/**
 * Common Header Component for BroBillionaire Articles
 * Injects a consistent navigation header across all article pages
 */

(function() {
    'use strict';

    // Common header HTML template
    const headerHTML = `
    <!-- Article Navigation -->
    <nav class="article-nav">
        <div class="article-nav-container">
            <a href="articles.html" class="back-link" style="margin-right:15px;"><i class="fas fa-th-large"></i><span>All Articles</span></a>
            <a href="index.html" class="back-link">
                <i class="fas fa-arrow-left"></i>
                <span>Back to Home</span>
            </a>
            <div class="article-nav-center">
                <a href="index.html" style="display: inline-flex; align-items: center;"><img src="logo.jpg" alt="BroBillionaire" class="nav-logo-small"></a>
            </div>
            <div class="article-share">
                <button class="share-btn" onclick="shareArticle()">
                    <i class="fas fa-share-alt"></i>
                </button>
            </div>
        </div>
        <div class="reading-progress-bar"></div>
    </nav>
    `;

    // CSS for the common header (article-specific styles)
    const headerStyles = `
    <style id="common-header-styles">
        /* Article Navigation Styles */
        .article-nav {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: rgba(10, 10, 10, 0.85);
            backdrop-filter: blur(30px) saturate(180%);
            -webkit-backdrop-filter: blur(30px) saturate(180%);
            border-bottom: 1px solid rgba(201, 162, 39, 0.15);
            z-index: 1000;
            padding: 0;
            transition: all 0.3s ease;
        }
        
        .article-nav.scrolled {
            background: rgba(5, 5, 5, 0.98);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
        }
        
        .article-nav-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 15px 30px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .back-link {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: rgba(255, 255, 255, 0.7);
            text-decoration: none;
            font-size: 0.9rem;
            font-weight: 500;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            padding: 8px 16px;
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
        }
        
        .back-link:hover {
            color: #C9A227;
            background: rgba(201, 162, 39, 0.1);
            border-color: rgba(201, 162, 39, 0.3);
            transform: translateX(-3px);
        }
        
        .article-nav-center {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
        }
        
        .nav-logo-small {
            height: 40px;
            width: auto;
            border-radius: 8px;
            transition: transform 0.3s ease;
        }
        
        .nav-logo-small:hover {
            transform: scale(1.05);
        }
        
        .article-share {
            display: flex;
            align-items: center;
        }
        
        .share-btn {
            background: linear-gradient(135deg, rgba(201, 162, 39, 0.15) 0%, rgba(201, 162, 39, 0.05) 100%);
            border: 1px solid rgba(201, 162, 39, 0.3);
            color: #C9A227;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }
        
        .share-btn::before {
            content: '';
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at center, rgba(201, 162, 39, 0.3) 0%, transparent 70%);
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .share-btn:hover {
            background: linear-gradient(135deg, rgba(201, 162, 39, 0.3) 0%, rgba(201, 162, 39, 0.1) 100%);
            transform: scale(1.1) rotate(5deg);
            box-shadow: 0 0 25px rgba(201, 162, 39, 0.4);
        }
        
        .share-btn:hover::before {
            opacity: 1;
        }

        /* Reading Progress Bar */
        .reading-progress-bar {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #C9A227, #FFD700, #C9A227);
            background-size: 200% 100%;
            animation: shimmer 2s ease-in-out infinite;
            transition: width 0.1s ease;
            box-shadow: 0 0 10px rgba(201, 162, 39, 0.5);
        }
        
        @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
            .article-nav-container {
                padding: 12px 16px;
            }
            
            .back-link span {
                display: none;
            }
            
            .back-link {
                padding: 8px 12px;
            }
        }

        /* Adjust body padding for fixed header */
        body.has-common-header {
            padding-top: 70px;
        }

        body.has-common-header .reading-progress {
            top: 70px;
        }
    </style>
    `;

    // Initialize common header
    function initCommonHeader() {
        // Check if we're on an article page
        if (!document.body.classList.contains('article-page')) {
            return;
        }

        // Check if article-nav already exists (don't duplicate)
        if (document.querySelector('.article-nav')) {
            return;
        }

        // Add styles to head
        document.head.insertAdjacentHTML('beforeend', headerStyles);

        // Insert header at the beginning of body
        document.body.insertAdjacentHTML('afterbegin', headerHTML);

        // Add class to body
        document.body.classList.add('has-common-header');

        // Handle scroll effect
        const navbar = document.querySelector('.article-nav');
        if (navbar) {
            window.addEventListener('scroll', function() {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            });

            // Update reading progress bar
            const progressBar = navbar.querySelector('.reading-progress-bar');
            if (progressBar) {
                window.addEventListener('scroll', function() {
                    const scrollTop = window.scrollY;
                    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                    const scrollPercent = (scrollTop / docHeight) * 100;
                    progressBar.style.width = scrollPercent + '%';
                });
            }
        }
    }

    // Share article function (if not already defined)
    if (typeof window.shareArticle !== 'function') {
        window.shareArticle = function() {
            if (navigator.share) {
                navigator.share({
                    title: document.title,
                    url: window.location.href
                }).catch(console.error);
            } else {
                // Fallback: copy to clipboard
                navigator.clipboard.writeText(window.location.href).then(function() {
                    alert('Link copied to clipboard!');
                }).catch(function() {
                    prompt('Copy this link:', window.location.href);
                });
            }
        };
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCommonHeader);
    } else {
        initCommonHeader();
    }
})();
