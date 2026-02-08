#!/usr/bin/env python3
"""
Script to add faq-common.css to all HTML files that have FAQ sections
"""

import os
import re
from pathlib import Path

def has_faq_section(html_content):
    """Check if HTML file has FAQ section"""
    return 'faq-section' in html_content.lower() or 'faq-item' in html_content.lower()

def has_faq_css_link(html_content):
    """Check if faq-common.css is already linked"""
    return 'faq-common.css' in html_content

def add_faq_css_link(html_content):
    """Add faq-common.css link to HTML file"""

    # Find the position to insert the CSS link
    # Look for the last CSS link in the head section

    # Try to find responsive.css link (common in most files)
    responsive_pattern = r'(\s*<link\s+rel=["\']stylesheet["\']\s+href=["\']responsive\.css["\']\s*>)'
    match = re.search(responsive_pattern, html_content)

    if match:
        # Add after responsive.css
        insertion_point = match.end()
        new_content = (
            html_content[:insertion_point] +
            '\n    <link rel="stylesheet" href="faq-common.css">' +
            html_content[insertion_point:]
        )
        return new_content

    # If responsive.css not found, try to find styles.css
    styles_pattern = r'(\s*<link\s+rel=["\']stylesheet["\']\s+href=["\']styles\.css["\']\s*>)'
    match = re.search(styles_pattern, html_content)

    if match:
        # Add after styles.css
        insertion_point = match.end()
        new_content = (
            html_content[:insertion_point] +
            '\n    <link rel="stylesheet" href="faq-common.css">' +
            html_content[insertion_point:]
        )
        return new_content

    # If no CSS links found, try to add before </head>
    head_end_pattern = r'(\s*</head>)'
    match = re.search(head_end_pattern, html_content, re.IGNORECASE)

    if match:
        insertion_point = match.start()
        new_content = (
            html_content[:insertion_point] +
            '    <link rel="stylesheet" href="faq-common.css">\n' +
            html_content[insertion_point:]
        )
        return new_content

    # If nothing works, return original content
    return html_content

def process_html_files():
    """Process all HTML files in current directory"""

    current_dir = Path('.')
    html_files = list(current_dir.glob('*.html'))

    stats = {
        'total_files': len(html_files),
        'files_with_faq': 0,
        'files_updated': 0,
        'files_skipped': 0,
        'errors': 0
    }

    updated_files = []
    skipped_files = []
    error_files = []

    print("=" * 60)
    print("FAQ COMMON CSS UPDATER")
    print("=" * 60)
    print(f"\nProcessing {stats['total_files']} HTML files...\n")

    for html_file in html_files:
        try:
            # Skip backup files
            if '.backup' in html_file.name:
                continue

            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()

            # Check if file has FAQ section
            if not has_faq_section(content):
                continue

            stats['files_with_faq'] += 1

            # Check if faq-common.css is already linked
            if has_faq_css_link(content):
                print(f"✓ SKIP: {html_file.name} (already has faq-common.css)")
                stats['files_skipped'] += 1
                skipped_files.append(html_file.name)
                continue

            # Add faq-common.css link
            new_content = add_faq_css_link(content)

            # Check if content was actually changed
            if new_content == content:
                print(f"⚠ WARN: {html_file.name} (couldn't find insertion point)")
                stats['errors'] += 1
                error_files.append(html_file.name)
                continue

            # Write updated content
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(new_content)

            print(f"✓ UPDATED: {html_file.name}")
            stats['files_updated'] += 1
            updated_files.append(html_file.name)

        except Exception as e:
            print(f"✗ ERROR: {html_file.name} - {str(e)}")
            stats['errors'] += 1
            error_files.append(html_file.name)

    # Print summary
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"Total HTML files: {stats['total_files']}")
    print(f"Files with FAQ sections: {stats['files_with_faq']}")
    print(f"Files updated: {stats['files_updated']}")
    print(f"Files skipped (already has CSS): {stats['files_skipped']}")
    print(f"Errors: {stats['errors']}")

    if updated_files:
        print(f"\n✓ Successfully updated {len(updated_files)} files")

    if error_files:
        print(f"\n⚠ Files with errors ({len(error_files)}):")
        for f in error_files[:10]:  # Show first 10
            print(f"  - {f}")
        if len(error_files) > 10:
            print(f"  ... and {len(error_files) - 10} more")

    print("\n" + "=" * 60)
    print("DONE!")
    print("=" * 60)

    return stats

if __name__ == '__main__':
    process_html_files()
