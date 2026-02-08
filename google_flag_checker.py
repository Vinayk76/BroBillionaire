#!/usr/bin/env python3
"""
Focused Google Search Flag Checker
Focus on real issues that trigger Google Search Console flags
"""

import json
import re
import os
from collections import defaultdict

def check_faq_flags(filename, content):
    """Check FAQ schema for real flag triggers"""
    issues = []

    pattern = r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>'
    matches = re.findall(pattern, content, re.DOTALL)

    faq_count = 0
    total_questions = 0

    for match in matches:
        try:
            schema = json.loads(match.strip())
            if schema.get('@type') == 'FAQPage':
                faq_count += 1

                # Check @context
                if schema.get('@context') != 'https://schema.org':
                    issues.append("🚨 FAQ: Invalid @context (will cause flag)")

                # Check mainEntity
                main_entity = schema.get('mainEntity', [])
                if not main_entity:
                    issues.append("🚨 FAQ: Empty mainEntity (will cause flag)")
                    continue

                if not isinstance(main_entity, list):
                    issues.append("🚨 FAQ: mainEntity not a list (will cause flag)")
                    continue

                question_count = len(main_entity)
                total_questions += question_count

                # Check minimum questions
                if question_count < 2:
                    issues.append(f"🚨 FAQ: Only {question_count} question (Google requires 2+)")

                # Validate each question
                for i, q in enumerate(main_entity):
                    if q.get('@type') != 'Question':
                        issues.append(f"🚨 FAQ Q{i+1}: Missing @type=Question")

                    if not q.get('name'):
                        issues.append(f"🚨 FAQ Q{i+1}: Missing question name")

                    answer = q.get('acceptedAnswer', {})
                    if answer.get('@type') != 'Answer':
                        issues.append(f"🚨 FAQ Q{i+1}: Missing @type=Answer")

                    if not answer.get('text'):
                        issues.append(f"🚨 FAQ Q{i+1}: Missing answer text")

                    # Check for spam/promotional (Google flag trigger)
                    answer_text = answer.get('text', '').lower()
                    spam_phrases = ['buy now', 'click here to buy', 'limited time offer',
                                   'discount code', 'use promo code', 'call us today']
                    if any(spam in answer_text for spam in spam_phrases):
                        issues.append(f"🚨 FAQ Q{i+1}: Promotional content detected (flag risk)")

        except json.JSONDecodeError:
            issues.append("🚨 FAQ: Malformed JSON (will cause flag)")
        except Exception as e:
            issues.append(f"🚨 FAQ: Parse error - {str(e)[:40]}")

    # Multiple FAQPage schemas (Google doesn't like this)
    if faq_count > 1:
        issues.append(f"🚨 Multiple FAQPage schemas ({faq_count}) - should be only 1")

    if faq_count == 0:
        issues.append("🚨 No FAQPage schema found")

    return issues, total_questions

def check_duplicate_content(filename, content):
    """Check for duplicate content flags"""
    issues = []

    # Check title
    title_match = re.search(r'<title>([^<]+)</title>', content, re.I)
    title = title_match.group(1) if title_match else ''

    # Check meta description
    desc_match = re.search(r'<meta\s+name="description"\s+content="([^"]+)"', content, re.I)
    desc = desc_match.group(1) if desc_match else ''

    # Check if title and description are identical (duplicate content signal)
    if title and desc and title.lower().strip() == desc.lower().strip():
        issues.append("🚨 Title and description are identical (duplicate content flag)")

    # Check for very short unique content
    body_match = re.search(r'<body[^>]*>(.*?)</body>', content, re.DOTALL | re.I)
    if body_match:
        body = body_match.group(1)
        body = re.sub(r'<script[^>]*>.*?</script>', '', body, flags=re.DOTALL)
        body = re.sub(r'<style[^>]*>.*?</style>', '', body, flags=re.DOTALL)
        text = re.sub(r'<[^>]+>', ' ', body)
        text = re.sub(r'\s+', ' ', text).strip()

        word_count = len(text.split())
        if word_count < 200:
            issues.append(f"🚨 Thin content ({word_count} words) - flag risk if <200")

    return issues

def check_schema_errors(filename, content):
    """Check for schema errors that cause flags"""
    issues = []

    pattern = r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>'
    matches = re.findall(pattern, content, re.DOTALL)

    for match in matches:
        try:
            schema = json.loads(match.strip())
            schema_type = schema.get('@type', 'Unknown')

            # Check @context
            context = schema.get('@context')
            if not context:
                issues.append(f"🚨 {schema_type}: Missing @context")
            elif context not in ['https://schema.org', 'http://schema.org']:
                issues.append(f"🚨 {schema_type}: Invalid @context")

            # Check for empty/null values (Google doesn't like this)
            def check_empty_values(obj, path=''):
                if isinstance(obj, dict):
                    for key, value in obj.items():
                        new_path = f"{path}.{key}" if path else key
                        if value in ['', None, [], {}]:
                            issues.append(f"⚠️  {schema_type}: Empty value at {new_path}")
                        elif isinstance(value, (dict, list)):
                            check_empty_values(value, new_path)

            check_empty_values(schema)

        except json.JSONDecodeError as e:
            issues.append(f"🚨 Malformed JSON-LD schema: {str(e)[:60]}")

    return issues

def check_indexability(filename, content):
    """Check for indexability issues"""
    issues = []

    # Check robots meta
    robots_match = re.search(r'<meta\s+name="robots"\s+content="([^"]+)"', content, re.I)
    if robots_match:
        robots = robots_match.group(1).lower()
        if 'noindex' in robots:
            issues.append("🚨 CRITICAL: Page set to noindex - won't appear in search!")
        if 'none' in robots:
            issues.append("🚨 CRITICAL: robots=none - page blocked from indexing!")

    # Check canonical
    canonical_match = re.search(r'<link\s+rel="canonical"\s+href="([^"]+)"', content, re.I)
    if not canonical_match:
        issues.append("⚠️  Missing canonical URL (not critical but recommended)")
    else:
        canonical = canonical_match.group(1)
        # Check if canonical points to different domain
        if 'brobillionaire.com' not in canonical.lower():
            issues.append(f"🚨 Canonical points to different domain: {canonical[:50]}")

    # Check title
    if not re.search(r'<title>[^<]+</title>', content, re.I):
        issues.append("🚨 CRITICAL: Missing title tag")

    # Check meta description
    if not re.search(r'<meta\s+name="description"', content, re.I):
        issues.append("⚠️  Missing meta description (not critical but recommended)")

    return issues

def main():
    print("="*80)
    print("🔍 GOOGLE SEARCH FLAG CHECKER")
    print("Checking for issues that trigger actual Google Search Console flags")
    print("="*80)
    print()

    articles = sorted([f for f in os.listdir('.') if f.startswith('article-') and f.endswith('.html')])

    print(f"📁 Analyzing {len(articles)} articles...\n")

    critical_issues_count = 0
    warning_count = 0
    clean_articles = []
    flagged_articles = {}

    # Track duplicate questions across articles
    all_questions = defaultdict(list)

    for i, filename in enumerate(articles, 1):
        if i % 50 == 0:
            print(f"  Progress: {i}/{len(articles)}...")

        try:
            with open(filename, 'r', encoding='utf-8') as f:
                content = f.read()

            article_issues = []

            # Run checks
            faq_issues, question_count = check_faq_flags(filename, content)
            duplicate_issues = check_duplicate_content(filename, content)
            schema_issues = check_schema_errors(filename, content)
            index_issues = check_indexability(filename, content)

            all_issues = faq_issues + duplicate_issues + schema_issues + index_issues

            # Count issue severity
            critical = len([i for i in all_issues if '🚨' in i])
            warnings = len([i for i in all_issues if '⚠️' in i])

            if all_issues:
                flagged_articles[filename] = all_issues
                critical_issues_count += critical
                warning_count += warnings
            else:
                clean_articles.append(filename)

            # Track FAQ questions for duplicate check
            pattern = r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>'
            matches = re.findall(pattern, content, re.DOTALL)
            for match in matches:
                try:
                    schema = json.loads(match.strip())
                    if schema.get('@type') == 'FAQPage':
                        for q in schema.get('mainEntity', []):
                            question_text = q.get('name', '').lower().strip()
                            if question_text:
                                all_questions[question_text].append(filename)
                except:
                    pass

        except Exception as e:
            flagged_articles[filename] = [f"🚨 File error: {str(e)}"]
            critical_issues_count += 1

    # Check for duplicate FAQs across articles
    duplicate_faqs = {q: files for q, files in all_questions.items() if len(files) > 1}

    # Generate report
    print(f"\n{'='*80}")
    print("📊 RESULTS")
    print(f"{'='*80}\n")

    print(f"✅ Clean articles (no flags): {len(clean_articles)} ({len(clean_articles)/len(articles)*100:.1f}%)")
    print(f"🚨 Articles with CRITICAL issues: {len([a for a in flagged_articles if any('🚨' in i for i in flagged_articles[a])])}")
    print(f"⚠️  Articles with warnings: {len([a for a in flagged_articles if any('⚠️' in i for i in flagged_articles[a]) and not any('🚨' in i for i in flagged_articles[a])])}")
    print(f"📝 Total critical issues: {critical_issues_count}")
    print(f"📝 Total warnings: {warning_count}")

    if duplicate_faqs:
        print(f"🔄 Duplicate FAQ questions across articles: {len(duplicate_faqs)}")
    else:
        print(f"✅ No duplicate FAQ questions across articles")

    # Show critical issues
    critical_articles = {f: issues for f, issues in flagged_articles.items()
                        if any('🚨' in i for i in issues)}

    if critical_articles:
        print(f"\n{'='*80}")
        print(f"🚨 CRITICAL ISSUES (Will trigger Google flags)")
        print(f"{'='*80}\n")

        for filename, issues in list(critical_articles.items())[:15]:
            critical_only = [i for i in issues if '🚨' in i]
            if critical_only:
                print(f"❌ {filename}")
                for issue in critical_only[:5]:
                    print(f"   {issue}")
                print()

    # Show duplicate FAQs if any
    if duplicate_faqs:
        print(f"{'='*80}")
        print(f"🔄 DUPLICATE FAQ QUESTIONS (May trigger duplicate content flags)")
        print(f"{'='*80}\n")

        for question, files in sorted(duplicate_faqs.items(), key=lambda x: len(x[1]), reverse=True)[:5]:
            print(f"Question appears in {len(files)} articles:")
            print(f'  "{question[:70]}..."')
            for f in files[:3]:
                print(f"    • {f}")
            print()

    # Final verdict
    print(f"{'='*80}")
    if len(critical_articles) == 0:
        print("✅ NO CRITICAL ISSUES FOUND!")
        print("🎉 Your articles are compliant with Google Search Console guidelines")
        print("✨ No flags will be triggered")
    elif len(critical_articles) < 10:
        print("⚠️  FEW CRITICAL ISSUES FOUND")
        print(f"🔧 Fix {len(critical_articles)} articles to ensure full compliance")
    else:
        print("🚨 MULTIPLE CRITICAL ISSUES FOUND")
        print(f"⚠️  {len(critical_articles)} articles need attention to avoid flags")
    print(f"{'='*80}\n")

    # Save report
    with open('google_flag_report.txt', 'w') as f:
        f.write("GOOGLE SEARCH FLAG REPORT\n")
        f.write("="*80 + "\n\n")

        f.write(f"Total articles: {len(articles)}\n")
        f.write(f"Clean: {len(clean_articles)}\n")
        f.write(f"With critical issues: {len(critical_articles)}\n\n")

        if critical_articles:
            f.write("CRITICAL ISSUES:\n")
            f.write("-"*80 + "\n\n")
            for filename, issues in sorted(critical_articles.items()):
                f.write(f"{filename}:\n")
                for issue in issues:
                    if '🚨' in issue:
                        f.write(f"  {issue}\n")
                f.write("\n")

        if duplicate_faqs:
            f.write("\nDUPLICATE FAQS:\n")
            f.write("-"*80 + "\n\n")
            for question, files in sorted(duplicate_faqs.items(), key=lambda x: len(x[1]), reverse=True):
                f.write(f'"{question}" in {len(files)} articles:\n')
                for f_name in files:
                    f.write(f"  - {f_name}\n")
                f.write("\n")

    print("📄 Detailed report saved to: google_flag_report.txt\n")

if __name__ == "__main__":
    main()
