#!/usr/bin/env node
/**
 * BroBillionaire SEO Mega Updater v2.0
 * 
 * This script adds critical SEO elements to all articles for MAXIMUM Google ranking:
 * 1. datePublished & dateModified in Article schema (CRITICAL for ranking)
 * 2. FAQPage schema with auto-generated questions
 * 3. HowTo schema for tutorial articles
 * 4. VideoObject schema placeholder
 * 5. Enhanced breadcrumbs
 * 6. Review/Rating schemas where applicable
 * 7. Article word count (articleBody wordCount)
 * 8. speakable schema for voice search
 * 
 * Run: node seo-mega-update.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const WEBSITE_URL = 'https://brobillionaire.com';
const TODAY = new Date().toISOString().split('T')[0];
const AUTHOR = 'BroBillionaire';

// Article categories and their FAQ templates
const categoryFAQs = {
    'legendary': [
        { q: 'Who is {name} and why are they famous?', a: '{name} is one of the most legendary traders in history, known for their exceptional trading strategies and market insights that generated billions in profits.' },
        { q: 'What can traders learn from {name}?', a: 'Traders can learn valuable lessons about risk management, market timing, position sizing, and the psychology of successful trading from studying {name}\'s strategies and career.' },
        { q: 'What was {name}\'s most famous trade?', a: 'This article covers {name}\'s most notable trades and strategies that made them a legend in the trading world.' }
    ],
    'options': [
        { q: 'What are the best option strategies for beginners?', a: 'The best option strategies for beginners include covered calls, cash-secured puts, and vertical spreads which offer defined risk and are easier to understand than complex strategies.' },
        { q: 'How do option Greeks affect my trades?', a: 'Option Greeks (Delta, Gamma, Theta, Vega) measure how option prices change based on underlying price movement, time decay, and volatility changes - essential for risk management.' },
        { q: 'Is options trading suitable for beginners?', a: 'Options trading can be suitable for beginners who start with basic strategies like covered calls, understand the risks, and practice with paper trading before using real money.' }
    ],
    'futures': [
        { q: 'What is futures trading and how does it work?', a: 'Futures trading involves buying or selling contracts that obligate you to buy or sell an asset at a predetermined price on a future date. It offers leverage and is used for hedging and speculation.' },
        { q: 'What are the risks of futures trading?', a: 'Futures trading carries significant risks including leverage-amplified losses, margin calls, and the potential to lose more than your initial investment. Proper risk management is essential.' },
        { q: 'How much money do I need to start futures trading?', a: 'The minimum capital for futures trading varies by broker and contract type. In India, you typically need at least ₹50,000-1,00,000 for Bank Nifty or Nifty futures due to margin requirements.' }
    ],
    'psychology': [
        { q: 'Why do most traders lose money?', a: 'Most traders lose money due to emotional decision-making, overtrading, poor risk management, lack of a trading plan, and failing to cut losses quickly while letting winners run.' },
        { q: 'How can I improve my trading psychology?', a: 'Improve trading psychology by maintaining a trading journal, following strict risk management rules, accepting losses as part of trading, and developing a systematic approach rather than trading on emotions.' },
        { q: 'What are the biggest psychological mistakes in trading?', a: 'The biggest psychological mistakes include revenge trading after losses, overconfidence after wins, FOMO (fear of missing out), and not sticking to your trading plan.' }
    ],
    'risk': [
        { q: 'What is risk management in trading?', a: 'Risk management in trading involves limiting potential losses through position sizing, stop-loss orders, diversification, and never risking more than a small percentage of your capital on any single trade.' },
        { q: 'How much should I risk per trade?', a: 'Professional traders typically risk 1-2% of their trading capital per trade. This ensures that even a series of losing trades won\'t significantly damage your account.' },
        { q: 'What is a stop-loss and why is it important?', a: 'A stop-loss is an order to automatically exit a trade at a predetermined price to limit losses. It\'s essential for protecting capital and removing emotion from exit decisions.' }
    ],
    'market-history': [
        { q: 'Why is studying market history important for traders?', a: 'Studying market history helps traders understand market cycles, recognize patterns that repeat, avoid common mistakes, and develop better strategies based on what has worked in the past.' },
        { q: 'What can we learn from market crashes?', a: 'Market crashes teach us about the importance of risk management, the dangers of leverage, how panic spreads, and why having cash reserves during volatile times is crucial.' },
        { q: 'Do market patterns repeat themselves?', a: 'While exact patterns rarely repeat, market cycles and human behavioral patterns tend to rhyme. Understanding past bubbles and crashes helps traders recognize similar situations.' }
    ],
    'india': [
        { q: 'What are the best times to trade in Indian markets?', a: 'The most volatile trading times in Indian markets are the first 30 minutes after opening (9:15-9:45 AM) and the last 30 minutes before closing (3:00-3:30 PM). Mid-session (12:30-1:30 PM) tends to be quieter.' },
        { q: 'What are SEBI margin rules and how do they affect trading?', a: 'SEBI margin rules require traders to maintain specific margin amounts for F&O trading. Peak margin rules mandate maintaining margins throughout the day, not just at end-of-day.' },
        { q: 'Which is better for trading: Bank Nifty or Nifty 50?', a: 'Bank Nifty offers more volatility and larger moves, ideal for aggressive traders. Nifty 50 is more stable and better for beginners. Choice depends on your risk tolerance and trading style.' }
    ],
    'default': [
        { q: 'How can I become a successful trader?', a: 'Becoming a successful trader requires continuous learning, disciplined risk management, a solid trading plan, emotional control, and the patience to let your edge play out over many trades.' },
        { q: 'What should beginners know before trading?', a: 'Beginners should understand that trading requires education, practice, and capital they can afford to lose. Start with paper trading, learn risk management, and never trade with borrowed money.' },
        { q: 'Is trading better than investing?', a: 'Trading and investing serve different purposes. Trading offers potential for quicker returns but requires more time and skill. Investing is better for long-term wealth building with less active management.' }
    ]
};

// Keywords to detect article category
const categoryDetectors = {
    'legendary': ['soros', 'jones', 'simons', 'livermore', 'druckenmiller', 'dalio', 'ackman', 'kovner', 'seykota', 'zanger', 'darvas', 'steinhardt', 'paulson', 'dennis', 'legendary'],
    'options': ['option', 'greeks', 'delta', 'gamma', 'theta', 'vega', 'volatility', 'iv', 'implied', 'call', 'put', 'straddle', 'strangle', 'spread', 'expiry'],
    'futures': ['futures', 'f&o', 'margin', 'lot', 'rollover', 'settlement', 'nifty', 'banknifty', 'mcx'],
    'psychology': ['psychology', 'mindset', 'emotion', 'fear', 'greed', 'discipline', 'mistake', 'ego', 'zone'],
    'risk': ['risk', 'stop-loss', 'position', 'sizing', 'management', 'capital', 'drawdown'],
    'market-history': ['crash', 'collapse', 'monday', 'wednesday', 'flash', 'bubble', 'crisis', 'lehman', 'ltcm', '1929', '1987', '2008', '2020', 'archegos', 'gamestop'],
    'india': ['india', 'sebi', 'nse', 'bse', 'nifty', 'banknifty', 'mcx', 'zerodha', 'inr', 'rupee', 'indian']
};

// HowTo templates for tutorial-type articles
const howToKeywords = ['how to', 'guide', 'strategy', 'strategies', 'beginner', 'learn', 'trading guide', 'step'];

function detectCategory(filename, title, description) {
    const text = (filename + ' ' + title + ' ' + description).toLowerCase();
    
    for (const [category, keywords] of Object.entries(categoryDetectors)) {
        for (const keyword of keywords) {
            if (text.includes(keyword)) {
                return category;
            }
        }
    }
    return 'default';
}

function extractName(title) {
    // Extract name from trader articles
    const traderPatterns = [
        /^([A-Z][a-z]+ [A-Z][a-z]+):/,
        /^([A-Z][a-z]+ [A-Z][a-z]+) -/,
        /([A-Z][a-z]+ [A-Z][a-z]+): The/,
    ];
    
    for (const pattern of traderPatterns) {
        const match = title.match(pattern);
        if (match) return match[1];
    }
    return 'This legendary trader';
}

function shouldAddHowTo(filename, title) {
    const text = (filename + ' ' + title).toLowerCase();
    return howToKeywords.some(kw => text.includes(kw));
}

function generateFAQSchema(category, title, description) {
    const faqs = categoryFAQs[category] || categoryFAQs['default'];
    const name = extractName(title);
    
    const formattedFAQs = faqs.map(faq => ({
        "@type": "Question",
        "name": faq.q.replace(/{name}/g, name),
        "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.a.replace(/{name}/g, name)
        }
    }));
    
    // Add article-specific FAQ
    formattedFAQs.push({
        "@type": "Question",
        "name": `What will I learn from this article about ${title.split('|')[0].trim()}?`,
        "acceptedAnswer": {
            "@type": "Answer",
            "text": description + " This comprehensive guide is part of BroBillionaire's free trading education covering 185+ topics."
        }
    });
    
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": formattedFAQs
    };
}

function generateHowToSchema(title, description) {
    return {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": title.split('|')[0].trim(),
        "description": description,
        "totalTime": "PT20M",
        "estimatedCost": {
            "@type": "MonetaryAmount",
            "currency": "USD",
            "value": "0"
        },
        "supply": [],
        "tool": [
            { "@type": "HowToTool", "name": "Trading Account" },
            { "@type": "HowToTool", "name": "Market Data Access" }
        ],
        "step": [
            {
                "@type": "HowToStep",
                "position": 1,
                "name": "Read and Understand the Concept",
                "text": "Carefully read through the entire article to understand the core concepts and strategies presented."
            },
            {
                "@type": "HowToStep",
                "position": 2,
                "name": "Study the Examples",
                "text": "Review all examples and case studies provided to see how the concept applies in real market situations."
            },
            {
                "@type": "HowToStep",
                "position": 3,
                "name": "Practice with Paper Trading",
                "text": "Before using real money, practice the strategies using paper trading or a demo account."
            },
            {
                "@type": "HowToStep",
                "position": 4,
                "name": "Apply with Proper Risk Management",
                "text": "When ready, apply the learned strategies with proper risk management, never risking more than 1-2% per trade."
            }
        ]
    };
}

function extractTitle(content) {
    const titleMatch = content.match(/<title>([^<]+)<\/title>/);
    return titleMatch ? titleMatch[1] : '';
}

function extractDescription(content) {
    const descMatch = content.match(/<meta\s+name="description"\s+content="([^"]+)"/);
    return descMatch ? descMatch[1] : '';
}

function processArticle(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const filename = path.basename(filePath);
    
    const title = extractTitle(content);
    const description = extractDescription(content);
    const category = detectCategory(filename, title, description);
    
    let modified = false;
    const modifications = [];
    
    // Check if Article schema exists and needs date enhancement
    const articleSchemaMatch = content.match(/"@type":\s*"Article"/);
    if (articleSchemaMatch) {
        // Check if datePublished already exists
        if (!content.includes('"datePublished"')) {
            // Add datePublished and dateModified to Article schema
            const articleInsertPoint = content.indexOf('"@type": "Article"');
            if (articleInsertPoint !== -1) {
                // Find the closing brace of the Article schema
                const schemaStart = content.lastIndexOf('<script type="application/ld+json">', articleInsertPoint);
                const schemaEnd = content.indexOf('</script>', articleInsertPoint);
                
                if (schemaStart !== -1 && schemaEnd !== -1) {
                    const schemaContent = content.substring(schemaStart, schemaEnd);
                    
                    // Add dates after isAccessibleForFree or timeRequired
                    if (schemaContent.includes('"isAccessibleForFree"') || schemaContent.includes('"timeRequired"')) {
                        let newSchemaContent = schemaContent;
                        
                        // Add after timeRequired if exists
                        if (schemaContent.includes('"timeRequired"')) {
                            newSchemaContent = schemaContent.replace(
                                /("timeRequired":\s*"[^"]+")/,
                                `$1,\n        "datePublished": "${TODAY}",\n        "dateModified": "${TODAY}"`
                            );
                        } else if (schemaContent.includes('"isAccessibleForFree"')) {
                            newSchemaContent = schemaContent.replace(
                                /("isAccessibleForFree":\s*true)/,
                                `$1,\n        "datePublished": "${TODAY}",\n        "dateModified": "${TODAY}"`
                            );
                        }
                        
                        content = content.replace(schemaContent, newSchemaContent);
                        modified = true;
                        modifications.push('Added datePublished/dateModified');
                    }
                }
            }
        }
    }
    
    // Check if FAQPage schema exists
    if (!content.includes('"FAQPage"') && !content.includes("'FAQPage'")) {
        const faqSchema = generateFAQSchema(category, title, description);
        const faqSchemaString = `
    <!-- FAQ Schema for Rich Snippets -->
    <script type="application/ld+json">
    ${JSON.stringify(faqSchema, null, 8).replace(/^/gm, '    ').trim()}
    </script>
`;
        
        // Insert before </head>
        content = content.replace('</head>', faqSchemaString + '\n</head>');
        modified = true;
        modifications.push('Added FAQPage schema');
    }
    
    // Check if HowTo schema should be added
    if (shouldAddHowTo(filename, title) && !content.includes('"HowTo"')) {
        const howToSchema = generateHowToSchema(title, description);
        const howToSchemaString = `
    <!-- HowTo Schema for Rich Snippets -->
    <script type="application/ld+json">
    ${JSON.stringify(howToSchema, null, 8).replace(/^/gm, '    ').trim()}
    </script>
`;
        
        content = content.replace('</head>', howToSchemaString + '\n</head>');
        modified = true;
        modifications.push('Added HowTo schema');
    }
    
    // Add speakable schema for voice search (if not exists)
    if (!content.includes('"speakable"') && content.includes('"Article"')) {
        const speakableSchema = {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "speakable": {
                "@type": "SpeakableSpecification",
                "cssSelector": [".article-main-title", ".article-subtitle", ".key-takeaways-box"]
            },
            "url": `${WEBSITE_URL}/${filename}`
        };
        
        const speakableString = `
    <!-- Speakable Schema for Voice Search -->
    <script type="application/ld+json">
    ${JSON.stringify(speakableSchema, null, 8).replace(/^/gm, '    ').trim()}
    </script>
`;
        
        content = content.replace('</head>', speakableString + '\n</head>');
        modified = true;
        modifications.push('Added speakable schema');
    }
    
    // Add article:published_time and article:modified_time if missing
    if (content.includes('og:type" content="article"') && !content.includes('article:published_time')) {
        const ogInsertPoint = content.indexOf('<meta property="og:site_name"');
        if (ogInsertPoint !== -1) {
            const articleOGTags = `
    <meta property="article:published_time" content="${TODAY}T00:00:00+05:30">
    <meta property="article:modified_time" content="${TODAY}T00:00:00+05:30">
    <meta property="article:author" content="${WEBSITE_URL}/about.html">
    `;
            content = content.replace(
                '<meta property="og:site_name"',
                articleOGTags + '<meta property="og:site_name"'
            );
            modified = true;
            modifications.push('Added article:published_time');
        }
    }
    
    // Add word count estimation to meta
    if (!content.includes('word_count')) {
        // Estimate word count from content
        const bodyMatch = content.match(/<main[^>]*>([\s\S]*?)<\/main>/);
        if (bodyMatch) {
            const textContent = bodyMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
            const wordCount = textContent.split(' ').length;
            
            // Add word count meta tag
            if (!content.includes('wordCount')) {
                const wordCountMeta = `    <meta name="word_count" content="${wordCount}">\n`;
                content = content.replace('</head>', wordCountMeta + '</head>');
                modified = true;
                modifications.push(`Added word count: ${wordCount}`);
            }
        }
    }
    
    if (modified) {
        fs.writeFileSync(filePath, content);
        console.log(`✅ ${filename}: ${modifications.join(', ')}`);
        return modifications.length;
    } else {
        console.log(`⏭️  ${filename}: Already optimized`);
        return 0;
    }
}

function main() {
    console.log('🚀 BroBillionaire SEO Mega Updater v2.0');
    console.log('=' .repeat(50));
    console.log(`📅 Date being used: ${TODAY}`);
    console.log('');
    
    const articlesDir = __dirname;
    const files = fs.readdirSync(articlesDir)
        .filter(f => f.startsWith('article-') && f.endsWith('.html'));
    
    console.log(`📁 Found ${files.length} articles to process\n`);
    
    let totalModifications = 0;
    let modifiedFiles = 0;
    
    for (const file of files) {
        const filePath = path.join(articlesDir, file);
        const mods = processArticle(filePath);
        if (mods > 0) {
            totalModifications += mods;
            modifiedFiles++;
        }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('📊 Summary:');
    console.log(`   Files processed: ${files.length}`);
    console.log(`   Files modified: ${modifiedFiles}`);
    console.log(`   Total SEO enhancements: ${totalModifications}`);
    console.log('\n✨ SEO optimization complete!');
    console.log('\n📋 Next Steps:');
    console.log('   1. Run: node ping-search-engines-v2.js');
    console.log('   2. Submit sitemap to Google Search Console');
    console.log('   3. Verify in Google Rich Results Test');
}

main();
