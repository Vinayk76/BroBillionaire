#!/bin/bash
# BroBillionaire Backlink Injector - Adds SEO backlinks to all articles

cd /Users/vinayprajapati/Desktop/BroBillionaire

echo "Starting backlink injection for all articles..."

count=0
for file in article-*.html; do
    if ! grep -q "backlink-injector.js" "$file" 2>/dev/null; then
        # Read file content
        content=$(cat "$file")
        
        # Add CSS link after styles.css
        content=$(echo "$content" | sed 's|<link rel="stylesheet" href="styles.css">|<link rel="stylesheet" href="styles.css"><link rel="stylesheet" href="backlink-styles.css">|g')
        
        # Add scripts before </body>
        content=$(echo "$content" | sed 's|</body>|<script src="article-backlinks-data.js" defer></script><script src="backlink-injector.js" defer></script></body>|g')
        
        # Write back
        echo "$content" > "$file"
        
        count=$((count + 1))
        echo "[$count] Updated: $file"
    else
        echo "Already has backlinks: $file"
    fi
done

echo ""
echo "================================"
echo "Backlink injection complete!"
echo "Updated $count article files"
echo "================================"
