#!/usr/bin/env python3
"""
Premium CSS Theme Fixer for BroBillionaire Articles
Systematically fixes all styling inconsistencies across articles
"""

import re
import os
import glob
from pathlib import Path

class PremiumThemeFixer:
    def __init__(self, base_dir):
        self.base_dir = Path(base_dir)
        self.fixes_applied = []

    def fix_gold_colors(self, content):
        """Consolidate all gold colors to #C9A227"""
        fixes = 0

        # Fix #d4af37 -> #C9A227
        new_content = re.sub(r'#d4af37', '#C9A227', content, flags=re.IGNORECASE)
        fixes += len(re.findall(r'#d4af37', content, re.IGNORECASE))

        # Fix #D4AF37 -> #C9A227
        new_content = re.sub(r'#D4AF37', '#C9A227', new_content)
        fixes += len(re.findall(r'#D4AF37', content))

        # Fix rgba(212, 175, 55, x) -> rgba(201, 162, 39, x)
        new_content = re.sub(r'rgba\(212,\s*175,\s*55,', 'rgba(201, 162, 39,', new_content)
        fixes += len(re.findall(r'rgba\(212,\s*175,\s*55,', content))

        return new_content, fixes

    def fix_border_radius(self, content):
        """Standardize border radius: 8px, 12px, 16px, 50%"""
        fixes = 0

        # 4px -> 8px
        new_content = re.sub(r'border-radius:\s*4px', 'border-radius: 8px', content)
        fixes += len(re.findall(r'border-radius:\s*4px', content))

        # 6px -> 8px
        new_content = re.sub(r'border-radius:\s*6px', 'border-radius: 8px', new_content)
        fixes += len(re.findall(r'border-radius:\s*6px', content))

        # 10px -> 8px or 12px (choose 12px for larger elements)
        new_content = re.sub(r'border-radius:\s*10px', 'border-radius: 12px', new_content)
        fixes += len(re.findall(r'border-radius:\s*10px', content))

        # 20px -> 16px
        new_content = re.sub(r'border-radius:\s*20px', 'border-radius: 16px', new_content)
        fixes += len(re.findall(r'border-radius:\s*20px', content))

        # 24px -> 16px
        new_content = re.sub(r'border-radius:\s*24px', 'border-radius: 16px', new_content)
        fixes += len(re.findall(r'border-radius:\s*24px', content))

        # 30px -> 16px
        new_content = re.sub(r'border-radius:\s*30px', 'border-radius: 16px', new_content)
        fixes += len(re.findall(r'border-radius:\s*30px', content))

        return new_content, fixes

    def fix_font_sizes(self, content):
        """Convert pixel font sizes to rem and standardize"""
        fixes = 0

        # Common conversions (16px = 1rem base)
        conversions = {
            '12px': '0.75rem',   # --font-xs
            '14px': '0.875rem',  # --font-sm
            '16px': '1rem',      # --font-base
            '18px': '1.125rem',  # --font-md
            '20px': '1.25rem',   # --font-lg
            '24px': '1.5rem',    # --font-xl
            '28px': '1.75rem',   # --font-2xl
            '32px': '2rem',      # --font-3xl
            '40px': '2.5rem',    # --font-4xl
            '56px': '3.5rem',    # --font-5xl
        }

        new_content = content
        for px_val, rem_val in conversions.items():
            pattern = re.compile(rf'font-size:\s*{re.escape(px_val)}\b')
            new_content = pattern.sub(f'font-size: {rem_val}', new_content)
            fixes += len(pattern.findall(content))

        return new_content, fixes

    def fix_spacing(self, content):
        """Standardize padding and margin values"""
        fixes = 0

        # Common padding conversions
        padding_conversions = {
            '8px': '0.5rem',    # --space-xs
            '12px': '0.75rem',  # --space-sm
            '16px': '1rem',     # --space-base
            '24px': '1.5rem',   # --space-md
            '32px': '2rem',     # --space-lg
            '40px': '2.5rem',   # --space-xl
            '48px': '3rem',     # --space-2xl
            '64px': '4rem',     # --space-3xl
        }

        new_content = content
        for px_val, rem_val in padding_conversions.items():
            # Fix padding
            pattern = re.compile(rf'padding:\s*{re.escape(px_val)}\b')
            new_content = pattern.sub(f'padding: {rem_val}', new_content)
            fixes += len(pattern.findall(content))

            # Fix margin
            pattern = re.compile(rf'margin:\s*{re.escape(px_val)}\b')
            new_content = pattern.sub(f'margin: {rem_val}', new_content)
            fixes += len(pattern.findall(content))

        return new_content, fixes

    def fix_transitions(self, content):
        """Improve transition quality"""
        fixes = 0

        # Replace generic "all 0.3s ease" with more specific transitions
        new_content = re.sub(
            r'transition:\s*all\s+0\.3s\s+ease',
            'transition: transform 0.3s ease, opacity 0.3s ease, border-color 0.3s ease, background 0.3s ease',
            content
        )
        fixes += len(re.findall(r'transition:\s*all\s+0\.3s\s+ease', content))

        return new_content, fixes

    def add_premium_enhancements(self, content):
        """Add premium visual enhancements where appropriate"""
        fixes = 0

        # Already has enhancements in embedded styles
        # This method can be expanded for additional premium touches

        return content, fixes

    def process_file(self, filepath):
        """Process a single HTML file"""
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            original_content = content
            total_fixes = 0

            # Apply all fixes
            content, gold_fixes = self.fix_gold_colors(content)
            total_fixes += gold_fixes

            content, radius_fixes = self.fix_border_radius(content)
            total_fixes += radius_fixes

            content, font_fixes = self.fix_font_sizes(content)
            total_fixes += font_fixes

            content, spacing_fixes = self.fix_spacing(content)
            total_fixes += spacing_fixes

            content, transition_fixes = self.fix_transitions(content)
            total_fixes += transition_fixes

            # Only write if changes were made
            if content != original_content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)

                return True, total_fixes

            return False, 0

        except Exception as e:
            print(f"Error processing {filepath}: {e}")
            return False, 0

    def fix_all_articles(self):
        """Fix all bro billionaire stock articles"""

        # Find all bro billionaire articles
        patterns = [
            '*bro*billionaire*stocks*.html',
            '*bro*billionaire*.html'
        ]

        files_to_fix = set()
        for pattern in patterns:
            files_to_fix.update(glob.glob(str(self.base_dir / pattern)))

        files_to_fix = sorted(files_to_fix)

        print(f"Found {len(files_to_fix)} articles to fix")
        print("="*60)

        files_modified = 0
        total_fixes = 0

        for filepath in files_to_fix:
            filename = os.path.basename(filepath)
            modified, fixes = self.process_file(filepath)

            if modified:
                files_modified += 1
                total_fixes += fixes
                print(f"✓ {filename}: {fixes} fixes")
            else:
                print(f"  {filename}: No changes needed")

        print("="*60)
        print(f"\n🎉 COMPLETE!")
        print(f"Files modified: {files_modified}/{len(files_to_fix)}")
        print(f"Total fixes applied: {total_fixes}")

        return files_modified, total_fixes


def main():
    base_dir = '/Users/vinayprajapati/Desktop/BroBillionaire'

    print("🎨 Premium CSS Theme Fixer")
    print("="*60)
    print(f"Working directory: {base_dir}")
    print()

    fixer = PremiumThemeFixer(base_dir)
    files_modified, total_fixes = fixer.fix_all_articles()

    if files_modified > 0:
        print(f"\n✨ All articles now have premium, consistent styling!")
    else:
        print(f"\nℹ️  No changes needed - articles are already styled correctly")


if __name__ == '__main__':
    main()
