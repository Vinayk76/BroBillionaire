#!/usr/bin/env python3
"""Fix articles with duplicate FAQPage schemas"""

import json
import re

articles_to_fix = [
    'article-bro-billionaire-stocks-beginners-guide.html',
    'article-crypto-tokenomics-analysis.html',
    'article-india-buy-bro-billionaire-stocks.html'
]

def fix_duplicate_faq_schemas(filename):
    """Remove duplicate FAQPage schemas, keep the better one"""
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()

        # Find all FAQPage schemas
        pattern = r'(<!--[^>]*FAQPage[^>]*-->)?\s*<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>'
        matches = list(re.finditer(pattern, content, re.DOTALL))

        faq_schemas = []
        for match in matches:
            try:
                schema_text = match.group(2).strip()
                schema = json.loads(schema_text)
                if schema.get('@type') == 'FAQPage':
                    faq_schemas.append({
                        'full_match': match.group(0),
                        'schema': schema,
                        'question_count': len(schema.get('mainEntity', []))
                    })
            except:
                pass

        if len(faq_schemas) <= 1:
            print(f"✅ {filename}: Only 1 FAQ schema (no fix needed)")
            return False

        print(f"🔧 {filename}: Found {len(faq_schemas)} FAQPage schemas")

        # Keep the one with more questions
        best_schema = max(faq_schemas, key=lambda x: x['question_count'])
        schemas_to_remove = [s for s in faq_schemas if s != best_schema]

        print(f"   Keeping schema with {best_schema['question_count']} questions")
        print(f"   Removing {len(schemas_to_remove)} duplicate schema(s)")

        # Remove duplicate schemas
        new_content = content
        for schema_to_remove in schemas_to_remove:
            new_content = new_content.replace(schema_to_remove['full_match'], '', 1)

        # Write back
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(new_content)

        print(f"   ✅ Fixed!")
        return True

    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

def main():
    print("🔧 Fixing articles with duplicate FAQPage schemas...\n")

    fixed_count = 0
    for filename in articles_to_fix:
        if fix_duplicate_faq_schemas(filename):
            fixed_count += 1
        print()

    print(f"{'='*80}")
    print(f"✅ Fixed {fixed_count}/{len(articles_to_fix)} articles")
    print(f"{'='*80}\n")

if __name__ == "__main__":
    main()
