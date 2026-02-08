#!/usr/bin/env python3

import os
import glob
import re

# Counter
wrong_position = []
correct_position = 0
no_footer = 0

# Get all article HTML files with substantial content
article_files = glob.glob('article-*.html')

print(f"Checking {len(article_files)} article files for footer position...")
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
            no_footer += 1
            continue

        # Find positions
        footer_pos = content.rfind('<footer')
        body_close_pos = content.rfind('</body>')

        if body_close_pos == -1:
            wrong_position.append((filepath, "Missing </body> tag"))
            continue

        # Calculate how much content is after footer
        content_after_footer = content[footer_pos:body_close_pos]

        # Count substantial content (not just scripts/closing tags)
        substantial_content = re.sub(r'<script[^>]*>.*?</script>', '', content_after_footer, flags=re.DOTALL)
        substantial_content = re.sub(r'<!--.*?-->', '', substantial_content, flags=re.DOTALL)
        substantial_content = re.sub(r'</\w+>', '', substantial_content)
        substantial_content = substantial_content.strip()

        # If there's more than just whitespace and closing tags after footer, it's in wrong position
        if len(substantial_content) > 100:
            wrong_position.append((filepath, f"{len(substantial_content)} chars of content after footer"))
        else:
            correct_position += 1

    except Exception as e:
        print(f"✗ Error processing {filepath}: {str(e)}")

print("\n" + "=" * 60)
print(f"Results:")
print(f"  ✓ Correct position: {correct_position}")
print(f"  ✗ Wrong position: {len(wrong_position)}")
print(f"  ⊘ No footer: {no_footer}")
print("=" * 60)

if wrong_position:
    print("\nArticles with footer in wrong position:")
    for filepath, reason in wrong_position[:20]:  # Show first 20
        print(f"  - {filepath}: {reason}")
    if len(wrong_position) > 20:
        print(f"  ... and {len(wrong_position) - 20} more")
