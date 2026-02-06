#!/usr/bin/env python3
"""
Fix Headers and Footers Script for BroBillionaire Articles
This script:
1. Removes duplicate inline site-footer sections (since common-footer.js handles this)
2. Ensures common-header.js and common-footer.js are included
3. Ensures consistent script loading order
"""

import os
import glob
import re

def fix_article_file(html_file):
    """Fix header and footer issues in an HTML file."""
    
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    changes_made = []
    
    # 1. Remove inline site-footer (since common-footer.js will inject the footer)
    # Match the entire site-footer section including the comment
    site_footer_pattern = r'\s*<!-- Footer -->\s*<footer class="site-footer">.*?</footer>'
    if re.search(site_footer_pattern, content, re.DOTALL):
        content = re.sub(site_footer_pattern, '', content, flags=re.DOTALL)
        changes_made.append("Removed inline site-footer")
    
    # Also match site-footer without comment
    site_footer_pattern2 = r'\s*<footer class="site-footer">.*?</footer>'
    if re.search(site_footer_pattern2, content, re.DOTALL):
        content = re.sub(site_footer_pattern2, '', content, flags=re.DOTALL)
        changes_made.append("Removed inline site-footer (no comment)")
    
    # 2. Check if common-footer.js is present
    if 'common-footer.js' not in content:
        # Add before common-header.js if it exists, otherwise before </body>
        if 'common-header.js' in content:
            content = content.replace(
                '<script src="common-header.js"></script>',
                '<script src="common-footer.js" defer></script>\n    <script src="common-header.js"></script>'
            )
            changes_made.append("Added common-footer.js")
        elif '</body>' in content:
            content = content.replace(
                '</body>',
                '    <script src="common-footer.js" defer></script>\n</body>'
            )
            changes_made.append("Added common-footer.js before </body>")
    
    # 3. Check if common-header.js is present
    if 'common-header.js' not in content:
        # Add before </body>
        if '</body>' in content:
            content = content.replace(
                '</body>',
                '    <!-- Common Header -->\n    <script src="common-header.js"></script>\n</body>'
            )
            changes_made.append("Added common-header.js")
    
    # 4. Clean up excessive newlines that might have been created
    content = re.sub(r'\n{4,}', '\n\n\n', content)
    
    # Write back if changes were made
    if content != original_content:
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(content)
        return True, changes_made
    
    return False, []

def main():
    # Get the directory where this script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Find all article HTML files
    article_files = glob.glob(os.path.join(script_dir, 'article-*.html'))
    
    print(f"\n🔧 Fixing Headers and Footers in Article Files")
    print(f"=" * 60)
    print(f"Found {len(article_files)} article files\n")
    
    updated_count = 0
    skipped_count = 0
    
    for html_file in sorted(article_files):
        filename = os.path.basename(html_file)
        updated, changes = fix_article_file(html_file)
        
        if updated:
            print(f"  ✅ {filename}")
            for change in changes:
                print(f"      └─ {change}")
            updated_count += 1
        else:
            skipped_count += 1
    
    print(f"\n" + "=" * 60)
    print(f"✅ Updated: {updated_count} files")
    print(f"⏭️  Skipped: {skipped_count} files (no changes needed)")
    print(f"📊 Total:   {len(article_files)} files\n")

if __name__ == '__main__':
    main()
