// Common Footer Component for BroBillionaire Articles
// This script injects a consistent footer across all article pages

(function() {
    'use strict';

    // Footer HTML template
    const footerHTML = `
    <footer class="bro-footer">
        <div class="bro-footer-content">
            <div class="bro-footer-brand">
                <div class="bro-footer-logo-container">
                    <img src="logo.jpg" alt="BroBillionaire Logo" class="bro-footer-logo">
                    <span class="bro-footer-title">BroBillionaire</span>
                </div>
                <p class="bro-footer-tagline"><em>Making Wall Street wisdom accessible to every trader.</em></p>
            </div>
            <div class="bro-footer-nav">
                <a href="index.html" class="bro-footer-home-btn">Home</a>
            </div>
        </div>
        <div class="bro-footer-disclaimer">
            <p>For educational purposes only. Not financial advice. Trading options involves substantial risk of loss.</p>
        </div>
    </footer>
    `;

    // Footer CSS styles
    const footerCSS = `
    <style>
    .bro-footer {
        background: linear-gradient(180deg, #0a0a0a 0%, #111111 100%);
        padding: 60px 20px 40px;
        text-align: center;
        border-top: 3px solid #C9A227;
        margin-top: 60px;
    }

    .bro-footer-content {
        max-width: 800px;
        margin: 0 auto;
    }

    .bro-footer-brand {
        margin-bottom: 30px;
    }

    .bro-footer-logo-container {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 15px;
        margin-bottom: 15px;
    }

    .bro-footer-logo {
        width: 60px;
        height: 60px;
        border-radius: 12px;
        object-fit: cover;
    }

    .bro-footer-title {
        font-family: 'Playfair Display', Georgia, serif;
        font-size: 2rem;
        font-weight: 600;
        color: #ffffff;
        letter-spacing: 0.5px;
    }

    .bro-footer-tagline {
        font-family: 'Inter', sans-serif;
        font-size: 1.1rem;
        color: #b8a068;
        font-style: italic;
        margin: 0;
        font-weight: 300;
    }

    .bro-footer-nav {
        margin: 30px 0;
    }

    .bro-footer-home-btn {
        display: inline-block;
        padding: 15px 50px;
        border: 2px solid #C9A227;
        background: transparent;
        color: #C9A227;
        font-family: 'Inter', sans-serif;
        font-size: 1rem;
        font-weight: 500;
        text-decoration: none;
        border-radius: 8px;
        transition: all 0.3s ease;
        letter-spacing: 0.5px;
    }

    .bro-footer-home-btn:hover {
        background: #C9A227;
        color: #000000;
        transform: translateY(-2px);
        box-shadow: 0 4px 20px rgba(201, 162, 39, 0.3);
    }

    .bro-footer-disclaimer {
        max-width: 900px;
        margin: 40px auto 0;
        padding: 20px 30px;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 12px;
    }

    .bro-footer-disclaimer p {
        font-family: 'Inter', sans-serif;
        font-size: 0.95rem;
        color: #888888;
        margin: 0;
        line-height: 1.6;
    }

    /* Hide any existing article-footer when bro-footer is present */
    body:has(.bro-footer) .article-footer {
        display: none;
    }

    /* Responsive styles */
    @media (max-width: 768px) {
        .bro-footer {
            padding: 40px 15px 30px;
        }

        .bro-footer-logo-container {
            flex-direction: column;
            gap: 10px;
        }

        .bro-footer-logo {
            width: 50px;
            height: 50px;
        }

        .bro-footer-title {
            font-size: 1.6rem;
        }

        .bro-footer-tagline {
            font-size: 1rem;
        }

        .bro-footer-home-btn {
            padding: 12px 40px;
            font-size: 0.95rem;
        }

        .bro-footer-disclaimer {
            padding: 15px 20px;
        }

        .bro-footer-disclaimer p {
            font-size: 0.85rem;
        }
    }

    @media (max-width: 480px) {
        .bro-footer-logo-container {
            gap: 8px;
        }

        .bro-footer-title {
            font-size: 1.4rem;
        }

        .bro-footer-tagline {
            font-size: 0.9rem;
        }
    }
    </style>
    `;

    // Function to inject footer
    function injectFooter() {
        // Remove existing article-footer if present
        const existingFooter = document.querySelector('.article-footer');
        if (existingFooter) {
            existingFooter.remove();
        }

        // Inject CSS into head
        document.head.insertAdjacentHTML('beforeend', footerCSS);

        // Find the best place to insert footer (before </body> or after main content)
        const body = document.body;
        const scripts = body.querySelectorAll('script');
        
        // Insert before the first script tag in body, or at the end
        if (scripts.length > 0) {
            scripts[0].insertAdjacentHTML('beforebegin', footerHTML);
        } else {
            body.insertAdjacentHTML('beforeend', footerHTML);
        }
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectFooter);
    } else {
        injectFooter();
    }
})();
