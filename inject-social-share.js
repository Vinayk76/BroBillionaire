#!/usr/bin/env node
/**
 * BroBillionaire - Inject Social Share Buttons into All Articles
 * 
 * This script adds the social-share-buttons.js to all article pages
 * Run: node inject-social-share.js
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE = __dirname;
const SCRIPT_TAG = '<script src="social-share-buttons.js" defer></script>';

console.log('🔄 Injecting social share buttons into all articles...\n');

// Get all article files
const files = fs.readdirSync(WORKSPACE).filter(f => 
    f.startsWith('article-') && f.endsWith('.html')
);

console.log(`Found ${files.length} article files\n`);

let updated = 0;
let skipped = 0;
let errors = 0;

files.forEach(file => {
    const filePath = path.join(WORKSPACE, file);
    
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if already has the script
        if (content.includes('social-share-buttons.js')) {
            console.log(`   ⏭️  ${file} - already has social share`);
            skipped++;
            return;
        }
        
        // Find the closing body tag and inject before it
        if (content.includes('</body>')) {
            content = content.replace('</body>', `    ${SCRIPT_TAG}\n</body>`);
            fs.writeFileSync(filePath, content);
            console.log(`   ✅ ${file} - updated`);
            updated++;
        } else {
            console.log(`   ⚠️  ${file} - no </body> tag found`);
            errors++;
        }
    } catch (err) {
        console.log(`   ❌ ${file} - error: ${err.message}`);
        errors++;
    }
});

console.log(`
═══════════════════════════════════════════════════════
SUMMARY:
   ✅ Updated: ${updated}
   ⏭️  Skipped (already had): ${skipped}
   ❌ Errors: ${errors}
═══════════════════════════════════════════════════════
`);

// Also update index.html if it doesn't have it
const indexPath = path.join(WORKSPACE, 'index.html');
if (fs.existsSync(indexPath)) {
    let indexContent = fs.readFileSync(indexPath, 'utf8');
    if (!indexContent.includes('social-share-buttons.js')) {
        // Don't add to index - it's not an article
        console.log('ℹ️  Note: index.html not updated (social share is for articles only)');
    }
}

console.log('✅ Social share injection complete!');
console.log('   Users can now easily share articles on Twitter, Reddit, WhatsApp, etc.');
