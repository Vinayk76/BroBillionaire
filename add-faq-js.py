#!/usr/bin/env python3
"""
Add faq-toggle.js to all HTML files with FAQ sections
"""

import os
import re
from pathlib import Path

def has_faq_section(content):
    """Check if file has FAQ section"""
    return 'faq-section' in content

def has_faq_toggle_js(content):
    """Check if faq-toggle.js is already included"""
    return 'faq-toggle.js' in content

def add_faq_toggle_js(content):
    """Add faq-toggle.js script tag before </body>"""

    # Look for </body> tag
    body_end_pattern = r'(</body>)'
    match = re.search(body_end_pattern, content, re.IGNORECASE)

    if match:
        insertion_point = match.start()
        new_content = (
            content[:insertion_point] +
            '    <script src="faq-toggle.js"></script>\n' +
            content[insertion_point:]
        )
        return new_content

    return content

def main():
    current_dir = Path('.')
    html_files = list(current_dir.glob('*.html'))

    stats = {
        'total': len(html_files),
        'updated': 0,
        'skipped': 0,
        'errors': 0
    }

    print("=" * 60)
    print("ADD FAQ TOGGLE JS TO HTML FILES")
    print("=" * 60)
    print(f"\nProcessing {stats['total']} HTML files...\n")

    for html_file in html_files:
        try:
            if '.backup' in html_file.name:
                continue

            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()

            # Only process files with FAQ sections
            if not has_faq_section(content):
                continue

            # Skip if already has faq-toggle.js
            if has_faq_toggle_js(content):
                print(f"✓ SKIP: {html_file.name} (already has faq-toggle.js)")
                stats['skipped'] += 1
                continue

            # Add faq-toggle.js
            new_content = add_faq_toggle_js(content)

            if new_content == content:
                print(f"⚠ WARN: {html_file.name} (couldn't find </body>)")
                stats['errors'] += 1
                continue

            # Write updated content
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(new_content)

            print(f"✓ UPDATED: {html_file.name}")
            stats['updated'] += 1

        except Exception as e:
            print(f"✗ ERROR: {html_file.name} - {str(e)}")
            stats['errors'] += 1

    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"Total files: {stats['total']}")
    print(f"Updated: {stats['updated']}")
    print(f"Skipped: {stats['skipped']}")
    print(f"Errors: {stats['errors']}")
    print("=" * 60)

if __name__ == '__main__':
    main()
