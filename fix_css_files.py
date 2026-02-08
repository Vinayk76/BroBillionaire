#!/usr/bin/env python3
"""
Fix main CSS files with premium design system values
"""

import re
from pathlib import Path

def fix_css_file(filepath):
    """Fix a single CSS file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content
        total_fixes = 0

        # Fix gold colors: #d4af37 -> #C9A227
        content = re.sub(r'#d4af37', '#C9A227', content, flags=re.IGNORECASE)
        total_fixes += len(re.findall(r'#d4af37', original_content, re.IGNORECASE))

        content = re.sub(r'#D4AF37', '#C9A227', content)
        total_fixes += len(re.findall(r'#D4AF37', original_content))

        # Fix rgba(212, 175, 55) -> rgba(201, 162, 39)
        content = re.sub(r'rgba?\(212,\s*175,\s*55,', 'rgba(201, 162, 39,', content)
        total_fixes += len(re.findall(r'rgba?\(212,\s*175,\s*55,', original_content))

        # Fix border radius values
        radius_fixes = [
            (r'border-radius:\s*4px\b', 'border-radius: 8px'),
            (r'border-radius:\s*6px\b', 'border-radius: 8px'),
            (r'border-radius:\s*10px\b', 'border-radius: 12px'),
            (r'border-radius:\s*20px\b', 'border-radius: 16px'),
            (r'border-radius:\s*24px\b', 'border-radius: 16px'),
        ]

        for pattern, replacement in radius_fixes:
            content = re.sub(pattern, replacement, content)
            total_fixes += len(re.findall(pattern, original_content))

        # Font size standardization
        font_conversions = {
            '12px': '0.75rem',
            '14px': '0.875rem',
            '18px': '1.125rem',
            '20px': '1.25rem',
            '24px': '1.5rem',
            '28px': '1.75rem',
            '32px': '2rem',
            '40px': '2.5rem',
            '56px': '3.5rem',
        }

        for px_val, rem_val in font_conversions.items():
            pattern = re.compile(rf'font-size:\s*{re.escape(px_val)}\b')
            content = pattern.sub(f'font-size: {rem_val}', content)
            total_fixes += len(pattern.findall(original_content))

        # Spacing fixes
        spacing_conversions = {
            '8px': '0.5rem',
            '12px': '0.75rem',
            '24px': '1.5rem',
            '32px': '2rem',
            '40px': '2.5rem',
            '48px': '3rem',
            '64px': '4rem',
        }

        for px_val, rem_val in spacing_conversions.items():
            # Padding
            pattern = re.compile(rf'padding:\s*{re.escape(px_val)}\b')
            content = pattern.sub(f'padding: {rem_val}', content)
            total_fixes += len(pattern.findall(original_content))

            # Margin
            pattern = re.compile(rf'margin:\s*{re.escape(px_val)}\b')
            content = pattern.sub(f'margin: {rem_val}', content)
            total_fixes += len(pattern.findall(original_content))

        # Only write if changes were made
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True, total_fixes

        return False, 0

    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return False, 0

def main():
    base_dir = Path('/Users/vinayprajapati/Desktop/BroBillionaire')

    css_files = [
        'styles.css',
        'responsive.css',
        'backlink-styles.css',
        'premium-article-enhancements.css',
        'premium-enhancements.css',
        'humanized-content.css',
        'footer-styles.css'
    ]

    print("🎨 Fixing Main CSS Files")
    print("="*60)

    total_modified = 0
    total_fixes = 0

    for css_file in css_files:
        filepath = base_dir / css_file
        if filepath.exists():
            modified, fixes = fix_css_file(filepath)
            if modified:
                print(f"✓ {css_file}: {fixes} fixes")
                total_modified += 1
                total_fixes += fixes
            else:
                print(f"  {css_file}: No changes needed")
        else:
            print(f"⚠ {css_file}: Not found")

    print("="*60)
    print(f"\n🎉 Complete! Modified {total_modified} files with {total_fixes} fixes")

if __name__ == '__main__':
    main()
