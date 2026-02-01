#!/usr/bin/env node
/**
 * Fix FAQ toggle functionality with improved error handling
 */

const fs = require('fs');
const path = require('path');

// Improved toggleFAQ with error handling and better selector
const improvedToggleFAQScript = `<script>
    // FAQ Toggle Function
    function toggleFAQ(index) {
        const items = document.querySelectorAll('.faq-section .faq-item');
        if (!items || !items[index]) {
            console.error('FAQ item not found at index:', index);
            return;
        }
        const item = items[index];
        const wasActive = item.classList.contains('active');
        
        // Close all FAQs
        items.forEach(faq => {
            faq.classList.remove('active');
            const btn = faq.querySelector('.faq-question');
            if (btn) btn.setAttribute('aria-expanded', 'false');
        });
        
        // Open clicked one if it wasn't already open
        if (!wasActive) {
            item.classList.add('active');
            const btn = item.querySelector('.faq-question');
            if (btn) btn.setAttribute('aria-expanded', 'true');
        }
    }
</script>
</body>`;

// Old pattern to replace
const oldPatterns = [
    /<script>\s*\/\/\s*FAQ Toggle Function\s*function toggleFAQ\(index\)\s*\{[\s\S]*?const item = document\.querySelectorAll\('\.faq-item'\)\[index\];[\s\S]*?\}\s*<\/script>\s*<\/body>/g,
];

const articlesDir = __dirname;
const allHtmlFiles = fs.readdirSync(articlesDir).filter(f => f.endsWith('.html'));

let fixed = 0;
let skipped = 0;

allHtmlFiles.forEach(file => {
    const filePath = path.join(articlesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Check if has the old toggleFAQ pattern (without .faq-section prefix)
    if (content.includes('function toggleFAQ') && 
        content.includes("querySelectorAll('.faq-item')") &&
        !content.includes("querySelectorAll('.faq-section .faq-item')")) {
        
        // Replace the old script block
        const oldScriptPattern = /<script>\s*\/\/\s*FAQ Toggle Function\s*function toggleFAQ\(index\)\s*\{[\s\S]*?\}\s*<\/script>\s*<\/body>/;
        
        if (oldScriptPattern.test(content)) {
            content = content.replace(oldScriptPattern, improvedToggleFAQScript);
            modified = true;
            fixed++;
            console.log(`✅ Fixed: ${file}`);
        }
    }
    
    if (modified) {
        fs.writeFileSync(filePath, content);
    } else if (content.includes('faq-item')) {
        skipped++;
    }
});

console.log('');
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`✅ Fixed: ${fixed} files`);
console.log(`⏭️  Skipped: ${skipped} files`);
