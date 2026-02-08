// Common Footer Component for BroBillionaire Articles
// This script injects a consistent footer across all article pages
// SEBI Compliant Disclaimer Added

(function () {
    'use strict';

    // Footer HTML template with comprehensive SEBI disclaimer
    const footerHTML = `
    <footer class="bro-footer">
        <!-- SEBI Compliance Disclaimer Section -->
        <div class="sebi-disclaimer-section">
            <div class="sebi-disclaimer-container">
                <div class="sebi-disclaimer-header">
                    <div class="sebi-disclaimer-icon">
                        ⚠️
                    </div>
                    <div class="sebi-disclaimer-title">Important SEBI Disclaimer & Risk Warning</div>
                </div>
                <div class="sebi-disclaimer-content">
                    <p><strong>For Educational Purposes Only:</strong> All tools, calculators, articles, and content on BroBillionaire.com are designed for educational and informational purposes only. They do not constitute investment advice, financial advice, trading advice, or any other sort of advice.</p>

                    <p><strong>No SEBI Registration:</strong> BroBillionaire is <strong>NOT</strong> a SEBI (Securities and Exchange Board of India) registered investment advisor, research analyst, or portfolio manager. We do not hold any SEBI registration or license to provide investment advisory services.</p>

                    <p><strong>Risk Warning:</strong> Trading and investing in securities markets involves substantial risk of loss. According to SEBI's 2023 study, <strong>93% of individual F&O traders in India incurred net losses</strong> with an average loss of ₹1.81 lakh per trader. Past performance is not indicative of future results.</p>

                    <p><strong>No Guarantee:</strong> Calculations, projections, and analysis provided by our tools are based on mathematical models and historical data. They do not guarantee future performance or protect against losses.</p>

                    <p><strong>Consult Professionals:</strong> Before making any investment decisions, consult with a SEBI-registered investment advisor and/or a qualified financial professional who can assess your specific situation and risk tolerance.</p>
                </div>

                <div class="sebi-disclaimer-badges">
                    <div class="sebi-badge-item">
                        <i class="fas fa-shield-alt"></i>
                        <span>Not SEBI Registered</span>
                    </div>
                    <div class="sebi-badge-item">
                        <i class="fas fa-graduation-cap"></i>
                        <span>Educational Only</span>
                    </div>
                    <div class="sebi-badge-item">
                        <i class="fas fa-chart-line"></i>
                        <span>No Investment Advice</span>
                    </div>
                    <div class="sebi-badge-item">
                        <i class="fas fa-balance-scale"></i>
                        <span>Consult SEBI RIA</span>
                    </div>
                </div>

                <div class="sebi-disclaimer-footer">
                    <p>📊 <strong>SEBI Reference:</strong> For registered investment advisors, visit <a href="https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doRecognised=yes" target="_blank" rel="noopener">SEBI's Official Website</a></p>
                </div>
            </div>
        </div>

        <!-- Footer Content -->
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
            <p>© ${new Date().getFullYear()} BroBillionaire. For educational purposes only. Not financial advice. Trading involves substantial risk of loss.</p>
        </div>
    </footer>
    `;

    // Footer CSS styles
    const footerCSS = `
    <style>
    /* SEBI Disclaimer Section Styles - BroBillionaire Theme */
    .sebi-disclaimer-section {
        max-width: 1200px;
        margin: 0 auto 40px;
        padding: 0 20px;
    }
    
    .sebi-disclaimer-container {
        background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0a0a0a 100%);
        border: 2px solid rgba(201, 162, 39, 0.3);
        border-radius: 16px;
        padding: 35px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05);
        position: relative;
        overflow: hidden;
    }
    
    .sebi-disclaimer-container::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, #C9A227, #E5B946, #C9A227);
    }
    
    .sebi-disclaimer-header {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 25px;
        padding-bottom: 20px;
        border-bottom: 1px solid rgba(201, 162, 39, 0.15);
    }
    
    .sebi-disclaimer-icon {
        width: 55px;
        height: 55px;
        background: linear-gradient(135deg, rgba(201, 162, 39, 0.2) 0%, rgba(201, 162, 39, 0.1) 100%);
        border: 1px solid rgba(201, 162, 39, 0.3);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.8rem;
        box-shadow: 0 4px 15px rgba(201, 162, 39, 0.15);
    }
    
    .sebi-disclaimer-title {
        color: #C9A227;
        font-size: 1.3rem;
        font-weight: 700;
        font-family: 'Playfair Display', Georgia, serif;
        letter-spacing: 0.5px;
    }
    
    .sebi-disclaimer-content {
        margin-bottom: 30px;
    }
    
    .sebi-disclaimer-content p {
        color: #b8b8b8;
        line-height: 1.9;
        margin-bottom: 18px;
        font-size: 0.95rem;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    
    .sebi-disclaimer-content strong {
        color: #C9A227;
        font-weight: 600;
    }
    
    .sebi-disclaimer-content p strong:first-child {
        display: inline-block;
        margin-right: 3px;
    }
    
    .sebi-disclaimer-badges {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 15px;
        margin-bottom: 25px;
    }
    
    .sebi-badge-item {
        background: linear-gradient(135deg, rgba(201, 162, 39, 0.08) 0%, rgba(201, 162, 39, 0.03) 100%);
        border: 1px solid rgba(201, 162, 39, 0.2);
        border-radius: 12px;
        padding: 18px 15px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        transition: all 0.3s ease;
    }
    
    .sebi-badge-item:hover {
        background: linear-gradient(135deg, rgba(201, 162, 39, 0.15) 0%, rgba(201, 162, 39, 0.08) 100%);
        border-color: rgba(201, 162, 39, 0.4);
        transform: translateY(-2px);
    }
    
    .sebi-badge-item i {
        color: #C9A227;
        font-size: 1.3rem;
    }
    
    .sebi-badge-item span {
        color: #e0e0e0;
        font-size: 0.85rem;
        font-weight: 600;
        font-family: 'Inter', sans-serif;
    }
    
    .sebi-disclaimer-footer {
        background: linear-gradient(135deg, rgba(201, 162, 39, 0.1) 0%, rgba(201, 162, 39, 0.05) 100%);
        border: 1px solid rgba(201, 162, 39, 0.2);
        border-radius: 10px;
        padding: 20px 25px;
    }
    
    .sebi-disclaimer-footer p {
        color: #d0d0d0;
        font-size: 0.9rem;
        margin: 0;
        font-family: 'Inter', sans-serif;
    }
    
    .sebi-disclaimer-footer a {
        color: #C9A227;
        text-decoration: none;
        font-weight: 600;
        transition: all 0.3s ease;
    }
    
    .sebi-disclaimer-footer a:hover {
        color: #E5B946;
        text-decoration: underline;
    }
    
    @media (max-width: 768px) {
        .sebi-disclaimer-badges {
            grid-template-columns: repeat(2, 1fr);
        }
        .sebi-disclaimer-header {
            flex-direction: column;
            text-align: center;
        }
        .sebi-disclaimer-container {
            padding: 25px 20px;
        }
        .sebi-disclaimer-title {
            font-size: 1.15rem;
        }
    }
    
    @media (max-width: 480px) {
        .sebi-disclaimer-badges {
            grid-template-columns: 1fr;
        }
        .sebi-disclaimer-content p {
            font-size: 0.9rem;
        }
    }
    
    /* Existing Footer Styles */
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
        // Remove ALL existing footers to prevent duplicates
        const existingFooters = document.querySelectorAll('footer, .footer, .article-footer, .bro-footer');
        existingFooters.forEach(footer => footer.remove());

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
