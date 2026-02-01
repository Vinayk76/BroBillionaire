/**
 * BroBillionaire SEO Backlink Injector
 * Advanced Internal Linking System for First Page Rankings
 * 
 * Features:
 * 1. Related Articles Section (6 highly relevant articles)
 * 2. Topic Cluster Navigation (pillar content linking)
 * 3. Breadcrumb Navigation with Schema
 * 4. Contextual In-Article Links
 * 5. "You May Also Like" sidebar
 * 6. Article Series Navigation
 * 7. Popular Articles Widget
 * 8. Enhanced Schema.org structured data
 */

(function() {
    'use strict';
    
    // Get current page filename
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Check if this is an article page
    if (!currentPage.startsWith('article-')) return;
    
    // Get article data
    const currentArticle = ARTICLE_DATABASE[currentPage];
    if (!currentArticle) return;
    
    // Initialize backlinks when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBacklinks);
    } else {
        initBacklinks();
    }
    
    function initBacklinks() {
        injectTopicClusterNav();
        injectEnhancedRelatedArticles();
        injectYouMayAlsoLike();
        injectContextualLinks();
        injectArticleSeries();
        injectPopularArticles();
        injectEnhancedSchema();
        injectInternalLinkingFooter();
    }
    
    /**
     * 2. TOPIC CLUSTER NAVIGATION (Pillar-Cluster Model for Topical Authority)
     */
    function injectTopicClusterNav() {
        const cluster = TOPIC_CLUSTERS[currentArticle.cluster];
        if (!cluster) return;
        
        // Get all articles in the same cluster
        const clusterArticles = Object.entries(ARTICLE_DATABASE)
            .filter(([file, data]) => data.cluster === currentArticle.cluster && file !== currentPage)
            .sort((a, b) => (a[1].priority || 5) - (b[1].priority || 5))
            .slice(0, 8);
        
        if (clusterArticles.length === 0) return;
        
        const pillarArticle = ARTICLE_DATABASE[cluster.pillar];
        const isPillar = currentPage === cluster.pillar;
        
        const clusterNavHTML = `
        <div class="topic-cluster-nav" style="border-left: 4px solid ${cluster.color}">
            <div class="cluster-header">
                <h3><i class="fas fa-sitemap"></i> ${cluster.name} Series</h3>
                <span class="cluster-badge">${clusterArticles.length + 1} Articles</span>
            </div>
            ${!isPillar && pillarArticle ? `
            <div class="pillar-link">
                <a href="${cluster.pillar}">
                    <i class="fas fa-star"></i>
                    <span>Start Here: ${pillarArticle.shortTitle}</span>
                    <i class="fas fa-arrow-right"></i>
                </a>
            </div>
            ` : ''}
            <ul class="cluster-articles">
                ${clusterArticles.map(([file, data]) => `
                    <li>
                        <a href="${file}" title="${data.title}">
                            <i class="fas ${data.icon || 'fa-file-alt'}"></i>
                            <span>${data.shortTitle}</span>
                        </a>
                    </li>
                `).join('')}
            </ul>
            <div class="cluster-cta">
                <a href="index.html#articles" class="view-all-btn">
                    View All ${cluster.name} Articles <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </div>`;
        
        // Insert after first major section or TOC - use more specific selectors
        const insertPoint = document.querySelector('.article-toc') || 
                           document.querySelector('.key-takeaways-box') ||
                           document.querySelector('.article-chapter:first-of-type');
        
        // Only insert if we found a valid insertion point inside the article content
        if (insertPoint && insertPoint.closest('article, .article-content-wrapper, .article-main')) {
            insertPoint.insertAdjacentHTML('afterend', clusterNavHTML);
        }
    }
    
    /**
     * 3. ENHANCED RELATED ARTICLES (Replace existing with SEO-optimized version)
     */
    function injectEnhancedRelatedArticles() {
        // Remove existing related articles section if present
        const existingRelated = document.querySelector('.related-articles-section');
        
        // Get related articles from database
        let relatedArticles = [];
        
        // First, add explicitly related articles
        if (currentArticle.related) {
            currentArticle.related.forEach(file => {
                if (ARTICLE_DATABASE[file]) {
                    relatedArticles.push([file, ARTICLE_DATABASE[file]]);
                }
            });
        }
        
        // If we need more, add articles from same cluster
        if (relatedArticles.length < 6) {
            const clusterArticles = Object.entries(ARTICLE_DATABASE)
                .filter(([file, data]) => 
                    data.cluster === currentArticle.cluster && 
                    file !== currentPage &&
                    !relatedArticles.some(r => r[0] === file)
                )
                .slice(0, 6 - relatedArticles.length);
            relatedArticles = [...relatedArticles, ...clusterArticles];
        }
        
        // If still need more, add by keyword matching
        if (relatedArticles.length < 6) {
            const keywordMatches = Object.entries(ARTICLE_DATABASE)
                .filter(([file, data]) => {
                    if (file === currentPage) return false;
                    if (relatedArticles.some(r => r[0] === file)) return false;
                    const commonKeywords = currentArticle.keywords.filter(k => 
                        data.keywords && data.keywords.includes(k)
                    );
                    return commonKeywords.length > 0;
                })
                .slice(0, 6 - relatedArticles.length);
            relatedArticles = [...relatedArticles, ...keywordMatches];
        }
        
        if (relatedArticles.length === 0) return;
        
        const relatedHTML = `
        <section class="enhanced-related-articles" itemscope itemtype="https://schema.org/ItemList">
            <meta itemprop="numberOfItems" content="${relatedArticles.length}">
            <div class="related-container">
                <h2 class="related-section-title">
                    <i class="fas fa-book-reader"></i>
                    Continue Your Learning Journey
                </h2>
                <p class="related-subtitle">Master these related concepts to become a complete trader</p>
                
                <div class="related-articles-grid">
                    ${relatedArticles.slice(0, 6).map(([file, data], index) => {
                        const cluster = TOPIC_CLUSTERS[data.cluster];
                        return `
                        <article class="related-article-card" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                            <meta itemprop="position" content="${index + 1}">
                            <a href="${file}" itemprop="url" class="related-card-link">
                                <div class="related-card-category" style="background: ${cluster ? cluster.color : '#C9A227'}20; color: ${cluster ? cluster.color : '#C9A227'}">
                                    <i class="fas ${data.icon || 'fa-file-alt'}"></i>
                                    ${data.category}
                                </div>
                                <h3 itemprop="name">${data.shortTitle}</h3>
                                <p class="related-card-desc">${data.description || ''}</p>
                                <span class="related-read-more">
                                    Read Article <i class="fas fa-arrow-right"></i>
                                </span>
                            </a>
                        </article>
                        `;
                    }).join('')}
                </div>
            </div>
        </section>`;
        
        if (existingRelated) {
            existingRelated.outerHTML = relatedHTML;
        } else {
            // Insert before footer or FAQ section
            const insertPoint = document.querySelector('.faq-section') || 
                               document.querySelector('footer') ||
                               document.querySelector('.footer');
            if (insertPoint) {
                insertPoint.insertAdjacentHTML('beforebegin', relatedHTML);
            }
        }
    }
    
    /**
     * 4. "YOU MAY ALSO LIKE" FLOATING SIDEBAR
     */
    function injectYouMayAlsoLike() {
        // Get 4 random related articles from different clusters
        const otherClusterArticles = Object.entries(ARTICLE_DATABASE)
            .filter(([file, data]) => 
                file !== currentPage && 
                data.cluster !== currentArticle.cluster &&
                data.priority === 1 // Only pillar/important articles
            )
            .sort(() => Math.random() - 0.5)
            .slice(0, 4);
        
        if (otherClusterArticles.length === 0) return;
        
        const sidebarHTML = `
        <aside class="you-may-also-like">
            <h4><i class="fas fa-fire-alt"></i> Trending Now</h4>
            <ul>
                ${otherClusterArticles.map(([file, data]) => `
                    <li>
                        <a href="${file}" title="${data.title}">
                            <i class="fas ${data.icon || 'fa-chevron-right'}"></i>
                            <span>${data.shortTitle}</span>
                        </a>
                    </li>
                `).join('')}
            </ul>
        </aside>`;
        
        // Add to article content area
        const articleContent = document.querySelector('.article-content') || document.querySelector('article');
        if (articleContent) {
            articleContent.insertAdjacentHTML('beforeend', sidebarHTML);
        }
    }
    
    /**
     * 5. CONTEXTUAL IN-ARTICLE LINKS (Auto-link keywords)
     */
    function injectContextualLinks() {
        const articleContent = document.querySelector('.article-content') || document.querySelector('article');
        if (!articleContent) return;
        
        // Create a map of keywords to articles
        const keywordMap = {};
        Object.entries(ARTICLE_DATABASE).forEach(([file, data]) => {
            if (file === currentPage) return;
            if (data.keywords) {
                data.keywords.forEach(keyword => {
                    if (keyword.length > 4) { // Only keywords longer than 4 chars
                        if (!keywordMap[keyword.toLowerCase()]) {
                            keywordMap[keyword.toLowerCase()] = [];
                        }
                        keywordMap[keyword.toLowerCase()].push({
                            file,
                            title: data.title,
                            shortTitle: data.shortTitle
                        });
                    }
                });
            }
        });
        
        // Get all text paragraphs
        const paragraphs = articleContent.querySelectorAll('p');
        let linksAdded = 0;
        const maxLinks = 5; // Limit contextual links per article
        
        paragraphs.forEach(p => {
            if (linksAdded >= maxLinks) return;
            
            // Skip if paragraph already has links
            if (p.querySelectorAll('a').length > 2) return;
            
            let html = p.innerHTML;
            
            // Try to add links for keywords
            Object.entries(keywordMap).forEach(([keyword, articles]) => {
                if (linksAdded >= maxLinks) return;
                
                const regex = new RegExp(`\\b(${keyword})\\b`, 'gi');
                if (regex.test(html) && !html.includes(`>${keyword}</a>`)) {
                    const article = articles[0];
                    html = html.replace(regex, (match) => {
                        linksAdded++;
                        return `<a href="${article.file}" class="contextual-link" title="${article.title}">${match}</a>`;
                    });
                }
            });
            
            if (html !== p.innerHTML) {
                p.innerHTML = html;
            }
        });
    }
    
    /**
     * 6. ARTICLE SERIES NAVIGATION (Prev/Next in cluster)
     */
    function injectArticleSeries() {
        const cluster = TOPIC_CLUSTERS[currentArticle.cluster];
        if (!cluster) return;
        
        // Get all articles in cluster sorted by priority
        const clusterArticles = Object.entries(ARTICLE_DATABASE)
            .filter(([file, data]) => data.cluster === currentArticle.cluster)
            .sort((a, b) => (a[1].priority || 5) - (b[1].priority || 5));
        
        const currentIndex = clusterArticles.findIndex(([file]) => file === currentPage);
        if (currentIndex === -1) return;
        
        const prevArticle = currentIndex > 0 ? clusterArticles[currentIndex - 1] : null;
        const nextArticle = currentIndex < clusterArticles.length - 1 ? clusterArticles[currentIndex + 1] : null;
        
        if (!prevArticle && !nextArticle) return;
        
        const seriesNavHTML = `
        <nav class="article-series-nav" aria-label="Article series navigation">
            <div class="series-header">
                <span class="series-label"><i class="fas fa-layer-group"></i> ${cluster.name} Series</span>
                <span class="series-progress">${currentIndex + 1} of ${clusterArticles.length}</span>
            </div>
            <div class="series-nav-buttons">
                ${prevArticle ? `
                <a href="${prevArticle[0]}" class="series-nav-btn prev" title="${prevArticle[1].title}">
                    <i class="fas fa-arrow-left"></i>
                    <div class="nav-btn-content">
                        <span class="nav-direction">Previous</span>
                        <span class="nav-title">${prevArticle[1].shortTitle}</span>
                    </div>
                </a>
                ` : '<div class="series-nav-placeholder"></div>'}
                
                ${nextArticle ? `
                <a href="${nextArticle[0]}" class="series-nav-btn next" title="${nextArticle[1].title}">
                    <div class="nav-btn-content">
                        <span class="nav-direction">Next Up</span>
                        <span class="nav-title">${nextArticle[1].shortTitle}</span>
                    </div>
                    <i class="fas fa-arrow-right"></i>
                </a>
                ` : '<div class="series-nav-placeholder"></div>'}
            </div>
        </nav>`;
        
        // Insert before related articles or footer
        const insertPoint = document.querySelector('.enhanced-related-articles') ||
                           document.querySelector('.related-articles-section') ||
                           document.querySelector('.faq-section') ||
                           document.querySelector('footer');
        
        if (insertPoint) {
            insertPoint.insertAdjacentHTML('beforebegin', seriesNavHTML);
        }
    }
    
    /**
     * 7. POPULAR ARTICLES WIDGET
     */
    function injectPopularArticles() {
        // Get top articles by priority
        const popularArticles = Object.entries(ARTICLE_DATABASE)
            .filter(([file, data]) => file !== currentPage && data.priority === 1)
            .sort(() => Math.random() - 0.5)
            .slice(0, 5);
        
        if (popularArticles.length === 0) return;
        
        const popularHTML = `
        <div class="popular-articles-widget">
            <h4><i class="fas fa-chart-line"></i> Most Popular</h4>
            <ol>
                ${popularArticles.map(([file, data], index) => `
                    <li>
                        <a href="${file}" title="${data.title}">
                            <span class="popular-rank">${index + 1}</span>
                            <span class="popular-title">${data.shortTitle}</span>
                        </a>
                    </li>
                `).join('')}
            </ol>
        </div>`;
        
        // Add after article content
        const articleContent = document.querySelector('.article-content') || document.querySelector('article');
        if (articleContent) {
            articleContent.insertAdjacentHTML('beforeend', popularHTML);
        }
    }
    
    /**
     * 8. ENHANCED SCHEMA.ORG STRUCTURED DATA
     */
    function injectEnhancedSchema() {
        const cluster = TOPIC_CLUSTERS[currentArticle.cluster];
        
        // Create Article schema with enhanced interlinking
        const articleSchema = {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": currentArticle.title,
            "description": currentArticle.description,
            "author": {
                "@type": "Organization",
                "name": "BroBillionaire",
                "url": "https://brobillionaire.com"
            },
            "publisher": {
                "@type": "Organization",
                "name": "BroBillionaire",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://brobillionaire.com/logo.jpg"
                }
            },
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `https://brobillionaire.com/${currentPage}`
            },
            "keywords": currentArticle.keywords ? currentArticle.keywords.join(", ") : "",
            "articleSection": currentArticle.category,
            "isPartOf": cluster ? {
                "@type": "CreativeWorkSeries",
                "name": cluster.name,
                "url": `https://brobillionaire.com/${cluster.pillar}`
            } : undefined,
            "relatedLink": currentArticle.related ? 
                currentArticle.related.map(file => `https://brobillionaire.com/${file}`) : []
        };
        
        // Add WebPage schema for better SEO
        const webPageSchema = {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": currentArticle.title,
            "description": currentArticle.description,
            "url": `https://brobillionaire.com/${currentPage}`,
            "isPartOf": {
                "@type": "WebSite",
                "name": "BroBillionaire",
                "url": "https://brobillionaire.com"
            },
            "about": {
                "@type": "Thing",
                "name": currentArticle.category
            },
            "significantLink": currentArticle.related ? 
                currentArticle.related.slice(0, 3).map(file => `https://brobillionaire.com/${file}`) : []
        };
        
        // Inject schemas
        const schemaScript = document.createElement('script');
        schemaScript.type = 'application/ld+json';
        schemaScript.textContent = JSON.stringify([articleSchema, webPageSchema]);
        document.head.appendChild(schemaScript);
    }
    
    /**
     * 9. INTERNAL LINKING FOOTER (SEO Footer Links)
     */
    function injectInternalLinkingFooter() {
        // Group articles by cluster for footer navigation
        const clusterGroups = {};
        Object.entries(ARTICLE_DATABASE).forEach(([file, data]) => {
            if (!clusterGroups[data.cluster]) {
                clusterGroups[data.cluster] = [];
            }
            if (data.priority === 1) { // Only important articles
                clusterGroups[data.cluster].push([file, data]);
            }
        });
        
        const footerLinksHTML = `
        <section class="seo-footer-links">
            <div class="footer-links-container">
                <h3>Explore More Trading Topics</h3>
                <div class="footer-links-grid">
                    ${Object.entries(TOPIC_CLUSTERS).slice(0, 6).map(([clusterId, cluster]) => {
                        const articles = clusterGroups[clusterId] || [];
                        return `
                        <div class="footer-link-column">
                            <h4 style="color: ${cluster.color}">${cluster.name}</h4>
                            <ul>
                                ${articles.slice(0, 4).map(([file, data]) => `
                                    <li><a href="${file}">${data.shortTitle}</a></li>
                                `).join('')}
                            </ul>
                        </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </section>`;
        
        // Insert before main footer
        const footer = document.querySelector('footer.footer') || document.querySelector('footer');
        if (footer) {
            footer.insertAdjacentHTML('beforebegin', footerLinksHTML);
        }
    }
    
})();
