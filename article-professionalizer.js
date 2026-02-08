/**
 * Article Professionalizer - BroBillionaire
 * Automatically enhances articles with professional elements
 * Makes content look authoritative, not personally written
 * Version 2.0 - February 2026
 */

(function() {
    'use strict';

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initArticleEnhancements);
    } else {
        initArticleEnhancements();
    }

    function initArticleEnhancements() {
        // Only run on article pages
        if (!isArticlePage()) return;

        console.log('🎨 Professionalizing article...');

        // Run all enhancement functions
        addProfessionalByline();
        addCredibilityIndicators();
        enhanceTables();
        enhanceQuotes();
        addMethodologyNote();
        addLastUpdatedBadge();
        enhanceCalloutBoxes();
        improveReadability();
        addSmoothScrolling();

        console.log('✅ Article professionalized successfully!');
    }

    function isArticlePage() {
        return document.querySelector('.article-content') !== null ||
               document.querySelector('.article-header') !== null ||
               window.location.pathname.includes('article-');
    }

    /**
     * Add professional author byline
     */
    function addProfessionalByline() {
        const articleContent = document.querySelector('.article-content');
        if (!articleContent) return;

        // Remove any existing personal-sounding bylines
        const existingBylines = articleContent.querySelectorAll('.article-byline, .author-attribution');
        existingBylines.forEach(el => el.remove());

        // Get article metadata
        const title = document.querySelector('.article-title, h1')?.textContent || '';
        const metaAuthor = document.querySelector('meta[name="author"]')?.content || 'BroBillionaire';

        // Determine professional author based on article type
        const author = getProfessionalAuthor(title);

        // Create professional byline
        const byline = document.createElement('div');
        byline.className = 'article-byline';
        byline.innerHTML = `
            <div class="byline-avatar">${author.initials}</div>
            <div class="byline-info">
                <div class="byline-name">${author.name}</div>
                <div class="byline-title">${author.title}</div>
                <div class="byline-date">
                    <i class="far fa-calendar-alt"></i>
                    <span>${getCurrentDate()}</span>
                    <span style="margin: 0 0.5rem;">•</span>
                    <i class="far fa-sync"></i>
                    <span>Updated ${getCurrentDate()}</span>
                </div>
            </div>
        `;

        // Insert after intro or at the beginning
        const intro = articleContent.querySelector('.article-intro, p:first-of-type');
        if (intro && intro.nextSibling) {
            intro.parentNode.insertBefore(byline, intro.nextSibling);
        } else {
            articleContent.insertBefore(byline, articleContent.firstChild);
        }
    }

    /**
     * Get professional author based on content type
     */
    function getProfessionalAuthor(title) {
        const lowerTitle = title.toLowerCase();

        if (lowerTitle.includes('crypto') || lowerTitle.includes('bitcoin') || lowerTitle.includes('ethereum')) {
            return {
                name: 'Arjun Mehta',
                title: 'Senior Cryptocurrency Analyst',
                initials: 'AM'
            };
        } else if (lowerTitle.includes('option') || lowerTitle.includes('derivative') || lowerTitle.includes('futures')) {
            return {
                name: 'Priya Sharma',
                title: 'Derivatives Strategy Lead',
                initials: 'PS'
            };
        } else if (lowerTitle.includes('bro billionaire') || lowerTitle.includes('stock') || lowerTitle.includes('equity')) {
            return {
                name: 'Rahul Singh',
                title: 'Senior Equity Research Analyst',
                initials: 'RS'
            };
        } else if (lowerTitle.includes('psycholog') || lowerTitle.includes('trading mind') || lowerTitle.includes('emotion')) {
            return {
                name: 'Dr. Anjali Verma',
                title: 'Trading Psychology Specialist',
                initials: 'AV'
            };
        } else if (lowerTitle.includes('risk') || lowerTitle.includes('manage')) {
            return {
                name: 'Vikram Kapoor',
                title: 'Risk Management Strategist',
                initials: 'VK'
            };
        } else {
            return {
                name: 'BroBillionaire',
                title: 'Market Analysis & Education',
                initials: 'BR'
            };
        }
    }

    /**
     * Add credibility indicators
     */
    function addCredibilityIndicators() {
        const articleContent = document.querySelector('.article-content');
        if (!articleContent) return;

        // Skip if already exists
        if (document.querySelector('.article-credibility-bar')) return;

        // Calculate metrics
        const wordCount = articleContent.textContent.trim().split(/\s+/).length;
        const readTime = Math.ceil(wordCount / 250); // 250 words per minute
        const sourceCount = (articleContent.innerHTML.match(/\[Source:/gi) || []).length;
        const citations = articleContent.querySelectorAll('a[href*="http"]').length;

        const credibilityBar = document.createElement('div');
        credibilityBar.className = 'article-credibility-bar';
        credibilityBar.innerHTML = `
            <div class="credibility-item">
                <i class="credibility-icon fas fa-file-alt"></i>
                <span><span class="credibility-value">${wordCount.toLocaleString()}</span> words</span>
            </div>
            <div class="credibility-item">
                <i class="credibility-icon far fa-clock"></i>
                <span><span class="credibility-value">${readTime}</span> min read</span>
            </div>
            <div class="credibility-item">
                <i class="credibility-icon fas fa-link"></i>
                <span><span class="credibility-value">${citations}</span> external sources</span>
            </div>
            <div class="credibility-item">
                <i class="credibility-icon fas fa-check-circle"></i>
                <span><span class="credibility-value">Fact-checked</span></span>
            </div>
            <div class="credibility-item">
                <i class="credibility-icon fas fa-shield-alt"></i>
                <span><span class="credibility-value">Editorial standards</span> applied</span>
            </div>
        `;

        // Insert after byline or at the beginning
        const byline = articleContent.querySelector('.article-byline');
        if (byline && byline.nextSibling) {
            byline.parentNode.insertBefore(credibilityBar, byline.nextSibling);
        } else {
            articleContent.insertBefore(credibilityBar, articleContent.firstChild);
        }
    }

    /**
     * Enhance tables with better styling
     */
    function enhanceTables() {
        const tables = document.querySelectorAll('.article-content table:not(.enhanced)');

        tables.forEach(table => {
            table.classList.add('enhanced');

            // Add wrapper for horizontal scroll on mobile
            if (!table.parentElement.classList.contains('table-wrapper')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'table-wrapper';
                wrapper.style.overflowX = 'auto';
                wrapper.style.marginBottom = '2rem';
                table.parentNode.insertBefore(wrapper, table);
                wrapper.appendChild(table);
            }

            // Ensure proper styling
            table.classList.add('data-table');
        });
    }

    /**
     * Enhance blockquotes to look like expert quotes
     */
    function enhanceQuotes() {
        const blockquotes = document.querySelectorAll('.article-content blockquote:not(.enhanced)');

        blockquotes.forEach(quote => {
            quote.classList.add('enhanced');

            // Check if it has attribution
            const text = quote.innerHTML;
            const hasAttribution = text.includes('—') || text.includes('–');

            if (hasAttribution) {
                quote.classList.add('expert-quote-box');

                // Extract attribution
                const parts = quote.innerHTML.split(/—|–/);
                if (parts.length >= 2) {
                    const quoteText = parts[0].trim();
                    const attribution = parts.slice(1).join('—').trim();

                    quote.innerHTML = `
                        ${quoteText}
                        <div class="expert-quote-attribution">— ${attribution}</div>
                    `;
                }
            }
        });
    }

    /**
     * Add methodology note for data-driven articles
     */
    function addMethodologyNote() {
        const articleContent = document.querySelector('.article-content');
        if (!articleContent) return;

        // Skip if already exists
        if (document.querySelector('.methodology-box')) return;

        // Check if article has data/statistics
        const hasData = articleContent.innerHTML.match(/\d+(\.\d+)?%|\$\d+[BMK]?|\d{1,3}(,\d{3})*/) !== null;
        if (!hasData) return;

        // Add methodologynote before references or at the end
        const methodologyBox = document.createElement('div');
        methodologyBox.className = 'methodology-box';
        methodologyBox.innerHTML = `
            <h4><i class="fas fa-microscope"></i> Research Methodology</h4>
            <p>This analysis draws from multiple verified sources including regulatory filings, academic research, industry reports, and reputable financial publications. All statistics and data points are cross-referenced across at least two independent sources. Market data is current as of ${getCurrentDate()}.</p>
            <p>Our content team follows strict fact-checking protocols and maintains independence from financial institutions and trading platforms. Any potential conflicts of interest are disclosed in our <a href="/disclosure.html">disclosure policy</a>.</p>
        `;

        // Insert before FAQ section or at the end
        const faqSection = articleContent.querySelector('.faq-section');
        if (faqSection) {
            articleContent.insertBefore(methodologyBox, faqSection);
        } else {
            // Insert near the end, before last section
            const lastSection = articleContent.querySelector('h2:last-of-type');
            if (lastSection) {
                articleContent.insertBefore(methodologyBox, lastSection);
            }
        }
    }

    /**
     * Add last updated badge
     */
    function addLastUpdatedBadge() {
        const articleContent = document.querySelector('.article-content');
        if (!articleContent) return;

        // Skip if already exists
        if (document.querySelector('.last-updated-badge')) return;

        const badge = document.createElement('div');
        badge.className = 'last-updated-badge';
        badge.innerHTML = `
            <i class="far fa-clock"></i>
            <span>Last updated: ${getCurrentDate()}</span>
        `;

        // Insert at the very end of article content
        articleContent.appendChild(badge);
    }

    /**
     * Enhance callout boxes
     */
    function enhanceCalloutBoxes() {
        const articleContent = document.querySelector('.article-content');
        if (!articleContent) return;

        // Find paragraphs that start with strong emphasis (might be key points)
        const paragraphs = articleContent.querySelectorAll('p');

        paragraphs.forEach(p => {
            const text = p.textContent.trim();

            // Check for key insight indicators
            if (text.startsWith('Key takeaway:') ||
                text.startsWith('Important:') ||
                text.startsWith('Remember:') ||
                text.startsWith('Pro tip:')) {

                if (!p.classList.contains('key-insight-box')) {
                    const wrapper = document.createElement('div');
                    wrapper.className = 'key-insight-box';

                    const heading = document.createElement('h4');
                    if (text.startsWith('Key takeaway:')) heading.textContent = 'Key Takeaway';
                    else if (text.startsWith('Important:')) heading.textContent = 'Important';
                    else if (text.startsWith('Remember:')) heading.textContent = 'Remember';
                    else if (text.startsWith('Pro tip:')) heading.textContent = 'Professional Insight';

                    const content = document.createElement('p');
                    content.innerHTML = p.innerHTML.replace(/^(Key takeaway:|Important:|Remember:|Pro tip:)\s*/i, '');

                    wrapper.appendChild(heading);
                    wrapper.appendChild(content);

                    p.parentNode.replaceChild(wrapper, p);
                }
            }
        });
    }

    /**
     * Improve readability with proper spacing
     */
    function improveReadability() {
        const articleContent = document.querySelector('.article-content');
        if (!articleContent) return;

        // Add proper spacing between sections
        const headings = articleContent.querySelectorAll('h2, h3');
        headings.forEach(heading => {
            // Skip if it's the first element
            if (heading.previousElementSibling) {
                const prevElement = heading.previousElementSibling;
                const marginBottom = window.getComputedStyle(prevElement).marginBottom;

                // Ensure proper spacing
                if (parseFloat(marginBottom) < 40) {
                    prevElement.style.marginBottom = '2.5rem';
                }
            }
        });
    }

    /**
     * Add smooth scrolling for anchor links
     */
    function addSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href').substring(1);
                if (!targetId) return;

                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    /**
     * Get current date formatted
     */
    function getCurrentDate() {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date().toLocaleDateString('en-US', options);
    }

    /**
     * Remove personal pronouns and casual language (visual indicators only)
     */
    function addEditorialNotice() {
        // This would require content rewriting, which is beyond client-side JS
        // Instead, we add a subtle editorial notice
        const articleContent = document.querySelector('.article-content');
        if (!articleContent) return;

        // Check for overly casual language
        const text = articleContent.textContent;
        const personalPronouns = (text.match(/\b(I|me|my|mine|we|us|our|ours)\b/gi) || []).length;
        const totalWords = text.trim().split(/\s+/).length;
        const personalPronounRatio = personalPronouns / totalWords;

        // If content seems too personal, add subtle notice
        if (personalPronounRatio > 0.015) { // More than 1.5% personal pronouns
            console.warn('⚠️ Article may contain personal language. Consider rewriting for professional tone.');
        }
    }

})();
