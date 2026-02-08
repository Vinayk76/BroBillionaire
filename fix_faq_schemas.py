#!/usr/bin/env python3
"""
Fix FAQ schemas in article HTML files.
- Remove placeholder FAQPage schemas if no actual FAQ section exists
- Update FAQPage schemas with real FAQ content if FAQ section exists
- Flag off-topic hot-take-box/Contrarian Take sections
"""

import os
import re
import json
from pathlib import Path
from bs4 import BeautifulSoup
import html

def extract_faq_from_content(soup):
    """Extract actual FAQ questions and answers from article body."""
    faqs = []

    # Look for FAQ section heading
    faq_headings = soup.find_all(['h2', 'h3'], string=re.compile(r'FAQ|Frequently Asked', re.I))

    for faq_heading in faq_headings:
        # Find all h3/h4 questions after the FAQ heading
        current = faq_heading.find_next_sibling()

        while current:
            # Stop if we hit another major section
            if current.name in ['h2'] and not re.search(r'FAQ|Frequently Asked', current.get_text(), re.I):
                break

            # Check if this is a question heading (h3 or h4)
            if current.name in ['h3', 'h4']:
                question_text = current.get_text().strip()
                # Clean up numbering like "1. " or "Q1: "
                question_text = re.sub(r'^\d+\.\s*|^Q\d+:\s*', '', question_text)

                # Get the answer (next paragraph or paragraphs until next heading)
                answer_parts = []
                answer_elem = current.find_next_sibling()

                while answer_elem and answer_elem.name not in ['h2', 'h3', 'h4']:
                    if answer_elem.name == 'p':
                        answer_parts.append(answer_elem.get_text().strip())
                    elif answer_elem.name == 'ul':
                        # Include list items
                        for li in answer_elem.find_all('li'):
                            answer_parts.append(li.get_text().strip())
                    answer_elem = answer_elem.find_next_sibling()

                if answer_parts:
                    answer_text = ' '.join(answer_parts)
                    # Clean up extra whitespace
                    answer_text = re.sub(r'\s+', ' ', answer_text).strip()

                    if question_text and answer_text:
                        faqs.append({
                            'question': question_text,
                            'answer': answer_text
                        })

            current = current.find_next_sibling()

    return faqs

def has_placeholder_faq_schema(html_content):
    """Check if FAQPage schema contains placeholder/generic content."""
    # Look for placeholder patterns
    placeholder_patterns = [
        r'What makes \[ARTICLE_NAME\]',
        r'What is \[ARTICLE_NAME\] in simple terms',
        r'a Bro Billionaire stock\?',
        r'Should I invest in .+ in 202\d\?',
        r'Can I buy .+ from India\?',
        r'What are the main risks of investing',
        r'10K Bro Billionaire Worth',  # Generic placeholder article name
    ]

    # Extract schema
    schema_match = re.search(r'<script[^>]*type="application/ld\+json"[^>]*>\s*(\{[^<]+FAQPage[^<]+\})\s*</script>', html_content, re.DOTALL)

    if not schema_match:
        return False

    schema_text = schema_match.group(1)

    # Check for placeholder patterns
    for pattern in placeholder_patterns:
        if re.search(pattern, schema_text, re.I):
            return True

    return False

def get_article_topic(soup):
    """Extract article topic from title or heading."""
    # Try to get from title
    title_tag = soup.find('title')
    if title_tag:
        return title_tag.get_text().split('|')[0].strip()

    # Try h1
    h1 = soup.find('h1')
    if h1:
        return h1.get_text().strip()

    return "this article"

def check_off_topic_hotbox(soup, article_topic):
    """Check for off-topic hot-take-box or Contrarian Take sections."""
    off_topic_boxes = []

    hotboxes = soup.find_all('div', class_='hot-take-box')

    for box in hotboxes:
        content = box.get_text().strip()

        # Check if it mentions Meta's metaverse (common off-topic placeholder)
        if 'Meta' in content and 'metaverse' in content:
            # Check if article is about Meta
            if not re.search(r'\bmeta\b', article_topic, re.I):
                off_topic_boxes.append({
                    'content': content[:200],  # First 200 chars
                    'reason': 'Generic Meta metaverse content in non-Meta article'
                })

        # Check for other obviously off-topic content
        # (can expand this logic)

    return off_topic_boxes

def remove_faq_schema(html_content):
    """Remove FAQPage schema from HTML."""
    # Remove the entire FAQPage schema block
    pattern = r'<!--\s*FAQPage Schema\s*-->\s*<script[^>]*type="application/ld\+json"[^>]*>\s*\{[^<]*"@type"\s*:\s*"FAQPage"[^<]*\}\s*</script>'
    cleaned = re.sub(pattern, '', html_content, flags=re.DOTALL)

    # Also handle without comment
    pattern2 = r'<script[^>]*type="application/ld\+json"[^>]*>\s*\{[^<]*"@type"\s*:\s*"FAQPage"[^<]*\}\s*</script>'
    if '<!-- FAQPage Schema -->' not in html_content:
        cleaned = re.sub(pattern2, '', cleaned, flags=re.DOTALL)

    return cleaned

def create_faq_schema(faqs):
    """Create FAQPage schema JSON from FAQ list."""
    schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": []
    }

    for faq in faqs:
        schema["mainEntity"].append({
            "@type": "Question",
            "name": faq['question'],
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq['answer']
            }
        })

    return schema

def update_faq_schema(html_content, new_schema):
    """Update FAQPage schema in HTML with new content."""
    # First remove old schema
    cleaned = remove_faq_schema(html_content)

    # Create new schema block
    schema_json = json.dumps(new_schema, indent=2)
    schema_block = f'  <!-- FAQPage Schema -->\n  <script type="application/ld+json">{schema_json}</script>'

    # Insert before </head>
    cleaned = re.sub(r'(\s*</head>)', f'\n{schema_block}\n\\1', cleaned)

    return cleaned

def process_article(file_path):
    """Process a single article file."""
    result = {
        'file': os.path.basename(file_path),
        'status': 'unchanged',
        'action': None,
        'off_topic_boxes': [],
        'error': None
    }

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            html_content = f.read()

        soup = BeautifulSoup(html_content, 'html.parser')

        # Get article topic
        article_topic = get_article_topic(soup)

        # Check for off-topic boxes
        off_topic_boxes = check_off_topic_hotbox(soup, article_topic)
        if off_topic_boxes:
            result['off_topic_boxes'] = off_topic_boxes

        # Check if has FAQPage schema
        if 'FAQPage' not in html_content:
            result['status'] = 'no_schema'
            return result

        # Check if schema has placeholder content
        has_placeholder = has_placeholder_faq_schema(html_content)

        # Extract actual FAQs from content
        actual_faqs = extract_faq_from_content(soup)

        # Decide what to do
        if actual_faqs:
            # Has real FAQ section - update schema
            new_schema = create_faq_schema(actual_faqs)
            updated_html = update_faq_schema(html_content, new_schema)

            # Write back to file
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(updated_html)

            result['status'] = 'updated'
            result['action'] = f'Updated schema with {len(actual_faqs)} real FAQs'

        elif has_placeholder or True:  # Remove all schemas if no real FAQs
            # No real FAQ section - remove schema
            cleaned_html = remove_faq_schema(html_content)

            # Write back to file
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(cleaned_html)

            result['status'] = 'removed'
            result['action'] = 'Removed placeholder/unnecessary FAQ schema (no actual FAQ section in body)'

    except Exception as e:
        result['error'] = str(e)
        result['status'] = 'error'

    return result

def main():
    """Main processing function."""
    # Find all article HTML files in main directory
    article_dir = Path('/Users/vinayprajapati/Desktop/BroBillionaire')
    article_files = sorted(article_dir.glob('article-*.html'))

    print(f"Found {len(article_files)} article files to process\n")
    print("=" * 80)

    results = {
        'updated': [],
        'removed': [],
        'unchanged': [],
        'no_schema': [],
        'error': [],
        'off_topic_flags': []
    }

    for i, file_path in enumerate(article_files, 1):
        print(f"\rProcessing {i}/{len(article_files)}: {file_path.name[:50]}...", end='', flush=True)

        result = process_article(file_path)

        # Categorize result
        results[result['status']].append(result)

        # Track off-topic boxes separately
        if result['off_topic_boxes']:
            results['off_topic_flags'].append(result)

    print("\n" + "=" * 80)
    print("\n📊 PROCESSING SUMMARY")
    print("=" * 80)
    print(f"✅ Updated (with real FAQs): {len(results['updated'])}")
    print(f"🗑️  Removed (no FAQ section): {len(results['removed'])}")
    print(f"⏭️  Unchanged: {len(results['unchanged'])}")
    print(f"ℹ️  No schema found: {len(results['no_schema'])}")
    print(f"❌ Errors: {len(results['error'])}")
    print(f"⚠️  Off-topic boxes flagged: {len(results['off_topic_flags'])}")

    # Show details of updated files
    if results['updated']:
        print(f"\n{'='*80}")
        print("✅ FILES WITH UPDATED FAQ SCHEMAS")
        print('='*80)
        for r in results['updated'][:10]:  # Show first 10
            print(f"  • {r['file']}: {r['action']}")
        if len(results['updated']) > 10:
            print(f"  ... and {len(results['updated']) - 10} more")

    # Show files with off-topic boxes
    if results['off_topic_flags']:
        print(f"\n{'='*80}")
        print("⚠️  FILES WITH OFF-TOPIC HOT-TAKE BOXES")
        print('='*80)
        for r in results['off_topic_flags'][:20]:  # Show first 20
            print(f"\n  📄 {r['file']}")
            for box in r['off_topic_boxes']:
                print(f"     Reason: {box['reason']}")
                print(f"     Content: {box['content'][:100]}...")
        if len(results['off_topic_flags']) > 20:
            print(f"\n  ... and {len(results['off_topic_flags']) - 20} more files")

    # Show errors
    if results['error']:
        print(f"\n{'='*80}")
        print("❌ ERRORS")
        print('='*80)
        for r in results['error']:
            print(f"  • {r['file']}: {r['error']}")

    print(f"\n{'='*80}")
    print("✨ Processing complete!")
    print('='*80)

    # Save detailed report
    report_file = article_dir / 'faq_schema_fix_report.json'
    with open(report_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2)

    print(f"\n📋 Detailed report saved to: {report_file}")

if __name__ == '__main__':
    main()
