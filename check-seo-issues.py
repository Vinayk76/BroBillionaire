#!/usr/bin/env python3
"""
SEO Issue Checker - Check for duplicate FAQs and other SEO issues
"""

import os
import re
from collections import defaultdict
from bs4 import BeautifulSoup
import json

def extract_faq_questions(html_content, file_path):
    """Extract all FAQ questions from HTML content"""
    soup = BeautifulSoup(html_content, 'html.parser')
    questions = []
    
    # Method 1: Check microdata (itemscope/itemprop)
    faq_sections = soup.find_all('section', {'itemtype': 'https://schema.org/FAQPage'})
    for faq_section in faq_sections:
        question_items = faq_section.find_all('div', {'itemtype': 'https://schema.org/Question'})
        for item in question_items:
            question_elem = item.find(attrs={'itemprop': 'name'})
            if question_elem:
                questions.append(question_elem.get_text(strip=True))
    
    # Method 2: Check JSON-LD schema
    json_ld_scripts = soup.find_all('script', type='application/ld+json')
    for script in json_ld_scripts:
        try:
            data = json.loads(script.string)
            if isinstance(data, dict):
                if data.get('@type') == 'FAQPage':
                    main_entity = data.get('mainEntity', [])
                    for entity in main_entity:
                        if entity.get('@type') == 'Question':
                            questions.append(entity.get('name', ''))
            elif isinstance(data, list):
                for item in data:
                    if item.get('@type') == 'FAQPage':
                        main_entity = item.get('mainEntity', [])
                        for entity in main_entity:
                            if entity.get('@type') == 'Question':
                                questions.append(entity.get('name', ''))
        except json.JSONDecodeError:
            pass
    
    return questions

def check_schema_issues(html_content, file_path):
    """Check for schema markup issues"""
    soup = BeautifulSoup(html_content, 'html.parser')
    issues = []
    
    # Check for multiple FAQPage schemas
    faq_sections_microdata = soup.find_all('section', {'itemtype': 'https://schema.org/FAQPage'})
    if len(faq_sections_microdata) > 1:
        issues.append(f"Multiple FAQPage microdata sections found ({len(faq_sections_microdata)})")
    
    # Check for multiple FAQPage in JSON-LD
    json_ld_scripts = soup.find_all('script', type='application/ld+json')
    faq_page_count = 0
    for script in json_ld_scripts:
        try:
            data = json.loads(script.string)
            if isinstance(data, dict) and data.get('@type') == 'FAQPage':
                faq_page_count += 1
            elif isinstance(data, list):
                for item in data:
                    if item.get('@type') == 'FAQPage':
                        faq_page_count += 1
        except json.JSONDecodeError:
            issues.append("Invalid JSON-LD found")
    
    if faq_page_count > 1:
        issues.append(f"Multiple FAQPage JSON-LD schemas found ({faq_page_count})")
    
    # Check for missing required schema fields
    for script in json_ld_scripts:
        try:
            data = json.loads(script.string)
            if isinstance(data, dict):
                if data.get('@type') == 'FAQPage':
                    if 'mainEntity' not in data:
                        issues.append("FAQPage missing mainEntity")
                    else:
                        for idx, entity in enumerate(data.get('mainEntity', [])):
                            if entity.get('@type') != 'Question':
                                issues.append(f"mainEntity[{idx}] is not of type Question")
                            if 'name' not in entity:
                                issues.append(f"Question[{idx}] missing 'name' field")
                            if 'acceptedAnswer' not in entity:
                                issues.append(f"Question[{idx}] missing 'acceptedAnswer' field")
                            elif 'text' not in entity['acceptedAnswer']:
                                issues.append(f"Question[{idx}] acceptedAnswer missing 'text' field")
        except json.JSONDecodeError:
            pass
    
    return issues

def check_duplicate_titles_meta(html_content, file_path):
    """Check for duplicate or missing titles and meta descriptions"""
    soup = BeautifulSoup(html_content, 'html.parser')
    issues = []
    
    # Check for multiple title tags
    titles = soup.find_all('title')
    if len(titles) > 1:
        issues.append(f"Multiple title tags found ({len(titles)})")
    elif len(titles) == 0:
        issues.append("No title tag found")
    
    # Check for multiple meta descriptions
    meta_desc = soup.find_all('meta', attrs={'name': 'description'})
    if len(meta_desc) > 1:
        issues.append(f"Multiple meta description tags found ({len(meta_desc)})")
    
    # Check for multiple canonical tags
    canonical = soup.find_all('link', attrs={'rel': 'canonical'})
    if len(canonical) > 1:
        issues.append(f"Multiple canonical tags found ({len(canonical)})")
    
    return issues

def main():
    print("=" * 80)
    print("SEO ISSUE CHECKER - Checking for duplicate FAQs and other issues")
    print("=" * 80)
    print()
    
    # Get all HTML files
    html_files = [f for f in os.listdir('.') if f.endswith('.html')]
    
    # Track all questions across all files
    all_questions = defaultdict(list)  # question -> list of files
    file_issues = {}
    
    print(f"Analyzing {len(html_files)} HTML files...\n")
    
    for html_file in sorted(html_files):
        try:
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Extract FAQ questions
            questions = extract_faq_questions(content, html_file)
            
            # Track questions
            for q in questions:
                if q:  # Skip empty questions
                    all_questions[q].append(html_file)
            
            # Check for other schema issues
            schema_issues = check_schema_issues(content, html_file)
            
            # Check for title/meta issues
            title_meta_issues = check_duplicate_titles_meta(content, html_file)
            
            all_issues = schema_issues + title_meta_issues
            
            if questions or all_issues:
                file_issues[html_file] = {
                    'questions': questions,
                    'issues': all_issues
                }
        
        except Exception as e:
            print(f"Error processing {html_file}: {e}")
    
    # Report findings
    print("\n" + "=" * 80)
    print("DUPLICATE FAQ QUESTIONS ACROSS FILES")
    print("=" * 80)
    
    duplicates_found = False
    for question, files in sorted(all_questions.items()):
        if len(files) > 1:
            duplicates_found = True
            print(f"\n⚠️  DUPLICATE: '{question}'")
            print(f"   Found in {len(files)} files:")
            for file in files:
                print(f"   - {file}")
    
    if not duplicates_found:
        print("\n✅ No duplicate FAQ questions found across files!")
    
    # Report per-file issues
    print("\n" + "=" * 80)
    print("PER-FILE SEO ISSUES")
    print("=" * 80)
    
    files_with_issues = {f: data for f, data in file_issues.items() if data['issues']}
    
    if files_with_issues:
        for file, data in sorted(files_with_issues.items()):
            print(f"\n📄 {file}")
            for issue in data['issues']:
                print(f"   ⚠️  {issue}")
    else:
        print("\n✅ No schema or metadata issues found!")
    
    # Check for duplicate questions within the same file
    print("\n" + "=" * 80)
    print("DUPLICATE QUESTIONS WITHIN SAME FILE")
    print("=" * 80)
    
    within_file_duplicates = False
    for file, data in sorted(file_issues.items()):
        questions = data['questions']
        question_counts = defaultdict(int)
        for q in questions:
            if q:
                question_counts[q] += 1
        
        duplicates_in_file = {q: count for q, count in question_counts.items() if count > 1}
        if duplicates_in_file:
            within_file_duplicates = True
            print(f"\n📄 {file}")
            for q, count in duplicates_in_file.items():
                print(f"   ⚠️  Question appears {count} times: '{q}'")
    
    if not within_file_duplicates:
        print("\n✅ No duplicate questions within individual files!")
    
    # Summary statistics
    print("\n" + "=" * 80)
    print("SUMMARY")
    print("=" * 80)
    print(f"Total HTML files analyzed: {len(html_files)}")
    print(f"Files with FAQs: {len([f for f, d in file_issues.items() if d['questions']])}")
    print(f"Total unique FAQ questions: {len(all_questions)}")
    print(f"Files with issues: {len(files_with_issues)}")
    
    if duplicates_found or within_file_duplicates or files_with_issues:
        print("\n⚠️  ISSUES FOUND - Please review the report above")
        return 1
    else:
        print("\n✅ All SEO checks passed!")
        return 0

if __name__ == '__main__':
    exit(main())
