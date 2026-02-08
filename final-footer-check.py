#!/usr/bin/env python3

import os
import glob
import re

# Counter
correct = 0
has_content_after = 0

# Get all article HTML files
article_files = glob.glob('article-*.html')

print(f"Checking {len(article_files)} article files...")
print("=" * 60)

for filepath in article_files:
    try:
        # Read the file
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Skip if file is too small
        if len(content) < 500:
            continue

        # Check if footer exists
        if '<footer' not in content:
            continue

        # Find closing </footer> tag
        footer_end = content.rfind('</footer>')
        body_close = content.rfind('</body>')

        if footer_end == -1 or body_close == -1:
            continue

        # Get content between </footer> and </body>
        content_after_footer = content[footer_end + 9:body_close].strip()

        # Check if there's any substantial content (not just whitespace)
        if len(content_after_footer) > 5:
            has_content_after += 1
            if has_content_after <= 5:
                print(f"⚠ {filepath}")
                print(f"   Content after footer: {content_after_footer[:100]}")
        else:
            correct += 1

    except Exception as e:
        print(f"✗ Error: {filepath}: {str(e)}")

print("\n" + "=" * 60)
print(f"Results:")
print(f"  ✓ Footer correctly at bottom: {correct}")
print(f"  ⚠ Content after footer: {has_content_after}")
print("=" * 60)
