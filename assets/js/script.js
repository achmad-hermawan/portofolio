document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // 1. NAVIGATION SCROLL SPY
    // =========================================
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');
    
    const observerOptions = {
        threshold: 0.2, 
        rootMargin: "-20% 0px -35% 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => link.classList.remove('active'));
                const id = entry.target.getAttribute('id');
                const activeLink = document.querySelector(`nav a[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));


    // =========================================
    // 2. SCROLL PROGRESS & STICKY NAVBAR
    // =========================================
    const progressBar = document.querySelector('.scroll-progress');
    const header = document.getElementById('header');
    const scrollToTopBtn = document.getElementById('scrollToTop');

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        if (progressBar) progressBar.style.width = scrolled + "%";

        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        if (scrollToTopBtn) {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        }
    });

    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }


    // =========================================
    // 3. BACKGROUND ANIMATION: "SMOOTH BREATHING PARTICLES"
    // Animasi: Sangat halus, lambat, dan bersih (Clean)
    // =========================================
    const canvas = document.getElementById('bg-canvas');
    
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        const spacing = 60; // Jarak lebih lebar untuk kesan bersih (clean)

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        }

        function initParticles() {
            particles = [];
            for (let x = 0; x < width + spacing; x += spacing) {
                for (let y = 0; y < height + spacing; y += spacing) {
                    particles.push({
                        x: x,
                        y: y,
                        originX: x,
                        originY: y,
                        // Kecepatan sangat rendah untuk kehalusan (Smoothness)
                        vx: (Math.random() - 0.5) * 0.2, 
                        vy: (Math.random() - 0.5) * 0.2,
                        baseAlpha: 0.04, // Opasitas rendah
                        alpha: 0.04
                    });
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            
            const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
            const r = isDark ? 255 : 15;
            const g = isDark ? 255 : 23;
            const b = isDark ? 255 : 42;

            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                // Batas pergerakan agar tetap dalam grid (Disciplined)
                const distOrigin = Math.hypot(p.x - p.originX, p.y - p.originY);
                if (distOrigin > 15) {
                    p.vx *= -1;
                    p.vy *= -1;
                }

                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha})`;
                ctx.beginPath();
                // Menggunakan lingkaran (arc) untuk visual yang lebih lembut
                ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
                ctx.fill();

                if (p.alpha > p.baseAlpha) {
                    p.alpha -= 0.001; 
                }
            });
            requestAnimationFrame(animate);
        }

        window.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            particles.forEach(p => {
                const dx = mouseX - p.x;
                const dy = mouseY - p.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                
                // Efek hover halus
                if (dist < 180) {
                    p.alpha = 0.25 - (dist / 600); 
                }
            });
        });

        window.addEventListener('resize', resize);
        resize();
        animate();
    }


    // =========================================
    // 4. THEME TOGGLE
    // =========================================
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    const icon = themeToggle ? themeToggle.querySelector('i') : null;

    if (themeToggle && icon) {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        html.setAttribute('data-theme', savedTheme);
        updateIcon(savedTheme);

        themeToggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateIcon(newTheme);
        });

        function updateIcon(theme) {
            if (theme === 'light') {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            } else {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
        }
    }


    // =========================================
    // 5. MOBILE MENU
    // =========================================
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        links.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }


    // =========================================
    // 6. ANIMASI LANJUTAN (GSAP)
    // =========================================
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // A. Hero Animations
        const tl = gsap.timeline();
        tl.from('.logo', { y: -20, opacity: 0, duration: 1 })
          .from('.nav-links li', { y: -20, opacity: 0, stagger: 0.1, duration: 0.8 }, "-=0.5")
          .from('.hero-text > *', { y: 30, opacity: 0, stagger: 0.2, duration: 1 }, "-=0.5")
          .from('.hero-visual', { x: 30, opacity: 0, duration: 1 }, "-=0.8");

        // B. Section Headers Reveal
        gsap.utils.toArray('.section-header, .about-text').forEach(el => {
            gsap.from(el, {
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                },
                y: 40,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out"
            });
        });

        // C. ITEM STAGGER ANIMATIONS (Relevan per Item)
        
        // 1. Skill Categories
        gsap.from('.skill-category', {
            scrollTrigger: { trigger: '.skills-wrapper', start: "top 85%" },
            y: 50, opacity: 0, duration: 0.6, stagger: 0.2, ease: "back.out(1.7)"
        });

        // 2. Project Cards
        gsap.from('.project-card', {
            scrollTrigger: { trigger: '.projects-grid', start: "top 80%" },
            y: 50, opacity: 0, duration: 0.8, stagger: 0.2, ease: "power2.out"
        });

        // 3. Contact Info Items
        gsap.from('.info-item', {
            scrollTrigger: { trigger: '.contact-info', start: "top 85%" },
            x: -20, opacity: 0, duration: 0.5, stagger: 0.1, ease: "power1.out"
        });

        // 4. Contact Form Inputs (New Stagger)
        gsap.from('.input-group', {
            scrollTrigger: { trigger: '#contactForm', start: "top 85%" },
            y: 20, opacity: 0, duration: 0.5, stagger: 0.1, ease: "power2.out"
        });

        // D. STATS COUNTER & SKILL BARS FIX
        
        // Fix 1: Stats Counter
        const stats = document.querySelectorAll('.stat-num'); 
        stats.forEach(stat => {
            let targetText = stat.getAttribute('data-target') || stat.innerText;
            const rawTarget = targetText.replace(/[^0-9]/g, ''); 
            const target = parseInt(rawTarget);
            
            if (!isNaN(target)) {
                stat.innerText = "0+"; 
                ScrollTrigger.create({
                    trigger: stat,
                    start: "top 90%", 
                    once: true, 
                    onEnter: () => {
                        let current = 0;
                        const increment = target < 50 ? 1 : Math.ceil(target / 50); 
                        const speed = target < 10 ? 100 : 30; 
                        const timer = setInterval(() => {
                            current += increment;
                            if (current >= target) {
                                stat.innerText = target + "+";
                                clearInterval(timer);
                            } else {
                                stat.innerText = current + "+";
                            }
                        }, speed);
                    }
                });
            }
        });

        // Fix 2: Skill Bars Animation
        const skillBars = document.querySelectorAll('.progress');
        skillBars.forEach(bar => {
            const width = bar.getAttribute('data-width') || '0%';
            // Reset width awal agar animasi terlihat
            bar.style.width = '0%';
            
            ScrollTrigger.create({
                trigger: bar,
                start: "top 90%", // Trigger saat bar hampir terlihat
                onEnter: () => {
                    // Animasi CSS width
                    bar.style.width = width;
                }
            });
        });
    }


    // =========================================
    // 7. TYPEWRITER EFFECT
    // =========================================
    const typeElement = document.querySelector('.typewriter-text');
    if (typeElement) {
        const texts = ["Robust Systems", "Clean Architecture", "Data Insights"];
        let count = 0;
        let index = 0;
        let currentText = "";
        let letter = "";
        let isDeleting = false;
        
        (function type() {
            if (count === texts.length) { count = 0; }
            currentText = texts[count];

            if (isDeleting) {
                letter = currentText.slice(0, --index);
            } else {
                letter = currentText.slice(0, ++index);
            }

            typeElement.textContent = letter;
            let typeSpeed = 100;
            if (isDeleting) typeSpeed = 50;

            if (!isDeleting && letter.length === currentText.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && letter.length === 0) {
                isDeleting = false;
                count++;
                typeSpeed = 500;
            }
            setTimeout(type, typeSpeed);
        })();
    }


    // =========================================
    // 8. 3D TILT EFFECT
    // =========================================
    const tiltCards = document.querySelectorAll('.tilt-element, .project-card');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });


    // =========================================
    // 9. MODAL POPUP LOGIC
    // =========================================
    const modal = document.getElementById('projectModal');
    const closeBtn = document.querySelector('.close-modal');
    const projectTriggers = document.querySelectorAll('.project-trigger');
    
    const projectData = {
        1: {
            title: "Resep Makanan App",
            category: "Mobile Application",
            desc: "Aplikasi mobile Flutter dengan arsitektur bersih. Fitur utama mencakup pencarian resep, filtering, dan integrasi API.",
            tech: ["Flutter", "Dart", "API Integration", "Firebase"],
            link: "#"
        },
        2: {
            title: "NoteLite PWA",
            category: "Progressive Web App",
            desc: "Aplikasi pencatat offline-first dengan sinkronisasi background dan antarmuka minimalis.",
            tech: ["JavaScript", "HTML5", "CSS3", "PWA"],
            link: "#"
        },
        3: {
            title: "Smart Farming Dashboard",
            category: "IoT / Web",
            desc: "Dashboard real-time untuk memantau sensor pertanian presisi tinggi. Data divisualisasikan menggunakan grafik interaktif.",
            tech: ["React.js", "Node.js", "MQTT", "Chart.js"],
            link: "#"
        }
    };

    if (projectTriggers && modal) {
        projectTriggers.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = btn.getAttribute('data-id');
                const data = projectData[id];
                
                if(data) {
                    document.getElementById('modalTitle').textContent = data.title;
                    document.getElementById('modalCategory').textContent = data.category;
                    document.getElementById('modalDesc').textContent = data.desc;
                    document.getElementById('modalLink').href = data.link;
                    
                    const techContainer = document.getElementById('modalTech');
                    techContainer.innerHTML = '';
                    data.tech.forEach(tech => {
                        const span = document.createElement('span');
                        span.className = 'modal-badge';
                        span.textContent = tech;
                        span.style.marginRight = '5px';
                        techContainer.appendChild(span);
                    });
                    modal.classList.add('active');
                }
            });
        });

        closeBtn.addEventListener('click', () => { modal.classList.remove('active'); });
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });
    }


    // =========================================
    // 10. FORM SUBMIT SIMULATION
    // =========================================
    const form = document.getElementById('contactForm');
    if (form) {
        const btnText = form.querySelector('.btn-text');
        const loader = form.querySelector('.loader');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            btnText.style.display = 'none';
            loader.style.display = 'block';

            setTimeout(() => {
                btnText.style.display = 'block';
                loader.style.display = 'none';
                btnText.textContent = "Terkirim!";
                form.reset();
                setTimeout(() => { btnText.textContent = "Kirim Pesan"; }, 3000);
            }, 2000);
        });
    }


    // =========================================
    // 11. SERVICE WORKER REGISTRATION
    // =========================================
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('SW Registered!', reg.scope))
            .catch(err => console.log('SW Registration Failed:', err));
    }

});