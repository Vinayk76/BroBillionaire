#!/usr/bin/env python3
import glob
import re

# Get all tool files
tools = sorted(glob.glob('tool-*.html'))

# Get existing tools from tools.html
with open('tools.html', 'r', encoding='utf-8') as f:
    tools_html = f.read()
    
existing = set(re.findall(r"'(tool-[^']+\.html)'", tools_html))

print(f'Total tool files: {len(tools)}')
print(f'Total tools in HTML: {len(existing)}')
print(f'Missing: {len(tools) - len(existing)}')
print()

# Show missing tools with titles
missing = set([t.split('/')[-1] for t in tools]) - existing
for tool in sorted(missing):
    # Extract title
    try:
        with open(tool, 'r', encoding='utf-8') as f:
            content = f.read(5000)
            title_match = re.search(r'<title>(.*?)</title>', content, re.DOTALL)
            if title_match:
                title = title_match.group(1).strip().replace(' | BroBillionaire', '').replace(' | Brobillionaire', '').replace(' - BroBillionaire', '').replace(' – BroBillionaire', '')
                # Clean up title
                title = re.sub(r'\s+', ' ', title).strip()
                print(f'{tool}|||{title}')
    except:
        pass
