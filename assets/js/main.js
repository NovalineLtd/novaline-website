/* ============================================
   NOVALINE - main.js
   ============================================ */

/**
 * DOM Ready
 */
const ready = (fn) => {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
};

/**
 * Selectors
 */
const $ = (sel, parent = document) => parent.querySelector(sel);
const $$ = (sel, parent = document) => [...parent.querySelectorAll(sel)];

/* --------------------------------------------
   Theme Toggle (Dark/Light Mode)
   -------------------------------------------- */
const initThemeToggle = () => {
    const themeToggle = $('#themeToggle');
    const html = document.documentElement;

    if (!themeToggle) return;

    // Check for saved theme preference or default to light
    const currentTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', currentTheme);

    // Update theme toggle icon
    const updateThemeIcon = (theme) => {
        const icon = themeToggle.querySelector('svg');
        if (theme === 'dark') {
            icon.innerHTML = `
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            `;
        } else {
            icon.innerHTML = `
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            `;
        }
    };

    updateThemeIcon(currentTheme);

    // Toggle theme on click
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
};

/* --------------------------------------------
   Mobile Navigation
   -------------------------------------------- */
const initMobileNav = () => {
    const toggle = $('#mobileToggle');
    const menu = $('#mobileMenu');
    const overlay = $('#mobileOverlay');

    if (!toggle || !menu) return;

    const openMenu = () => {
        toggle.setAttribute('aria-expanded', 'true');
        menu.setAttribute('aria-hidden', 'false');
        if (overlay) overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
        toggle.setAttribute('aria-expanded', 'false');
        menu.setAttribute('aria-hidden', 'true');
        if (overlay) overlay.classList.remove('open');
        document.body.style.overflow = '';
    };

    const toggleMenu = () => {
        const isOpen = toggle.getAttribute('aria-expanded') === 'true';
        isOpen ? closeMenu() : openMenu();
    };

    // Toggle click
    toggle.addEventListener('click', toggleMenu);

    // Close on overlay click
    if (overlay) {
        overlay.addEventListener('click', () => {
            closeMenu();
        });
    }

    // Close on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
            closeMenu();
            toggle.focus();
        }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (toggle.getAttribute('aria-expanded') === 'true' &&
            !menu.contains(e.target) &&
            !toggle.contains(e.target)) {
            closeMenu();
        }
    });

    // Close on resize to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024 && toggle.getAttribute('aria-expanded') === 'true') {
            closeMenu();
        }
    });

    // Close mobile menu when clicking on nav links
    $$('.header__mobile-link', menu).forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });
};

/* --------------------------------------------
   Mobile Dropdown Menus
   -------------------------------------------- */
const initMobileDropdowns = () => {
    const mobileDropdowns = $$('.header__mobile-dropdown');

    mobileDropdowns.forEach(dropdown => {
        const toggle = $('.header__mobile-toggle-btn', dropdown);

        if (!toggle) return;

        toggle.addEventListener('click', () => {
            dropdown.classList.toggle('open');
        });
    });
};

/* --------------------------------------------
   Desktop Dropdown Navigation
   -------------------------------------------- */
const initDesktopDropdowns = () => {
    const dropdowns = $$('.header__item--dropdown');

    dropdowns.forEach(dropdown => {
        const trigger = $('.header__link--dropdown', dropdown);

        if (!trigger) return;

        // Keyboard support
        trigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
                trigger.setAttribute('aria-expanded', !isExpanded);
            }

            if (e.key === 'Escape') {
                trigger.setAttribute('aria-expanded', 'false');
                trigger.focus();
            }
        });

        // Update aria on hover
        dropdown.addEventListener('mouseenter', () => {
            trigger.setAttribute('aria-expanded', 'true');
        });

        dropdown.addEventListener('mouseleave', () => {
            trigger.setAttribute('aria-expanded', 'false');
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.header__item--dropdown')) {
            dropdowns.forEach(dropdown => {
                const trigger = $('.header__link--dropdown', dropdown);
                if (trigger) {
                    trigger.setAttribute('aria-expanded', 'false');
                }
            });
        }
    });
};

/* --------------------------------------------
   Newsletter Form
   -------------------------------------------- */
const initNewsletterForm = () => {
    const form = $('#newsletterForm');
    if (!form) return;

    const input = $('.footer__newsletter-input', form);
    const btn = $('.footer__newsletter-btn', form);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = input.value.trim();

        if (email) {
            // Simulate submission
            const originalText = btn.textContent;
            btn.textContent = 'Subscribed!';
            btn.style.background = '#00B894';
            input.value = '';

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
            }, 2000);
        }
    });
};

/* --------------------------------------------
   Dynamic Year
   -------------------------------------------- */
const initYear = () => {
    const yearEl = $('#year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
};

/* --------------------------------------------
   Smooth Scroll (Anchor Links)
   -------------------------------------------- */
const initSmoothScroll = () => {
    $$('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const target = $(targetId);
            if (!target) return;

            e.preventDefault();

            const header = $('.header');
            const headerHeight = header?.offsetHeight || 0;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Update URL
            history.pushState(null, null, targetId);

            // Focus target for accessibility
            target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });
        });
    });
};

/* --------------------------------------------
   Initialize All
   -------------------------------------------- */
ready(() => {
    initThemeToggle();
    initMobileNav();
    initMobileDropdowns();
    initDesktopDropdowns();
    initNewsletterForm();
    initYear();
    initSmoothScroll();
});