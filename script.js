// ===== DOM ELEMENTS =====
const navbar = document.getElementById('navbar');
const navMenu = document.getElementById('nav-menu');
const hamburger = document.getElementById('hamburger');
const backToTopBtn = document.getElementById('backToTop');
const contactForm = document.getElementById('contactForm');

// ===== NAVIGATION FUNCTIONALITY =====

// ===== PERFORMANCE OPTIMIZATIONS =====
// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Debounce function for resize events
function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Preload critical resources
function preloadCriticalResources() {
    const criticalImages = [
        'ICON2.png',
        'favicon.svg',
        'og-image.jpg'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Lazy load images with Intersection Observer
function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Sticky Navigation with throttling
const handleScroll = throttle(() => {
    if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
}, 16); // ~60fps

window.addEventListener('scroll', handleScroll);

// Mobile Menu Toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    
    // Update ARIA attributes
    const isExpanded = hamburger.classList.contains('active');
    hamburger.setAttribute('aria-expanded', isExpanded);
});

// Keyboard support for hamburger menu
hamburger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        hamburger.click();
    }
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== BACK TO TOP BUTTON =====
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.service-card, .product-card, .blog-card, .value-item, .stat-item, .testimonial-card, .feature-item');
    animateElements.forEach((el, index) => {
        observer.observe(el);
        // Add staggered animation delays
        el.classList.add(`stagger-${Math.min(index + 1, 5)}`);
    });
    
    // Add Google-style micro-interactions
    addMicroInteractions();
    
    // Add staggered animations for hero content
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');
    
    if (heroContent) {
        setTimeout(() => heroContent.classList.add('fade-in-left'), 300);
    }
    if (heroImage) {
        setTimeout(() => heroImage.classList.add('fade-in-right'), 600);
    }
    
    // Add scale animation for hero graphic
    const heroGraphic = document.querySelector('.hero-graphic');
    if (heroGraphic) {
        setTimeout(() => heroGraphic.classList.add('scale-in'), 900);
    }
    
    // Add pulse animation to CTA buttons
    const ctaButtons = document.querySelectorAll('.btn-primary');
    ctaButtons.forEach(btn => {
        btn.classList.add('pulse');
    });
    
    // Add glow effect to hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.classList.add('glow');
    }
});

// ===== FORM VALIDATION =====
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form elements
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const subject = document.getElementById('subject');
        const message = document.getElementById('message');
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        
        // Reset previous error states
        clearErrors();
        
        // Show loading state
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
        submitBtn.disabled = true;
        
        // Validate form
        let isValid = true;
        
        // Name validation
        if (!name.value.trim()) {
            showError(name, 'الاسم مطلوب');
            isValid = false;
        } else if (name.value.trim().length < 2) {
            showError(name, 'الاسم يجب أن يكون أكثر من حرفين');
            isValid = false;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim()) {
            showError(email, 'البريد الإلكتروني مطلوب');
            isValid = false;
        } else if (!emailRegex.test(email.value)) {
            showError(email, 'البريد الإلكتروني غير صحيح');
            isValid = false;
        }
        
        // Subject validation
        if (!subject.value.trim()) {
            showError(subject, 'الموضوع مطلوب');
            isValid = false;
        } else if (subject.value.trim().length < 5) {
            showError(subject, 'الموضوع يجب أن يكون أكثر من 5 أحرف');
            isValid = false;
        }
        
        // Message validation
        if (!message.value.trim()) {
            showError(message, 'الرسالة مطلوبة');
            isValid = false;
        } else if (message.value.trim().length < 10) {
            showError(message, 'الرسالة يجب أن تكون أكثر من 10 أحرف');
            isValid = false;
        }
        
        // If form is valid, submit it
        if (isValid) {
            submitForm();
        }
    });
}

// Show error message
function showError(element, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = '#ef4444';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    
    element.style.borderColor = '#ef4444';
    element.parentNode.appendChild(errorDiv);
}

// Clear all errors
function clearErrors() {
    // Remove error messages
    document.querySelectorAll('.error-message').forEach(error => {
        error.remove();
    });
    
    // Reset border colors
    document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
        input.style.borderColor = '';
    });
}

// Submit form to Formspree
function submitForm() {
    const formData = new FormData(contactForm);
    
    fetch('https://formspree.io/f/xwpqgvwy', {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            showSuccessMessage();
            contactForm.reset();
        } else {
            throw new Error('فشل في إرسال الرسالة');
        }
    })
    .catch(error => {
        showErrorMessage(error.message);
    })
    .finally(() => {
        // Reset button
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> إرسال الرسالة';
        submitBtn.disabled = false;
    });
}

// Show success message
function showSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <div style="
            background: #00D084;
            color: white;
            padding: 1rem;
            border-radius: 8px;
            margin-top: 1rem;
            text-align: center;
            font-weight: 500;
        ">
            <i class="fas fa-check-circle" style="margin-left: 0.5rem;"></i>
            تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.
        </div>
    `;
    
    contactForm.appendChild(successDiv);
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// Show error message
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <div style="
            background: #ef4444;
            color: white;
            padding: 1rem;
            border-radius: 8px;
            margin-top: 1rem;
            text-align: center;
            font-weight: 500;
        ">
            <i class="fas fa-exclamation-circle" style="margin-left: 0.5rem;"></i>
            ${message}
        </div>
    `;
    
    contactForm.appendChild(errorDiv);
    
    // Remove error message after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// ===== ACTIVE NAVIGATION HIGHLIGHTING =====
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ===== PARALLAX EFFECT FOR HERO SECTION =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroGraphic = document.querySelector('.hero-graphic');
    
    if (heroGraphic) {
        const rate = scrolled * -0.5;
        heroGraphic.style.transform = `translateY(${rate}px)`;
    }
});

// ===== COUNTER ANIMATION =====
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
}

// ===== LAZY LOADING FOR IMAGES =====
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== SMOOTH REVEAL ANIMATIONS =====
function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);

// ===== TYPING ANIMATION =====
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing animation for hero title
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 50);
    }
});

// ===== PRELOADER =====
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
});

// ===== MOBILE MENU ENHANCEMENT =====
// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// ===== PERFORMANCE OPTIMIZATION =====
// Debounce function for scroll events
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

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply debounce to scroll events
const debouncedScrollHandler = debounce(() => {
    // Scroll-based animations
    revealOnScroll();
}, 10);

// Apply throttle to scroll events for better performance
const throttledScrollHandler = throttle(() => {
    // Sticky navigation
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Back to top button
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
        } else {
        backToTopBtn.classList.remove('show');
    }
}, 16); // ~60fps

window.addEventListener('scroll', throttledScrollHandler);

// ===== ACCESSIBILITY IMPROVEMENTS =====
// Keyboard navigation for mobile menu
hamburger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        hamburger.click();
    }
});

// Focus management for mobile menu
navMenu.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        hamburger.focus();
    }
});

// ===== UTILITY FUNCTIONS =====
// Format phone numbers
function formatPhoneNumber(phoneNumber) {
    return phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Copy to clipboard function
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('تم نسخ النص إلى الحافظة', 'success');
    }).catch(() => {
        showNotification('فشل في نسخ النص', 'error');
    });
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Google-style micro-interactions
function addMicroInteractions() {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn, .feature-link');
    buttons.forEach(button => {
        button.addEventListener('click', createRipple);
    });
    
    // Add parallax effect to hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroHeight = hero.offsetHeight;
            if (scrolled < heroHeight) {
                hero.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
        });
    }
    
    // Add smooth hover effects to cards
    const cards = document.querySelectorAll('.service-card, .product-card, .feature-item');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'all 0.3s ease';
            });
    });

    // Add floating animation to icons
    const floatingIcons = document.querySelectorAll('.floating-icon');
    floatingIcons.forEach((icon, index) => {
        icon.style.animationDelay = `${index * 0.5}s`;
    });
}

// Create ripple effect
function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all functionality
    
    
    // Add loading animation to service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Add loading animation to product cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Preload critical images
    const criticalImages = ['ICON2.png', 'favicon.svg'];
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
    
    // Initialize intersection observer for lazy loading
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
});

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
});

// ===== SERVICE WORKER REGISTRATION (FOR PWA) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}