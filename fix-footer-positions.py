#!/usr/bin/env python3

import os
import glob
import re

# Counter
fixed = 0
errors = 0

# Get all article HTML files with substantial content
article_files = glob.glob('article-*.html')

print(f"Fixing footer positions in {len(article_files)} article files...")
print("=" * 60)

for filepath in article_files:
    try:
        # Read the file
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Skip if file is too small (incomplete)
        if len(content) < 500:
            continue

        # Check if footer exists
        if '<footer' not in content:
            continue

        # Find the footer content (including all nested tags)
        footer_match = re.search(r'(<footer[\s\S]*?</footer>)', content, re.DOTALL)

        if not footer_match:
            continue

        footer_html = footer_match.group(1)

        # Remove the footer from its current position
        content_without_footer = content.replace(footer_html, '', 1)

        # Find the position of </body> tag
        body_close_pos = content_without_footer.rfind('</body>')

        if body_close_pos == -1:
            print(f"⚠ Warning: No </body> tag in {filepath}")
            continue

        # Insert footer right before </body>
        new_content = (
            content_without_footer[:body_close_pos] +
            '    ' + footer_html + '\n' +
            content_without_footer[body_close_pos:]
        )

        # Write back to file
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)

        fixed += 1
        if fixed <= 20 or fixed % 25 == 0:  # Show first 20 and every 25th
            print(f"✓ Fixed footer position in: {filepath}")

    except Exception as e:
        errors += 1
        print(f"✗ Error processing {filepath}: {str(e)}")

print("\n" + "=" * 60)
print(f"Footer positioning complete!")
print(f"  ✓ Fixed: {fixed}")
print(f"  ✗ Errors: {errors}")
print("=" * 60)
