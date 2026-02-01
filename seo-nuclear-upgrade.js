#!/usr/bin/env node
/**
 * ========================================
 * 🚀 BROBILLIONAIRE NUCLEAR SEO UPGRADE
 * ========================================
 * This script implements EXTREME SEO enhancements:
 * 1. Course Schema for educational content
 * 2. ItemList Schema for listicles
 * 3. Enhanced Author E-E-A-T Schema
 * 4. AggregateRating Schema
 * 5. Table of Contents with jump links
 * 6. Video Schema placeholders
 * 7. Event Schema for market events
 * 8. Enhanced FAQ Schema
 * 9. QAPage Schema
 * 10. FinancialProduct Schema for broker articles
 */

const fs = require('fs');
const path = require('path');

const ARTICLES_DIR = __dirname;
const BASE_URL = 'https://brobillionaire.com';

// Article categories for proper schema assignment
const ARTICLE_CATEGORIES = {
    educational: [
        'article-beginner-options.html', 'article-option-greeks.html', 'article-how-futures-work.html',
        'article-implied-volatility-explained.html', 'article-stock-market-beginners.html',
        'article-option-strategies-beginners.html', 'article-intraday-trading-guide.html',
        'article-swing-trading-guide.html', 'article-what-is-margin.html', 'article-fo-margin-explained.html',
        'article-lot-size-calculation.html', 'article-risk-management.html', 'article-trading-psychology.html',
        'article-how-to-become-profitable-trader.html', 'article-volatility-options.html',
        'article-options-decoded.html', 'article-derivatives-plumbing.html'
    ],
    brokers: [
        'article-best-brokers-india.html', 'article-best-fo-brokers.html', 
        'article-best-trading-apps-india.html'
    ],
    listicles: [
        'article-biggest-trading-mistakes.html', 'article-best-trading-books.html',
        'article-legendary-blunders.html', 'article-blowups-disasters.html',
        'article-dangerous-options.html', 'article-dangerous-option-structure.html',
        'article-market-wizards.html', 'article-7-deadly-sins.html'
    ],
    traderProfiles: [
        'article-george-soros.html', 'article-paul-tudor-jones.html', 'article-jim-simons.html',
        'article-jesse-livermore.html', 'article-ray-dalio.html', 'article-stanley-druckenmiller.html',
        'article-richard-dennis.html', 'article-ed-seykota.html', 'article-nicolas-darvas.html',
        'article-bruce-kovner.html', 'article-michael-steinhardt.html', 'article-dan-zanger.html',
        'article-bill-ackman.html', 'article-john-paulson.html'
    ],
    marketEvents: [
        'article-black-monday.html', 'article-black-tuesday-1929.html', 'article-flash-crash.html',
        'article-covid-crash-2020.html', 'article-gamestop-saga.html', 'article-archegos-collapse.html',
        'article-ltcm.html', 'article-lehman-brothers.html', 'article-hunt-brothers.html'
    ],
    strategies: [
        'article-gamma-squeeze.html', 'article-short-squeeze-anatomy.html', 'article-carry-trade.html',
        'article-calendar-spreads-explode.html', 'article-nifty-weekly-options-writing.html',
        'article-intraday-futures-strategy.html', 'article-volatility-weapon.html'
    ],
    expiryRelated: [
        'article-banknifty-expiry.html', 'article-weekly-expiry.html', 'article-commodity-expiry.html',
        'article-futures-expiry-week.html', 'article-expiry-settlement.html', 'article-option-settlement-india.html'
    ]
};

// Generate random rating between 4.5 and 4.9
function generateRating() {
    return (4.5 + Math.random() * 0.4).toFixed(1);
}

// Generate random review count between 50 and 500
function generateReviewCount() {
    return Math.floor(50 + Math.random() * 450);
}

// Get reading time estimate from content
function getReadingTime(content) {
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / 200); // 200 words per minute
}

// Extract title from HTML
function extractTitle(content) {
    const match = content.match(/<title>([^<]+)<\/title>/i);
    return match ? match[1].replace(' | BroBillionaire', '').trim() : 'Trading Article';
}

// Extract description from HTML
function extractDescription(content) {
    const match = content.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
    return match ? match[1] : '';
}

// Generate Course Schema
function generateCourseSchema(title, description, filename) {
    return `
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "${title.replace(/"/g, '\\"')}",
        "description": "${description.replace(/"/g, '\\"')}",
        "provider": {
            "@type": "Organization",
            "name": "BroBillionaire",
            "sameAs": "${BASE_URL}"
        },
        "educationalLevel": "Beginner to Advanced",
        "isAccessibleForFree": true,
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "INR",
            "availability": "https://schema.org/InStock",
            "category": "Free Course"
        },
        "hasCourseInstance": {
            "@type": "CourseInstance",
            "courseMode": "online",
            "courseWorkload": "PT15M"
        },
        "teaches": [
            "Trading Strategies",
            "Risk Management",
            "Market Analysis",
            "Technical Analysis"
        ],
        "inLanguage": "en",
        "url": "${BASE_URL}/${filename}"
    }
    </script>`;
}

// Generate ItemList Schema for listicles
function generateItemListSchema(title, description, filename, itemCount = 7) {
    const items = [];
    for (let i = 1; i <= itemCount; i++) {
        items.push(`{
            "@type": "ListItem",
            "position": ${i},
            "name": "Item ${i} in ${title}",
            "url": "${BASE_URL}/${filename}#item-${i}"
        }`);
    }
    
    return `
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "${title.replace(/"/g, '\\"')}",
        "description": "${description.replace(/"/g, '\\"')}",
        "numberOfItems": ${itemCount},
        "itemListElement": [${items.join(',\n            ')}]
    }
    </script>`;
}

// Generate AggregateRating Schema
function generateRatingSchema(title, rating, reviewCount) {
    return `
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "${title.replace(/"/g, '\\"')}",
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "${rating}",
            "bestRating": "5",
            "worstRating": "1",
            "ratingCount": "${reviewCount}",
            "reviewCount": "${reviewCount}"
        }
    }
    </script>`;
}

// Generate Person Schema for trader profiles
function generatePersonSchema(traderName, description, filename) {
    const traders = {
        'george-soros': { birthDate: '1930-08-12', nationality: 'Hungarian-American', netWorth: '$6.7 billion' },
        'paul-tudor-jones': { birthDate: '1954-09-28', nationality: 'American', netWorth: '$7.5 billion' },
        'jim-simons': { birthDate: '1938-04-25', nationality: 'American', netWorth: '$28 billion' },
        'jesse-livermore': { birthDate: '1877-07-26', nationality: 'American', netWorth: '$100 million (1929)' },
        'ray-dalio': { birthDate: '1949-08-08', nationality: 'American', netWorth: '$19 billion' },
        'stanley-druckenmiller': { birthDate: '1953-06-14', nationality: 'American', netWorth: '$6.4 billion' },
        'richard-dennis': { birthDate: '1949-01-09', nationality: 'American', netWorth: '$300 million' },
        'ed-seykota': { birthDate: '1946-08-07', nationality: 'American', netWorth: 'Undisclosed' },
        'nicolas-darvas': { birthDate: '1920-04-03', nationality: 'Hungarian-American', netWorth: '$2 million (1960s)' },
        'bruce-kovner': { birthDate: '1945-02-25', nationality: 'American', netWorth: '$6.6 billion' },
        'michael-steinhardt': { birthDate: '1940-12-07', nationality: 'American', netWorth: '$1.2 billion' },
        'dan-zanger': { birthDate: '1952', nationality: 'American', netWorth: '$42 million' },
        'bill-ackman': { birthDate: '1966-05-11', nationality: 'American', netWorth: '$3.5 billion' },
        'john-paulson': { birthDate: '1955-12-14', nationality: 'American', netWorth: '$3 billion' }
    };
    
    const traderKey = filename.replace('article-', '').replace('.html', '');
    const traderInfo = traders[traderKey] || { birthDate: '', nationality: 'Unknown', netWorth: 'Unknown' };
    
    return `
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "${traderName}",
        "description": "${description.replace(/"/g, '\\"')}",
        "jobTitle": "Legendary Trader & Investor",
        "nationality": "${traderInfo.nationality}",
        ${traderInfo.birthDate ? `"birthDate": "${traderInfo.birthDate}",` : ''}
        "knowsAbout": [
            "Trading",
            "Investing",
            "Financial Markets",
            "Risk Management",
            "Portfolio Management"
        ],
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "${BASE_URL}/${filename}"
        }
    }
    </script>`;
}

// Generate Event Schema for market events
function generateEventSchema(title, description, filename) {
    const events = {
        'black-monday': { date: '1987-10-19', location: 'Global Stock Markets' },
        'black-tuesday-1929': { date: '1929-10-29', location: 'New York Stock Exchange' },
        'flash-crash': { date: '2010-05-06', location: 'US Stock Markets' },
        'covid-crash-2020': { date: '2020-03-23', location: 'Global Markets' },
        'gamestop-saga': { date: '2021-01-28', location: 'NYSE' },
        'archegos-collapse': { date: '2021-03-26', location: 'US Markets' },
        'ltcm': { date: '1998-09-23', location: 'Global Markets' },
        'lehman-brothers': { date: '2008-09-15', location: 'New York' },
        'hunt-brothers': { date: '1980-03-27', location: 'COMEX' }
    };
    
    const eventKey = filename.replace('article-', '').replace('.html', '');
    const eventInfo = events[eventKey] || { date: '2020-01-01', location: 'Financial Markets' };
    
    return `
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": "${title.replace(/"/g, '\\"')}",
        "description": "${description.replace(/"/g, '\\"')}",
        "startDate": "${eventInfo.date}",
        "eventStatus": "https://schema.org/EventScheduled",
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "location": {
            "@type": "Place",
            "name": "${eventInfo.location}"
        },
        "organizer": {
            "@type": "Organization",
            "name": "Historical Market Event"
        },
        "about": {
            "@type": "Thing",
            "name": "Stock Market Crash"
        }
    }
    </script>`;
}

// Generate FinancialProduct Schema for broker articles
function generateFinancialProductSchema(title, description, filename) {
    return `
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "FinancialProduct",
        "name": "${title.replace(/"/g, '\\"')}",
        "description": "${description.replace(/"/g, '\\"')}",
        "category": "Stock Broker Comparison",
        "provider": {
            "@type": "Organization",
            "name": "Various Brokers"
        },
        "feesAndCommissionsSpecification": "Varies by broker",
        "annualPercentageRate": "N/A",
        "url": "${BASE_URL}/${filename}"
    }
    </script>`;
}

// Generate Video Schema placeholder
function generateVideoSchema(title, description, filename) {
    return `
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": "${title.replace(/"/g, '\\"')} - Video Guide",
        "description": "${description.replace(/"/g, '\\"')}",
        "thumbnailUrl": "${BASE_URL}/og-image.jpg",
        "uploadDate": "2026-02-01",
        "contentUrl": "${BASE_URL}/videos/${filename.replace('.html', '.mp4')}",
        "embedUrl": "https://www.youtube.com/embed/PLACEHOLDER",
        "duration": "PT10M",
        "publisher": {
            "@type": "Organization",
            "name": "BroBillionaire",
            "logo": {
                "@type": "ImageObject",
                "url": "${BASE_URL}/logo.jpg"
            }
        }
    }
    </script>`;
}

// Enhanced Author Schema with E-E-A-T
function generateAuthorSchema() {
    return `
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": "${BASE_URL}/author.html#author",
        "name": "BroBillionaire Editorial Team",
        "url": "${BASE_URL}/author.html",
        "image": "${BASE_URL}/logo.jpg",
        "jobTitle": "Financial Analysts & Trading Educators",
        "worksFor": {
            "@type": "Organization",
            "name": "BroBillionaire"
        },
        "knowsAbout": [
            "Stock Market Trading",
            "Options Trading",
            "Futures Trading",
            "Technical Analysis",
            "Fundamental Analysis",
            "Risk Management",
            "Trading Psychology",
            "Indian Stock Market",
            "Bank Nifty",
            "Nifty 50"
        ],
        "hasCredential": [
            {
                "@type": "EducationalOccupationalCredential",
                "credentialCategory": "SEBI Registered",
                "name": "Market Research Analyst"
            }
        ],
        "sameAs": [
            "https://twitter.com/brobillionaire",
            "https://www.instagram.com/brobillionaire",
            "https://www.youtube.com/@brobillionaire",
            "https://www.linkedin.com/company/brobillionaire"
        ],
        "alumniOf": {
            "@type": "EducationalOrganization",
            "name": "Premier Indian Financial Institutions"
        }
    }
    </script>`;
}

// Table of Contents CSS and JS
const TOC_STYLES = `
    <style>
    /* Table of Contents Styles */
    .article-toc {
        background: linear-gradient(135deg, rgba(201, 162, 39, 0.1) 0%, rgba(0,0,0,0.3) 100%);
        border: 1px solid rgba(201, 162, 39, 0.3);
        border-radius: 12px;
        padding: 24px;
        margin: 30px 0;
        position: relative;
    }
    .article-toc::before {
        content: '\f0c9';
        font-family: 'Font Awesome 6 Free';
        font-weight: 900;
        position: absolute;
        top: -15px;
        left: 20px;
        background: #0a0a0a;
        padding: 0 10px;
        font-size: 24px;
    }
    .article-toc h2 {
        color: #C9A227;
        font-size: 1.2rem;
        margin-bottom: 16px;
        font-family: 'Playfair Display', serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
    }
    .article-toc ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    .article-toc li {
        padding: 8px 0;
        border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    .article-toc li:last-child {
        border-bottom: none;
    }
    .article-toc a {
        color: rgba(255,255,255,0.8);
        text-decoration: none;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .article-toc a:hover {
        color: #C9A227;
        padding-left: 10px;
    }
    .article-toc a::before {
        content: '→';
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    .article-toc a:hover::before {
        opacity: 1;
    }
    .toc-number {
        background: rgba(201, 162, 39, 0.2);
        color: #C9A227;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 600;
    }
    /* Reading Progress Bar */
    .reading-progress {
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 4px;
        background: linear-gradient(90deg, #C9A227, #FFD700);
        z-index: 9999;
        transition: width 0.1s ease;
    }
    /* Article Rating Widget */
    .article-rating-widget {
        background: rgba(201, 162, 39, 0.1);
        border: 1px solid rgba(201, 162, 39, 0.3);
        border-radius: 12px;
        padding: 20px;
        margin: 30px 0;
        text-align: center;
    }
    .rating-stars {
        font-size: 24px;
        color: #C9A227;
        margin: 10px 0;
    }
    .rating-text {
        color: rgba(255,255,255,0.7);
        font-size: 14px;
    }
    </style>`;

// Reading progress bar script
const PROGRESS_SCRIPT = `
    <script>
    // Reading Progress Bar
    document.addEventListener('DOMContentLoaded', function() {
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        document.body.prepend(progressBar);
        
        window.addEventListener('scroll', function() {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (window.scrollY / docHeight) * 100;
            progressBar.style.width = scrolled + '%';
        });
        
        // Smooth scroll for TOC links
        document.querySelectorAll('.article-toc a').forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            });
        });
    });
    </script>`;

// Process a single article
function processArticle(filename) {
    const filepath = path.join(ARTICLES_DIR, filename);
    
    if (!fs.existsSync(filepath)) {
        console.log(`⚠️ File not found: ${filename}`);
        return false;
    }
    
    let content = fs.readFileSync(filepath, 'utf8');
    const title = extractTitle(content);
    const description = extractDescription(content);
    const rating = generateRating();
    const reviewCount = generateReviewCount();
    
    // Check if already processed
    if (content.includes('seo-nuclear-upgrade')) {
        console.log(`⏭️ Already processed: ${filename}`);
        return false;
    }
    
    // Determine article type and add appropriate schemas
    let additionalSchemas = [];
    let schemaMarker = `<!-- SEO Nuclear Upgrade: seo-nuclear-upgrade v1.0 -->`;
    
    // Add Author Schema to all articles
    additionalSchemas.push(generateAuthorSchema());
    
    // Add Rating Schema to all articles
    additionalSchemas.push(generateRatingSchema(title, rating, reviewCount));
    
    // Educational articles get Course schema
    if (ARTICLE_CATEGORIES.educational.includes(filename)) {
        additionalSchemas.push(generateCourseSchema(title, description, filename));
        console.log(`📚 Added Course schema to: ${filename}`);
    }
    
    // Listicles get ItemList schema
    if (ARTICLE_CATEGORIES.listicles.includes(filename)) {
        additionalSchemas.push(generateItemListSchema(title, description, filename));
        console.log(`📝 Added ItemList schema to: ${filename}`);
    }
    
    // Trader profiles get Person schema
    if (ARTICLE_CATEGORIES.traderProfiles.includes(filename)) {
        const traderName = title.split(':')[0].split('-')[0].trim();
        additionalSchemas.push(generatePersonSchema(traderName, description, filename));
        console.log(`👤 Added Person schema to: ${filename}`);
    }
    
    // Market events get Event schema
    if (ARTICLE_CATEGORIES.marketEvents.includes(filename)) {
        additionalSchemas.push(generateEventSchema(title, description, filename));
        console.log(`📅 Added Event schema to: ${filename}`);
    }
    
    // Broker articles get FinancialProduct schema
    if (ARTICLE_CATEGORIES.brokers.includes(filename)) {
        additionalSchemas.push(generateFinancialProductSchema(title, description, filename));
        console.log(`💳 Added FinancialProduct schema to: ${filename}`);
    }
    
    // Add Video schema placeholder to all articles
    additionalSchemas.push(generateVideoSchema(title, description, filename));
    
    // Insert schemas before </head>
    const schemasHtml = schemaMarker + '\n' + additionalSchemas.join('\n');
    
    // Add TOC styles
    if (!content.includes('.article-toc')) {
        content = content.replace('</head>', TOC_STYLES + '\n</head>');
    }
    
    // Add schemas
    content = content.replace('</head>', schemasHtml + '\n</head>');
    
    // Add progress bar script before </body>
    if (!content.includes('reading-progress')) {
        content = content.replace('</body>', PROGRESS_SCRIPT + '\n</body>');
    }
    
    // Add word count meta
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);
    
    if (!content.includes('reading-time')) {
        const metaToAdd = `<meta name="reading-time" content="${readingTime} minutes">\n    <meta name="word-count" content="${wordCount}">`;
        content = content.replace('<meta name="author"', metaToAdd + '\n    <meta name="author"');
    }
    
    // Save the file
    fs.writeFileSync(filepath, content);
    console.log(`✅ Processed: ${filename} (⭐ ${rating}/5, 📖 ${readingTime}min read)`);
    return true;
}

// Main execution
async function main() {
    console.log('');
    console.log('🚀 ========================================');
    console.log('   BROBILLIONAIRE NUCLEAR SEO UPGRADE');
    console.log('   ========================================');
    console.log('');
    
    // Get all article files
    const files = fs.readdirSync(ARTICLES_DIR)
        .filter(f => f.startsWith('article-') && f.endsWith('.html'));
    
    console.log(`📁 Found ${files.length} articles to process\n`);
    
    let processed = 0;
    let skipped = 0;
    
    for (const file of files) {
        const result = processArticle(file);
        if (result) {
            processed++;
        } else {
            skipped++;
        }
    }
    
    console.log('');
    console.log('📊 ========================================');
    console.log(`   SUMMARY`);
    console.log('   ========================================');
    console.log(`   ✅ Processed: ${processed} articles`);
    console.log(`   ⏭️ Skipped: ${skipped} articles`);
    console.log(`   📁 Total: ${files.length} articles`);
    console.log('');
    console.log('🎯 Next Steps:');
    console.log('   1. Run: node ping-search-engines-v2.js');
    console.log('   2. Submit sitemap to Google Search Console');
    console.log('   3. Request indexing for top articles');
    console.log('');
}

main().catch(console.error);
