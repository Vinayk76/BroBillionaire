/**
 * BroBillionaire Advanced SEO Injector
 * Dynamically enhances all pages with advanced SEO features
 * Version 2.0 - Maximum Google Ranking Optimization
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        siteName: 'BroBillionaire',
        siteUrl: 'https://brobillionaire.com',
        defaultImage: 'https://brobillionaire.com/og-image.jpg',
        logoUrl: 'https://brobillionaire.com/logo.jpg',
        twitterHandle: '@brobillionaire',
        themeColor: '#C9A227',
        defaultKeywords: 'trading, finance, investing, stock market, trading strategies, financial education, market analysis, trader mindset, wealth building, BroBillionaire'
    };

    // SEO Enhancement Class
    class SEOEnhancer {
        constructor() {
            this.head = document.head;
            this.isArticle = window.location.pathname.includes('article-');
            this.pageTitle = document.title;
            this.init();
        }

        init() {
            this.addPreconnects();
            this.addDNSPrefetch();
            this.enhanceMetaTags();
            this.addStructuredData();
            this.addPerformanceHints();
            this.addAccessibilityEnhancements();
            this.addSocialProof();
            this.trackReadTime();
            this.addTableOfContents();
            this.lazyLoadImages();
            this.addInternalLinking();
            console.log('🚀 BroBillionaire SEO Enhanced');
        }

        // Add preconnect hints for faster loading
        addPreconnects() {
            const preconnects = [
                'https://fonts.googleapis.com',
                'https://fonts.gstatic.com',
                'https://cdnjs.cloudflare.com',
                'https://www.google-analytics.com',
                'https://www.googletagmanager.com'
            ];

            preconnects.forEach(url => {
                if (!document.querySelector(`link[href="${url}"][rel="preconnect"]`)) {
                    const link = document.createElement('link');
                    link.rel = 'preconnect';
                    link.href = url;
                    link.crossOrigin = 'anonymous';
                    this.head.appendChild(link);
                }
            });
        }

        // Add DNS prefetch for third-party resources
        addDNSPrefetch() {
            const prefetches = [
                'https://www.google.com',
                'https://www.facebook.com',
                'https://platform.twitter.com',
                'https://www.linkedin.com'
            ];

            prefetches.forEach(url => {
                if (!document.querySelector(`link[href="${url}"][rel="dns-prefetch"]`)) {
                    const link = document.createElement('link');
                    link.rel = 'dns-prefetch';
                    link.href = url;
                    this.head.appendChild(link);
                }
            });
        }

        // Enhance existing meta tags and add missing ones
        enhanceMetaTags() {
            // Add missing essential meta tags
            this.addMetaTag('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
            this.addMetaTag('name', 'googlebot', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
            this.addMetaTag('name', 'bingbot', 'index, follow');
            this.addMetaTag('name', 'revisit-after', '1 days');
            this.addMetaTag('name', 'rating', 'General');
            this.addMetaTag('name', 'distribution', 'Global');
            this.addMetaTag('name', 'language', 'English');
            this.addMetaTag('name', 'geo.region', 'IN');
            this.addMetaTag('name', 'geo.placename', 'India');
            this.addMetaTag('name', 'content-language', 'en');
            
            // Mobile optimization
            this.addMetaTag('name', 'mobile-web-app-capable', 'yes');
            this.addMetaTag('name', 'apple-mobile-web-app-capable', 'yes');
            this.addMetaTag('name', 'apple-mobile-web-app-status-bar-style', 'black-translucent');
            this.addMetaTag('name', 'apple-mobile-web-app-title', CONFIG.siteName);
            this.addMetaTag('name', 'application-name', CONFIG.siteName);
            this.addMetaTag('name', 'format-detection', 'telephone=no');
            this.addMetaTag('name', 'theme-color', CONFIG.themeColor);
            this.addMetaTag('name', 'msapplication-TileColor', CONFIG.themeColor);
            
            // Add manifest link
            if (!document.querySelector('link[rel="manifest"]')) {
                const manifest = document.createElement('link');
                manifest.rel = 'manifest';
                manifest.href = '/manifest.json';
                this.head.appendChild(manifest);
            }

            // Add canonical if missing
            if (!document.querySelector('link[rel="canonical"]')) {
                const canonical = document.createElement('link');
                canonical.rel = 'canonical';
                canonical.href = window.location.href.split('?')[0].split('#')[0];
                this.head.appendChild(canonical);
            }

            // Add alternate languages
            this.addAlternateLanguages();
        }

        // Add meta tag helper
        addMetaTag(attrType, attrValue, content) {
            const selector = `meta[${attrType}="${attrValue}"]`;
            if (!document.querySelector(selector)) {
                const meta = document.createElement('meta');
                meta.setAttribute(attrType, attrValue);
                meta.content = content;
                this.head.appendChild(meta);
            }
        }

        // Add alternate language links
        addAlternateLanguages() {
            const languages = [
                { hreflang: 'en', href: window.location.href },
                { hreflang: 'en-IN', href: window.location.href },
                { hreflang: 'x-default', href: window.location.href }
            ];

            languages.forEach(lang => {
                if (!document.querySelector(`link[hreflang="${lang.hreflang}"]`)) {
                    const link = document.createElement('link');
                    link.rel = 'alternate';
                    link.hreflang = lang.hreflang;
                    link.href = lang.href;
                    this.head.appendChild(link);
                }
            });
        }

        // Add comprehensive structured data
        addStructuredData() {
            // Website schema (for all pages)
            this.addSchema({
                "@context": "https://schema.org",
                "@type": "WebSite",
                "@id": `${CONFIG.siteUrl}/#website`,
                "url": CONFIG.siteUrl,
                "name": CONFIG.siteName,
                "description": "Free comprehensive trading education platform",
                "publisher": {
                    "@id": `${CONFIG.siteUrl}/#organization`
                },
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": {
                        "@type": "EntryPoint",
                        "urlTemplate": `${CONFIG.siteUrl}/?s={search_term_string}`
                    },
                    "query-input": "required name=search_term_string"
                },
                "inLanguage": "en-US"
            });

            // Organization schema
            this.addSchema({
                "@context": "https://schema.org",
                "@type": "Organization",
                "@id": `${CONFIG.siteUrl}/#organization`,
                "name": CONFIG.siteName,
                "url": CONFIG.siteUrl,
                "logo": {
                    "@type": "ImageObject",
                    "url": CONFIG.logoUrl,
                    "width": 512,
                    "height": 512
                },
                "sameAs": [
                    "https://twitter.com/brobillionaire",
                    "https://www.instagram.com/brobillionaire",
                    "https://www.youtube.com/@brobillionaire"
                ]
            });

            // If it's an article page, add article-specific schemas
            if (this.isArticle) {
                this.addArticleSchema();
                this.addHowToSchema();
            }
        }

        // Add article-specific schema
        addArticleSchema() {
            const articleContent = document.querySelector('.article-content, .content, main, article');
            const title = document.querySelector('h1')?.textContent || this.pageTitle;
            const description = document.querySelector('meta[name="description"]')?.content || '';
            const wordCount = articleContent ? articleContent.textContent.split(/\s+/).length : 1000;
            const readTime = Math.ceil(wordCount / 200);

            // Enhanced Article Schema
            this.addSchema({
                "@context": "https://schema.org",
                "@type": "Article",
                "@id": `${window.location.href}#article`,
                "headline": title,
                "description": description,
                "image": {
                    "@type": "ImageObject",
                    "url": CONFIG.defaultImage,
                    "width": 1200,
                    "height": 630
                },
                "author": {
                    "@type": "Organization",
                    "@id": `${CONFIG.siteUrl}/#organization`,
                    "name": CONFIG.siteName
                },
                "publisher": {
                    "@type": "Organization",
                    "@id": `${CONFIG.siteUrl}/#organization`,
                    "name": CONFIG.siteName,
                    "logo": {
                        "@type": "ImageObject",
                        "url": CONFIG.logoUrl
                    }
                },
                "mainEntityOfPage": {
                    "@type": "WebPage",
                    "@id": window.location.href
                },
                "wordCount": wordCount,
                "timeRequired": `PT${readTime}M`,
                "inLanguage": "en-US",
                "isAccessibleForFree": true,
                "isPartOf": {
                    "@type": "WebSite",
                    "@id": `${CONFIG.siteUrl}/#website`
                },
                "about": {
                    "@type": "Thing",
                    "name": "Trading Education"
                },
                "audience": {
                    "@type": "Audience",
                    "audienceType": "Traders, Investors, Finance Enthusiasts"
                }
            });

            // Add WebPage schema
            this.addSchema({
                "@context": "https://schema.org",
                "@type": "WebPage",
                "@id": window.location.href,
                "url": window.location.href,
                "name": title,
                "description": description,
                "isPartOf": {
                    "@id": `${CONFIG.siteUrl}/#website`
                },
                "inLanguage": "en-US",
                "potentialAction": [{
                    "@type": "ReadAction",
                    "target": [window.location.href]
                }]
            });
        }

        // Add HowTo schema for educational content
        addHowToSchema() {
            const headers = document.querySelectorAll('h2, h3');
            if (headers.length > 2) {
                const steps = [];
                headers.forEach((header, index) => {
                    if (index < 8) { // Limit to 8 steps
                        steps.push({
                            "@type": "HowToStep",
                            "position": index + 1,
                            "name": header.textContent,
                            "text": header.nextElementSibling?.textContent?.substring(0, 200) || header.textContent
                        });
                    }
                });

                if (steps.length >= 2) {
                    this.addSchema({
                        "@context": "https://schema.org",
                        "@type": "HowTo",
                        "name": document.querySelector('h1')?.textContent || this.pageTitle,
                        "description": document.querySelector('meta[name="description"]')?.content || '',
                        "step": steps,
                        "totalTime": "PT15M"
                    });
                }
            }
        }

        // Helper to add schema
        addSchema(schema) {
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.textContent = JSON.stringify(schema);
            this.head.appendChild(script);
        }

        // Add performance optimization hints
        addPerformanceHints() {
            // Add resource hints for next likely pages
            const popularPages = [
                '/article-george-soros.html',
                '/article-trading-psychology.html',
                '/article-risk-management.html',
                '/tools.html'
            ];

            popularPages.forEach(page => {
                if (window.location.pathname !== page) {
                    const link = document.createElement('link');
                    link.rel = 'prefetch';
                    link.href = page;
                    this.head.appendChild(link);
                }
            });
        }

        // Add accessibility enhancements
        addAccessibilityEnhancements() {
            // Add lang attribute if missing
            if (!document.documentElement.lang) {
                document.documentElement.lang = 'en';
            }

            // Add skip link for keyboard navigation
            if (!document.querySelector('.skip-link')) {
                const skipLink = document.createElement('a');
                skipLink.href = '#main-content';
                skipLink.className = 'skip-link sr-only';
                skipLink.textContent = 'Skip to main content';
                skipLink.style.cssText = `
                    position: absolute;
                    top: -40px;
                    left: 0;
                    background: ${CONFIG.themeColor};
                    color: white;
                    padding: 8px 16px;
                    z-index: 100000;
                    transition: top 0.3s;
                `;
                skipLink.addEventListener('focus', () => {
                    skipLink.style.top = '0';
                });
                skipLink.addEventListener('blur', () => {
                    skipLink.style.top = '-40px';
                });
                document.body.insertBefore(skipLink, document.body.firstChild);
            }

            // Add main content landmark
            const main = document.querySelector('main, .main-content, .content');
            if (main && !main.id) {
                main.id = 'main-content';
                main.setAttribute('role', 'main');
            }

            // Enhance images with alt text
            document.querySelectorAll('img:not([alt])').forEach(img => {
                const src = img.src;
                const filename = src.split('/').pop().split('.')[0];
                img.alt = filename.replace(/-/g, ' ').replace(/_/g, ' ');
            });

            // Add aria labels to links
            document.querySelectorAll('a:not([aria-label])').forEach(link => {
                if (!link.textContent.trim() && link.querySelector('i, svg, img')) {
                    const title = link.title || link.href.split('/').pop().replace(/-/g, ' ');
                    link.setAttribute('aria-label', title);
                }
            });
        }

        // Add social proof elements
        addSocialProof() {
            if (this.isArticle) {
                // Add reading progress bar
                const progressBar = document.createElement('div');
                progressBar.className = 'reading-progress';
                progressBar.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    height: 3px;
                    background: linear-gradient(90deg, ${CONFIG.themeColor}, #FFD700);
                    width: 0%;
                    z-index: 99999;
                    transition: width 0.1s ease;
                `;
                document.body.appendChild(progressBar);

                window.addEventListener('scroll', () => {
                    const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
                    progressBar.style.width = Math.min(scrolled, 100) + '%';
                });
            }
        }

        // Track and display read time
        trackReadTime() {
            if (this.isArticle) {
                const content = document.querySelector('.article-content, .content, main, article');
                if (content) {
                    const wordCount = content.textContent.split(/\s+/).length;
                    const readTime = Math.ceil(wordCount / 200);

                    // Try to insert read time near title
                    const titleElement = document.querySelector('h1');
                    if (titleElement && !document.querySelector('.read-time-badge')) {
                        const badge = document.createElement('span');
                        badge.className = 'read-time-badge';
                        badge.innerHTML = `<i class="fas fa-clock"></i> ${readTime} min read`;
                        badge.style.cssText = `
                            display: inline-block;
                            margin-left: 10px;
                            padding: 4px 12px;
                            background: rgba(201, 162, 39, 0.2);
                            color: ${CONFIG.themeColor};
                            border-radius: 20px;
                            font-size: 0.8rem;
                            vertical-align: middle;
                        `;
                        titleElement.parentNode.insertBefore(badge, titleElement.nextSibling);
                    }
                }
            }
        }

        // Auto-generate table of contents for articles
        addTableOfContents() {
            if (this.isArticle) {
                const headers = document.querySelectorAll('h2');
                if (headers.length >= 3) {
                    // Create mobile toggle button
                    const mobileToggle = document.createElement('button');
                    mobileToggle.className = 'toc-mobile-toggle';
                    mobileToggle.innerHTML = '<i class="fas fa-list-ul"></i>';
                    mobileToggle.setAttribute('aria-label', 'Toggle Quick Navigation');
                    mobileToggle.style.cssText = `
                        position: fixed;
                        right: 20px;
                        bottom: 80px;
                        width: 50px;
                        height: 50px;
                        border-radius: 50%;
                        background: linear-gradient(135deg, ${CONFIG.themeColor} 0%, #a68820 100%);
                        color: #000;
                        border: none;
                        cursor: pointer;
                        z-index: 1001;
                        display: none;
                        align-items: center;
                        justify-content: center;
                        font-size: 18px;
                        box-shadow: 0 4px 20px rgba(201, 162, 39, 0.4);
                        transition: transform 0.3s, box-shadow 0.3s;
                    `;

                    const tocContainer = document.createElement('nav');
                    tocContainer.className = 'article-toc';
                    tocContainer.setAttribute('aria-label', 'Table of Contents');
                    
                    // Header with close button
                    const tocHeader = document.createElement('div');
                    tocHeader.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;';
                    tocHeader.innerHTML = `
                        <h4 style="margin: 0; color: ${CONFIG.themeColor}; font-size: 1rem;"><i class="fas fa-list-ul"></i> Quick Navigation</h4>
                        <button class="toc-close-btn" aria-label="Close navigation" style="
                            background: rgba(255, 255, 255, 0.1);
                            border: 1px solid rgba(255, 255, 255, 0.2);
                            color: #fff;
                            width: 28px;
                            height: 28px;
                            border-radius: 50%;
                            cursor: pointer;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 14px;
                            transition: all 0.3s;
                        "><i class="fas fa-times"></i></button>
                    `;
                    tocContainer.appendChild(tocHeader);
                    
                    const tocList = document.createElement('ul');
                    tocList.style.cssText = 'list-style: none; padding: 0; margin: 0;';

                    headers.forEach((header, index) => {
                        // Add ID to header if missing
                        if (!header.id) {
                            header.id = 'section-' + (index + 1);
                        }

                        const li = document.createElement('li');
                        li.style.cssText = 'margin: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 8px;';
                        
                        const link = document.createElement('a');
                        link.href = '#' + header.id;
                        link.textContent = header.textContent;
                        link.style.cssText = `
                            color: #e0e0e0;
                            text-decoration: none;
                            font-size: 0.9rem;
                            transition: color 0.3s, padding-left 0.3s;
                            display: block;
                            line-height: 1.5;
                        `;
                        link.addEventListener('mouseenter', () => {
                            link.style.color = CONFIG.themeColor;
                            link.style.paddingLeft = '8px';
                        });
                        link.addEventListener('mouseleave', () => {
                            link.style.color = '#e0e0e0';
                            link.style.paddingLeft = '0';
                        });
                        // Close TOC on mobile when link is clicked
                        link.addEventListener('click', () => {
                            if (window.innerWidth <= 1024) {
                                tocContainer.style.display = 'none';
                                mobileToggle.style.display = 'flex';
                            }
                        });
                        
                        li.appendChild(link);
                        tocList.appendChild(li);
                    });

                    // Remove border from last item
                    if (tocList.lastChild) {
                        tocList.lastChild.style.borderBottom = 'none';
                        tocList.lastChild.style.marginBottom = '0';
                        tocList.lastChild.style.paddingBottom = '0';
                    }

                    tocContainer.appendChild(tocList);
                    
                    // Check if there's a sidebar on the page
                    const hasSidebar = document.querySelector('.article-sidebar') !== null;
                    const rightOffset = hasSidebar ? '380px' : '20px';
                    const minScreenWidth = hasSidebar ? 1700 : 1400;
                    
                    tocContainer.style.cssText = `
                        position: fixed;
                        right: ${rightOffset};
                        top: 50%;
                        transform: translateY(-50%);
                        background: rgba(15, 15, 25, 0.98);
                        backdrop-filter: blur(20px);
                        -webkit-backdrop-filter: blur(20px);
                        padding: 20px;
                        border-radius: 12px;
                        border: 1px solid rgba(201, 162, 39, 0.4);
                        max-width: 280px;
                        max-height: 70vh;
                        overflow-y: auto;
                        z-index: 1000;
                        display: none;
                        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
                    `;

                    // Close button functionality
                    const closeBtn = tocHeader.querySelector('.toc-close-btn');
                    closeBtn.addEventListener('mouseenter', () => {
                        closeBtn.style.background = 'rgba(239, 68, 68, 0.3)';
                        closeBtn.style.borderColor = '#ef4444';
                        closeBtn.style.color = '#ef4444';
                    });
                    closeBtn.addEventListener('mouseleave', () => {
                        closeBtn.style.background = 'rgba(255, 255, 255, 0.1)';
                        closeBtn.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                        closeBtn.style.color = '#fff';
                    });
                    closeBtn.addEventListener('click', () => {
                        tocContainer.style.display = 'none';
                        if (window.innerWidth <= 1024) {
                            mobileToggle.style.display = 'flex';
                        }
                    });

                    // Mobile toggle functionality
                    mobileToggle.addEventListener('click', () => {
                        tocContainer.style.display = 'block';
                        tocContainer.style.right = '20px';
                        tocContainer.style.top = '50%';
                        tocContainer.style.transform = 'translateY(-50%)';
                        mobileToggle.style.display = 'none';
                    });
                    mobileToggle.addEventListener('mouseenter', () => {
                        mobileToggle.style.transform = 'scale(1.1)';
                        mobileToggle.style.boxShadow = '0 6px 25px rgba(201, 162, 39, 0.6)';
                    });
                    mobileToggle.addEventListener('mouseleave', () => {
                        mobileToggle.style.transform = 'scale(1)';
                        mobileToggle.style.boxShadow = '0 4px 20px rgba(201, 162, 39, 0.4)';
                    });

                    // Handle screen resize
                    const handleResize = () => {
                        if (window.innerWidth > minScreenWidth) {
                            // Desktop: show TOC, hide toggle
                            tocContainer.style.display = 'block';
                            tocContainer.style.right = rightOffset;
                            mobileToggle.style.display = 'none';
                        } else if (window.innerWidth > 768) {
                            // Tablet: show toggle, hide TOC
                            tocContainer.style.display = 'none';
                            mobileToggle.style.display = 'flex';
                        } else {
                            // Mobile: show toggle, hide TOC
                            tocContainer.style.display = 'none';
                            mobileToggle.style.display = 'flex';
                        }
                    };

                    // Initial check
                    handleResize();
                    window.addEventListener('resize', handleResize);

                    // Close TOC when clicking outside on mobile
                    document.addEventListener('click', (e) => {
                        if (window.innerWidth <= 1024 && 
                            !tocContainer.contains(e.target) && 
                            !mobileToggle.contains(e.target) &&
                            tocContainer.style.display === 'block') {
                            tocContainer.style.display = 'none';
                            mobileToggle.style.display = 'flex';
                        }
                    });

                    document.body.appendChild(tocContainer);
                    document.body.appendChild(mobileToggle);
                }
            }
        }

        // Lazy load images for performance
        lazyLoadImages() {
            const images = document.querySelectorAll('img:not([loading])');
            images.forEach(img => {
                img.loading = 'lazy';
                img.decoding = 'async';
            });

            // Add fetchpriority to above-the-fold images
            const firstImage = document.querySelector('img');
            if (firstImage) {
                firstImage.loading = 'eager';
                firstImage.fetchPriority = 'high';
            }
        }

        // Add internal linking suggestions
        addInternalLinking() {
            if (this.isArticle) {
                // Related articles based on content
                const relatedArticles = {
                    'soros': ['article-paul-tudor-jones.html', 'article-jim-simons.html', 'article-stanley-druckenmiller.html'],
                    'options': ['article-option-greeks.html', 'article-implied-volatility-explained.html', 'article-gamma-squeeze.html'],
                    'futures': ['article-futures-risk.html', 'article-futures-rollover.html', 'article-fo-margin-explained.html'],
                    'psychology': ['article-trading-psychology.html', 'article-elite-trader-thinking.html', 'article-ego-cycle.html'],
                    'crash': ['article-black-monday.html', 'article-flash-crash.html', 'article-covid-crash-2020.html'],
                    'nifty': ['article-banknifty-expiry.html', 'article-best-time-banknifty.html', 'article-nifty-weekly-options-writing.html'],
                    'risk': ['article-risk-management.html', 'article-leverage-trap.html', 'article-margin-cascade.html']
                };

                // Check page content and suggest related
                const pageContent = document.body.textContent.toLowerCase();
                let suggestions = [];

                for (const [keyword, articles] of Object.entries(relatedArticles)) {
                    if (pageContent.includes(keyword)) {
                        suggestions = suggestions.concat(articles);
                    }
                }

                // Remove duplicates and current page
                const currentPage = window.location.pathname.split('/').pop();
                suggestions = [...new Set(suggestions)].filter(s => s !== currentPage).slice(0, 3);

                if (suggestions.length > 0) {
                    // Add structured data for related articles
                    this.addSchema({
                        "@context": "https://schema.org",
                        "@type": "WebPage",
                        "relatedLink": suggestions.map(s => `${CONFIG.siteUrl}/${s}`)
                    });
                }
            }
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new SEOEnhancer());
    } else {
        new SEOEnhancer();
    }

    // Service Worker Registration for PWA
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').catch(() => {
                console.log('Service worker not available');
            });
        });
    }

})();
