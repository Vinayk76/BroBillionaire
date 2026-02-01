#!/usr/bin/env node
/**
 * BroBillionaire Sitemap Updater
 * 
 * Updates sitemap.xml with current dates to signal freshness to Google.
 * Run this after updating any articles.
 * 
 * Usage: node update-sitemap.js
 */

const fs = require('fs');
const path = require('path');

const SITEMAP_PATH = path.join(__dirname, 'sitemap.xml');
const TODAY = new Date().toISOString().split('T')[0];

function updateSitemap() {
    console.log('🗺️  BroBillionaire Sitemap Updater');
    console.log('='.repeat(40));
    
    if (!fs.existsSync(SITEMAP_PATH)) {
        console.log('❌ sitemap.xml not found!');
        return;
    }
    
    let content = fs.readFileSync(SITEMAP_PATH, 'utf8');
    
    // Count updates
    const datePattern = /<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g;
    const matches = content.match(datePattern) || [];
    
    // Update all lastmod dates to today
    content = content.replace(datePattern, `<lastmod>${TODAY}</lastmod>`);
    
    fs.writeFileSync(SITEMAP_PATH, content);
    
    console.log(`✅ Updated ${matches.length} lastmod dates to ${TODAY}`);
    console.log('');
    console.log('📋 Next: Ping search engines with updated sitemap');
    console.log('   Run: node ping-search-engines-v2.js');
}

updateSitemap();
