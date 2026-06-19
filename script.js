document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const navbar = document.querySelector('.navbar');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');
    const contactForm = document.getElementById('contactForm');
    const backToTop = document.getElementById('backToTop');
    const reviewModal = document.getElementById('reviewModal');

    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a');

    function highlightNavItem() {
        let currentSectionId = 'home';
        const scrollPosition = window.scrollY + 120; // Nav height offset

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentSectionId}`) {
                item.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            backToTop.classList.add('active');
        } else {
            navbar.classList.remove('scrolled');
            backToTop.classList.remove('active');
        }
        highlightNavItem();
    });

    // Run highlight on initial load
    highlightNavItem();

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    /* ==========================================================================
       Mobile Navigation Drawer
       ========================================================================== */
    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileMenu.querySelector('i');

        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
            document.body.style.overflow = 'hidden';
            backToTop.style.display = 'none';
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
            document.body.style.overflow = 'auto';
            backToTop.style.display = 'flex';
        }
    });

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const icon = mobileMenu.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                document.body.style.overflow = 'auto';
                backToTop.style.display = 'flex';
            }
        });
    });

    /* ==========================================================================
       Typewriter Effect
       ========================================================================== */
    const servicesList = [
        "Inventory & Warehouse Management",
        "ERP & GST Billing Software",
        "E-Commerce Development",
        "Dynamic and Static Websites",
        "CRM and HRM Solutions",
        "POS Billing Systems",
        "Custom Software Development",
        "AI Video & Post Creation",
        "Agriculture Maintenance Software",
        "SEO Services & Paid Ads",
        "Social Media Marketing",
        "Content Creation & Copywriting"
    ];

    const typedTextSpan = document.querySelector(".typed-text");
    let serviceIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingDelay = 100;
    let erasingDelay = 50;
    let newTextDelay = 2000; // Delay between full words

    // Distinct colors for each service category (matching their service card accents)
    const serviceColors = [
        "#d97706", // Inventory & Warehouse (Amber)
        "#1d4ed8", // ERP & GST (Blue)
        "#be1848", // E-Commerce (Rose)
        "#0369a1", // Web Design (Sky Blue)
        "#7e22ce", // CRM & HRM (Purple)
        "#4338ca", // POS Terminals (Indigo)
        "#6d28d9", // Custom Software (Violet)
        "#be185d", // AI & Video (Pink)
        "#15803d", // Agriculture (Green)
        "#047857", // SEO Services (Emerald)
        "#b91c1c", // Paid Ads (Red)
        "#0891b2"  // Social Media (Cyan)
    ];

    function type() {
        if (!typedTextSpan) return;
        const currentService = servicesList[serviceIndex];
        let delay = typingDelay;

        // Apply distinct color dynamically matching the service index
        typedTextSpan.style.color = serviceColors[serviceIndex];

        if (isDeleting) {
            // Erasing characters
            typedTextSpan.textContent = currentService.substring(0, charIndex - 1);
            charIndex--;
            delay = erasingDelay;

            // Word completed erasing
            if (charIndex === 0) {
                isDeleting = false;
                serviceIndex = (serviceIndex + 1) % servicesList.length;
                delay = 300; // Small break before typing next service
            }
        } else {
            // Typing characters
            typedTextSpan.textContent = currentService.substring(0, charIndex + 1);
            charIndex++;
            delay = typingDelay;

            // Word completed typing
            if (charIndex === currentService.length) {
                isDeleting = true;
                delay = newTextDelay; // Delay between full words
            }
        }

        setTimeout(type, delay);
    }

    // Initialize typing
    if (typedTextSpan) {
        setTimeout(type, 1000);
    }

    /* ==========================================================================
       Statistics Counter Animator
       ========================================================================== */
    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'), 10);
        if (isNaN(target) || target <= 0) {
            el.innerText = target || 0;
            el.classList.add('counted');
            return;
        }
        const duration = 2000; // 2 seconds count duration
        const stepTime = Math.max(Math.floor(duration / target), 15);
        let current = 0;
        
        el.classList.add('counted');

        const timer = setInterval(() => {
            current += Math.ceil(target / (duration / stepTime));
            if (current >= target) {
                el.innerText = target;
                clearInterval(timer);
            } else {
                el.innerText = current;
            }
        }, stepTime);
    }

    /* ==========================================================================
       Intersection Observer: Bidirectional Scroll Animations
       ========================================================================== */
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Determine grid stagger delays
                const parent = entry.target.parentElement;
                const isGrid = parent && (
                    parent.classList.contains('services-grid') ||
                    parent.classList.contains('pricing-grid') ||
                    parent.classList.contains('testimonials-grid') ||
                    parent.classList.contains('stats-grid')
                );

                if (isGrid && !entry.target.classList.contains('visible')) {
                    const siblings = Array.from(parent.children).filter(el => el.classList.contains('reveal-on-scroll'));
                    const gridIndex = siblings.indexOf(entry.target);
                    if (gridIndex !== -1) {
                        entry.target.style.transitionDelay = `${gridIndex * 0.12}s`;
                    }
                }

                entry.target.classList.add('visible');

                // Animate child counter if statistic item enters
                const numberEl = entry.target.querySelector('.stat-number');
                if (numberEl && !numberEl.classList.contains('counted')) {
                    animateCounter(numberEl);
                }
            } else {
                // Only reset/remove visible if the element is below the viewport (exited to the bottom).
                // This prevents the infinite layout-loop when elements exit to the top of the viewport.
                if (entry.boundingClientRect.top > 0) {
                    // Smooth fade-away exit animation by removing visible class
                    entry.target.classList.remove('visible');
                    
                    // Reset statistics count so they re-animate next view
                    const numberEl = entry.target.querySelector('.stat-number');
                    if (numberEl) {
                        numberEl.classList.remove('counted');
                        numberEl.innerText = '0';
                    }
                }
            }
        });
    }, observerOptions);

    // Track all elements targeted for scroll animations
    const animatableElements = document.querySelectorAll('.reveal-on-scroll');
    animatableElements.forEach(el => {
        scrollObserver.observe(el);
    });

    /* ==========================================================================
       Contact Form Submission (EmailJS Integration)
       ========================================================================== */
    if (contactForm) {
        const formResponse = document.getElementById('formResponse');

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;

            // Loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            // Get form values
            const name = contactForm.querySelector("input[name='name']").value;
            const email = contactForm.querySelector("input[name='email']").value;
            const phone = contactForm.querySelector("input[name='phone']").value;
            const service = contactForm.querySelector("select[name='service']").value;
            const message = contactForm.querySelector("textarea[name='message']").value;

            const templateParams = {
                name: name,
                email: email,
                phone: phone,
                service: service,
                message: message
            };

            emailjs.send('service_ky6y4mf', 'template_byp72r8', templateParams)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    formResponse.innerHTML = `<p class="success-msg"><i class="fas fa-check-circle"></i> Message sent successfully! We will contact you soon.</p>`;
                    contactForm.reset();
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                }, function(error) {
                    console.log('FAILED...', error);
                    formResponse.innerHTML = `<p class="error-msg"><i class="fas fa-exclamation-circle"></i> Submission failed: ${error.text || 'Something went wrong'}. Please try again.</p>`;
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                });

            // Clear response message after 6 seconds
            setTimeout(() => {
                formResponse.innerHTML = '';
            }, 6000);
        });
    }

    /* ==========================================================================
       Hero Image Slideshow / Slider (Background Autoplay Slider)
       ========================================================================== */
    const bgSlides = document.querySelectorAll('.hero-bg-scroller .bg-slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    const prevBtn = document.querySelector('.prev-arrow');
    const nextBtn = document.querySelector('.next-arrow');
    
    if (bgSlides.length > 0) {
        let currentSlide = 0;
        let slideInterval;
        
        function showSlide(index) {
            // Remove active class from all slides and dots
            bgSlides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            // Handle boundary conditions
            if (index >= bgSlides.length) currentSlide = 0;
            else if (index < 0) currentSlide = bgSlides.length - 1;
            else currentSlide = index;
            
            // Add active class to current slide and dot
            bgSlides[currentSlide].classList.add('active');
            if (dots[currentSlide]) dots[currentSlide].classList.add('active');
        }
        
        function nextSlide() {
            showSlide(currentSlide + 1);
        }
        
        function prevSlide() {
            showSlide(currentSlide - 1);
        }
        
        // Auto slide interval
        function startSlideShow() {
            slideInterval = setInterval(nextSlide, 5000); // Change image every 5 seconds
        }
        
        function resetSlideShow() {
            clearInterval(slideInterval);
            startSlideShow();
        }
        
        // Event Listeners for controls
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetSlideShow();
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetSlideShow();
            });
        }
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                resetSlideShow();
            });
        });
        
        // Initialize
        startSlideShow();
    }

    /* ==========================================================================
       Custom Select Dropdown
       ========================================================================== */
    const customSelectWrapper = document.querySelector('.custom-select-wrapper');
    const customSelectTrigger = document.getElementById('customSelectTrigger');
    const customOptions = document.querySelectorAll('.custom-option');
    const hiddenSelect = document.getElementById('service');

    if (customSelectWrapper && customSelectTrigger && hiddenSelect) {
        const selectedText = customSelectTrigger.querySelector('.selected-text');
        const selectedIcon = customSelectTrigger.querySelector('.select-placeholder-icon') || customSelectTrigger.querySelector('i');

        // Toggle dropdown open/close
        customSelectTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            customSelectWrapper.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!customSelectWrapper.contains(e.target)) {
                customSelectWrapper.classList.remove('active');
            }
        });

        // Handle option clicks
        customOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const value = option.getAttribute('data-value');
                const iconClass = option.getAttribute('data-icon');
                const color = option.getAttribute('data-color');
                const text = option.querySelector('span').innerText;

                // Update hidden select
                hiddenSelect.value = value;
                // Dispatch change event to notify any listeners
                hiddenSelect.dispatchEvent(new Event('change'));

                // Update custom select trigger styling
                selectedText.innerText = text;
                selectedText.style.color = 'var(--text-primary)';
                
                // Replace icon classes and set custom color
                selectedIcon.className = `fas ${iconClass}`;
                selectedIcon.style.color = color;

                // Highlight selected item
                customOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');

                // Close dropdown
                customSelectWrapper.classList.remove('active');
            });
        });

        // Reset custom select state when form is reset
        if (contactForm) {
            contactForm.addEventListener('reset', () => {
                selectedText.innerText = 'Choose a Service';
                selectedText.style.color = '';
                selectedIcon.className = 'fas fa-concierge-bell select-placeholder-icon';
                selectedIcon.style.color = '';
                customOptions.forEach(opt => opt.classList.remove('selected'));
                customSelectWrapper.classList.remove('active');
            });
        }

        /* ==========================================================================
           Source Code & Inspect Protection
           ========================================================================== */
        function showProtectionToast(message) {
            let toast = document.getElementById('protection-toast');
            if (!toast) {
                toast = document.createElement('div');
                toast.id = 'protection-toast';
                toast.style.cssText = `
                    position: fixed;
                    bottom: 30px;
                    left: 50%;
                    transform: translateX(-50%) translateY(20px);
                    background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid rgba(223, 168, 55, 0.45);
                    color: #0f172a;
                    padding: 14px 28px;
                    border-radius: 50px;
                    font-family: 'Outfit', sans-serif;
                    font-size: 0.9rem;
                    font-weight: 600;
                    box-shadow: 0 10px 30px rgba(191, 131, 27, 0.18);
                    z-index: 10000;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                `;
                toast.innerHTML = `<i class="fas fa-shield-alt" style="color: #bf831b; font-size: 1.1rem;"></i> <span></span>`;
                document.body.appendChild(toast);
            }
            
            toast.querySelector('span').textContent = message;
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
            
            if (window.toastTimeout) {
                clearTimeout(window.toastTimeout);
            }
            
            window.toastTimeout = setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(-50%) translateY(20px)';
            }, 2500);
        }

        // Disable right click (Context Menu)
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            showProtectionToast("Right-click is disabled to protect website content.");
        });

        // Disable Inspect Element & View Source keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            const isCmdOrCtrl = e.ctrlKey || e.metaKey;
            const isShift = e.shiftKey;
            const isAlt = e.altKey;
            const key = e.key.toLowerCase();

            // F12 Developer Tools
            if (e.key === 'F12') {
                e.preventDefault();
                showProtectionToast("Developer tools are disabled.");
                return false;
            }
            
            // Ctrl+U / Cmd+Opt+U (View Source)
            if ((isCmdOrCtrl && key === 'u') || (isCmdOrCtrl && isAlt && key === 'u')) {
                e.preventDefault();
                showProtectionToast("Viewing source code is disabled.");
                return false;
            }
            
            // Ctrl+Shift+I / Cmd+Opt+I (Inspect Element)
            if ((isCmdOrCtrl && isShift && key === 'i') || (isCmdOrCtrl && isAlt && key === 'i')) {
                e.preventDefault();
                showProtectionToast("Inspecting elements is disabled.");
                return false;
            }

            // Ctrl+Shift+J / Cmd+Opt+J (Console)
            if ((isCmdOrCtrl && isShift && key === 'j') || (isCmdOrCtrl && isAlt && key === 'j')) {
                e.preventDefault();
                showProtectionToast("Developer console is disabled.");
                return false;
            }

            // Ctrl+Shift+C / Cmd+Opt+C (Inspector Selector)
            if ((isCmdOrCtrl && isShift && key === 'c') || (isCmdOrCtrl && isAlt && key === 'c')) {
                e.preventDefault();
                showProtectionToast("Inspecting elements is disabled.");
                return false;
            }

            // Ctrl+S / Cmd+S (Save Page)
            if (isCmdOrCtrl && key === 's') {
                e.preventDefault();
                showProtectionToast("Saving this page is disabled.");
                return false;
            }
        });
    }
});

/* ==========================================================================
   Review Modal Handlers
   ========================================================================== */
function openReviewModal() {
    const modal = document.getElementById('reviewModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeReviewModal() {
    const modal = document.getElementById('reviewModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function submitDummyReview(event) {
    event.preventDefault();
    const modalResponse = document.getElementById('modalResponse');
    const form = event.target;
    const submitBtn = form.querySelector('button');
    const originalBtnText = submitBtn.innerText;

    submitBtn.innerText = 'Submitting...';
    submitBtn.disabled = true;

    // Simulate submission delay
    setTimeout(() => {
        modalResponse.innerHTML = `<p class="success-msg" style="margin-top: 10px;"><i class="fas fa-check-circle"></i> Thank you! Your review has been submitted for approval.</p>`;
        form.reset();

        setTimeout(() => {
            closeReviewModal();
            modalResponse.innerHTML = '';
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
        }, 2000);
    }, 1200);
}

// Close review modal when clicking background overlay
window.onclick = function(event) {
    const modal = document.getElementById('reviewModal');
    if (event.target === modal) {
        closeReviewModal();
    }
}
