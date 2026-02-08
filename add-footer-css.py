#!/usr/bin/env python3

import os
import glob
import re

# Counter
fixed = 0
already_has = 0
errors = 0

# Get all article HTML files
article_files = glob.glob('article-*.html')

print(f"Adding footer-styles.css to {len(article_files)} article files...")
print("=" * 60)

for filepath in article_files:
    try:
        # Read the file
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Skip if file is too small (incomplete)
        if len(content) < 500:
            continue

        # Check if footer-styles.css is already included
        if 'footer-styles.css' in content:
            already_has += 1
            continue

        # Find the </head> tag or the last stylesheet link
        # Insert the footer-styles.css link before </head>
        head_close = content.find('</head>')

        if head_close == -1:
            print(f"⚠ Warning: No </head> tag in {filepath}")
            continue

        # Create the link tag
        footer_css_link = '    <link rel="stylesheet" href="footer-styles.css">\n'

        # Insert before </head>
        new_content = (
            content[:head_close] +
            footer_css_link +
            content[head_close:]
        )

        # Write back to file
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)

        fixed += 1
        if fixed <= 20 or fixed % 25 == 0:  # Show first 20 and every 25th
            print(f"✓ Added CSS to: {filepath}")

    except Exception as e:
        errors += 1
        print(f"✗ Error processing {filepath}: {str(e)}")

print("\n" + "=" * 60)
print(f"Footer CSS linking complete!")
print(f"  ✓ Added: {fixed}")
print(f"  ⊙ Already had: {already_has}")
print(f"  ✗ Errors: {errors}")
print("=" * 60)
