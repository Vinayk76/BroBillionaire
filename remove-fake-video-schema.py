#!/usr/bin/env python3
"""
Remove Fake VideoObject Schema from Articles
---------------------------------------------
This script removes VideoObject schemas with PLACEHOLDER YouTube URLs
that cause Google Search Console errors (Invalid object type for field <parent_node>)
"""

import os
import re
import glob

ARTICLES_DIR = os.path.dirname(os.path.abspath(__file__))

def remove_video_schema(content):
    """Remove VideoObject schema blocks with PLACEHOLDER URLs"""
    
    # Pattern to match the entire VideoObject script block with PLACEHOLDER
    pattern = r'\s*<script type="application/ld\+json">\s*\{[^}]*"@type":\s*"VideoObject"[^}]*"embedUrl":\s*"https://www\.youtube\.com/embed/PLACEHOLDER"[^<]*</script>'
    
    # Also handle the pattern with nested objects
    # More comprehensive pattern
    video_pattern = r'<script type="application/ld\+json">\s*\{\s*"@context":\s*"https://schema\.org",\s*"@type":\s*"VideoObject"[^<]*?"embedUrl":\s*"https://www\.youtube\.com/embed/PLACEHOLDER"[^<]*?</script>'
    
    # Remove the VideoObject blocks
    new_content = re.sub(video_pattern, '', content, flags=re.DOTALL)
    
    # Clean up any resulting double newlines
    new_content = re.sub(r'\n\s*\n\s*\n', '\n\n', new_content)
    
    return new_content

def process_file(filepath):
    """Process a single file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if 'youtube.com/embed/PLACEHOLDER' not in content:
            return False
        
        new_content = remove_video_schema(content)
        
        # Verify something was removed
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            return True
        
        return False
    except Exception as e:
        print(f"  ❌ Error processing {filepath}: {e}")
        return False

def main():
    print("\n🔧 Removing Fake VideoObject Schemas from Articles")
    print("=" * 55)
    
    # Find all article HTML files
    pattern = os.path.join(ARTICLES_DIR, 'article-*.html')
    files = glob.glob(pattern)
    
    print(f"📁 Found {len(files)} article files\n")
    
    fixed = 0
    for filepath in sorted(files):
        filename = os.path.basename(filepath)
        if process_file(filepath):
            print(f"  ✅ Fixed: {filename}")
            fixed += 1
    
    print(f"\n{'=' * 55}")
    print(f"✅ Fixed {fixed} files with fake VideoObject schemas")
    print(f"📝 This should resolve Google Search Console errors about")
    print(f"   'Invalid object type for field <parent_node>' in Review snippets")

if __name__ == '__main__':
    main()
