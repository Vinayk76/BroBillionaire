#!/usr/bin/env python3
"""
Add common header script to all article HTML files.
This script adds the common-header.js script tag before the closing </body> tag.
"""

import os
import glob
import re

def add_common_header_script(html_file):
    """Add common-header.js script to an HTML file if not already present."""
    
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if common-header.js is already included
    if 'common-header.js' in content:
        print(f"  ✓ Already has common-header.js: {os.path.basename(html_file)}")
        return False
    
    # Find the closing </body> tag and add the script before it
    if '</body>' in content:
        # Add the script tag before </body>
        script_tag = '\n    <!-- Common Header -->\n    <script src="common-header.js"></script>\n</body>'
        new_content = content.replace('</body>', script_tag)
        
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"  ✅ Added common-header.js to: {os.path.basename(html_file)}")
        return True
    else:
        print(f"  ❌ No </body> tag found in: {os.path.basename(html_file)}")
        return False

def main():
    # Get the directory where this script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Find all article HTML files
    article_files = glob.glob(os.path.join(script_dir, 'article-*.html'))
    
    print(f"\n🔧 Adding Common Header to Article Files")
    print(f"=" * 50)
    print(f"Found {len(article_files)} article files\n")
    
    updated_count = 0
    skipped_count = 0
    
    for html_file in sorted(article_files):
        if add_common_header_script(html_file):
            updated_count += 1
        else:
            skipped_count += 1
    
    print(f"\n" + "=" * 50)
    print(f"✅ Updated: {updated_count} files")
    print(f"⏭️  Skipped: {skipped_count} files (already had script)")
    print(f"📊 Total:   {len(article_files)} files\n")

if __name__ == '__main__':
    main()
