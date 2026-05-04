// ============================================
// GLOBAL VARIABLES
// ============================================

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contactForm');
const scrollTopBtn = document.getElementById('scrollTop');

// ============================================
// HAMBURGER MENU TOGGLE
// ============================================

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when a nav link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-container')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// ============================================
// SMOOTH SCROLL TO SECTION
// ============================================

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = document.querySelector('.navbar').offsetHeight;
        const sectionTop = section.offsetTop - headerHeight;
        
        window.scrollTo({
            top: sectionTop,
            behavior: 'smooth'
        });
        
        // Close mobile menu if open
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
}

// ============================================
// CONTACT FORM VALIDATION & SUBMISSION
// ============================================

const nameInput = document.getElementById('nameInput');
const emailInput = document.getElementById('emailInput');
const subjectInput = document.getElementById('subjectInput');
const messageInput = document.getElementById('messageInput');
const submitBtn = document.getElementById('submitBtn');

// Real-time validation
nameInput.addEventListener('blur', () => validateField('name', nameInput.value));
emailInput.addEventListener('blur', () => validateField('email', emailInput.value));
subjectInput.addEventListener('blur', () => validateField('subject', subjectInput.value));
messageInput.addEventListener('blur', () => validateField('message', messageInput.value));

function validateField(fieldType, value) {
    const errorElement = document.getElementById(fieldType + 'Error');
    let error = '';

    if (value.trim() === '') {
        error = `${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} is required`;
    } else if (fieldType === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            error = 'Please enter a valid email address';
        }
    } else if (fieldType === 'name' && value.length < 2) {
        error = 'Name must be at least 2 characters';
    } else if (fieldType === 'subject' && value.length < 5) {
        error = 'Subject must be at least 5 characters';
    } else if (fieldType === 'message' && value.length < 10) {
        error = 'Message must be at least 10 characters';
    }

    if (error) {
        errorElement.textContent = error;
        errorElement.classList.add('show');
        return false;
    } else {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
        return true;
    }
}

// Form submission
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate all fields
    const nameValid = validateField('name', nameInput.value);
    const emailValid = validateField('email', emailInput.value);
    const subjectValid = validateField('subject', subjectInput.value);
    const messageValid = validateField('message', messageInput.value);

    if (!nameValid || !emailValid || !subjectValid || !messageValid) {
        showNotification('Please fix the errors above', 'error');
        return;
    }

    // Show loading state
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    // Simulate API call (in production, send to backend)
    setTimeout(() => {
        showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
        contactForm.reset();
        document.querySelectorAll('.form-error').forEach(error => {
            error.classList.remove('show');
        });
        
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1500);
});

// ============================================
// NOTIFICATION SYSTEM
// ============================================

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Set styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1.25rem 2rem;
        border-radius: 6px;
        font-weight: 600;
        z-index: 2000;
        animation: slideInRight 0.4s ease-out;
        max-width: 400px;
        word-wrap: break-word;
        font-family: 'Poppins', sans-serif;
        font-size: 0.95rem;
    `;

    // Set colors based on type
    const colors = {
        success: { bg: '#10b981', text: '#fff' },
        error: { bg: '#ff6b6b', text: '#fff' },
        info: { bg: '#00d4ff', text: '#0a0e27' }
    };

    const color = colors[type] || colors.info;
    notification.style.backgroundColor = color.bg;
    notification.style.color = color.text;

    // Add to page
    document.body.appendChild(notification);

    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.4s ease-in';
        setTimeout(() => {
            notification.remove();
        }, 400);
    }, 4000);
}

// ============================================
// SCROLL ANIMATIONS - INTERSECTION OBSERVER
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe cards for animation
document.querySelectorAll('.service-card, .research-card, .expertise-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================

const navbar = document.querySelector('.navbar');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Add shadow on scroll
    if (scrollTop > 50) {
        navbar.style.boxShadow = '0 4px 30px rgba(0, 212, 255, 0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;

    // Show/hide scroll to top button
    if (scrollTop > 300) {
        scrollTopBtn.classList.add('show');
    } else {
        scrollTopBtn.classList.remove('show');
    }
});

// ============================================
// SCROLL TO TOP BUTTON
// ============================================

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ============================================
// ACTIVE NAV LINK HIGHLIGHTING
// ============================================

window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    const headerHeight = navbar.offsetHeight;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 50;
        const sectionHeight = section.offsetHeight;
        
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.style.color = 'var(--text-primary)';
        if (link.getAttribute('href').slice(1) === current) {
            link.style.color = 'var(--primary-color)';
        }
    });
});

// ============================================
// 3D MOUSE TRACKING FOR HERO GRAPHIC
// ============================================

const techGlobe = document.querySelector('.tech-globe');

if (techGlobe) {
    document.addEventListener('mousemove', (e) => {
        // Only apply on larger screens
        if (window.innerWidth > 768) {
            const mouseX = (e.clientX / window.innerWidth - 0.5) * 30;
            const mouseY = (e.clientY / window.innerHeight - 0.5) * 30;
            
            techGlobe.style.transform = `perspective(1000px) rotateX(${mouseY}deg) rotateY(${mouseX}deg)`;
            techGlobe.style.transition = 'transform 0.1s ease-out';
        }
    });

    // Reset on mouse leave
    document.addEventListener('mouseleave', () => {
        techGlobe.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
}

// ============================================
// LAZY LOADING FOR IMAGES
// ============================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                }
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ============================================
// KEYBOARD NAVIGATION
// ============================================

document.addEventListener('keydown', (e) => {
    // Escape key closes mobile menu
    if (e.key === 'Escape') {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// ============================================
// FORM INPUT FOCUS EFFECTS
// ============================================

document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('focus', function() {
        this.style.borderColor = 'var(--primary-color)';
    });

    input.addEventListener('blur', function() {
        if (this.value.trim() === '') {
            this.style.borderColor = 'var(--border-color)';
        }
    });
});

// ============================================
// DEBOUNCE UTILITY FUNCTION
// ============================================

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

// ============================================
// OPTIMIZE SCROLL PERFORMANCE
// ============================================

let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            // Scroll-based operations happen here
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });

// ============================================
// PREVENT CONSOLE ERRORS
// ============================================

window.addEventListener('error', (e) => {
    console.log('Error caught:', e.message);
});

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('%c🔐 The Frostcod Labs', 'font-size: 24px; color: #00d4ff; font-weight: bold; text-shadow: 0 0 10px #00d4ff;');
    console.log('%cAdvanced Cybersecurity Solutions', 'font-size: 14px; color: #00d4ff;');
    console.log('%cProtecting your digital infrastructure with cutting-edge research and expertise.', 'font-size: 12px; color: #a0a0a0;');
});

// ============================================
// HANDLE VISIBILITY CHANGES
// ============================================

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden
    } else {
        // Page is visible - refresh if needed
    }
});
