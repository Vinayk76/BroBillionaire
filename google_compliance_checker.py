#!/usr/bin/env python3
"""
Comprehensive Google Search Compliance Checker
Validates all articles against Google Search Console standards to prevent flags
"""

import json
import re
import os
from collections import defaultdict
from pathlib import Path

class GoogleSearchComplianceChecker:
    def __init__(self):
        self.issues = defaultdict(list)
        self.warnings = defaultdict(list)
        self.article_count = 0
        self.passed_count = 0

    def check_faq_schema_compliance(self, filename, content):
        """Check FAQ schema against Google's requirements"""
        faq_issues = []

        # Extract FAQPage schemas
        pattern = r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>'
        matches = re.findall(pattern, content, re.DOTALL)

        faq_found = False
        faq_question_count = 0

        for match in matches:
            try:
                schema = json.loads(match.strip())
                if schema.get('@type') == 'FAQPage':
                    faq_found = True

                    # Check for mainEntity
                    main_entity = schema.get('mainEntity', [])
                    if not main_entity:
                        faq_issues.append("FAQPage has no mainEntity")
                        continue

                    if not isinstance(main_entity, list):
                        faq_issues.append("mainEntity is not a list")
                        continue

                    faq_question_count = len(main_entity)

                    # Google recommends at least 2 questions
                    if faq_question_count < 2:
                        faq_issues.append(f"Only {faq_question_count} FAQ question (minimum 2 recommended)")

                    # Check each question
                    for i, question in enumerate(main_entity):
                        if question.get('@type') != 'Question':
                            faq_issues.append(f"Question {i+1}: Missing or incorrect @type")

                        question_name = question.get('name', '')
                        if not question_name or len(question_name.strip()) < 10:
                            faq_issues.append(f"Question {i+1}: Question text too short or missing")

                        accepted_answer = question.get('acceptedAnswer', {})
                        if accepted_answer.get('@type') != 'Answer':
                            faq_issues.append(f"Question {i+1}: Missing or incorrect Answer @type")

                        answer_text = accepted_answer.get('text', '')
                        if not answer_text or len(answer_text.strip()) < 50:
                            faq_issues.append(f"Question {i+1}: Answer too short (minimum 50 chars recommended)")

                        # Check for promotional content (Google flag risk)
                        promotional_keywords = ['buy now', 'click here', 'sign up today', 'limited offer', 'discount code']
                        if any(keyword in answer_text.lower() for keyword in promotional_keywords):
                            faq_issues.append(f"Question {i+1}: Contains promotional content (Google may flag)")

            except json.JSONDecodeError as e:
                faq_issues.append(f"Invalid JSON in FAQ schema: {str(e)[:50]}")
            except Exception as e:
                faq_issues.append(f"Error parsing FAQ: {str(e)[:50]}")

        if not faq_found:
            faq_issues.append("No FAQPage schema found")

        return faq_issues, faq_question_count

    def check_schema_validity(self, filename, content):
        """Check all schema.org markup for validity"""
        schema_issues = []

        pattern = r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>'
        matches = re.findall(pattern, content, re.DOTALL)

        schema_types_found = []

        for match in matches:
            try:
                schema = json.loads(match.strip())
                schema_type = schema.get('@type')
                if schema_type:
                    schema_types_found.append(schema_type)

                # Validate context
                if schema.get('@context') != 'https://schema.org':
                    schema_issues.append(f"{schema_type}: Incorrect @context (should be https://schema.org)")

                # Check for required fields based on type
                if schema_type == 'Article':
                    if not schema.get('headline'):
                        schema_issues.append("Article schema missing headline")
                    if not schema.get('author'):
                        schema_issues.append("Article schema missing author")
                    if not schema.get('datePublished'):
                        schema_issues.append("Article schema missing datePublished")

                elif schema_type == 'BreadcrumbList':
                    items = schema.get('itemListElement', [])
                    if len(items) < 2:
                        schema_issues.append("BreadcrumbList should have at least 2 items")

            except json.JSONDecodeError as e:
                schema_issues.append(f"Invalid JSON in schema: {str(e)[:80]}")

        # Check for recommended schemas
        if 'Article' not in schema_types_found:
            schema_issues.append("No Article schema found (recommended for blog posts)")

        if 'BreadcrumbList' not in schema_types_found:
            schema_issues.append("No BreadcrumbList schema found (recommended for SEO)")

        return schema_issues

    def check_meta_tags(self, filename, content):
        """Check essential meta tags"""
        meta_issues = []

        # Check title
        title_match = re.search(r'<title>([^<]+)</title>', content, re.IGNORECASE)
        if not title_match:
            meta_issues.append("Missing <title> tag")
        else:
            title = title_match.group(1)
            if len(title) < 30:
                meta_issues.append(f"Title too short ({len(title)} chars, minimum 30 recommended)")
            elif len(title) > 60:
                self.warnings[filename].append(f"Title long ({len(title)} chars, may be truncated in search)")

        # Check meta description
        desc_match = re.search(r'<meta\s+name="description"\s+content="([^"]+)"', content, re.IGNORECASE)
        if not desc_match:
            meta_issues.append("Missing meta description")
        else:
            desc = desc_match.group(1)
            if len(desc) < 120:
                meta_issues.append(f"Description too short ({len(desc)} chars, minimum 120 recommended)")
            elif len(desc) > 160:
                self.warnings[filename].append(f"Description long ({len(desc)} chars, may be truncated)")

        # Check canonical URL
        canonical_match = re.search(r'<link\s+rel="canonical"\s+href="([^"]+)"', content, re.IGNORECASE)
        if not canonical_match:
            meta_issues.append("Missing canonical URL")

        # Check robots meta
        robots_match = re.search(r'<meta\s+name="robots"\s+content="([^"]+)"', content, re.IGNORECASE)
        if robots_match:
            robots_content = robots_match.group(1).lower()
            if 'noindex' in robots_content:
                meta_issues.append("⚠️ Page set to noindex (won't appear in search)")
            if 'nofollow' in robots_content:
                self.warnings[filename].append("Page set to nofollow")

        # Check Open Graph
        og_title = re.search(r'<meta\s+property="og:title"\s+content="([^"]+)"', content, re.IGNORECASE)
        og_desc = re.search(r'<meta\s+property="og:description"\s+content="([^"]+)"', content, re.IGNORECASE)
        og_image = re.search(r'<meta\s+property="og:image"\s+content="([^"]+)"', content, re.IGNORECASE)

        if not og_title:
            self.warnings[filename].append("Missing og:title (affects social sharing)")
        if not og_desc:
            self.warnings[filename].append("Missing og:description (affects social sharing)")
        if not og_image:
            self.warnings[filename].append("Missing og:image (affects social sharing)")

        return meta_issues

    def check_content_quality(self, filename, content):
        """Check for content quality issues"""
        quality_issues = []

        # Extract visible content (rough estimate)
        body_match = re.search(r'<body[^>]*>(.*?)</body>', content, re.DOTALL | re.IGNORECASE)
        if body_match:
            body = body_match.group(1)

            # Remove scripts and styles
            body = re.sub(r'<script[^>]*>.*?</script>', '', body, flags=re.DOTALL)
            body = re.sub(r'<style[^>]*>.*?</style>', '', body, flags=re.DOTALL)

            # Remove HTML tags
            text = re.sub(r'<[^>]+>', ' ', body)
            text = re.sub(r'\s+', ' ', text).strip()

            word_count = len(text.split())

            if word_count < 300:
                quality_issues.append(f"Thin content ({word_count} words, minimum 300 recommended)")

        # Check for excessive ads/affiliate links (Google thin content flag)
        affiliate_pattern = r'(amzn\.to|bit\.ly|goo\.gl|tinyurl\.com|aff=|affiliate|ref=)'
        affiliate_links = len(re.findall(affiliate_pattern, content, re.IGNORECASE))
        if affiliate_links > 10:
            quality_issues.append(f"Many affiliate links ({affiliate_links}, may trigger thin content review)")

        return quality_issues

    def check_article(self, filename):
        """Run all checks on a single article"""
        try:
            with open(filename, 'r', encoding='utf-8') as f:
                content = f.read()

            article_issues = []

            # Run all checks
            faq_issues, faq_count = self.check_faq_schema_compliance(filename, content)
            schema_issues = self.check_schema_validity(filename, content)
            meta_issues = self.check_meta_tags(filename, content)
            quality_issues = self.check_content_quality(filename, content)

            # Combine all issues
            all_issues = faq_issues + schema_issues + meta_issues + quality_issues

            if all_issues:
                self.issues[filename] = all_issues
            else:
                self.passed_count += 1

            return len(all_issues) == 0

        except Exception as e:
            self.issues[filename] = [f"Error reading file: {str(e)}"]
            return False

    def generate_report(self):
        """Generate comprehensive compliance report"""
        print("="*80)
        print("🔍 GOOGLE SEARCH COMPLIANCE REPORT")
        print("="*80)
        print(f"\n📊 Articles analyzed: {self.article_count}")
        print(f"✅ Fully compliant: {self.passed_count} ({self.passed_count/self.article_count*100:.1f}%)")
        print(f"⚠️  With issues: {len(self.issues)} ({len(self.issues)/self.article_count*100:.1f}%)")
        print(f"📝 Total warnings: {sum(len(w) for w in self.warnings.values())}")

        # Count issue types
        issue_types = defaultdict(int)
        for issues in self.issues.values():
            for issue in issues:
                if 'FAQ' in issue or 'Question' in issue:
                    issue_types['FAQ Schema'] += 1
                elif 'schema' in issue.lower():
                    issue_types['Schema Markup'] += 1
                elif 'title' in issue.lower() or 'description' in issue.lower() or 'canonical' in issue.lower():
                    issue_types['Meta Tags'] += 1
                elif 'content' in issue.lower():
                    issue_types['Content Quality'] += 1
                else:
                    issue_types['Other'] += 1

        print(f"\n📋 Issue Breakdown:")
        for issue_type, count in sorted(issue_types.items(), key=lambda x: x[1], reverse=True):
            print(f"  • {issue_type}: {count}")

        # Show critical issues
        if self.issues:
            print(f"\n{'='*80}")
            print(f"🚨 CRITICAL ISSUES (First 10 articles)")
            print(f"{'='*80}")

            for i, (filename, issues) in enumerate(list(self.issues.items())[:10]):
                print(f"\n❌ {filename}")
                for issue in issues[:5]:  # Show first 5 issues per article
                    print(f"   • {issue}")
                if len(issues) > 5:
                    print(f"   ... and {len(issues)-5} more issues")

        # Show warnings
        if self.warnings:
            print(f"\n{'='*80}")
            print(f"⚠️  WARNINGS (First 10 articles)")
            print(f"{'='*80}")

            for i, (filename, warnings) in enumerate(list(self.warnings.items())[:10]):
                if i >= 10:
                    break
                print(f"\n⚠️  {filename}")
                for warning in warnings[:3]:
                    print(f"   • {warning}")

        # Final verdict
        print(f"\n{'='*80}")
        if len(self.issues) == 0:
            print("✅ ALL ARTICLES ARE GOOGLE SEARCH COMPLIANT!")
            print("🎉 No flags will be triggered in Google Search Console")
        elif len(self.issues) < self.article_count * 0.05:  # Less than 5% issues
            print("✅ MOSTLY COMPLIANT - Minor issues found")
            print("⚠️  Fix critical issues to avoid potential flags")
        else:
            print("⚠️  MULTIPLE COMPLIANCE ISSUES FOUND")
            print("🚨 Action required to prevent Google Search Console flags")
        print(f"{'='*80}\n")

    def save_detailed_report(self):
        """Save detailed report to file"""
        with open('google_compliance_report.txt', 'w', encoding='utf-8') as f:
            f.write("GOOGLE SEARCH COMPLIANCE DETAILED REPORT\n")
            f.write("="*80 + "\n\n")

            f.write(f"Total articles: {self.article_count}\n")
            f.write(f"Fully compliant: {self.passed_count}\n")
            f.write(f"With issues: {len(self.issues)}\n\n")

            f.write("ISSUES BY ARTICLE:\n")
            f.write("-"*80 + "\n\n")

            for filename, issues in sorted(self.issues.items()):
                f.write(f"\n{filename}:\n")
                for issue in issues:
                    f.write(f"  • {issue}\n")

            if self.warnings:
                f.write("\n\nWARNINGS BY ARTICLE:\n")
                f.write("-"*80 + "\n\n")

                for filename, warnings in sorted(self.warnings.items()):
                    f.write(f"\n{filename}:\n")
                    for warning in warnings:
                        f.write(f"  • {warning}\n")

        print(f"📄 Detailed report saved to: google_compliance_report.txt\n")

def main():
    print("🚀 Starting Google Search Compliance Check...\n")

    # Get all article files
    article_files = sorted([f for f in os.listdir('.') if f.startswith('article-') and f.endswith('.html')])

    checker = GoogleSearchComplianceChecker()
    checker.article_count = len(article_files)

    print(f"📁 Found {len(article_files)} articles\n")
    print("🔍 Checking compliance...\n")

    # Check all articles
    for i, filename in enumerate(article_files, 1):
        if i % 50 == 0:
            print(f"  Progress: {i}/{len(article_files)} articles checked...")

        checker.check_article(filename)

    print(f"\n✅ Completed checking {len(article_files)} articles\n")

    # Generate reports
    checker.generate_report()
    checker.save_detailed_report()

if __name__ == "__main__":
    main()
