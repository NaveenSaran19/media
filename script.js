document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');
    const contactForm = document.getElementById('contactForm');
    const backToTop = document.getElementById('backToTop');

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            backToTop.classList.add('active');
        } else {
            navbar.classList.remove('scrolled');
            backToTop.classList.remove('active');
        }
    });

    // Back to top functionality
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Mobile menu toggle
    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileMenu.querySelector('i');

        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
            document.body.style.overflow = 'hidden'; // Prevent scroll
            if (backToTop) backToTop.style.display = 'none'; // Hide back to top
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
            document.body.style.overflow = 'auto'; // Enable scroll
            if (backToTop) backToTop.style.display = 'flex';
        }
    });

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = mobileMenu.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
            document.body.style.overflow = 'auto';
            if (backToTop) backToTop.style.display = 'flex';
        });
    });

    // AJAX Form Submission
    if (contactForm) {
        const formResponse = document.getElementById('formResponse');

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button');
            const originalBtnText = submitBtn.innerText;

            // Loading state
            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;

            // Get form values directly from the submitted form
            var name = contactForm.querySelector("input[name='name']").value;
            var email = contactForm.querySelector("input[name='email']").value;
            var phone = contactForm.querySelector("input[name='phone']").value;
            var message = contactForm.querySelector("textarea[name='message']").value;

            var templateParams = {
                name: name,
                email: email,
                phone: phone,
                message: message
            };

            emailjs.send('service_ky6y4mf', 'template_byp72r8', templateParams)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    formResponse.innerHTML = `<p class="success-msg">Message sent successfully!</p>`;
                    contactForm.reset();

                    submitBtn.innerText = originalBtnText;
                    submitBtn.disabled = false;
                }, function(error) {
                    console.log('FAILED...', error);
                    // Show specific error for debugging
                    formResponse.innerHTML = `<p class="error-msg">Error: ${error.text || 'Something went wrong'}. Please try again.</p>`;

                    submitBtn.innerText = originalBtnText;
                    submitBtn.disabled = false;
                });

            // Clear message after 5 seconds
            setTimeout(() => {
                formResponse.innerHTML = '';
            }, 5000);
        });
    }

    // Intersection Observer for animations on scroll
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Check if the element is part of a grid for staggered animation
                const parent = entry.target.parentElement;
                const isGrid = parent && (parent.classList.contains('services-grid') ||
                                         parent.classList.contains('portfolio-grid') ||
                                         parent.classList.contains('testimonials-grid') ||
                                         parent.classList.contains('pricing-grid'));

                if (isGrid) {
                    // Find index within the grid to apply delay
                    const siblings = Array.from(parent.children);
                    const gridIndex = siblings.indexOf(entry.target);
                    entry.target.style.transitionDelay = `${gridIndex * 0.15}s`;
                }

                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatableElements = document.querySelectorAll('.service-card, .portfolio-item, .testimonial-card, .about-text, .about-image, .contact-info, .contact-form, .pricing-card, .testimonial-btn');

    animatableElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        observer.observe(el);
    });

    // Hero Image Slider
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (slides.length > 0) {
        let currentSlide = 0;
        let slideInterval;

        const initSlider = () => {
            slides.forEach((slide, index) => {
                slide.classList.remove('active');
                if(dots[index]) dots[index].classList.remove('active');
            });
            slides[currentSlide].classList.add('active');
            if(dots[currentSlide]) dots[currentSlide].classList.add('active');
        };

        const nextSlide = () => {
            currentSlide++;
            if (currentSlide > slides.length - 1) {
                currentSlide = 0;
            }
            initSlider();
        };

        const prevSlide = () => {
            currentSlide--;
            if (currentSlide < 0) {
                currentSlide = slides.length - 1;
            }
            initSlider();
        };

        if(nextBtn) nextBtn.addEventListener('click', () => {
            nextSlide();
            resetInterval();
        });

        if(prevBtn) prevBtn.addEventListener('click', () => {
            prevSlide();
            resetInterval();
        });

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                initSlider();
                resetInterval();
            });
        });

        const startInterval = () => {
            slideInterval = setInterval(nextSlide, 5000);
        };

        const resetInterval = () => {
            clearInterval(slideInterval);
            startInterval();
        };

        startInterval();
    }
});

// Modal Functions
function openReviewModal() {
    document.getElementById('reviewModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeReviewModal() {
    document.getElementById('reviewModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function submitDummyReview(event) {
    event.preventDefault();
    const modalResponse = document.getElementById('modalResponse');
    const submitBtn = event.target.querySelector('button');

    submitBtn.innerText = 'Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
        modalResponse.innerHTML = `<p class="success-msg" style="margin-top: 20px;">Message sent successfully!</p>`;
        event.target.reset();

        setTimeout(() => {
            closeReviewModal();
            modalResponse.innerHTML = '';
            submitBtn.innerText = 'Submit Review';
            submitBtn.disabled = false;
        }, 2000);
    }, 1500);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('reviewModal');
    if (event.target == modal) {
        closeReviewModal();
    }
}
