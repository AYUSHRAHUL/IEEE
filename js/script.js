document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Synchronize Lenis with scroll reveals
    lenis.on('scroll', (e) => {
        revealOnScroll();
    });

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Reveal animation on scroll
    function revealOnScroll() {
        const triggerBottom = window.innerHeight / 5 * 4;
        const revealElements = document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right');
        
        revealElements.forEach(el => {
            const top = el.getBoundingClientRect().top;
            if(top < triggerBottom) {
                el.classList.add('active');
                
                // Trigger count-up if element contains counters
                const counters = el.querySelectorAll('.counter');
                if (counters.length > 0) {
                    counters.forEach(counter => animateCounter(counter));
                }
            }
        });
    }

    // Expose to window for dynamic content (like gallery items)
    window.revealOnScroll = revealOnScroll;

    // High-performance Count-up Animation
    const animateCounter = (counter) => {
        if (counter.classList.contains('animated')) return;
        
        const target = +counter.getAttribute('data-target');
        const duration = 2000; // 2 seconds
        const startTime = performance.now();
        
        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(easeProgress * target);
            counter.innerText = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                counter.innerText = target;
                counter.classList.add('animated');
            }
        };
        
        requestAnimationFrame(update);
    };

    revealOnScroll(); // Initial check

    // Smooth scroll for anchor links (Lenis handles this but we can use lenis.scrollTo)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                lenis.scrollTo(targetElement, {
                    offset: -85 // Compansate for fixed header
                });
            }
        });
    });
    
    // Header shadow & Scroll Progress
    const header = document.querySelector('header');
    const progressBar = document.getElementById('scroll-progress');
    
    lenis.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
        // Shadow logic
        if (scroll > 50) {
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
        } else {
            header.style.boxShadow = 'none';
        }
        
        // Progress bar logic
        if (progressBar) progressBar.style.width = (progress * 100) + "%";
    });

    // Event Filtering Logic
    const filterButtons = document.querySelectorAll('.filter-btn');
    const eventCards = document.querySelectorAll('.event-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            eventCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Initialize Lucide Icons if available
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});
