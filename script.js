/**
 * Dubai Crocodile Park - Campaign Landing Page
 * JavaScript Functionality
 *
 * ELEMENTOR NOTES:
 * - Countdown can be replaced with Elementor Countdown widget
 * - Mobile menu can be handled by Elementor Nav Menu widget
 * - Smooth scroll is native with Elementor links
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initCountdown();
    initMobileMenu();
    initSmoothScroll();
    initHeaderScroll();
});

/**
 * Countdown Timer
 * For campaign end dates - Replace with Elementor Countdown widget
 */
function initCountdown() {
    // Set the campaign end date (adjust as needed)
    const campaignEndDate = new Date();
    campaignEndDate.setDate(campaignEndDate.getDate() + 5); // 5 days from now
    campaignEndDate.setHours(campaignEndDate.getHours() + 12);
    campaignEndDate.setMinutes(campaignEndDate.getMinutes() + 30);

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = campaignEndDate.getTime() - now;

        if (distance < 0) {
            // Campaign ended
            document.querySelectorAll('.countdown-number').forEach(el => {
                el.textContent = '00';
            });
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    // Update immediately and then every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

/**
 * Mobile Menu Toggle
 * Note: In Elementor, use the Nav Menu widget with hamburger settings
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const header = document.querySelector('.header');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        // Close menu when clicking on a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
    }
}

/**
 * Smooth Scroll for anchor links
 * Note: Elementor handles this automatically with Menu Anchor widget
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Header scroll effect
 * Adds shadow/background change on scroll
 */
function initHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

/**
 * Optional: Lazy loading for images
 * Note: Elementor has built-in lazy loading
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

/**
 * Optional: Form validation for newsletter
 */
function initNewsletterForm() {
    const form = document.querySelector('.newsletter-form');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = form.querySelector('input[type="email"]').value;

            if (validateEmail(email)) {
                // Here you would typically send the email to your backend
                alert('Thank you for subscribing!');
                form.reset();
            } else {
                alert('Please enter a valid email address.');
            }
        });
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Optional: Animation on scroll
 * Note: Elementor has Motion Effects for this
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, {
        threshold: 0.1
    });

    animatedElements.forEach(el => observer.observe(el));
}
