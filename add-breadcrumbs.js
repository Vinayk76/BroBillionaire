#!/usr/bin/env node
/**
 * Add BreadcrumbList Schema to all HTML files missing it
 * This fixes the Google Search Console error about parent_node
 */

const fs = require('fs');
const path = require('path');

const BASE_DIR = __dirname;
const BASE_URL = 'https://brobillionaire.com';

// Function to generate BreadcrumbList schema
function generateBreadcrumb(filename, category, title) {
    const breadcrumbs = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": `${BASE_URL}/`
            }
        ]
    };
    
    // Add category level for articles
    if (filename.startsWith('article-')) {
        breadcrumbs.itemListElement.push({
            "@type": "ListItem",
            "position": 2,
            "name": "Articles",
            "item": `${BASE_URL}/articles.html`
        });
        breadcrumbs.itemListElement.push({
            "@type": "ListItem",
            "position": 3,
            "name": title,
            "item": `${BASE_URL}/${filename}`
        });
    } else if (filename.startsWith('tool-')) {
        breadcrumbs.itemListElement.push({
            "@type": "ListItem",
            "position": 2,
            "name": "Tools",
            "item": `${BASE_URL}/tools.html`
        });
        breadcrumbs.itemListElement.push({
            "@type": "ListItem",
            "position": 3,
            "name": title,
            "item": `${BASE_URL}/${filename}`
        });
    } else {
        // For other files, just add them directly
        breadcrumbs.itemListElement.push({
            "@type": "ListItem",
            "position": 2,
            "name": title,
            "item": `${BASE_URL}/${filename}`
        });
    }
    
    return `
    <!-- BreadcrumbList Schema -->
    <script type="application/ld+json">
    ${JSON.stringify(breadcrumbs, null, 4)}
    </script>
`;
}

// Extract title from HTML
function extractTitle(content) {
    const match = content.match(/<title>([^<]+)<\/title>/i);
    if (!match) return 'Page';
    let title = match[1].replace(' | BroBillionaire', '').trim();
    title = title.replace(/FREE\s*/gi, '').replace(/\s*2026\s*/gi, '').replace(/\s*2025\s*/gi, '').trim();
    return title;
}

// Process a single HTML file
function processFile(filepath) {
    const filename = path.basename(filepath);
    
    // Skip files that should not have breadcrumbs
    const skipFiles = ['index.html', 'googleXXXXXXXXXXXXXXXX.html'];
    if (skipFiles.includes(filename)) {
        console.log(`⏭️  Skipping ${filename}`);
        return;
    }
    
    // Read the file
    let content = fs.readFileSync(filepath, 'utf8');
    
    // Check if already has BreadcrumbList
    if (content.includes('BreadcrumbList')) {
        console.log(`✅ ${filename} already has BreadcrumbList`);
        return;
    }
    
    // Extract title
    const title = extractTitle(content);
    
    // Generate breadcrumb schema
    const breadcrumbSchema = generateBreadcrumb(filename, 'default', title);
    
    // Find insertion point (before </head>)
    const headCloseIndex = content.indexOf('</head>');
    if (headCloseIndex === -1) {
        console.log(`❌ Could not find </head> in ${filename}`);
        return;
    }
    
    // Insert breadcrumb schema
    content = content.slice(0, headCloseIndex) + breadcrumbSchema + content.slice(headCloseIndex);
    
    // Write back to file
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`✅ Added BreadcrumbList to ${filename}`);
}

// Main execution
function main() {
    console.log('🚀 Starting BreadcrumbList addition process...\n');
    
    // Get all HTML files
    const files = fs.readdirSync(BASE_DIR).filter(f => f.endsWith('.html'));
    
    let processed = 0;
    let skipped = 0;
    let errors = 0;
    
    files.forEach(filename => {
        try {
            const filepath = path.join(BASE_DIR, filename);
            const initialContent = fs.readFileSync(filepath, 'utf8');
            
            processFile(filepath);
            
            const finalContent = fs.readFileSync(filepath, 'utf8');
            if (finalContent !== initialContent) {
                processed++;
            } else {
                skipped++;
            }
        } catch (error) {
            console.error(`❌ Error processing ${filename}:`, error.message);
            errors++;
        }
    });
    
    console.log('\n📊 Summary:');
    console.log(`✅ Processed: ${processed}`);
    console.log(`⏭️  Skipped: ${skipped}`);
    console.log(`❌ Errors: ${errors}`);
    console.log(`\n✨ Done!`);
}

main();
