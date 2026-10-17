/* ========================================
   KOTHOOR WELLNESS & BONE SETTING CENTRE
   Interactive Script (Conversion & Booking)
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ========== HAMBURGER MENU ==========
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const body = document.body;

    if (hamburger && navLinks) {
        // Create overlay element
        const overlay = document.createElement('div');
        overlay.classList.add('nav-overlay');
        body.appendChild(overlay);

        function toggleMenu() {
            const isActive = hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            overlay.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
            body.style.overflow = isActive ? 'hidden' : '';
        }

        function closeMenu() {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            overlay.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            body.style.overflow = '';
        }

        hamburger.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', closeMenu);

        // Close menu when a nav link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

    // ========== NAVBAR SCROLL SHADOW ==========
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    // ========== SCROLL ANIMATIONS (Intersection Observer) ==========
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if ('IntersectionObserver' in window && animatedElements.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -60px 0px',
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
    } else {
        // Fallback for older browsers
        animatedElements.forEach(el => el.classList.add('visible'));
    }

    // ========== ANIMATED COUNTERS ==========
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;

        statNumbers.forEach(stat => {
            const target = parseFloat(stat.getAttribute('data-target'));
            const isDecimal = stat.hasAttribute('data-decimal');
            const duration = 1800;
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

    const statsRow = document.querySelector('.stats-row');
    if (statsRow && 'IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        counterObserver.observe(statsRow);
    } else {
        animateCounters();
    }

    // ========== TESTIMONIAL CAROUSEL ==========
    const track = document.getElementById('carouselTrack');
    const dotsContainer = document.getElementById('carouselDots');

    if (track && dotsContainer) {
        const cards = track.querySelectorAll('.review-card');
        const totalSlides = cards.length;
        let currentSlide = 0;
        let autoSlideInterval;

        // Clear any existing dots
        dotsContainer.innerHTML = '';

        // Create dots
        cards.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.setAttribute('aria-label', `Go to review slide ${index + 1}`);
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
            stopAutoSlide();
            autoSlideInterval = setInterval(nextSlide, 6000);
        }

        function stopAutoSlide() {
            if (autoSlideInterval) {
                clearInterval(autoSlideInterval);
            }
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

            if (Math.abs(diff) > 40) {
                if (diff > 0 && currentSlide < totalSlides - 1) {
                    goToSlide(currentSlide + 1);
                } else if (diff < 0 && currentSlide > 0) {
                    goToSlide(currentSlide - 1);
                }
            }
            startAutoSlide();
        }, { passive: true });
    }

    // ========== FAQ ACCORDION INTERACTIVITY ==========
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        if (questionBtn) {
            questionBtn.addEventListener('click', () => {
                const isCurrentlyActive = item.classList.contains('active');
                
                // Close other open FAQ items for a clean accordion effect
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherBtn = otherItem.querySelector('.faq-question');
                        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
                    }
                });

                // Toggle selected item
                if (isCurrentlyActive) {
                    item.classList.remove('active');
                    questionBtn.setAttribute('aria-expanded', 'false');
                } else {
                    item.classList.add('active');
                    questionBtn.setAttribute('aria-expanded', 'true');
                }
            });
        }
    });

    // ========== APPOINTMENT ENQUIRY FORM LOGIC ==========
    const enquiryForm = document.getElementById('enquiryForm');
    const preferredDateInput = document.getElementById('preferredDate');
    const centreSelect = document.getElementById('centreSelect');
    const serviceSelect = document.getElementById('serviceSelect');
    const serviceNotice = document.getElementById('serviceNotice');

    // Set minimum selectable date to today
    if (preferredDateInput) {
        const todayStr = new Date().toISOString().split('T')[0];
        preferredDateInput.setAttribute('min', todayStr);
    }

    // Dynamic hint when choosing centre
    if (centreSelect && serviceNotice) {
        centreSelect.addEventListener('change', () => {
            const selectedVal = centreSelect.value;
            if (selectedVal.includes('Hasmathpet')) {
                serviceNotice.textContent = '✨ Hasmathpet offers Sports Recovery Massage & Steam Bath facilities, in addition to Deep Tissue Bodywork and Bone Setting.';
                serviceNotice.style.color = '#15803d';
            } else if (selectedVal.includes('Rasoolpura')) {
                serviceNotice.textContent = '📍 Rasoolpura offers Deep Tissue Relaxation, Targeted Neck/Shoulder Relief, and Bone Setting. (Sports Massage & Steam Bath are at Hasmathpet).';
                serviceNotice.style.color = '#0a3d62';
            } else {
                serviceNotice.textContent = '';
            }
        });
    }

    // Form submission -> construct WhatsApp message
    if (enquiryForm) {
        enquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('clientName').value.trim();
            const phone = document.getElementById('clientPhone').value.trim();
            const centre = document.getElementById('centreSelect').value;
            const service = document.getElementById('serviceSelect').value;
            const date = document.getElementById('preferredDate').value;
            const time = document.getElementById('preferredTime').value;
            const notes = document.getElementById('clientNotes').value.trim();

            if (!name) {
                alert('Please enter your full name.');
                document.getElementById('clientName').focus();
                return;
            }

            if (!phone) {
                alert('Please enter your phone/WhatsApp number.');
                document.getElementById('clientPhone').focus();
                return;
            }

            if (!centre) {
                alert('Please select your preferred centre (Hasmathpet or Rasoolpura).');
                document.getElementById('centreSelect').focus();
                return;
            }

            if (!service) {
                alert('Please select the service you are interested in.');
                document.getElementById('serviceSelect').focus();
                return;
            }

            // Construct readable, pre-filled WhatsApp message
            let message = `Hi Kothoor Centre, I would like to enquire about an appointment:\n\n`;
            message += `• Name: ${name}\n`;
            message += `• Phone: ${phone}\n`;
            message += `• Preferred Centre: ${centre}\n`;
            message += `• Requested Service: ${service}\n`;
            message += `• Preferred Date: ${date ? date : 'Earliest Available'}\n`;
            message += `• Preferred Time: ${time}\n`;
            if (notes) {
                message += `• Note / Query: ${notes}\n`;
            }
            message += `\nPlease let me know your availability and current session pricing. Thank you!`;

            const encodedMessage = encodeURIComponent(message);
            const waUrl = `https://wa.me/918801284081?text=${encodedMessage}`;

            // Track GA4 event
            if (typeof gtag === 'function') {
                gtag('event', 'generate_lead', {
                    'event_category': 'Booking',
                    'event_label': 'WhatsApp Appointment Form Submission',
                    'service_name': service,
                    'centre_location': centre
                });
            }

            // Open WhatsApp directly
            window.open(waUrl, '_blank', 'noopener,noreferrer');
        });
    }

    // ========== SMOOTH SCROLL FOR NAV & INTERNAL ANCHOR LINKS ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ========== GOOGLE ANALYTICS EVENT TRACKING ==========
    document.querySelectorAll('a[href*="wa.me"]').forEach(button => {
        button.addEventListener('click', () => {
            if (typeof gtag === 'function') {
                gtag('event', 'click_whatsapp', {
                    'event_category': 'Engagement',
                    'event_label': button.innerText.trim() || 'WhatsApp Booking Click'
                });
            }
        });
    });

    document.querySelectorAll('a[href^="tel:"]').forEach(button => {
        button.addEventListener('click', () => {
            if (typeof gtag === 'function') {
                gtag('event', 'click_call', {
                    'event_category': 'Engagement',
                    'event_label': 'Phone Call Dial'
                });
            }
        });
    });

});
