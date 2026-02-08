#!/usr/bin/env python3
"""
Add article-common.css to all article HTML files
Fixes double white background issue
"""

import os
import re
from pathlib import Path

def add_article_common_css(file_path):
    """Add article-common.css link to HTML file if not already present"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check if article-common.css is already linked
    if 'article-common.css' in content:
        return False, "Already has article-common.css"

    # Find the head section and add the CSS link after styles.css
    pattern = r'(<link rel="stylesheet" href="styles\.css">)'
    replacement = r'\1\n    <link rel="stylesheet" href="article-common.css">'

    new_content, count = re.subn(pattern, replacement, content)

    if count > 0:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True, f"Added article-common.css ({count} occurrence)"

    return False, "Could not find styles.css link"

def main():
    """Process all article HTML files"""
    current_dir = Path('.')
    article_files = list(current_dir.glob('article-*.html'))

    print(f"Found {len(article_files)} article files")
    print("=" * 60)

    success_count = 0
    skip_count = 0
    error_count = 0

    for file_path in sorted(article_files):
        try:
            modified, message = add_article_common_css(file_path)
            if modified:
                print(f"✓ {file_path.name}: {message}")
                success_count += 1
            else:
                print(f"⊘ {file_path.name}: {message}")
                skip_count += 1
        except Exception as e:
            print(f"✗ {file_path.name}: Error - {e}")
            error_count += 1

    print("=" * 60)
    print(f"\nSummary:")
    print(f"  Modified: {success_count}")
    print(f"  Skipped:  {skip_count}")
    print(f"  Errors:   {error_count}")
    print(f"  Total:    {len(article_files)}")

if __name__ == '__main__':
    main()
