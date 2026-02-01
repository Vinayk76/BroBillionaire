/**
 * BroBillionaire - Enhanced Social Sharing System
 * Adds floating share buttons to all articles for maximum viral potential
 * 
 * HOW BACKLINKS WORK:
 * - Every share = potential for someone to link back
 * - Easy sharing = more shares = more backlinks
 */

(function() {
    'use strict';

    // Only run on article pages
    if (!window.location.pathname.includes('article-')) return;

    // Get article metadata
    const getArticleData = () => {
        const title = document.querySelector('meta[property="og:title"]')?.content || 
                      document.querySelector('title')?.textContent || 
                      'BroBillionaire Article';
        const description = document.querySelector('meta[name="description"]')?.content || 
                           document.querySelector('meta[property="og:description"]')?.content || 
                           'Free trading education from BroBillionaire';
        const url = window.location.href;
        const image = document.querySelector('meta[property="og:image"]')?.content || 
                      'https://brobillionaire.com/og-image.jpg';
        
        return { title, description, url, image };
    };

    // Share URLs for different platforms
    const getShareUrls = (data) => ({
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(data.title)}&url=${encodeURIComponent(data.url)}&via=brobillionaire`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.url)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(data.url)}`,
        whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(data.title + ' ' + data.url)}`,
        telegram: `https://t.me/share/url?url=${encodeURIComponent(data.url)}&text=${encodeURIComponent(data.title)}`,
        reddit: `https://reddit.com/submit?url=${encodeURIComponent(data.url)}&title=${encodeURIComponent(data.title)}`,
        email: `mailto:?subject=${encodeURIComponent(data.title)}&body=${encodeURIComponent(data.description + '\n\nRead more: ' + data.url)}`,
        copy: data.url
    });

    // Create floating share bar
    const createFloatingShareBar = () => {
        const data = getArticleData();
        const urls = getShareUrls(data);

        const shareBar = document.createElement('div');
        shareBar.id = 'bro-share-bar';
        shareBar.innerHTML = `
            <style>
                #bro-share-bar {
                    position: fixed;
                    left: 20px;
                    top: 50%;
                    transform: translateY(-50%);
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    z-index: 9999;
                    transition: opacity 0.3s, transform 0.3s;
                }
                #bro-share-bar.hidden {
                    opacity: 0;
                    transform: translateY(-50%) translateX(-100px);
                    pointer-events: none;
                }
                #bro-share-bar .share-btn {
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    text-decoration: none;
                    font-size: 18px;
                    transition: transform 0.2s, box-shadow 0.2s;
                    cursor: pointer;
                    border: none;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                }
                #bro-share-bar .share-btn:hover {
                    transform: scale(1.15);
                    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                }
                #bro-share-bar .share-btn.twitter { background: linear-gradient(135deg, #1DA1F2, #0d8ecf); }
                #bro-share-bar .share-btn.facebook { background: linear-gradient(135deg, #4267B2, #365899); }
                #bro-share-bar .share-btn.linkedin { background: linear-gradient(135deg, #0077B5, #005885); }
                #bro-share-bar .share-btn.whatsapp { background: linear-gradient(135deg, #25D366, #128C7E); }
                #bro-share-bar .share-btn.telegram { background: linear-gradient(135deg, #0088cc, #006699); }
                #bro-share-bar .share-btn.reddit { background: linear-gradient(135deg, #FF5700, #cc4500); }
                #bro-share-bar .share-btn.email { background: linear-gradient(135deg, #C9A227, #a68820); }
                #bro-share-bar .share-btn.copy { background: linear-gradient(135deg, #6c757d, #545b62); }
                
                #bro-share-bar .share-label {
                    writing-mode: vertical-rl;
                    text-orientation: mixed;
                    font-size: 11px;
                    color: #888;
                    font-weight: 600;
                    margin-bottom: 8px;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                }
                
                #bro-share-bar .copy-tooltip {
                    position: absolute;
                    left: 55px;
                    background: #1a1a1a;
                    color: #C9A227;
                    padding: 8px 12px;
                    border-radius: 6px;
                    font-size: 12px;
                    white-space: nowrap;
                    opacity: 0;
                    transition: opacity 0.3s;
                    pointer-events: none;
                }
                #bro-share-bar .copy-tooltip.show {
                    opacity: 1;
                }
                
                /* Mobile: Bottom bar */
                @media (max-width: 1200px) {
                    #bro-share-bar {
                        left: 50%;
                        top: auto;
                        bottom: 20px;
                        transform: translateX(-50%);
                        flex-direction: row;
                    }
                    #bro-share-bar.hidden {
                        transform: translateX(-50%) translateY(100px);
                    }
                    #bro-share-bar .share-label {
                        display: none;
                    }
                    #bro-share-bar .share-btn {
                        width: 40px;
                        height: 40px;
                        font-size: 16px;
                    }
                }
                
                @media (max-width: 600px) {
                    #bro-share-bar .share-btn {
                        width: 36px;
                        height: 36px;
                        font-size: 14px;
                    }
                    #bro-share-bar {
                        gap: 6px;
                        bottom: 15px;
                    }
                }
            </style>
            
            <span class="share-label">SHARE</span>
            
            <a href="${urls.twitter}" target="_blank" rel="noopener" class="share-btn twitter" title="Share on Twitter/X">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="${urls.reddit}" target="_blank" rel="noopener" class="share-btn reddit" title="Share on Reddit">
                <i class="fab fa-reddit-alien"></i>
            </a>
            <a href="${urls.linkedin}" target="_blank" rel="noopener" class="share-btn linkedin" title="Share on LinkedIn">
                <i class="fab fa-linkedin-in"></i>
            </a>
            <a href="${urls.whatsapp}" target="_blank" rel="noopener" class="share-btn whatsapp" title="Share on WhatsApp">
                <i class="fab fa-whatsapp"></i>
            </a>
            <a href="${urls.telegram}" target="_blank" rel="noopener" class="share-btn telegram" title="Share on Telegram">
                <i class="fab fa-telegram-plane"></i>
            </a>
            <a href="${urls.facebook}" target="_blank" rel="noopener" class="share-btn facebook" title="Share on Facebook">
                <i class="fab fa-facebook-f"></i>
            </a>
            <button class="share-btn copy" onclick="copyLink()" title="Copy Link">
                <i class="fas fa-link"></i>
                <span class="copy-tooltip">Link copied!</span>
            </button>
        `;

        document.body.appendChild(shareBar);

        // Show/hide based on scroll
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;
            const scrollPercent = (currentScroll / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            
            // Show after scrolling 10%, hide at bottom
            if (scrollPercent > 10 && scrollPercent < 95) {
                shareBar.classList.remove('hidden');
            } else {
                shareBar.classList.add('hidden');
            }
            lastScroll = currentScroll;
        });

        // Start hidden
        shareBar.classList.add('hidden');
    };

    // Copy link function
    window.copyLink = function() {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            const tooltip = document.querySelector('#bro-share-bar .copy-tooltip');
            if (tooltip) {
                tooltip.classList.add('show');
                setTimeout(() => tooltip.classList.remove('show'), 2000);
            }
        });
    };

    // Create inline share section at article end
    const createInlineShareSection = () => {
        const data = getArticleData();
        const urls = getShareUrls(data);

        const articleContent = document.querySelector('.article-content, .article-body, main, article');
        if (!articleContent) return;

        const shareSection = document.createElement('div');
        shareSection.className = 'bro-inline-share';
        shareSection.innerHTML = `
            <style>
                .bro-inline-share {
                    background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%);
                    border: 1px solid rgba(201, 162, 39, 0.3);
                    border-radius: 16px;
                    padding: 30px;
                    margin: 40px 0;
                    text-align: center;
                }
                .bro-inline-share h3 {
                    color: #C9A227;
                    font-size: 1.5rem;
                    margin-bottom: 10px;
                }
                .bro-inline-share p {
                    color: #aaa;
                    margin-bottom: 20px;
                }
                .bro-inline-share .share-buttons {
                    display: flex;
                    justify-content: center;
                    flex-wrap: wrap;
                    gap: 12px;
                }
                .bro-inline-share .share-button {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 20px;
                    border-radius: 8px;
                    color: white;
                    text-decoration: none;
                    font-weight: 600;
                    font-size: 14px;
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                .bro-inline-share .share-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 20px rgba(0,0,0,0.3);
                }
                .bro-inline-share .share-button.twitter { background: #1DA1F2; }
                .bro-inline-share .share-button.reddit { background: #FF5700; }
                .bro-inline-share .share-button.whatsapp { background: #25D366; }
                .bro-inline-share .share-button.telegram { background: #0088cc; }
            </style>
            
            <h3>📢 Found This Valuable?</h3>
            <p>Share with fellow traders and help them level up!</p>
            <div class="share-buttons">
                <a href="${urls.twitter}" target="_blank" rel="noopener" class="share-button twitter">
                    <i class="fab fa-x-twitter"></i> Tweet This
                </a>
                <a href="${urls.reddit}" target="_blank" rel="noopener" class="share-button reddit">
                    <i class="fab fa-reddit-alien"></i> Post on Reddit
                </a>
                <a href="${urls.whatsapp}" target="_blank" rel="noopener" class="share-button whatsapp">
                    <i class="fab fa-whatsapp"></i> WhatsApp
                </a>
                <a href="${urls.telegram}" target="_blank" rel="noopener" class="share-button telegram">
                    <i class="fab fa-telegram-plane"></i> Telegram
                </a>
            </div>
        `;

        // Insert before footer or at end of article
        const footer = document.querySelector('footer, .article-footer');
        if (footer) {
            footer.parentNode.insertBefore(shareSection, footer);
        } else {
            articleContent.appendChild(shareSection);
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        createFloatingShareBar();
        createInlineShareSection();
    }

})();
