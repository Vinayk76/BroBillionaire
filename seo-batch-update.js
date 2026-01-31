/**
 * BroBillionaire SEO Batch Updater
 * Adds seo-injector.js to all article files
 * Run: node seo-batch-update.js
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE_DIR = __dirname;
const SEO_SCRIPT_TAG = '<script src="seo-injector.js" defer></script>';

// Get all article files
function getArticleFiles() {
    const files = fs.readdirSync(WORKSPACE_DIR);
    return files.filter(file => file.startsWith('article-') && file.endsWith('.html'));
}

// Update a single file
function updateFile(filename) {
    const filepath = path.join(WORKSPACE_DIR, filename);
    let content = fs.readFileSync(filepath, 'utf8');
    
    // Check if SEO script already added
    if (content.includes('seo-injector.js')) {
        console.log(`⏭️  Skipped (already has SEO): ${filename}`);
        return false;
    }
    
    // Add SEO script before </body>
    if (content.includes('</body>')) {
        content = content.replace('</body>', `    ${SEO_SCRIPT_TAG}\n</body>`);
        fs.writeFileSync(filepath, content, 'utf8');
        console.log(`✅ Updated: ${filename}`);
        return true;
    } else {
        console.log(`⚠️  No </body> found: ${filename}`);
        return false;
    }
}

// Add enhanced meta tags to articles that might be missing them
function enhanceMetaTags(filename) {
    const filepath = path.join(WORKSPACE_DIR, filename);
    let content = fs.readFileSync(filepath, 'utf8');
    
    const enhancements = [];
    
    // Check and add missing meta tags
    if (!content.includes('revisit-after')) {
        enhancements.push('<meta name="revisit-after" content="1 days">');
    }
    if (!content.includes('geo.region')) {
        enhancements.push('<meta name="geo.region" content="IN">');
    }
    if (!content.includes('distribution')) {
        enhancements.push('<meta name="distribution" content="Global">');
    }
    if (!content.includes('rel="manifest"')) {
        enhancements.push('<link rel="manifest" href="/manifest.json">');
    }
    
    if (enhancements.length > 0 && content.includes('</head>')) {
        const enhancementString = '\n    <!-- Additional SEO Enhancements -->\n    ' + enhancements.join('\n    ') + '\n';
        content = content.replace('</head>', enhancementString + '</head>');
        fs.writeFileSync(filepath, content, 'utf8');
        console.log(`🔧 Enhanced meta tags: ${filename} (+${enhancements.length} tags)`);
        return true;
    }
    
    return false;
}

// Main function
function main() {
    console.log('🚀 BroBillionaire SEO Batch Updater\n');
    console.log('=' .repeat(50));
    
    const articles = getArticleFiles();
    console.log(`\n📁 Found ${articles.length} article files\n`);
    
    let updatedCount = 0;
    let enhancedCount = 0;
    
    articles.forEach(file => {
        if (updateFile(file)) updatedCount++;
        if (enhanceMetaTags(file)) enhancedCount++;
    });
    
    console.log('\n' + '=' .repeat(50));
    console.log(`\n✨ Complete!`);
    console.log(`   📝 SEO Script Added: ${updatedCount} files`);
    console.log(`   🔧 Meta Enhanced: ${enhancedCount} files`);
    console.log(`   📊 Total Articles: ${articles.length}`);
}

main();
