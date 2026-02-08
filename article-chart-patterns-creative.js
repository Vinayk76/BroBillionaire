/**
 * CHART PATTERNS ARTICLE - CREATIVE INTERACTIONS
 * Enhanced user experience with smooth animations and interactions
 */

(function () {
    'use strict';

    // ===== READING PROGRESS BAR =====
    function createReadingProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress-bar';
        progressBar.style.width = '0%';
        document.body.prepend(progressBar);

        window.addEventListener('scroll', () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrolled = window.scrollY;
            const progress = (scrolled / documentHeight) * 100;
            progressBar.style.width = `${Math.min(progress, 100)}%`;
        });
    }

    // ===== INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS =====
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all content sections
        const animatedElements = document.querySelectorAll(
            '.article-content h2, .article-content h3, ' +
            '.article-content p, .article-content ul, .article-content ol, ' +
            '.insight-box, .formula-box, .strategy-box, .data-table'
        );

        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }

    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href !== '#' && href !== '#!') {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    }

    // ===== ANIMATE NUMBERS IN STAT CARDS =====
    function animateNumbers() {
        const stats = document.querySelectorAll('.stat-value');

        const observerOptions = {
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    entry.target.classList.add('animated');
                    const target = entry.target;
                    const text = target.textContent;

                    // Extract number from text
                    const match = text.match(/[\d.]+/);
                    if (match) {
                        const number = parseFloat(match[0]);
                        const duration = 2000;
                        const steps = 60;
                        const increment = number / steps;
                        let current = 0;
                        const suffix = text.replace(match[0], '').trim();

                        const timer = setInterval(() => {
                            current += increment;
                            if (current >= number) {
                                current = number;
                                clearInterval(timer);
                            }
                            target.textContent = current.toFixed(1) + suffix;
                        }, duration / steps);
                    }
                    observer.unobserve(target);
                }
            });
        }, observerOptions);

        stats.forEach(stat => observer.observe(stat));
    }

    // ===== ADD HOVER EFFECT TO DATA TABLE ROWS =====
    function enhanceDataTables() {
        const tables = document.querySelectorAll('.data-table table');

        tables.forEach(table => {
            const rows = table.querySelectorAll('tbody tr');

            rows.forEach((row, index) => {
                row.style.opacity = '0';
                row.style.transform = 'translateX(-20px)';

                setTimeout(() => {
                    row.style.transition = 'all 0.5s ease';
                    row.style.opacity = '1';
                    row.style.transform = 'translateX(0)';
                }, index * 100);
            });
        });
    }

    // ===== PARALLAX EFFECT FOR HERO SECTION =====
    function initParallax() {
        const hero = document.querySelector('.article-hero');
        if (!hero) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const parallaxSpeed = 0.5;

            if (scrolled < window.innerHeight) {
                hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
                hero.style.opacity = 1 - (scrolled / window.innerHeight);
            }
        });
    }

    // ===== COPY CODE FUNCTIONALITY =====
    function addCopyButtons() {
        const codeBlocks = document.querySelectorAll('.formula-box .formula');

        codeBlocks.forEach(block => {
            const button = document.createElement('button');
            button.className = 'copy-formula-btn';
            button.innerHTML = '<i class="fas fa-copy"></i> Copy';
            button.style.cssText = `
                position: absolute;
                top: 10px;
                right: 10px;
                padding: 8px 16px;
                background: rgba(201, 162, 39, 0.2);
                border: 1px solid rgba(201, 162, 39, 0.4);
                border-radius: 8px;
                color: #C9A227;
                font-size: 0.85rem;
                cursor: pointer;
                transition: all 0.3s ease;
            `;

            button.addEventListener('click', () => {
                const text = block.textContent;
                navigator.clipboard.writeText(text).then(() => {
                    button.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    button.style.background = 'rgba(34, 197, 94, 0.2)';
                    button.style.borderColor = 'rgba(34, 197, 94, 0.4)';
                    button.style.color = '#22c55e';

                    setTimeout(() => {
                        button.innerHTML = '<i class="fas fa-copy"></i> Copy';
                        button.style.background = 'rgba(201, 162, 39, 0.2)';
                        button.style.borderColor = 'rgba(201, 162, 39, 0.4)';
                        button.style.color = '#C9A227';
                    }, 2000);
                });
            });

            button.addEventListener('mouseenter', () => {
                button.style.background = 'rgba(201, 162, 39, 0.3)';
                button.style.transform = 'scale(1.05)';
            });

            button.addEventListener('mouseleave', () => {
                button.style.background = 'rgba(201, 162, 39, 0.2)';
                button.style.transform = 'scale(1)';
            });

            // Make formula box position relative
            const formulaBox = block.closest('.formula-box');
            if (formulaBox) {
                formulaBox.style.position = 'relative';
                formulaBox.appendChild(button);
            }
        });
    }

    // ===== ANIMATE LIST ITEMS ON SCROLL =====
    function animateListItems() {
        const lists = document.querySelectorAll('.key-takeaway ul, .strategy-box ul');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const items = entry.target.querySelectorAll('li');
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateX(0)';
                        }, index * 100);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        lists.forEach(list => {
            const items = list.querySelectorAll('li');
            items.forEach(item => {
                item.style.opacity = '0';
                item.style.transform = 'translateX(-20px)';
                item.style.transition = 'all 0.5s ease';
            });
            observer.observe(list);
        });
    }

    // ===== ADD TOOLTIP TO ABBREVIATIONS =====
    function addTooltips() {
        const abbreviations = {
            'H&S': 'Head and Shoulders',
            'R:R': 'Risk to Reward Ratio',
            'SL': 'Stop Loss',
            'NIFTY': 'National Stock Exchange Fifty'
        };

        const content = document.querySelector('.article-content');
        if (!content) return;

        Object.keys(abbreviations).forEach(abbr => {
            const regex = new RegExp(`\\b${abbr}\\b`, 'g');
            const walker = document.createTreeWalker(
                content,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );

            const nodesToReplace = [];
            let node;
            while (node = walker.nextNode()) {
                if (regex.test(node.textContent)) {
                    nodesToReplace.push(node);
                }
            }

            nodesToReplace.forEach(textNode => {
                const span = document.createElement('span');
                span.innerHTML = textNode.textContent.replace(
                    regex,
                    `<abbr title="${abbreviations[abbr]}" style="cursor: help; border-bottom: 1px dotted #C9A227; text-decoration: none;">${abbr}</abbr>`
                );
                textNode.parentNode.replaceChild(span, textNode);
            });
        });
    }

    // ===== BACK TO TOP BUTTON =====
    function createBackToTopButton() {
        const button = document.createElement('button');
        button.className = 'back-to-top';
        button.innerHTML = '<i class="fas fa-arrow-up"></i>';
        button.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #C9A227, #E8D5A3);
            border: none;
            border-radius: 50%;
            color: #0a0a0a;
            font-size: 1.2rem;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            box-shadow: 0 5px 20px rgba(201, 162, 39, 0.4);
            z-index: 1000;
        `;

        button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.1) translateY(-3px)';
            button.style.boxShadow = '0 10px 30px rgba(201, 162, 39, 0.6)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1) translateY(0)';
            button.style.boxShadow = '0 5px 20px rgba(201, 162, 39, 0.4)';
        });

        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                button.style.opacity = '1';
                button.style.visibility = 'visible';
            } else {
                button.style.opacity = '0';
                button.style.visibility = 'hidden';
            }
        });

        document.body.appendChild(button);
    }

    // ===== INITIALIZE ALL FEATURES =====
    function init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        console.log('🚀 Initializing Chart Patterns Article Enhancements...');

        try {
            createReadingProgressBar();
            initScrollAnimations();
            initSmoothScroll();
            animateNumbers();
            enhanceDataTables();
            initParallax();
            addCopyButtons();
            animateListItems();
            addTooltips();
            createBackToTopButton();

            console.log('✅ All enhancements loaded successfully!');
        } catch (error) {
            console.error('❌ Error loading enhancements:', error);
        }
    }

    // Start initialization
    init();

})();
