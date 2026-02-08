#!/usr/bin/env python3

import os
import glob
import re

# Counter
wrong_position = []
correct_position = 0

# Get all article HTML files with substantial content
article_files = glob.glob('article-*.html')

print(f"Checking {len(article_files)} article files for footer position...")
print("=" * 60)

for filepath in article_files:
    try:
        # Read the file
        with open(filepath, 'r', encoding='utf-8') as f:
            lines = f.readlines()

        # Skip if file is too small
        if len(lines) < 50:
            continue

        # Find footer and body positions
        footer_line = -1
        body_close_line = -1

        for i, line in enumerate(lines):
            if '<footer' in line and footer_line == -1:
                footer_line = i
            if '</body>' in line:
                body_close_line = i

        if footer_line == -1:
            continue

        if body_close_line == -1:
            wrong_position.append((filepath, "Missing </body> tag", []))
            continue

        # Check if footer is within last 10 lines before </body>
        lines_between = body_close_line - footer_line

        if lines_between > 10:
            # Get lines between footer and </body> for inspection
            between_lines = lines[footer_line:body_close_line]
            content_preview = ''.join(between_lines[:5])
            wrong_position.append((filepath, f"{lines_between} lines between footer and </body>", content_preview))
        else:
            correct_position += 1

    except Exception as e:
        print(f"✗ Error processing {filepath}: {str(e)}")

print("\n" + "=" * 60)
print(f"Results:")
print(f"  ✓ Footers at bottom: {correct_position}")
print(f"  ✗ Footers not at bottom: {len(wrong_position)}")
print("=" * 60)

if wrong_position:
    print("\nArticles with footer NOT at bottom:")
    for filepath, reason, preview in wrong_position[:10]:  # Show first 10
        print(f"\n  {filepath}")
        print(f"    {reason}")
        if preview:
            print(f"    Preview: {preview[:100]}...")
