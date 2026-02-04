/**
 * Common Header Component for BroBillionaire Articles
 * Injects a consistent navigation header across all article pages
 */

(function() {
    'use strict';

    // Common header HTML template
    const headerHTML = `
    <!-- Common Navigation Header -->
    <nav class="navbar article-navbar">
        <div class="nav-container">
            <div class="logo">
                <a href="index.html" style="display: flex; align-items: center; text-decoration: none;">
                    <img src="logo.jpg" alt="BroBillionaire" class="logo-img">
                    <span class="logo-text">BroBillionaire</span>
                </a>
            </div>
            <div class="nav-links">
                <a href="index.html" class="nav-link">Home</a>
                <a href="articles.html" class="nav-link">All Articles</a>
                <a href="tools.html" class="nav-link">Tools</a>
                <a href="about.html" class="nav-link">About</a>
                <a href="contact.html" class="nav-link">Contact</a>
            </div>
            <div class="nav-right">
                <button class="share-btn header-share-btn" onclick="shareArticle()" title="Share Article">
                    <i class="fas fa-share-alt"></i>
                </button>
                <button class="mobile-menu-toggle" onclick="toggleMobileMenu()" aria-label="Toggle menu">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </div>
    </nav>
    <div class="mobile-nav-dropdown" id="mobileNavDropdown">
        <a href="index.html">Home</a>
        <a href="articles.html">All Articles</a>
        <a href="tools.html">Tools</a>
        <a href="viral-tools-hub.html">Viral Tools</a>
        <a href="community.html">Community</a>
        <a href="about.html">About</a>
        <a href="contact.html">Contact</a>
    </div>
    `;

    // CSS for the common header (article-specific styles)
    const headerStyles = `
    <style id="common-header-styles">
        /* Article Navbar Styles */
        .article-navbar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            background: rgba(10, 10, 10, 0.95);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(201, 162, 39, 0.15);
            padding: 0;
            transition: all 0.3s ease;
        }

        .article-navbar .nav-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 12px 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .article-navbar .logo {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .article-navbar .logo-img {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            object-fit: cover;
        }

        .article-navbar .logo-text {
            font-family: 'Playfair Display', serif;
            font-size: 1.3rem;
            font-weight: 600;
            color: #C9A227;
            letter-spacing: 0.5px;
        }

        .article-navbar .nav-links {
            display: flex;
            gap: 32px;
            align-items: center;
        }

        .article-navbar .nav-link {
            color: rgba(255, 255, 255, 0.85);
            text-decoration: none;
            font-size: 0.95rem;
            font-weight: 500;
            letter-spacing: 0.3px;
            transition: color 0.3s ease;
            position: relative;
        }

        .article-navbar .nav-link:hover {
            color: #C9A227;
        }

        .article-navbar .nav-link::after {
            content: '';
            position: absolute;
            bottom: -4px;
            left: 0;
            width: 0;
            height: 2px;
            background: linear-gradient(90deg, #C9A227, #E8D48B);
            transition: width 0.3s ease;
        }

        .article-navbar .nav-link:hover::after {
            width: 100%;
        }

        .article-navbar .nav-right {
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .article-navbar .header-share-btn {
            background: rgba(201, 162, 39, 0.15);
            border: 1px solid rgba(201, 162, 39, 0.3);
            color: #C9A227;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .article-navbar .header-share-btn:hover {
            background: rgba(201, 162, 39, 0.25);
            border-color: #C9A227;
            transform: scale(1.05);
        }

        .article-navbar .mobile-menu-toggle {
            display: none;
            flex-direction: column;
            gap: 5px;
            background: none;
            border: none;
            cursor: pointer;
            padding: 5px;
        }

        .article-navbar .mobile-menu-toggle span {
            width: 24px;
            height: 2px;
            background: #C9A227;
            transition: all 0.3s ease;
        }

        /* Mobile Responsive */
        @media (max-width: 900px) {
            .article-navbar .nav-links {
                display: none;
            }

            .article-navbar .mobile-menu-toggle {
                display: flex;
            }
        }

        @media (max-width: 480px) {
            .article-navbar .logo-text {
                font-size: 1.1rem;
            }

            .article-navbar .nav-container {
                padding: 10px 16px;
            }
        }

        /* Scrolled state */
        .article-navbar.scrolled {
            background: rgba(5, 5, 5, 0.98);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        /* Adjust body padding for fixed header */
        body.has-common-header {
            padding-top: 70px;
        }

        body.has-common-header .reading-progress {
            top: 64px;
        }

        /* Hide old article-nav when common header is present */
        body.has-common-header .article-nav {
            display: none !important;
        }
    </style>
    `;

    // Initialize common header
    function initCommonHeader() {
        // Check if we're on an article page
        if (!document.body.classList.contains('article-page')) {
            return;
        }

        // Add styles to head
        document.head.insertAdjacentHTML('beforeend', headerStyles);

        // Insert header at the beginning of body
        document.body.insertAdjacentHTML('afterbegin', headerHTML);

        // Add class to body
        document.body.classList.add('has-common-header');

        // Handle scroll effect
        const navbar = document.querySelector('.article-navbar');
        if (navbar) {
            window.addEventListener('scroll', function() {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            });
        }
    }

    // Mobile menu toggle function (if not already defined)
    if (typeof window.toggleMobileMenu !== 'function') {
        window.toggleMobileMenu = function() {
            const dropdown = document.getElementById('mobileNavDropdown');
            if (dropdown) {
                dropdown.classList.toggle('active');
            }
        };
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
