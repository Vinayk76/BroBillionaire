#!/usr/bin/env node
/**
 * Fix BreadcrumbList Schema - Remove 'item' from last breadcrumb
 * This fixes the Google Search Console error about parent_node
 * The last item in a breadcrumb should not have an 'item' property
 */

const fs = require('fs');
const path = require('path');

const BASE_DIR = __dirname;

// Get all HTML files
const files = fs.readdirSync(BASE_DIR).filter(f => f.endsWith('.html'));

let fixedCount = 0;
let skippedCount = 0;

files.forEach(file => {
    const filePath = path.join(BASE_DIR, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if file has BreadcrumbList
    if (!content.includes('"@type": "BreadcrumbList"')) {
        skippedCount++;
        return;
    }
    
    // Find and fix the BreadcrumbList schema
    // Pattern: last ListItem with "item" property before closing the breadcrumb array
    const breadcrumbRegex = /({\s*"@context":\s*"https:\/\/schema\.org",\s*"@type":\s*"BreadcrumbList",\s*"itemListElement":\s*\[[\s\S]*?)({\s*"@type":\s*"ListItem",\s*"position":\s*(\d+),\s*"name":\s*"[^"]*",\s*"item":\s*"[^"]*"\s*})\s*(\]\s*}\s*<\/script>)/g;
    
    const matches = [...content.matchAll(breadcrumbRegex)];
    
    if (matches.length === 0) {
        // Try alternative pattern - check for the structure more carefully
        // Look for the last item in itemListElement array
        const schemaStartRegex = /"@type":\s*"BreadcrumbList"[\s\S]*?"itemListElement":\s*\[/g;
        let match;
        let hasChanges = false;
        
        while ((match = schemaStartRegex.exec(content)) !== null) {
            const startPos = match.index;
            // Find the closing bracket of itemListElement
            let depth = 1;
            let pos = content.indexOf('[', startPos + match[0].length - 1) + 1;
            let itemListContent = '[';
            
            while (depth > 0 && pos < content.length) {
                const char = content[pos];
                itemListContent += char;
                if (char === '[') depth++;
                if (char === ']') depth--;
                pos++;
            }
            
            // Now parse and fix the last item
            try {
                const items = JSON.parse(itemListContent);
                if (items.length > 0 && items[items.length - 1].item) {
                    // Remove 'item' from last element
                    delete items[items.length - 1].item;
                    
                    // Replace in content
                    const newItemList = JSON.stringify(items, null, 8).split('\n').map((line, idx) => 
                        idx === 0 ? line : '    ' + line
                    ).join('\n');
                    
                    const beforeItemList = content.substring(0, content.indexOf('[', startPos + match[0].length - 1));
                    const afterItemList = content.substring(pos);
                    
                    content = beforeItemList + newItemList + afterItemList;
                    hasChanges = true;
                    break; // Only fix first breadcrumb found
                }
            } catch (e) {
                // Skip if parsing fails
            }
        }
        
        if (hasChanges) {
            fs.writeFileSync(filePath, content, 'utf8');
            fixedCount++;
            console.log(`✓ Fixed: ${file}`);
        } else {
            skippedCount++;
        }
    } else {
        // We found matches - extract last ListItem position and rebuild without 'item'
        let newContent = content;
        
        matches.forEach(match => {
            const fullMatch = match[0];
            const beforeLastItem = match[1];
            const lastItem = match[2];
            const position = match[3];
            const afterItems = match[4];
            
            // Extract name from lastItem
            const nameMatch = lastItem.match(/"name":\s*"([^"]*)"/);
            if (nameMatch) {
                const name = nameMatch[1];
                
                // Rebuild last item without 'item' property
                const newLastItem = `        {
            "@type": "ListItem",
            "position": ${position},
            "name": "${name}"
        }`;
                
                const replacement = beforeLastItem + newLastItem + '\n    ' + afterItems;
                newContent = newContent.replace(fullMatch, replacement);
            }
        });
        
        if (newContent !== content) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            fixedCount++;
            console.log(`✓ Fixed: ${file}`);
        } else {
            skippedCount++;
        }
    }
});

console.log(`\n✓ Fixed ${fixedCount} files`);
console.log(`- Skipped ${skippedCount} files (no changes needed or no breadcrumbs)`);
console.log(`\nBreadcrumb fix complete! The last item no longer has an 'item' property.`);
