#!/usr/bin/env node
/**
 * Fix missing FAQ toggle functionality in all pages
 */

const fs = require('fs');
const path = require('path');

// Script for article pages using onclick="toggleFAQ(n)"
const toggleFAQScript = `<script>
    // FAQ Toggle Function
    function toggleFAQ(index) {
        const item = document.querySelectorAll('.faq-item')[index];
        const wasActive = item.classList.contains('active');
        
        // Close all FAQs
        document.querySelectorAll('.faq-item').forEach(faq => {
            faq.classList.remove('active');
            const btn = faq.querySelector('.faq-question');
            if (btn && btn.setAttribute) btn.setAttribute('aria-expanded', 'false');
        });
        
        // Open clicked one if it wasn't already open
        if (!wasActive) {
            item.classList.add('active');
            const btn = item.querySelector('.faq-question');
            if (btn && btn.setAttribute) btn.setAttribute('aria-expanded', 'true');
        }
    }
</script>
</body>`;

// Script for calculator pages using div.faq-question (no onclick)
const faqAccordionScript = `
        // FAQ accordion
        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', () => {
                const item = question.parentElement;
                const answer = item.querySelector('.faq-answer');
                const isOpen = item.classList.contains('active');
                
                // Close all
                document.querySelectorAll('.faq-item').forEach(faq => {
                    faq.classList.remove('active');
                    const ans = faq.querySelector('.faq-answer');
                    if (ans) ans.classList.remove('open');
                });
                
                // Open clicked if it wasn't open
                if (!isOpen) {
                    item.classList.add('active');
                    if (answer) answer.classList.add('open');
                }
            });
        });
    </script>
</body>`;

const articlesDir = __dirname;
const allHtmlFiles = fs.readdirSync(articlesDir).filter(f => f.endsWith('.html'));

let fixedToggle = 0;
let fixedAccordion = 0;
let skipped = 0;

allHtmlFiles.forEach(file => {
    const filePath = path.join(articlesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Type 1: Article pages with onclick="toggleFAQ(n)" 
    if (content.includes('onclick="toggleFAQ') && !content.includes('function toggleFAQ')) {
        content = content.replace('</body>', toggleFAQScript);
        modified = true;
        fixedToggle++;
        console.log(`✅ Fixed toggleFAQ: ${file}`);
    }
    
    // Type 2: Calculator pages with div.faq-question (accordion style, no onclick)
    // Check if has faq-answer (accordion style) but no click handler
    if (content.includes('faq-answer') && 
        content.includes('<div class="faq-question">') &&
        !content.includes("'.faq-question').forEach") &&
        !content.includes('onclick="toggleFAQ')) {
        
        // Add accordion script before </body>
        content = content.replace('</script>\n</body>', '</script>' + faqAccordionScript);
        if (!content.includes("'.faq-question').forEach")) {
            // Try simpler replacement if first didn't work
            content = content.replace('    </script>\n</body>', '    </script>' + faqAccordionScript);
        }
        modified = true;
        fixedAccordion++;
        console.log(`✅ Fixed accordion: ${file}`);
    }
    
    if (modified) {
        fs.writeFileSync(filePath, content);
    } else if (content.includes('faq-item')) {
        console.log(`⏭️  Already OK: ${file}`);
        skipped++;
    }
});

console.log('');
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`✅ Fixed toggleFAQ: ${fixedToggle} files`);
console.log(`✅ Fixed accordion: ${fixedAccordion} files`);
console.log(`⏭️  Skipped: ${skipped} files`);
