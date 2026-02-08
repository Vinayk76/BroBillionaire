# FAQ System Documentation

## Overview
The BroBillionaire FAQ system provides a unified, accessible, and SEO-optimized accordion-style FAQ implementation across all pages.

## Files

### Core Files
- **faq-common.css** - Centralized FAQ stylesheet (NEW)
- **fix-faq-toggle.js** - JavaScript for FAQ accordion functionality
- **aeo-faq-injector.js** - FAQ content database (180+ patterns)
- **aeo-faq-upgrade.js** - Enhanced, topic-specific FAQs

### Utility Scripts
- **add-faq-css.py** - Script to add faq-common.css to all HTML files
- **fix_faq_schemas.py** - Fixes empty/placeholder FAQs
- **check_faqs.py** - Validates FAQ presence

## Implementation

### HTML Structure
```html
<!-- Enhanced FAQ Section for AEO (Answer Engine Optimization) -->
<section class="faq-section" itemscope itemtype="https://schema.org/FAQPage">
    <div class="faq-container">
        <h2 class="faq-title">
            <i class="fas fa-question-circle"></i> Frequently Asked Questions
        </h2>
        <div class="faq-list">
            <div class="faq-item" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
                <button class="faq-question" onclick="toggleFAQ(0)" aria-expanded="false">
                    <span itemprop="name">Question Text Here</span>
                    <i class="fas fa-chevron-down faq-icon"></i>
                </button>
                <div class="faq-answer" id="faq-answer-0" itemscope itemprop="acceptedAnswer"
                     itemtype="https://schema.org/Answer">
                    <p itemprop="text">Answer text here</p>
                </div>
            </div>
        </div>
    </div>
</section>
```

### CSS Classes

| Class | Purpose |
|-------|---------|
| `.faq-section` | Main container with gradient background |
| `.faq-container` | Inner container (max-width: 800px) |
| `.faq-title` | Section title with icon |
| `.faq-list` | Flex container for FAQ items |
| `.faq-item` | Individual FAQ item with border |
| `.faq-question` | Question button (clickable) |
| `.faq-icon` | Chevron icon (rotates when active) |
| `.faq-answer` | Answer container (hidden by default) |
| `.faq-item.active` | Active state (answer visible) |

### JavaScript Toggle Function

```javascript
function toggleFAQ(index) {
    const items = document.querySelectorAll('.faq-section .faq-item');
    const item = items[index];
    const wasActive = item.classList.contains('active');

    // Close all FAQs
    items.forEach(faq => {
        faq.classList.remove('active');
        const btn = faq.querySelector('.faq-question');
        if (btn) btn.setAttribute('aria-expanded', 'false');
    });

    // Open clicked one if it wasn't already open
    if (!wasActive) {
        item.classList.add('active');
        const btn = item.querySelector('.faq-question');
        if (btn) btn.setAttribute('aria-expanded', 'true');
    }
}
```

## Adding to New Pages

### Step 1: Link CSS File
Add to the `<head>` section after other CSS files:
```html
<link rel="stylesheet" href="faq-common.css">
```

### Step 2: Add JavaScript
Include the toggle function or link to `fix-faq-toggle.js`:
```html
<script src="fix-faq-toggle.js"></script>
```

### Step 3: Add HTML Structure
Use the HTML structure shown above with proper Schema.org markup.

## Features

### Accessibility
- ✅ ARIA attributes (aria-expanded)
- ✅ Semantic HTML
- ✅ Keyboard navigation support
- ✅ Focus-visible states
- ✅ Screen reader friendly

### SEO Optimization
- ✅ Schema.org FAQPage markup
- ✅ Microdata (itemprop, itemtype)
- ✅ Google AI Overviews optimization
- ✅ Featured snippet targeting
- ✅ Voice search compatibility

### Responsive Design
- ✅ Mobile-first approach
- ✅ Breakpoints: 992px, 768px, 480px
- ✅ Touch-friendly buttons
- ✅ Smooth animations

### Design
- ✅ Premium black/gold theme
- ✅ Smooth transitions (0.3s-0.4s)
- ✅ Hover effects
- ✅ Icon rotation animation
- ✅ Gradient backgrounds

## Coverage Statistics
- **546 total HTML files**
- **284 files with FAQ sections**
- **100% updated** with faq-common.css

## Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Maintenance

### Updating FAQ Content
Edit the FAQ content database files:
- `aeo-faq-injector.js` - General FAQ patterns
- `aeo-faq-upgrade.js` - Topic-specific enhanced FAQs

### Validating FAQs
Run validation scripts:
```bash
python3 check_faqs.py
python3 fix_faq_schemas.py
```

### Adding FAQ CSS to New Files
```bash
python3 add-faq-css.py
```

## Troubleshooting

### FAQ Not Toggling
1. Check if JavaScript is loaded
2. Verify `onclick="toggleFAQ(index)"` is present
3. Ensure FAQ items have correct class names

### Styling Issues
1. Verify `faq-common.css` is linked
2. Check CSS file load order
3. Clear browser cache

### Schema Validation Errors
1. Use Google's Rich Results Test
2. Verify all required attributes are present
3. Check for proper nesting of Schema.org markup

## Migration Notes

### What Changed
- ✅ Consolidated FAQ CSS into `faq-common.css`
- ✅ Removed FAQ styles from `styles.css`
- ✅ Removed FAQ styles from `responsive.css`
- ✅ Removed FAQ styles from `ultra-premium-articles.css`
- ✅ Updated all 284 HTML files to use `faq-common.css`

### Benefits
- ✅ Single source of truth for FAQ styling
- ✅ Easier maintenance and updates
- ✅ Consistent styling across all pages
- ✅ Reduced CSS redundancy
- ✅ Better performance (single CSS file)

---

**Last Updated:** 2026-02-08
**Version:** 1.0
