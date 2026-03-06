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

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button');
            const originalBtnText = submitBtn.innerText;

            // Loading state
            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;

            try {
                // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your actual EmailJS IDs
                const response = await emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', contactForm);

                if (response.status === 200) {
                    formResponse.innerHTML = `<p class="success-msg">Thank You! Your message has been sent.</p>`;
                    contactForm.reset();
                } else {
                    formResponse.innerHTML = `<p class="error-msg">Oops! Something went wrong. Please try again.</p>`;
                }
            } catch (error) {
                console.error('EmailJS Error:', error);
                formResponse.innerHTML = `<p class="error-msg">Oops! Something went wrong. Please try again later.</p>`;
            } finally {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;

                // Clear message after 5 seconds
                setTimeout(() => {
                    formResponse.innerHTML = '';
                }, 5000);
            }
        });
    }

    // Intersection Observer for animations on scroll
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.service-card, .portfolio-item, .testimonial-card, .about-text, .about-image, .contact-info, .contact-form').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
});
