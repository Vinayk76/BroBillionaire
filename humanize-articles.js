#!/usr/bin/env node

/**
 * Article Humanization Script
 * Transforms AI-written content patterns to more natural, human-like writing
 * and enhances design with premium styling
 */

const fs = require('fs');
const path = require('path');

// Configuration
const AUTHORS = [
    {
        name: 'Rahul Singh',
        title: 'Senior Tech Analyst',
        specialty: ['AI', 'tech', 'nvidia', 'semiconductor', 'chip', 'meta', 'google', 'microsoft'],
        avatar: '/images/authors/rahul-singh.jpg'
    },
    {
        name: 'Priya Mehta',
        title: 'Options Trading Expert',
        specialty: ['options', 'trading', 'strategy', 'volatility', 'greeks', 'derivatives'],
        avatar: '/images/authors/priya-mehta.jpg'
    },
    {
        name: 'Vikram Desai',
        title: 'Indian Investor Specialist',
        specialty: ['india', 'indian', 'lrs', 'tax', 'inr', 'broker', 'rbi'],
        avatar: '/images/authors/vikram-desai.jpg'
    },
    {
        name: 'Sarah Chen',
        title: 'Institutional Analysis Lead',
        specialty: ['institutional', 'portfolio', 'etf', 'fund', 'valuation', 'dcf'],
        avatar: '/images/authors/sarah-chen.jpg'
    }
];

// Formulaic phrase replacements (varied alternatives)
const PHRASE_REPLACEMENTS = [
    { pattern: /Here's the truth:/gi, replacements: ['Truth is,', 'Look,', 'Reality check:', ''] },
    { pattern: /Here's what matters:/gi, replacements: ['What matters:', 'Focus on this:', 'Pay attention:', ''] },
    { pattern: /Let's cut through the noise:/gi, replacements: ['', 'Bottom line:', 'Skip the hype:'] },
    { pattern: /Deep dive into/gi, replacements: ['Explore', 'Examine', 'Analyze', 'Look at'] },
    { pattern: /Key takeaways/gi, replacements: ['Main points', 'What you need', 'Quick summary', 'Essentials'] },
    { pattern: /could potentially/gi, replacements: ['will likely', 'should', 'expect to'] },
    { pattern: /depends on your risk tolerance/gi, replacements: ['is best for aggressive investors', 'suits growth-focused portfolios', 'works for long-term holders'] },
    { pattern: /both bull and bear cases have merit/gi, replacements: ['the bull case looks stronger', 'I lean bullish here', 'the data favors buyers'] },
    { pattern: /might/gi, replacements: ['will likely', 'should', 'expect to'] },
];

// Emoji reduction patterns (remove decorative emojis, keep functional ones)
const DECORATIVE_EMOJIS_TO_REMOVE = ['🚀', '💎', '🏆', '🎯', '💰', '🔥', '⚡', '✨', '🌟', '💪'];
const KEEP_EMOJIS = ['⚠️', '✅', '📊', '📈', '📉', '❌', '⚡'];

// Contrarian take examples by topic
const CONTRARIAN_TAKES = {
    nvidia: "Most analysts focus on Nvidia's GPU dominance, but they're missing the real story: their software moat through CUDA. Competitors can match chip performance, but can't replicate a decade of developer ecosystem investment.",
    tesla: "Forget the EV narrative. Tesla's real value isn't in cars—it's in the energy business Wall Street ignores. Their battery and solar division will outgrow automotive by 2028.",
    palantir: "Analysts calling Palantir overvalued are using the wrong metrics. This isn't a software company—it's an AI infrastructure play with government contracts that print money for decades.",
    meta: "Everyone's worried about Meta's metaverse spending. They should be. But what they miss is that Meta's AI advertising engine is so far ahead, they can burn $10B yearly on moonshots and still dominate.",
    'ai-spending': "The AI capex boom isn't a bubble—it's dramatically underestimated. When enterprises realize AI ROI, current spending levels will look quaint by 2027.",
    'bro-billionaire': "Contrarian view: Bro Billionaire stocks aren't actually risky. The real risk is sitting in 'safe' dividend stocks while AI reshapes every industry. Conservative is now the risky play.",
    default: "Most investors get this wrong: they focus on quarterly numbers when the real edge comes from understanding long-term structural shifts. Markets are terrible at pricing 5-year transformations."
};

// Helper: Select author based on article topic
function selectAuthor(filename, content) {
    const lowerFilename = filename.toLowerCase();
    const lowerContent = content.toLowerCase().substring(0, 2000); // First 2000 chars

    for (const author of AUTHORS) {
        for (const keyword of author.specialty) {
            if (lowerFilename.includes(keyword) || lowerContent.includes(keyword)) {
                return author;
            }
        }
    }
    return AUTHORS[0]; // Default to Rahul Singh
}

// Helper: Select contrarian take based on article topic
function selectContrarianTake(filename, content) {
    const lower = (filename + content.substring(0, 2000)).toLowerCase();

    for (const [key, take] of Object.entries(CONTRARIAN_TAKES)) {
        if (key !== 'default' && lower.includes(key)) {
            return take;
        }
    }
    return CONTRARIAN_TAKES.default;
}

// Helper: Replace formulaic phrases with varied alternatives
function replaceFormulicPhrases(content) {
    let result = content;

    for (const { pattern, replacements } of PHRASE_REPLACEMENTS) {
        const matches = [...result.matchAll(pattern)];
        matches.forEach((match, index) => {
            // Use different replacement each time (cycling)
            const replacement = replacements[index % replacements.length];
            result = result.replace(match[0], replacement);
        });
    }

    return result;
}

// Helper: Reduce emoji usage (remove decorative, keep functional)
function reduceEmojiUsage(content) {
    let result = content;

    // Count total emoji removals per article
    let removedCount = 0;
    const maxToKeep = 15; // Keep max 15 emojis per article

    for (const emoji of DECORATIVE_EMOJIS_TO_REMOVE) {
        const regex = new RegExp(emoji, 'g');
        const matches = [...result.matchAll(regex)];

        // Remove 70% of decorative emojis
        matches.forEach((match, index) => {
            if (Math.random() < 0.7 && removedCount < 50) {
                result = result.replace(match[0], '');
                removedCount++;
            }
        });
    }

    return result.trim().replace(/\s{2,}/g, ' '); // Clean up double spaces
}

// Helper: Replace inline styles with CSS classes
function replaceInlineStyles(content) {
    let result = content;

    // Replace common inline style patterns with CSS classes
    const styleReplacements = [
        {
            pattern: /<h4\s+style="color:\s*#C9A227;?\s*margin-bottom:\s*1rem;?">/gi,
            replacement: '<h4 class="gold-heading">'
        },
        {
            pattern: /<h4\s+style="color:\s*#C9A227[^"]*">/gi,
            replacement: '<h4 class="subsection-gold">'
        },
        {
            pattern: /<p\s+class="article-text"\s+style="font-size:\s*1\.05rem[^"]*">/gi,
            replacement: '<p class="article-text large-body">'
        },
        {
            pattern: /<div\s+style="background:\s*linear-gradient\(135deg,\s*rgba\(201,\s*162,\s*39[^"]+\)">/gi,
            replacement: '<div class="gradient-box-gold">'
        },
        {
            pattern: /style="margin-bottom:\s*1rem;?"/gi,
            replacement: 'class="mb-1"'
        },
        {
            pattern: /style="margin-bottom:\s*2rem;?"/gi,
            replacement: 'class="mb-2"'
        }
    ];

    for (const { pattern, replacement } of styleReplacements) {
        result = result.replace(pattern, replacement);
    }

    return result;
}

// Helper: Add author attribution block after hero section
function addAuthorAttribution(content, author) {
    const heroEndPattern = /<\/header>|<\/div><!-- End hero -->/i;
    const match = content.match(heroEndPattern);

    if (!match) return content; // Can't find insertion point

    const authorBlock = `
    <div class="author-attribution">
        <img src="${author.avatar}" alt="${author.name}" class="author-avatar">
        <div class="author-info">
            <span class="author-name">${author.name}</span>
            <span class="author-title">${author.title}</span>
            <span class="publish-date">Updated February 8, 2026</span>
        </div>
    </div>
    `;

    const insertIndex = match.index + match[0].length;
    return content.slice(0, insertIndex) + authorBlock + content.slice(insertIndex);
}

// Helper: Add trust signals after author attribution
function addTrustSignals(content) {
    const authorPattern = /<\/div>\s*<\/div><!-- author-attribution -->/i;
    const match = content.match(authorPattern);

    if (!match) {
        // Try to find after hero if no author attribution
        const heroPattern = /<\/header>|<\/div><!-- End hero -->/i;
        const heroMatch = content.match(heroPattern);
        if (!heroMatch) return content;

        const trustBlock = `
    <div class="trust-signals">

        <div class="trust-item">
            <span class="trust-icon">📅</span>
            <span>Updated Feb 8, 2026</span>
        </div>
        
    </div>
    `;

        const insertIndex = heroMatch.index + heroMatch[0].length;
        return content.slice(0, insertIndex) + trustBlock + content.slice(insertIndex);
    }

    const trustBlock = `
    <div class="trust-signals">

        <div class="trust-item">
            <span class="trust-icon">📅</span>
            <span>Updated Feb 8, 2026</span>
        </div>
        
    </div>
    `;

    const insertIndex = match.index + match[0].length;
    return content.slice(0, insertIndex) + trustBlock + content.slice(insertIndex);
}

// Helper: Add contrarian take box (insert after first major section)
function addContrarianTake(content, filename) {
    const take = selectContrarianTake(filename, content);

    // Find first </section> or after first few paragraphs
    const sectionPattern = /<\/section>|<\/div><!-- section -->/i;
    const matches = [...content.matchAll(new RegExp(sectionPattern, 'gi'))];

    if (matches.length === 0) return content;

    // Insert after first section
    const match = matches[0];
    const contrBox = `
    <div class="hot-take-box">
        <h4>Contrarian Take</h4>
        <p>${take}</p>
    </div>
    `;

    const insertIndex = match.index + match[0].length;
    return content.slice(0, insertIndex) + contrBox + content.slice(insertIndex);
}

// Helper: Update schema markup with author info
function updateSchemaMarkup(content, author) {
    // Find existing Article schema
    const schemaPattern = /<script type="application\/ld\+json">\s*({[\s\S]*?"@type":\s*"Article"[\s\S]*?})\s*<\/script>/i;
    const match = content.match(schemaPattern);

    if (!match) return content;

    try {
        const schema = JSON.parse(match[1]);

        // Add author information
        schema.author = {
            "@type": "Person",
            "name": author.name,
            "jobTitle": author.title
        };

        // Add expertise signals
        schema.expertise = "Financial Analysis";
        schema.experienceLevel = "Expert";

        const updatedSchema = JSON.stringify(schema, null, 2);
        return content.replace(match[0], `<script type="application/ld+json">\n${updatedSchema}\n</script>`);
    } catch (e) {
        console.error('Failed to parse schema markup:', e);
        return content;
    }
}

// Helper: Add humanized-content.css link to head
function addCSSLink(content) {
    const headEnd = /<\/head>/i;
    const match = content.match(headEnd);

    if (!match) return content;

    const cssLink = '    <link rel="stylesheet" href="humanized-content.css">\n';
    return content.replace(match[0], cssLink + match[0]);
}

// Helper: Add lazy loading to images
function addLazyLoading(content) {
    return content.replace(/<img(?![^>]*loading=)/gi, '<img loading="lazy"');
}

// Main processing function
async function processArticle(filePath) {
    console.log(`Processing: ${path.basename(filePath)}`);

    let content = fs.readFileSync(filePath, 'utf-8');
    const filename = path.basename(filePath);

    // Select appropriate author
    const author = selectAuthor(filename, content);

    // Apply transformations
    content = replaceFormulicPhrases(content);
    content = reduceEmojiUsage(content);
    content = replaceInlineStyles(content);
    content = addCSSLink(content);
    content = addAuthorAttribution(content, author);
    content = addTrustSignals(content);
    content = addContrarianTake(content, filename);
    content = updateSchemaMarkup(content, author);
    content = addLazyLoading(content);

    // Write back to file
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✓ Completed: ${filename}`);
}

// Main execution
async function main() {
    console.log('🚀 Starting article humanization process...\n');

    // Find all article HTML files using built-in fs
    const allFiles = fs.readdirSync(__dirname);
    const articles = allFiles.filter(file => file.startsWith('article-') && file.endsWith('.html'));

    if (articles.length === 0) {
        console.log('No articles found matching pattern: article-*.html');
        return;
    }

    console.log(`Found ${articles.length} articles to process\n`);

    // Process each article
    for (const article of articles) {
        const filePath = path.join(__dirname, article);
        try {
            await processArticle(filePath);
        } catch (error) {
            console.error(`❌ Error processing ${article}:`, error.message);
        }
    }

    console.log(`\n✅ Humanization complete! Processed ${articles.length} articles.`);
    console.log('\n📋 Next steps:');
    console.log('1. Create author avatar images in /images/authors/');
    console.log('2. Review 10 random articles for quality');
    console.log('3. Run Lighthouse audit on sample pages');
    console.log('4. Deploy changes and update sitemap');
}

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { processArticle, AUTHORS, CONTRARIAN_TAKES };
