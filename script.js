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

// ------------------------------
// Contact form: validation + LocalStorage persistence
// ------------------------------
const SUBMISSIONS_STORAGE_KEY = 'submissions';

function safeParseSubmissions(raw) {
    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function getTrimmedValue(inputEl) {
    return (inputEl?.value ?? '').trim();
}

function buildSubmissionFromContactForm(formEl) {
    const name = getTrimmedValue(document.getElementById('contact-name'));
    const email = getTrimmedValue(document.getElementById('contact-email'));
    const topic = getTrimmedValue(document.getElementById('contact-topic'));
    const message = getTrimmedValue(document.getElementById('contact-message'));

    const errors = [];
    if (!name) errors.push('Name cannot be empty.');
    if (!email) errors.push('Email cannot be empty.');
    if (!topic) errors.push('Topic cannot be empty.');
    if (!message) errors.push('Message cannot be empty.');

    return {
        name,
        email,
        topic,
        message,
        errors
    };
}

function upsertSubmissionToStorage(submission) {
    const existing = safeParseSubmissions(localStorage.getItem(SUBMISSIONS_STORAGE_KEY));
    existing.push(submission);
    localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(existing));
}

function showContactPopup(message) {
    // Simple custom modal popup (no external deps)
    let modal = document.getElementById('contact-popup-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'contact-popup-modal';
        modal.innerHTML = `
            <div class="contact-popup-overlay" aria-hidden="true"></div>
            <div class="contact-popup" role="dialog" aria-modal="true" aria-labelledby="contact-popup-title">
                <div class="contact-popup-header">
                    <div class="contact-popup-glow" aria-hidden="true"><i class="fas fa-triangle-exclamation"></i></div>
                    <div>

                        <h3 class="contact-popup-title" id="contact-popup-title">Missing information</h3>
                        <p class="contact-popup-subtitle">Field cannot be left empty</p>
                    </div>


                    <button type="button" class="contact-popup-close" id="contact-popup-close" aria-label="Close">
                        <i class="fas fa-xmark" aria-hidden="true"></i>
                    </button>
                </div>
                <div class="contact-popup-body" id="contact-popup-message"></div>
                <div class="contact-popup-actions">
                    <button type="button" class="contact-popup-btn" id="contact-popup-ok">OK</button>
                </div>
            </div>
            
        `;
        document.body.appendChild(modal);

        const okBtn = modal.querySelector('#contact-popup-ok');
        const closeBtn = modal.querySelector('#contact-popup-close');

        const closeModal = () => {
            modal?.remove();
        };

        okBtn.addEventListener('click', closeModal);
        closeBtn?.addEventListener('click', closeModal);

        // Close on overlay click
        const overlay = modal.querySelector('.contact-popup-overlay');
        overlay.addEventListener('click', () => {
            modal?.remove();
        });

        // Basic focus
        okBtn.focus();

        // Esc to close
        document.addEventListener('keydown', (evt) => {
            if (evt.key === 'Escape') modal?.remove();
        }, { once: true });
    }

    const msgEl = document.getElementById('contact-popup-message');
    if (msgEl) msgEl.textContent = message;

    // Ensure displayed
    modal.style.display = '';
}


function validateNonEmptyAndShowErrors(formEl, statusEl) {
    const built = buildSubmissionFromContactForm(formEl);
    if (built.errors.length > 0) {
        const popupMsg = 'you need to fill all fields before sending';
        if (statusEl) {
            statusEl.textContent = popupMsg;
            statusEl.style.color = '#f87171';
        }

        // Show popup modal only once
        if (!document.getElementById('contact-popup-modal')) {
            showContactPopup(popupMsg);
        }
        return null;


    }
    if (statusEl) {
        statusEl.style.color = '';
    }
    return built;
}


const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const status = document.getElementById('contact-form-status');
        if (status) {
            status.textContent = 'Submitting...';
            status.style.color = '';
        }

        // Extra JS validation: prevent empty/whitespace-only values.
        const validated = validateNonEmptyAndShowErrors(contactForm, status);
        if (!validated) return;

        // Demo-only: store locally (no backend).
        const submission = {
            id: (crypto?.randomUUID?.() ?? String(Date.now()) + '-' + Math.random().toString(16).slice(2)),
            name: validated.name,
            email: validated.email,
            topic: validated.topic,
            message: validated.message,
            createdAt: new Date().toISOString()
        };

        setTimeout(() => {
            upsertSubmissionToStorage(submission);

            // Success popup: green "Thank you" with emoji + required message
            if (!document.getElementById('contact-success-popup')) {
                const modal = document.createElement('div');
                modal.id = 'contact-success-popup';
                modal.innerHTML = `
                    <div class="contact-popup-overlay" aria-hidden="true"></div>
                    <div class="contact-popup contact-popup--success" role="dialog" aria-modal="true" aria-labelledby="contact-success-title">
                        <div class="contact-popup-header">
                            <div class="contact-popup-glow contact-popup-glow--success" aria-hidden="true">
                                <i class="fas fa-circle-check" aria-hidden="true"></i>
                            </div>
                            <div>
                                <h3 class="contact-popup-title" id="contact-success-title">Thank you! ✅</h3>
                                <p class="contact-popup-subtitle" id="contact-success-subtitle"> your message has been send successfully!</p>

                            </div>
                            <button type="button" class="contact-popup-close" id="contact-success-close" aria-label="Close">
                                <i class="fas fa-xmark" aria-hidden="true"></i>
                            </button>
                        </div>
                        <div class="contact-popup-actions">
                            <button type="button" class="contact-popup-btn" id="contact-success-ok">OK</button>
                        </div>
                    </div>
                `;
                document.body.appendChild(modal);

                const okBtn = modal.querySelector('#contact-success-ok');
                const closeBtn = modal.querySelector('#contact-success-close');
                const overlay = modal.querySelector('.contact-popup-overlay');

                const closeModal = () => modal.remove();
                okBtn?.addEventListener('click', closeModal);
                closeBtn?.addEventListener('click', closeModal);
                overlay?.addEventListener('click', closeModal);

                document.addEventListener('keydown', (evt) => {
                    if (evt.key === 'Escape') closeModal();
                }, { once: true });
            }

            const successPopup = document.getElementById('contact-success-popup');
            if (successPopup) successPopup.style.display = '';

            // Also update inline status text (keeps existing UI behavior)
            if (status) {
                status.textContent = "Thanks! Your message has been saved. We'll reply soon.";
                status.style.color = '';
            }
            contactForm.reset();

        }, 300);
    });
}

// ------------------------------
// Submissions page renderer
// ------------------------------
function formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString();
}

function renderSubmissionsPage() {
    const tbody = document.getElementById('submissions-tbody');
    const emptyEl = document.getElementById('submissions-empty');
    const metaEl = document.getElementById('submissions-meta');
    const clearBtn = document.getElementById('clear-submissions');
    const clearStatus = document.getElementById('clear-status');

    if (!tbody) return; // Not on submissions page

    const submissions = safeParseSubmissions(localStorage.getItem(SUBMISSIONS_STORAGE_KEY));

    if (metaEl) metaEl.textContent = `${submissions.length} submission${submissions.length === 1 ? '' : 's'} stored locally.`;

    if (!submissions.length) {
        if (emptyEl) emptyEl.style.display = 'block';
        return;
    }

    if (emptyEl) emptyEl.style.display = 'none';

    tbody.innerHTML = submissions
        .slice()
        .reverse()
        .map((s) => {
            const name = String(s?.name ?? '');
            const email = String(s?.email ?? '');
            const topic = String(s?.topic ?? '');
            const message = String(s?.message ?? '');
            const createdAt = formatDate(s?.createdAt);

            return `
                <tr>
                    <td style="padding:0.75rem 0.5rem; border-top:1px solid rgba(255,255,255,0.08);">${escapeHtml(name)}</td>
                    <td style="padding:0.75rem 0.5rem; border-top:1px solid rgba(255,255,255,0.08);">${escapeHtml(email)}</td>
                    <td style="padding:0.75rem 0.5rem; border-top:1px solid rgba(255,255,255,0.08);">${escapeHtml(topic)}</td>
                    <td style="padding:0.75rem 0.5rem; border-top:1px solid rgba(255,255,255,0.08);">${escapeHtml(message)}</td>
                    <td style="padding:0.75rem 0.5rem; border-top:1px solid rgba(255,255,255,0.08); opacity:0.85;">${escapeHtml(createdAt)}</td>
                </tr>
            `;
        })
        .join('');

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            localStorage.removeItem(SUBMISSIONS_STORAGE_KEY);
            if (clearStatus) {
                clearStatus.textContent = 'Cleared.';
            }
            renderSubmissionsPage();
        });
    }
}

function escapeHtml(str) {
    return String(str)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '<')
        .replaceAll('>', '>')
        .replaceAll('"', '"')
        .replaceAll("'", '&#039;');
}


// Render submissions after DOM is ready (safe for both pages)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderSubmissionsPage);
} else {
    renderSubmissionsPage();
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

        // Immediately update "Jump to" section link colors on theme change (no hover needed)
        document.querySelectorAll('a[data-service-jump="true"]').forEach(link => {
            if (isLight) {
                link.style.color = '#1e293b';
            } else {
                link.style.color = 'rgba(255,255,255,0.95)';
            }
        });
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

