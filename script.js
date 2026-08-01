/* ========================================
   KOTHOOR BONE SETTING CENTRE
   Interactive Script
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ========== HAMBURGER MENU ==========
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const body = document.body;

    // Create overlay element
    const overlay = document.createElement('div');
    overlay.classList.add('nav-overlay');
    body.appendChild(overlay);

    function toggleMenu() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        overlay.classList.toggle('active');
        body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    }

    function closeMenu() {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        overlay.classList.remove('active');
        body.style.overflow = '';
    }

    hamburger.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', closeMenu);

    // Close menu when a nav link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // ========== NAVBAR SCROLL EFFECT ==========
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ========== SCROLL ANIMATIONS (Intersection Observer) ==========
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));

    // ========== ANIMATED COUNTERS ==========
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;

        statNumbers.forEach(stat => {
            const target = parseFloat(stat.getAttribute('data-target'));
            const isDecimal = stat.hasAttribute('data-decimal');
            const duration = 2000;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = eased * target;

                if (isDecimal) {
                    stat.textContent = current.toFixed(1);
                } else {
                    stat.textContent = Math.floor(current);
                }

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    if (isDecimal) {
                        stat.textContent = target.toFixed(1);
                    } else {
                        stat.textContent = Math.floor(target);
                    }
                }
            }

            requestAnimationFrame(updateCounter);
        });

        countersAnimated = true;
    }

    // Observe the stats row to trigger counters
    const statsRow = document.querySelector('.stats-row');
    if (statsRow) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counterObserver.observe(statsRow);
    }

    // ========== TESTIMONIAL CAROUSEL ==========
    const track = document.getElementById('carouselTrack');
    const dotsContainer = document.getElementById('carouselDots');

    if (track && dotsContainer) {
        const cards = track.querySelectorAll('.review-card');
        const totalSlides = cards.length;
        let currentSlide = 0;
        let autoSlideInterval;

        // Create dots
        cards.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.setAttribute('aria-label', `Go to review ${index + 1}`);
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.carousel-dot');

        function goToSlide(index) {
            currentSlide = index;
            track.style.transform = `translateX(-${currentSlide * 100}%)`;
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentSlide);
            });
        }

        function nextSlide() {
            goToSlide((currentSlide + 1) % totalSlides);
        }

        function startAutoSlide() {
            autoSlideInterval = setInterval(nextSlide, 5000);
        }

        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
        }

        // Start auto-slide
        startAutoSlide();

        // Pause on hover
        track.addEventListener('mouseenter', stopAutoSlide);
        track.addEventListener('mouseleave', startAutoSlide);

        // Touch swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoSlide();
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > 50) {
                if (diff > 0 && currentSlide < totalSlides - 1) {
                    goToSlide(currentSlide + 1);
                } else if (diff < 0 && currentSlide > 0) {
                    goToSlide(currentSlide - 1);
                }
            }
            startAutoSlide();
        }, { passive: true });
    }

    // ========== SMOOTH SCROLL FOR NAV LINKS ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    // ========== GOOGLE ANALYTICS EVENT TRACKING ==========
    document.querySelectorAll('a[href*="wa.me"]').forEach(button => {
        button.addEventListener('click', () => {
            if (typeof gtag === 'function') {
                gtag('event', 'click_whatsapp', {
                    'event_category': 'Engagement',
                    'event_label': 'WhatsApp Booking Click'
                });
            }
        });
    });

    document.querySelectorAll('a[href^="tel:"]').forEach(button => {
        button.addEventListener('click', () => {
            if (typeof gtag === 'function') {
                gtag('event', 'click_call', {
                    'event_category': 'Engagement',
                    'event_label': 'Phone Call Click'
                });
            }
        });
    });

});
