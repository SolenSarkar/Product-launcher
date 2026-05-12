// Smooth scrolling for navigation links (including dropdown)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        // Close mobile menu and dropdowns on link click
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileDropdown = document.getElementById('mobile-services-dropdown');
        if (mobileMenu) mobileMenu.classList.add('hidden');
        if (mobileDropdown) mobileDropdown.classList.add('hidden');
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Mobile menu toggle (closes dropdown too)
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const navbar = document.getElementById('navbar');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    // Close dropdown when toggling main menu
    const mobileDropdown = document.getElementById('mobile-services-dropdown');
    if (mobileDropdown) mobileDropdown.classList.add('hidden');
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-scrolled');
    }
});

// Mobile Services dropdown toggle
function toggleMobileDropdown(e, element) {
    e.preventDefault();
    e.stopPropagation();
    const dropdown = document.getElementById('mobile-services-dropdown');
    const icon = document.getElementById('mobile-services-icon');
    if (dropdown && icon) {
        const isHidden = dropdown.classList.contains('hidden');
        dropdown.classList.toggle('hidden');
        icon.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
    }
}

// Close dropdowns on outside click
document.addEventListener('click', (e) => {
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileDropdown = document.getElementById('mobile-services-dropdown');
    const menuBtn = document.getElementById('mobile-menu-btn');
    if (mobileDropdown && !mobileMenu?.contains(e.target) && !menuBtn?.contains(e.target)) {
        mobileDropdown.classList.add('hidden');
    }
});

// Fade in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
        }
    });
}, observerOptions);

// Add animation classes
document.querySelectorAll('.animate-fade-in, .animate-fade-in-delay, .animate-fade-in-delay2').forEach((el, index) => {
    el.style.animationDelay = `${index * 0.2}s`;
    observer.observe(el);
});

/* Parallax effect disabled to fix features overlap */// window.addEventListener('scroll', () => {
//     const scrolled = window.pageYOffset;
//     const hero = document.querySelector('#home');
//     if (hero) {
//         hero.style.transform = `translateY(${scrolled * 0.5}px)`;
//     }
// });

// /* Navbar scroll handler remains active */
// window.addEventListener('scroll', () => {
//     if (window.scrollY > 100) {
//         navbar.classList.add('navbar-scrolled');
//     } else {
//         navbar.classList.remove('navbar-scrolled');
//     }
// });

// Form handling for CTA (demo)
document.querySelectorAll('a[href="#cta"]').forEach(link => {
    link.addEventListener('click', (e) => {
        // Keep legacy behavior (changes button text) but don't override the contact submit button.
        const primaryBtn = document.querySelector('#cta .btn-primary');
        if (primaryBtn && primaryBtn.textContent !== 'Send Message') {
            primaryBtn.textContent = 'Thank you! 🚀';
            primaryBtn.style.animation = 'pulse 1s infinite';
            setTimeout(() => {
                primaryBtn.textContent = 'Send Message';
                primaryBtn.style.animation = '';
            }, 3000);
        }
    });
});

// Contact form handling (client-side demo)
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const status = document.getElementById('contact-form-status');
        if (status) status.textContent = 'Sending...';

        // Demo-only: no backend wired.
        setTimeout(() => {
            if (status) status.textContent = "Thanks! Your message has been received. We'll reply soon.";
            contactForm.reset();
        }, 800);
    });
}

// Theme toggle functionality
(function() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeToggle?.querySelector('i');

    if (!themeToggle || !icon) return;

    function setTheme(isLight) {
        if (isLight) {
            body.classList.add('light');
            icon.className = 'fas fa-sun';
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.remove('light');
            icon.className = 'fas fa-moon';
            localStorage.setItem('theme', 'dark');
        }
    }

    function initTheme() {
        // Default to dark theme to restore original look for about-to-footer sections
        body.classList.remove('light');
        icon.className = 'fas fa-moon';
        localStorage.setItem('theme', 'dark');

        // Only apply light if explicitly saved previously
        const saved = localStorage.getItem('theme');
        if (saved === 'light') {
            setTheme(true);
        }
    }

    themeToggle.addEventListener('click', () => {
        const isLight = body.classList.contains('light');
        setTheme(!isLight);
    });

    // Init on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
    } else {
        initTheme();
    }
})();

