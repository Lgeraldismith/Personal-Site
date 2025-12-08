/**
 * ENC1136 Portfolio - Main JavaScript
 * Handles navigation toggle and accessibility features
 */

(function() {
    'use strict';

    // DOM Elements
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    /**
     * Initialize mobile navigation toggle
     */
    function initNavigation() {
        if (!navToggle || !navMenu) return;

        navToggle.addEventListener('click', toggleMenu);

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                closeMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMenu();
                navToggle.focus();
            }
        });

        // Handle focus trap in mobile menu
        navMenu.addEventListener('keydown', handleMenuKeydown);
    }

    /**
     * Toggle the mobile menu
     */
    function toggleMenu() {
        const isOpen = navMenu.classList.contains('active');

        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    /**
     * Open the mobile menu
     */
    function openMenu() {
        navMenu.classList.add('active');
        navToggle.setAttribute('aria-expanded', 'true');

        // Focus first menu item
        const firstLink = navMenu.querySelector('.nav-link');
        if (firstLink) {
            firstLink.focus();
        }
    }

    /**
     * Close the mobile menu
     */
    function closeMenu() {
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
    }

    /**
     * Handle keyboard navigation within the menu
     */
    function handleMenuKeydown(e) {
        const menuLinks = navMenu.querySelectorAll('.nav-link');
        const firstLink = menuLinks[0];
        const lastLink = menuLinks[menuLinks.length - 1];

        // Tab trap
        if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === firstLink) {
                e.preventDefault();
                lastLink.focus();
            } else if (!e.shiftKey && document.activeElement === lastLink) {
                e.preventDefault();
                firstLink.focus();
            }
        }
    }

    /**
     * Add smooth scroll behavior for anchor links
     */
    function initSmoothScroll() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');

        anchorLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });

                    // Set focus on target for accessibility
                    targetElement.setAttribute('tabindex', '-1');
                    targetElement.focus();
                }
            });
        });
    }

    /**
     * Handle active navigation state
     */
    function updateActiveNav() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(function(link) {
            const href = link.getAttribute('href');
            const isActive = currentPath.endsWith(href) ||
                            (currentPath === '/' && href === 'index.html') ||
                            (currentPath.endsWith('/') && href === 'index.html');

            if (isActive) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            } else {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
            }
        });
    }

    /**
     * Initialize dark mode toggle
     */
    function initDarkMode() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (!themeToggle) return;

        // Check for saved preference or system preference
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }

        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);

            // Update button aria-label
            const label = newTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
            themeToggle.setAttribute('aria-label', label);
        });
    }

    /**
     * Initialize lightbox gallery
     */
    function initLightbox() {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxClose = document.querySelector('.lightbox-close');
        const galleryImages = document.querySelectorAll('.gallery-item img');

        if (!lightbox || !galleryImages.length) return;

        // Open lightbox on image click
        galleryImages.forEach(function(img) {
            img.addEventListener('click', function() {
                lightboxImg.src = this.src;
                lightboxImg.alt = this.alt;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
                lightboxClose.focus();
            });

            // Also open on Enter key
            img.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    lightboxImg.src = this.src;
                    lightboxImg.alt = this.alt;
                    lightbox.classList.add('active');
                    document.body.style.overflow = 'hidden';
                    lightboxClose.focus();
                }
            });
        });

        // Close lightbox
        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }

        lightboxClose.addEventListener('click', closeLightbox);

        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }

    /**
     * Initialize all functionality
     */
    function init() {
        initNavigation();
        initSmoothScroll();
        updateActiveNav();
        initDarkMode();
        initLightbox();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
