#!/usr/bin/env node
/**
 * BroBillionaire Search Engine Pinger v2.0
 * 
 * Notifies major search engines about your sitemap and new/updated content.
 * This helps get your pages indexed faster.
 * 
 * Run: node ping-search-engines-v2.js
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const WEBSITE_URL = 'https://brobillionaire.com';
const SITEMAP_URL = `${WEBSITE_URL}/sitemap.xml`;

// Note: Google and Bing deprecated their ping endpoints in 2023
// Modern approach: Use IndexNow API and submit directly via Search Console
// Reference: https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping

// IndexNow endpoints (still active)
const indexNowEndpoints = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow',
    'https://yandex.com/indexnow'
];

// IndexNow configuration (get your key from https://www.bing.com/indexnow)
const INDEXNOW_KEY = 'your-indexnow-key-here'; // Replace with your actual key

async function pingSearchEngine(engine) {
    return new Promise((resolve) => {
        const urlObj = new URL(engine.url);
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port || 443,
            path: urlObj.pathname + urlObj.search,
            method: engine.method,
            headers: {
                'User-Agent': 'BroBillionaire-SEO-Bot/2.0',
                'Accept': '*/*'
            },
            timeout: 10000
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve({ success: true, engine: engine.name, status: res.statusCode });
                } else {
                    resolve({ success: false, engine: engine.name, status: res.statusCode, error: data });
                }
            });
        });

        req.on('error', (e) => {
            resolve({ success: false, engine: engine.name, error: e.message });
        });

        req.on('timeout', () => {
            req.destroy();
            resolve({ success: false, engine: engine.name, error: 'Timeout' });
        });

        req.end();
    });
}

async function submitToIndexNow(urls) {
    if (INDEXNOW_KEY === 'your-indexnow-key-here') {
        console.log('⚠️  IndexNow: Skipped (set your INDEXNOW_KEY in the script)');
        return { success: false, error: 'Key not configured' };
    }

    const payload = JSON.stringify({
        host: 'brobillionaire.com',
        key: INDEXNOW_KEY,
        keyLocation: `${WEBSITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: urls.slice(0, 10000) // IndexNow limit
    });

    return new Promise((resolve) => {
        const options = {
            hostname: 'api.indexnow.org',
            port: 443,
            path: '/indexnow',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            },
            timeout: 30000
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve({ success: true, status: res.statusCode, urlCount: urls.length });
                } else {
                    resolve({ success: false, status: res.statusCode, error: data });
                }
            });
        });

        req.on('error', (e) => {
            resolve({ success: false, error: e.message });
        });

        req.end(payload);
    });
}

function getAllArticleUrls() {
    const articlesDir = __dirname;
    const files = fs.readdirSync(articlesDir)
        .filter(f => f.endsWith('.html'));
    
    return files.map(f => `${WEBSITE_URL}/${f}`);
}

async function main() {
    console.log('🚀 BroBillionaire Search Engine Pinger v2.0');
    console.log('='.repeat(50));
    console.log(`📍 Website: ${WEBSITE_URL}`);
    console.log(`🗺️  Sitemap: ${SITEMAP_URL}`);
    console.log('');

    // Ping sitemap to search engines
    console.log('📡 Pinging search engines with sitemap...\n');
    
    for (const engine of searchEngines) {
        if (engine.isIndexNow) continue; // Handle separately
        
        const result = await pingSearchEngine(engine);
        if (result.success) {
            console.log(`✅ ${engine.name}: Success (HTTP ${result.status})`);
        } else {
            console.log(`❌ ${engine.name}: Failed - ${result.error || `HTTP ${result.status}`}`);
        }
    }

    // Submit URLs via IndexNow
    console.log('\n📤 Submitting URLs via IndexNow...');
    const allUrls = getAllArticleUrls();
    console.log(`   Found ${allUrls.length} URLs to submit`);
    
    const indexNowResult = await submitToIndexNow(allUrls);
    if (indexNowResult.success) {
        console.log(`✅ IndexNow: Submitted ${indexNowResult.urlCount} URLs`);
    } else {
        console.log(`⚠️  IndexNow: ${indexNowResult.error}`);
    }

    console.log('\n' + '='.repeat(50));
    console.log('📋 Manual Submission Links:');
    console.log('');
    console.log('🔍 Google Search Console:');
    console.log('   https://search.google.com/search-console');
    console.log('   → Add Property → Enter: brobillionaire.com');
    console.log('   → Sitemaps → Submit: sitemap.xml');
    console.log('');
    console.log('🔍 Bing Webmaster Tools:');
    console.log('   https://www.bing.com/webmasters');
    console.log('   → Add Site → Submit Sitemap');
    console.log('');
    console.log('🔍 Google Indexing API (for instant indexing):');
    console.log('   https://developers.google.com/search/apis/indexing-api/v3/quickstart');
    console.log('');
    console.log('🔍 Rich Results Test:');
    console.log('   https://search.google.com/test/rich-results');
    console.log(`   Test URL: ${WEBSITE_URL}/article-george-soros.html`);
    console.log('');
    console.log('✨ Done! Check back in 24-48 hours for indexing status.');
}

main().catch(console.error);
