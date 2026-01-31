// ============================================
// BROBILLIONAIRE - Premium JavaScript
// Elegant Interactions & Animations
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initLoadingScreen();
    initNavbar();
    initScrollAnimations();
    initChartAnimation();
    initSmoothScroll();
    initFormInteractions();
    initButtonActions();
    initMoneyKillersCounter();
    initTimelineBarsAnimation();
    initBackToTop();
});

// ============================================
// LOADING SCREEN
// ============================================
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
            }, 2200);
        });
        // Fallback if load event already fired
        if (document.readyState === 'complete') {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
            }, 2200);
        }
    }
}

// ============================================
// BACK TO TOP BUTTON
// ============================================
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    const progressBar = document.querySelector('.progress-bar');
    
    if (backToTop) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            // Show/hide button
            if (scrollTop > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
            
            // Update progress ring
            if (progressBar) {
                const offset = 100 - scrollPercent;
                progressBar.style.strokeDashoffset = offset;
            }
        });
        
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ============================================
// TRADING CALCULATOR
// ============================================
function initTradingCalculator() {
    const calcToggle = document.getElementById('calcToggle');
    const calcPanel = document.getElementById('calcPanel');
    const calcClose = document.getElementById('calcClose');
    const calculateBtn = document.getElementById('calculateBtn');
    
    if (calcToggle && calcPanel) {
        calcToggle.addEventListener('click', () => {
            calcPanel.classList.toggle('active');
        });
        
        calcClose?.addEventListener('click', () => {
            calcPanel.classList.remove('active');
        });
        
        calculateBtn?.addEventListener('click', () => {
            calculatePosition();
        });
        
        // Calculate on input change
        const inputs = calcPanel.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', calculatePosition);
        });
    }
}

function calculatePosition() {
    const balance = parseFloat(document.getElementById('accountBalance')?.value) || 0;
    const riskPercent = parseFloat(document.getElementById('riskPercent')?.value) || 0;
    const entryPrice = parseFloat(document.getElementById('entryPrice')?.value) || 0;
    const stopLoss = parseFloat(document.getElementById('stopLoss')?.value) || 0;
    
    const riskAmount = (balance * riskPercent) / 100;
    const riskPerShare = Math.abs(entryPrice - stopLoss);
    const positionSize = riskPerShare > 0 ? Math.floor(riskAmount / riskPerShare) : 0;
    const positionValue = positionSize * entryPrice;
    
    document.getElementById('riskAmount').textContent = `$${riskAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    document.getElementById('positionSize').textContent = `${positionSize} shares`;
    document.getElementById('positionValue').textContent = `$${positionValue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
}

// ============================================
// MARKET CLOCK
// ============================================
function initMarketClock() {
    const clockTime = document.getElementById('clockTime');
    const nyseStatus = document.getElementById('nyseStatus');
    const cryptoStatus = document.getElementById('cryptoStatus');
    
    function updateClock() {
        const now = new Date();
        const estTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
        
        const hours = estTime.getHours().toString().padStart(2, '0');
        const minutes = estTime.getMinutes().toString().padStart(2, '0');
        const seconds = estTime.getSeconds().toString().padStart(2, '0');
        
        if (clockTime) {
            clockTime.textContent = `${hours}:${minutes}:${seconds}`;
        }
        
        // Check NYSE hours (9:30 AM - 4:00 PM EST, Monday-Friday)
        const day = estTime.getDay();
        const hour = estTime.getHours();
        const minute = estTime.getMinutes();
        const timeNum = hour * 100 + minute;
        
        const isWeekday = day >= 1 && day <= 5;
        const isMarketHours = timeNum >= 930 && timeNum < 1600;
        
        if (nyseStatus) {
            if (isWeekday && isMarketHours) {
                nyseStatus.classList.add('open');
            } else {
                nyseStatus.classList.remove('open');
            }
        }
        
        // Crypto is always open
        if (cryptoStatus) {
            cryptoStatus.classList.add('open');
        }
    }
    
    updateClock();
    setInterval(updateClock, 1000);
}

// ============================================
// KEYBOARD SHORTCUTS
// ============================================
function initKeyboardShortcuts() {
    const shortcutsModal = document.getElementById('shortcutsModal');
    const shortcutsClose = document.getElementById('shortcutsClose');
    
    document.addEventListener('keydown', (e) => {
        // Don't trigger shortcuts when typing in inputs
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
            return;
        }
        
        switch(e.key.toLowerCase()) {
            case 'h':
                scrollToSection('#home');
                break;
            case 'i':
                scrollToSection('#insights');
                break;
            case 'p':
                scrollToSection('#philosophy');
                break;
            case 'j':
                scrollToSection('#leadership');
                break;
            case 'c':
                document.getElementById('calcPanel')?.classList.toggle('active');
                break;
            case 't':
                document.body.classList.toggle('light-mode');
                localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
                break;
            case '?':
                shortcutsModal?.classList.toggle('active');
                break;
            case 'escape':
                shortcutsModal?.classList.remove('active');
                document.getElementById('calcPanel')?.classList.remove('active');
                document.getElementById('easterEgg')?.classList.remove('active');
                break;
        }
    });
    
    shortcutsClose?.addEventListener('click', () => {
        shortcutsModal?.classList.remove('active');
    });
    
    shortcutsModal?.addEventListener('click', (e) => {
        if (e.target === shortcutsModal) {
            shortcutsModal.classList.remove('active');
        }
    });
}

// ============================================
// THEME TOGGLE
// ============================================
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    }
    
    themeToggle?.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        
        // Add a little animation feedback
        themeToggle.style.transform = 'scale(1.2) rotate(360deg)';
        setTimeout(() => {
            themeToggle.style.transform = '';
        }, 400);
    });
}

// ============================================
// EASTER EGG - Konami Code
// ============================================
function initEasterEgg() {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    
    const easterEgg = document.getElementById('easterEgg');
    const closeCelebration = document.getElementById('closeCelebration');
    const moneyRain = document.querySelector('.money-rain');
    
    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            
            if (konamiIndex === konamiCode.length) {
                triggerCelebration();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
    
    function triggerCelebration() {
        easterEgg?.classList.add('active');
        
        // Create money rain
        if (moneyRain) {
            const emojis = ['💰', '💵', '💸', '🤑', '💎', '📈', '🚀', '⭐'];
            for (let i = 0; i < 50; i++) {
                setTimeout(() => {
                    const emoji = document.createElement('span');
                    emoji.className = 'money-emoji';
                    emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                    emoji.style.left = Math.random() * 100 + '%';
                    emoji.style.animationDuration = (2 + Math.random() * 2) + 's';
                    emoji.style.fontSize = (1.5 + Math.random() * 1.5) + 'rem';
                    moneyRain.appendChild(emoji);
                    
                    setTimeout(() => emoji.remove(), 4000);
                }, i * 100);
            }
        }
        
        // Play a fun sound effect (if you have one)
        console.log('🎉 Konami Code Activated! You found the Easter Egg!');
    }
    
    closeCelebration?.addEventListener('click', () => {
        easterEgg?.classList.remove('active');
    });
}

// ============================================
// CURSOR TRAIL EFFECT
// ============================================
function initCursorTrail() {
    const canvas = document.getElementById('cursorCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = 0;
    let mouseY = 0;
    let isMoving = false;
    let moveTimeout;
    
    // Resize canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Track mouse
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        isMoving = true;
        
        clearTimeout(moveTimeout);
        moveTimeout = setTimeout(() => {
            isMoving = false;
        }, 100);
        
        // Create particle on move
        if (Math.random() > 0.7) {
            particles.push({
                x: mouseX,
                y: mouseY,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 1.5,
                speedY: (Math.random() - 0.5) * 1.5,
                life: 1,
                color: `hsla(45, 80%, ${50 + Math.random() * 20}%, `
            });
        }
    });
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach((p, index) => {
            p.x += p.speedX;
            p.y += p.speedY;
            p.life -= 0.02;
            p.size *= 0.98;
            
            if (p.life <= 0 || p.size < 0.5) {
                particles.splice(index, 1);
                return;
            }
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color + p.life + ')';
            ctx.fill();
        });
        
        // Limit particles
        if (particles.length > 50) {
            particles = particles.slice(-50);
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// ============================================
// BUTTON ACTIONS - Make all buttons functional
// ============================================
function initButtonActions() {
    // Nav "Read Free" button - scroll to insights
    const navReadFreeBtn = document.querySelector('.navbar .cta-btn.gold-btn');
    if (navReadFreeBtn) {
        navReadFreeBtn.addEventListener('click', () => {
            scrollToSection('#insights');
        });
    }

    // Hero buttons
    const heroButtons = document.querySelectorAll('.hero-buttons .cta-btn');
    heroButtons.forEach(btn => {
        const text = btn.textContent.toLowerCase();
        if (text.includes('start learning')) {
            btn.addEventListener('click', () => {
                scrollToSection('#insights');
            });
        } else if (text.includes('philosophy')) {
            btn.addEventListener('click', () => {
                scrollToSection('#philosophy');
            });
        }
    });

    // "Start Your Journey" button in journey section
    const journeyBtn = document.querySelector('.journey-cta .cta-btn');
    if (journeyBtn) {
        journeyBtn.addEventListener('click', () => {
            scrollToSection('#insights');
        });
    }

    // Scroll indicator click
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.style.cursor = 'pointer';
        scrollIndicator.addEventListener('click', () => {
            scrollToSection('#insights');
        });
    }

    // "Read Now" article CTA buttons - smooth scroll for anchors, normal navigation for pages
    const articleCtaLinks = document.querySelectorAll('.article-cta');
    articleCtaLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                scrollToSection(href);
            }
            // For non-anchor links (like article pages), allow default navigation
        });
    });

    // Chat button - Coming Soon message
    const chatButton = document.querySelector('.chat-button');
    if (chatButton) {
        chatButton.style.cursor = 'pointer';
        chatButton.addEventListener('click', () => {
            showNotification('🚀 Live Chat with the Greatest Trader of All Time (Powered by AI) is Coming Soon! Stay tuned for wisdom from the legends.', 'info');
        });
    }
}

// Helper function to smoothly scroll to a section
function scrollToSection(selector) {
    const target = document.querySelector(selector);
    if (target) {
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.padding = '15px 0';
            navbar.style.background = 'rgba(13, 13, 13, 0.98)';
        } else {
            navbar.style.padding = '20px 0';
            navbar.style.background = 'rgba(13, 13, 13, 0.9)';
        }
        
        // Update active nav link
        let current = '';
        document.querySelectorAll('section[id]').forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
                link.style.color = '#C9A227';
            } else {
                link.style.color = '';
            }
        });
    });
    
    // Mobile menu
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinksContainer = document.querySelector('.nav-links');
    
    mobileMenu?.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        navLinksContainer.classList.toggle('mobile-open');
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu?.classList.remove('active');
            navLinksContainer?.classList.remove('mobile-open');
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenu?.contains(e.target) && !navLinksContainer?.contains(e.target)) {
            mobileMenu?.classList.remove('active');
            navLinksContainer?.classList.remove('mobile-open');
        }
    });
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Add animation classes
    const animatedElements = [
        '.story-showcase',
        '.story-chapter',
        '.philosophy-card',
        '.pattern-card',
        '.team-card',
        '.quote-card',
        '.rule-card',
        '.wave-type',
        '.fib-item',
        '.daily-article-card'
    ];
    
    animatedElements.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `all 0.6s ease ${index * 0.1}s`;
            observer.observe(el);
        });
    });
    
    // Observer callback for animations
    const animateInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            animateInObserver.observe(el);
        });
    });
    
    // Animate hero content on load
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.animation = 'fadeInUp 1s ease forwards';
    }
}

// ============================================
// CHART ANIMATION
// ============================================
function initChartAnimation() {
    const chartLine = document.querySelector('.chart-line');
    const elliottWaveLine = document.querySelector('.wave-line');
    
    const chartObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'none';
                entry.target.offsetHeight; // Trigger reflow
                entry.target.style.animation = 'drawChart 3s ease forwards';
            }
        });
    }, { threshold: 0.3 });
    
    if (chartLine) {
        chartObserver.observe(chartLine);
    }
    
    const waveObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'none';
                entry.target.offsetHeight;
                entry.target.style.animation = 'drawWave 3s ease forwards';
            }
        });
    }, { threshold: 0.3 });
    
    if (elliottWaveLine) {
        waveObserver.observe(elliottWaveLine);
    }
}

// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============================================
// FORM INTERACTIONS
// ============================================
function initFormInteractions() {
    const inputs = document.querySelectorAll('.form-group input, .form-group select');
    
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
        });
    });
    
    // Form submission with MongoDB integration
    const form = document.querySelector('.newsletter-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const button = form.querySelector('button[type="submit"]');
            const originalText = button.innerHTML;
            
            // Get form data
            const formData = {
                firstName: document.getElementById('firstName').value.trim(),
                lastName: document.getElementById('lastName').value.trim(),
                email: document.getElementById('email').value.trim(),
                tradingInterest: document.getElementById('tradingInterest').value,
                experienceLevel: document.getElementById('experienceLevel').value
            };

            // Validate form data
            if (!formData.firstName || !formData.lastName || !formData.email || 
                !formData.tradingInterest || !formData.experienceLevel) {
                showNotification('Please fill in all fields', 'error');
                return;
            }

            button.innerHTML = '<span>Subscribing...</span>';
            button.disabled = true;

            try {
                // Send data to backend API
                const response = await fetch('/api/subscribe', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    button.innerHTML = '<span>✓ Subscribed!</span>';
                    button.style.background = '#4ade80';
                    showNotification('Successfully subscribed to BroBillionaire!', 'success');
                    
                    setTimeout(() => {
                        button.innerHTML = originalText;
                        button.style.background = '';
                        button.disabled = false;
                        form.reset();
                    }, 2000);
                } else {
                    throw new Error(result.message || 'Subscription failed');
                }
            } catch (error) {
                console.error('Subscription error:', error);
                button.innerHTML = '<span>✗ Failed</span>';
                button.style.background = '#ef4444';
                showNotification(error.message || 'Subscription failed. Please try again.', 'error');
                
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.style.background = '';
                    button.disabled = false;
                }, 2000);
            }
        });
    }
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================
function showNotification(message, type = 'info') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 10px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' : 
                      type === 'error' ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 
                      'linear-gradient(135deg, #3b82f6, #2563eb)'};
        color: white;
        font-weight: 500;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        display: flex;
        align-items: center;
        gap: 10px;
    `;

    // Add animation keyframes if not already added
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// ============================================
// BUTTON HOVER EFFECTS
// ============================================
document.querySelectorAll('.cta-btn').forEach(button => {
    button.addEventListener('mouseenter', function(e) {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: translate(-50%, -50%);
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        ripple.animate([
            { width: '0px', height: '0px', opacity: 0.5 },
            { width: '300px', height: '300px', opacity: 0 }
        ], {
            duration: 600,
            easing: 'ease-out'
        }).onfinish = () => ripple.remove();
    });
});

// ============================================
// CARD HOVER EFFECTS
// ============================================
document.querySelectorAll('.philosophy-card, .pattern-card, .team-card, .quote-card, .story-point, .rule-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// ============================================
// TICKER ANIMATION
// ============================================
function animateTickers() {
    const tickers = document.querySelectorAll('.ticker-badge');
    
    tickers.forEach((ticker, index) => {
        const value = ticker.querySelector('.ticker-value');
        if (value) {
            // Store original text and check if it contains a parseable number
            const originalText = value.textContent;
            const numericMatch = originalText.match(/-?\d+(\.\d+)?/);
            
            // Only animate if we can extract a valid number
            if (numericMatch) {
                let baseValue = parseFloat(numericMatch[0]);
                setInterval(() => {
                    const change = (Math.random() - 0.5) * 2;
                    baseValue = baseValue + change;
                    // Keep the original format style
                    if (originalText.includes('%')) {
                        value.textContent = `${baseValue.toFixed(0)}% Traders Fail`;
                    } else if (originalText.includes('$')) {
                        value.textContent = `-$${Math.abs(baseValue).toFixed(0)}K Avg Loss`;
                    } else {
                        value.textContent = originalText;
                    }
                }, 3000 + index * 1000);
            }
        }
    });
}

animateTickers();

// ============================================
// FLOATING DOTS PARALLAX
// ============================================
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const dots = document.querySelectorAll('.dot');
    
    dots.forEach((dot, index) => {
        const speed = (index + 1) * 0.02;
        dot.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ============================================
// CHAT BUTTON
// ============================================
const chatButton = document.querySelector('.chat-button');
if (chatButton) {
    chatButton.addEventListener('click', () => {
        alert('Chat feature coming soon! Contact us at brobillionaire1@gmail.com');
    });
}

// ============================================
// MONEY KILLERS - Animated Counter
// ============================================
function initMoneyKillersCounter() {
    const counterElements = document.querySelectorAll('.stat-number-huge');
    if (counterElements.length === 0) return;
    
    counterElements.forEach(counterElement => {
        const targetValue = parseInt(counterElement.getAttribute('data-target') || 89);
        let hasAnimated = false;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimated) {
                    hasAnimated = true;
                    animateCounter(counterElement, 0, targetValue, 2000);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(counterElement);
    });
}

function animateCounter(element, start, end, duration) {
    const startTime = performance.now();
    const isLargeNumber = end >= 1000;
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(start + (end - start) * easeOutQuart);
        
        // Format large numbers with commas (Indian style for ₹)
        if (isLargeNumber) {
            element.textContent = currentValue.toLocaleString('en-IN');
        } else {
            element.textContent = currentValue;
        }
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            if (isLargeNumber) {
                element.textContent = end.toLocaleString('en-IN');
            } else {
                element.textContent = end;
            }
        }
    }
    
    requestAnimationFrame(update);
}

// Money Killers counter is initialized in main DOMContentLoaded

// Animate timeline bars on scroll
function initTimelineBarsAnimation() {
    // Legacy timeline bars
    const timelineBars = document.querySelectorAll('.timeline-bar');
    if (timelineBars.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.transform = 'scaleX(1)';
                        entry.target.style.opacity = '1';
                    }, index * 150);
                }
            });
        }, { threshold: 0.3 });
        
        timelineBars.forEach(bar => {
            bar.style.transform = 'scaleX(0)';
            bar.style.transformOrigin = 'left';
            bar.style.opacity = '0';
            bar.style.transition = 'transform 0.8s ease-out, opacity 0.5s ease';
            observer.observe(bar);
        });
    }
    
    // Premium Death Timeline Animation
    const deathTimeline = document.querySelector('.death-timeline-premium');
    if (deathTimeline) {
        const deathBars = deathTimeline.querySelectorAll('.death-bar-row');
        const deathFills = deathTimeline.querySelectorAll('.death-bar-fill');
        
        // Reset initial states
        deathBars.forEach(bar => {
            bar.style.opacity = '0';
            bar.style.transform = 'translateX(-30px)';
        });
        
        deathFills.forEach(fill => {
            fill.style.width = '0';
        });
        
        const deathObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate bars appearing
                    deathBars.forEach((bar, index) => {
                        setTimeout(() => {
                            bar.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                            bar.style.opacity = '1';
                            bar.style.transform = 'translateX(0)';
                        }, index * 150);
                    });
                    
                    // Animate bar fills
                    deathFills.forEach((fill, index) => {
                        setTimeout(() => {
                            const width = fill.style.getPropertyValue('--fill-width');
                            fill.style.transition = 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
                            fill.style.width = width;
                        }, 300 + index * 150);
                    });
                    
                    deathObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        deathObserver.observe(deathTimeline);
    }
}

// ============================================
// CONSOLE BRANDING
// ============================================
console.log('%c💰 BroBillionaire', 'font-size: 24px; font-weight: bold; color: #C9A227;');
console.log('%cFree Trading Education', 'font-size: 14px; color: #888;');
console.log('%cMaster the markets with proven strategies.', 'font-size: 12px; color: #666;');
