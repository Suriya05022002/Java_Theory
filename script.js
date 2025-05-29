// ===== COMPLETE JAVASCRIPT WITH FIXED HAMBURGER MENU =====

// ===== NAVIGATION MANAGER CLASS =====
class NavigationManager {
    constructor() {
        this.hamburger = document.getElementById('hamburger') || document.querySelector('.hamburger');
        this.sidebar = document.getElementById('sidebar');
        this.navLinks = document.getElementById('navLinks');
        this.mobileOverlay = null;
        this.isMenuOpen = false;
        this.isInitialized = false;
        
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        this.createMobileOverlay();
        this.bindEvents();
        this.handleResize();
        this.initializeAccessibility();
        this.isInitialized = true;
        
        console.log('Navigation Manager initialized successfully');
    }

    createMobileOverlay() {
        this.mobileOverlay = document.createElement('div');
        this.mobileOverlay.className = 'mobile-overlay';
        this.mobileOverlay.id = 'mobileOverlay';
        document.body.appendChild(this.mobileOverlay);
    }

    bindEvents() {
        // Hamburger click event
        if (this.hamburger) {
            this.hamburger.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleMenu();
            });
        }

        // Mobile overlay click event
        if (this.mobileOverlay) {
            this.mobileOverlay.addEventListener('click', () => {
                this.closeMenu();
            });
        }

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && !this.isClickInsideMenu(e.target)) {
                this.closeMenu();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMenu();
            }
        });

        // Prevent menu close when clicking inside sidebar
        if (this.sidebar) {
            this.sidebar.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        // Handle sidebar link clicks on mobile
        if (this.sidebar) {
            const sidebarLinks = this.sidebar.querySelectorAll('a');
            sidebarLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (window.innerWidth <= 768) {
                        this.closeMenu();
                    }
                });
            });
        }
    }

    toggleMenu() {
        if (this.isMenuOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        this.isMenuOpen = true;
        
        if (this.hamburger) {
            this.hamburger.classList.add('active');
            this.hamburger.setAttribute('aria-expanded', 'true');
        }
        
        if (this.sidebar) {
            this.sidebar.classList.add('active');
        }

        if (this.mobileOverlay) {
            this.mobileOverlay.classList.add('active');
        }
        
        // Prevent body scroll on mobile
        if (window.innerWidth <= 768) {
            document.body.style.overflow = 'hidden';
        }
        
        // Focus management
        this.trapFocus();
        
        console.log('Menu opened');
    }

    closeMenu() {
        this.isMenuOpen = false;
        
        if (this.hamburger) {
            this.hamburger.classList.remove('active');
            this.hamburger.setAttribute('aria-expanded', 'false');
        }
        
        if (this.sidebar) {
            this.sidebar.classList.remove('active');
        }

        if (this.mobileOverlay) {
            this.mobileOverlay.classList.remove('active');
        }
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        console.log('Menu closed');
    }

    isClickInsideMenu(target) {
        return this.sidebar?.contains(target) || 
               this.hamburger?.contains(target) ||
               target.closest('.topnav');
    }

    handleResize() {
        // Close mobile menu on desktop
        if (window.innerWidth > 768 && this.isMenuOpen) {
            this.closeMenu();
        }
    }

    initializeAccessibility() {
        if (this.hamburger) {
            this.hamburger.setAttribute('aria-expanded', 'false');
            this.hamburger.setAttribute('aria-controls', 'sidebar');
            
            if (!this.hamburger.getAttribute('aria-label')) {
                this.hamburger.setAttribute('aria-label', 'Toggle navigation menu');
            }
        }

        if (this.sidebar) {
            this.sidebar.setAttribute('aria-hidden', 'true');
        }
    }

    trapFocus() {
        if (!this.sidebar || window.innerWidth > 768) return;

        const focusableElements = this.sidebar.querySelectorAll(
            'a, button, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
    }
}

// ===== COPY CODE FUNCTIONALITY =====
function copyCode(button) {
    const codeBlock = button.closest('.code-container').querySelector('pre code');
    const text = codeBlock.textContent;

    navigator.clipboard.writeText(text).then(() => {
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.style.background = 'var(--success)';

        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = 'var(--primary-blue)';
        }, 2000);
    }).catch((err) => {
        console.error('Failed to copy code: ', err);
        button.textContent = 'Copy Failed';
        setTimeout(() => {
            button.textContent = 'Copy';
        }, 2000);
    });
}

// ===== SOLUTION TOGGLE FUNCTIONALITY =====
function toggleSolution(solutionId) {
    const solution = document.getElementById(solutionId);
    const button = event.target;

    if (solution.style.display === 'none' || solution.style.display === '') {
        solution.style.display = 'block';
        button.textContent = 'Hide Solution';
        button.classList.remove('btn-secondary');
        button.classList.add('btn-success');
    } else {
        solution.style.display = 'none';
        button.textContent = 'Show Solution';
        button.classList.remove('btn-success');
        button.classList.add('btn-secondary');
    }
}

// ===== SMOOTH SCROLLING FOR ANCHOR LINKS =====
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach((link) => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth',
                });
            }
        });
    });
}

// ===== ACTIVE NAVIGATION HIGHLIGHTING =====
function initActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.sidebar a[href^="#"]');

    if (sections.length === 0 || navLinks.length === 0) return;

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;

            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ===== PROGRESS TRACKING =====
function trackProgress() {
    const currentChapter = document.title.match(/Chapter (\d+)/);
    if (currentChapter) {
        const chapterNumber = parseInt(currentChapter[1]);
        const totalChapters = 14;
        const progress = (chapterNumber / totalChapters) * 100;

        localStorage.setItem('javaProgress', progress);
        localStorage.setItem('currentChapter', chapterNumber);
    }
}

// ===== SEARCH FUNCTIONALITY =====
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const searchTerm = this.value.toLowerCase();
            const sections = document.querySelectorAll('section, .program-section, .exercise');

            sections.forEach((section) => {
                const text = section.textContent.toLowerCase();
                if (text.includes(searchTerm) || searchTerm === '') {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }
            });
        });
    }
}

// ===== THEME TOGGLE =====
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            localStorage.setItem('darkTheme', isDark);

            this.textContent = isDark ? '☀️' : '🌙';
        });

        // Load saved theme
        const savedTheme = localStorage.getItem('darkTheme');
        if (savedTheme === 'true') {
            document.body.classList.add('dark-theme');
            themeToggle.textContent = '☀️';
        }
    }
}

// ===== KEYBOARD SHORTCUTS =====
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.focus();
            }
        }

        // Ctrl/Cmd + M for menu toggle
        if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
            e.preventDefault();
            const hamburger = document.getElementById('hamburger');
            if (hamburger) {
                hamburger.click();
            }
        }
    });
}

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.module-card, .benefit-item, .type-card, .class-card, .practice-item, .timeline-item'
    );
    
    animatedElements.forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ===== PERFORMANCE OPTIMIZATION =====
function optimizeImages() {
    const images = document.querySelectorAll('img');
    images.forEach((img) => {
        img.loading = 'lazy';
    });
}

// ===== ACCESSIBILITY IMPROVEMENTS =====
function improveAccessibility() {
    // Add skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link sr-only';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-blue);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1000;
        transition: top 0.3s;
    `;

    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
        skipLink.classList.remove('sr-only');
    });

    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
        skipLink.classList.add('sr-only');
    });

    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add main landmark
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.setAttribute('id', 'main-content');
        mainContent.setAttribute('role', 'main');
    }
}

// ===== PAGE TRANSITION =====
function showPageTransition() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease-in-out';

    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
}

// ===== LEGACY TOGGLE FUNCTION FOR BACKWARD COMPATIBILITY =====
function toggleNav() {
    const hamburger = document.getElementById('hamburger') || document.querySelector('.hamburger');
    if (hamburger) {
        hamburger.click();
    }
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;

        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize navigation manager (handles hamburger menu)
    const navigationManager = new NavigationManager();

    // Initialize all other functionality
    initSmoothScrolling();
    initActiveNavigation();
    trackProgress();
    initSearch();
    initThemeToggle();
    initKeyboardShortcuts();
    initAnimations();
    optimizeImages();
    improveAccessibility();
    showPageTransition();

    // Add copy buttons functionality
    const codeContainers = document.querySelectorAll('.code-container');
    codeContainers.forEach((container) => {
        const copyBtn = container.querySelector('.copy-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', function () {
                copyCode(this);
            });
        }
    });

    console.log('Java Tutorial website initialized successfully!');
});

// ===== SERVICE WORKER REGISTRATION (for offline support) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/sw.js')
            .then((registration) => {
                console.log('ServiceWorker registration successful');
            })
            .catch((err) => {
                console.log('ServiceWorker registration failed');
            });
    });
}

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
});

// ===== EXPORT FUNCTIONS FOR GLOBAL ACCESS =====
window.JavaTutorial = {
    toggleNav,
    copyCode,
    toggleSolution,
    trackProgress,
    NavigationManager
};

// ===== SCROLLABLE NAVIGATION ENHANCEMENT =====
class ScrollableNavbar {
    constructor() {
        this.navbar = document.querySelector('.topnav');
        this.navLinks = document.querySelector('.nav-links');
        this.init();
    }

    init() {
        if (!this.navLinks) return;
        
        this.bindEvents();
        this.updateActiveLink();
    }

    bindEvents() {
        // Window scroll events
        window.addEventListener('scroll', () => this.handleWindowScroll());

        // Keyboard navigation
        this.navLinks.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Auto-scroll to active link
        this.scrollToActiveLink();
    }

    handleWindowScroll() {
        // Add scrolled class to navbar
        if (window.scrollY > 50) {
            this.navbar?.classList.add('scrolled');
        } else {
            this.navbar?.classList.remove('scrolled');
        }

        // Update active link based on scroll position
        this.updateActiveLink();
    }

    updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}` || 
                link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    }

    scrollToActiveLink() {
        const activeLink = document.querySelector('.nav-links a.active');
        if (activeLink) {
            activeLink.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    }

    handleKeyboard(e) {
        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.navLinks.scrollBy({ left: -100, behavior: 'smooth' });
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.navLinks.scrollBy({ left: 100, behavior: 'smooth' });
                break;
            case 'Home':
                e.preventDefault();
                this.navLinks.scrollTo({ left: 0, behavior: 'smooth' });
                break;
            case 'End':
                e.preventDefault();
                this.navLinks.scrollTo({ 
                    left: this.navLinks.scrollWidth, 
                    behavior: 'smooth' 
                });
                break;
        }
    }
}

// Initialize scrollable navbar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ScrollableNavbar();
});

