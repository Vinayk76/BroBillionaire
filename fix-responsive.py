#!/usr/bin/env python3
"""
Fix responsive design issues across all article-*.html files.

Fixes applied:
1. Inject inline <style> block with mobile @media queries (if missing)
2. Add <script src="common-header.js"></script> (if missing)
3. Add <script src="mobile-nav.js"></script> (if missing)
4. Add class="article-page" to <body> tag (if missing)
"""

import os
import re
import glob

WORKSPACE = os.path.dirname(os.path.abspath(__file__))

RESPONSIVE_CSS = """
    <style>
        /* Mobile Responsive Styles - Auto-generated fix */
        @media (max-width: 768px) {
            .article-header {
                padding: 100px 20px 40px !important;
            }
            .article-title, .article-main-title {
                font-size: 2rem !important;
                line-height: 1.2 !important;
            }
            .article-subtitle {
                font-size: 1.1rem !important;
            }
            .article-content {
                padding: 40px 20px 60px !important;
                font-size: 1rem !important;
            }
            .article-content h2 {
                font-size: 1.5rem !important;
                margin-top: 2.5rem !important;
            }
            .article-content h3 {
                font-size: 1.2rem !important;
            }
            .stats-grid, .broker-grid, .customer-grid, .related-articles-grid {
                grid-template-columns: 1fr !important;
                gap: 1rem !important;
            }
            .data-table, .comparison-table, .matrix-table, table {
                font-size: 0.85rem !important;
                display: block !important;
                overflow-x: auto !important;
                -webkit-overflow-scrolling: touch !important;
            }
            .battle-arena {
                grid-template-columns: 1fr !important;
                gap: 1.5rem !important;
            }
            .vs-divider {
                font-size: 2rem !important;
                margin: 1rem 0 !important;
            }
            .article-toc {
                padding: 16px !important;
            }
            .key-takeaways-box {
                padding: 1.5rem !important;
            }
            .faq-section {
                padding: 20px !important;
            }
        }
        @media (max-width: 480px) {
            .article-title, .article-main-title {
                font-size: 1.6rem !important;
            }
            .article-meta {
                flex-direction: column !important;
                gap: 0.5rem !important;
            }
            .stat-card {
                padding: 1rem !important;
            }
            .verdict-box, .conclusion-box {
                padding: 1.5rem !important;
            }
            .broker-box, .option-card, .risk-card {
                padding: 1.5rem !important;
            }
            .allocation-tier {
                padding: 1.5rem !important;
            }
        }
    </style>
"""


def get_article_files():
    """Get all article-*.html files (excluding backups)."""
    pattern = os.path.join(WORKSPACE, "article-*.html")
    files = glob.glob(pattern)
    # Exclude backup files
    files = [f for f in files if not any(ext in f for ext in ['.backup', '.bak', '.old'])]
    files.sort()
    return files


def needs_responsive_css(content):
    """Check if the file is missing inline @media queries."""
    # Check for @media inside a <style> tag in the <head>
    head_match = re.search(r'<head[^>]*>(.*?)</head>', content, re.DOTALL | re.IGNORECASE)
    if head_match:
        head_content = head_match.group(1)
        # Look for @media queries in style blocks within head
        style_blocks = re.findall(r'<style[^>]*>(.*?)</style>', head_content, re.DOTALL | re.IGNORECASE)
        for block in style_blocks:
            if '@media' in block:
                return False
    return True


def needs_common_header_js(content):
    """Check if common-header.js script is missing."""
    return 'common-header.js' not in content


def needs_mobile_nav_js(content):
    """Check if mobile-nav.js script is missing."""
    return 'mobile-nav.js' not in content


def needs_body_class(content):
    """Check if <body> tag is missing class="article-page"."""
    # Match <body> tags that DON'T already have class="article-page"
    body_match = re.search(r'<body[^>]*>', content, re.IGNORECASE)
    if body_match:
        body_tag = body_match.group(0)
        if 'article-page' not in body_tag:
            return True
    return False


def fix_responsive_css(content):
    """Inject responsive CSS before </head>."""
    # Insert just before </head>
    return content.replace('</head>', RESPONSIVE_CSS + '\n</head>', 1)


def fix_common_header_js(content):
    """Add common-header.js script before </body>."""
    script_tag = '    <script src="common-header.js"></script>\n'
    return content.replace('</body>', script_tag + '</body>', 1)


def fix_mobile_nav_js(content):
    """Add mobile-nav.js script before </body>."""
    script_tag = '    <script src="mobile-nav.js"></script>\n'
    return content.replace('</body>', script_tag + '</body>', 1)


def fix_body_class(content):
    """Add class="article-page" to <body> tag."""
    # Handle <body> with no attributes
    content = re.sub(r'<body>', '<body class="article-page">', content, count=1, flags=re.IGNORECASE)
    # Handle <body with existing attributes but no class
    # Only if the simple replacement didn't work (body already had attributes)
    if 'article-page' not in content:
        content = re.sub(
            r'<body\s+(?!.*class)(.*?)>',
            r'<body class="article-page" \1>',
            content, count=1, flags=re.IGNORECASE
        )
    # Handle <body with existing class but missing article-page
    if 'article-page' not in content:
        content = re.sub(
            r'<body([^>]*?)class="([^"]*)"',
            r'<body\1class="article-page \2"',
            content, count=1, flags=re.IGNORECASE
        )
    return content


def process_file(filepath):
    """Process a single article file and apply all needed fixes."""
    filename = os.path.basename(filepath)
    fixes_applied = []

    try:
        with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
            content = f.read()
    except Exception as e:
        return filename, [], str(e)

    original_content = content

    # Fix 1: Add responsive CSS if missing
    if needs_responsive_css(content):
        content = fix_responsive_css(content)
        fixes_applied.append("responsive-css")

    # Fix 2: Add body class if missing
    if needs_body_class(content):
        content = fix_body_class(content)
        fixes_applied.append("body-class")

    # Fix 3: Add common-header.js if missing
    if needs_common_header_js(content):
        content = fix_common_header_js(content)
        fixes_applied.append("common-header.js")

    # Fix 4: Add mobile-nav.js if missing
    if needs_mobile_nav_js(content):
        content = fix_mobile_nav_js(content)
        fixes_applied.append("mobile-nav.js")

    # Write back only if changes were made
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

    return filename, fixes_applied, None


def main():
    files = get_article_files()
    print(f"Found {len(files)} article files to process\n")

    stats = {
        "responsive-css": 0,
        "body-class": 0,
        "common-header.js": 0,
        "mobile-nav.js": 0,
    }
    files_modified = 0
    files_already_ok = 0
    errors = []

    for filepath in files:
        filename, fixes, error = process_file(filepath)

        if error:
            errors.append((filename, error))
            print(f"  ERROR: {filename} — {error}")
            continue

        if fixes:
            files_modified += 1
            for fix in fixes:
                stats[fix] += 1
            print(f"  FIXED: {filename} — {', '.join(fixes)}")
        else:
            files_already_ok += 1

    print(f"\n{'='*60}")
    print(f"SUMMARY")
    print(f"{'='*60}")
    print(f"Total files scanned:      {len(files)}")
    print(f"Files modified:           {files_modified}")
    print(f"Files already responsive: {files_already_ok}")
    print(f"Errors:                   {len(errors)}")
    print(f"")
    print(f"Fixes applied:")
    for fix, count in stats.items():
        print(f"  {fix:25s} {count:5d}")

    if errors:
        print(f"\nErrors:")
        for filename, error in errors:
            print(f"  {filename}: {error}")


if __name__ == "__main__":
    main()
