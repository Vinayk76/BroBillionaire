#!/usr/bin/env python3
"""Final verification - count FAQ questions properly"""
import json, re, os

articles = [f for f in os.listdir('.') if f.startswith('article-') and f.endswith('.html')]
total_articles = len(articles)
articles_with_faqs = 0
articles_with_4plus_faqs = 0
total_questions = 0
issues = []

for filename in articles:
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()

        # Extract all JSON-LD schemas
        pattern = r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>'
        matches = re.findall(pattern, content, re.DOTALL)

        article_questions = 0
        for match in matches:
            try:
                schema = json.loads(match.strip())
                if schema.get('@type') == 'FAQPage':
                    main_entity = schema.get('mainEntity', [])
                    if isinstance(main_entity, list):
                        article_questions += len(main_entity)
            except:
                pass

        if article_questions > 0:
            articles_with_faqs += 1
            total_questions += article_questions
            if article_questions >= 4:
                articles_with_4plus_faqs += 1
        else:
            issues.append(filename)

    except Exception as e:
        issues.append(f"{filename} (error: {e})")

print("="*80)
print("🎯 FINAL FAQ VERIFICATION REPORT")
print("="*80)
print(f"\n📊 Total articles analyzed: {total_articles}")
print(f"✅ Articles with FAQs: {articles_with_faqs} ({articles_with_faqs/total_articles*100:.1f}%)")
print(f"⭐ Articles with 4+ FAQs: {articles_with_4plus_faqs} ({articles_with_4plus_faqs/total_articles*100:.1f}%)")
print(f"📝 Total FAQ questions: {total_questions}")
print(f"📊 Average FAQs per article: {total_questions/articles_with_faqs if articles_with_faqs > 0 else 0:.1f}")
print(f"❌ Articles with issues: {len(issues)}")

if issues:
    print(f"\n⚠️  Issues found in:")
    for issue in issues[:10]:
        print(f"  • {issue}")

print("\n" + "="*80)
print("✨ VERIFICATION COMPLETE!")
print("="*80)
