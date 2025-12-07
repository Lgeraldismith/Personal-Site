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
     * Initialize all functionality
     */
    function init() {
        initNavigation();
        initSmoothScroll();
        updateActiveNav();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
