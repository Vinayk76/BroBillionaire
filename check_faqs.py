#!/usr/bin/env python3
"""
FAQ Analysis Tool for BroBillionaire Articles
Checks for:
1. Articles missing FAQ schema
2. Duplicate FAQ questions across articles
3. Malformed FAQ schema
4. Articles with FAQPage but no questions
"""

import json
import re
import os
from collections import defaultdict
from pathlib import Path

def extract_faq_schema(html_content, filename):
    """Extract FAQ schema from HTML"""
    # Look for FAQPage schema
    faq_pattern = r'<script[^>]*type="application/ld\+json"[^>]*>\s*({[^<]*"@type"\s*:\s*"FAQPage"[^<]*})\s*</script>'
    matches = re.finditer(faq_pattern, html_content, re.DOTALL | re.IGNORECASE)

    faqs = []
    for match in matches:
        try:
            schema_text = match.group(1).strip()
            # Clean up the JSON (remove extra spaces, fix common issues)
            schema_json = json.loads(schema_text)
            if schema_json.get('@type') == 'FAQPage':
                faqs.append(schema_json)
        except json.JSONDecodeError as e:
            print(f"⚠️  JSON error in {filename}: {e}")
            continue

    return faqs

def analyze_articles():
    """Analyze all article files for FAQ issues"""
    article_files = sorted([f for f in os.listdir('.') if f.startswith('article-') and f.endswith('.html')])

    print(f"🔍 Analyzing {len(article_files)} articles...\n")

    # Storage for analysis
    articles_with_faq = []
    articles_without_faq = []
    articles_with_empty_faq = []
    articles_with_malformed_faq = []
    all_questions = defaultdict(list)  # question_text -> list of files

    for filename in article_files:
        try:
            with open(filename, 'r', encoding='utf-8') as f:
                content = f.read()

            # Check if article mentions FAQ in head
            has_faqpage = 'FAQPage' in content

            # Extract FAQ schema
            faq_schemas = extract_faq_schema(content, filename)

            if not faq_schemas:
                if has_faqpage:
                    articles_with_empty_faq.append(filename)
                else:
                    articles_without_faq.append(filename)
            else:
                # Analyze each FAQ schema
                has_questions = False
                for faq_schema in faq_schemas:
                    main_entity = faq_schema.get('mainEntity', [])
                    if isinstance(main_entity, list) and len(main_entity) > 0:
                        has_questions = True
                        articles_with_faq.append(filename)

                        # Extract questions
                        for question_obj in main_entity:
                            if question_obj.get('@type') == 'Question':
                                question_text = question_obj.get('name', '').strip()
                                if question_text:
                                    # Normalize question for duplicate detection
                                    normalized = question_text.lower().strip('?').strip()
                                    all_questions[normalized].append(filename)

                if not has_questions:
                    articles_with_empty_faq.append(filename)

        except Exception as e:
            articles_with_malformed_faq.append((filename, str(e)))
            print(f"❌ Error processing {filename}: {e}")

    # Generate report
    print("=" * 80)
    print("📊 FAQ ANALYSIS REPORT")
    print("=" * 80)

    print(f"\n✅ Articles with complete FAQs: {len(articles_with_faq)}")
    print(f"❌ Articles without FAQ schema: {len(articles_without_faq)}")
    print(f"⚠️  Articles with FAQPage but no questions: {len(articles_with_empty_faq)}")
    print(f"🔥 Articles with malformed FAQ: {len(articles_with_malformed_faq)}")

    # Show articles without FAQs (first 20)
    if articles_without_faq:
        print(f"\n{'='*80}")
        print(f"📋 Articles WITHOUT FAQ Schema (showing first 20 of {len(articles_without_faq)}):")
        print(f"{'='*80}")
        for article in articles_without_faq[:20]:
            print(f"  • {article}")
        if len(articles_without_faq) > 20:
            print(f"  ... and {len(articles_without_faq) - 20} more")

    # Show articles with empty FAQs
    if articles_with_empty_faq:
        print(f"\n{'='*80}")
        print(f"⚠️  Articles with FAQPage but NO Questions (showing first 20 of {len(articles_with_empty_faq)}):")
        print(f"{'='*80}")
        for article in articles_with_empty_faq[:20]:
            print(f"  • {article}")
        if len(articles_with_empty_faq) > 20:
            print(f"  ... and {len(articles_with_empty_faq) - 20} more")

    # Check for duplicate questions
    duplicates = {q: files for q, files in all_questions.items() if len(files) > 1}
    if duplicates:
        print(f"\n{'='*80}")
        print(f"🔄 DUPLICATE FAQ Questions Found: {len(duplicates)}")
        print(f"{'='*80}")
        for question, files in sorted(duplicates.items(), key=lambda x: len(x[1]), reverse=True)[:10]:
            print(f"\n❓ \"{question[:80]}...\" appears in {len(files)} articles:")
            for file in files[:5]:
                print(f"     • {file}")
            if len(files) > 5:
                print(f"     ... and {len(files) - 5} more")

    # Show malformed FAQs
    if articles_with_malformed_faq:
        print(f"\n{'='*80}")
        print(f"🔥 Articles with Malformed FAQs:")
        print(f"{'='*80}")
        for article, error in articles_with_malformed_faq:
            print(f"  • {article}: {error}")

    print(f"\n{'='*80}")
    print("✨ Analysis Complete!")
    print(f"{'='*80}\n")

    # Save detailed results to file
    with open('faq_analysis_results.txt', 'w') as f:
        f.write("FAQ ANALYSIS DETAILED RESULTS\n")
        f.write("="*80 + "\n\n")
        f.write(f"Total articles analyzed: {len(article_files)}\n")
        f.write(f"Articles with complete FAQs: {len(articles_with_faq)}\n")
        f.write(f"Articles without FAQ schema: {len(articles_without_faq)}\n")
        f.write(f"Articles with empty FAQ: {len(articles_with_empty_faq)}\n\n")

        f.write("ARTICLES WITHOUT FAQ SCHEMA:\n")
        f.write("-"*80 + "\n")
        for article in articles_without_faq:
            f.write(f"{article}\n")

        f.write("\n\nARTICLES WITH EMPTY FAQ:\n")
        f.write("-"*80 + "\n")
        for article in articles_with_empty_faq:
            f.write(f"{article}\n")

        f.write("\n\nDUPLICATE QUESTIONS:\n")
        f.write("-"*80 + "\n")
        for question, files in sorted(duplicates.items(), key=lambda x: len(x[1]), reverse=True):
            f.write(f"\n'{question}' ({len(files)} instances):\n")
            for file in files:
                f.write(f"  - {file}\n")

    print("📄 Detailed results saved to: faq_analysis_results.txt\n")

    return {
        'with_faq': articles_with_faq,
        'without_faq': articles_without_faq,
        'empty_faq': articles_with_empty_faq,
        'malformed': articles_with_malformed_faq,
        'duplicates': duplicates
    }

if __name__ == "__main__":
    results = analyze_articles()
