document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const sideMenu = document.getElementById('sideMenu');
    const navLinks = document.getElementById('navLinks');
    const cvPhoto = document.getElementById('cvPhoto');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');

    menuToggle.addEventListener('click', () => {
        sideMenu.classList.toggle('open');
    });

    // Close side menu when a link is clicked
    sideMenu.querySelectorAll('.side-nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            sideMenu.classList.remove('open');
        });
    });

    // Optional: Close side menu if clicked outside (for better UX)
    document.addEventListener('click', (event) => {
        if (!sideMenu.contains(event.target) && !menuToggle.contains(event.target) && sideMenu.classList.contains('open')) {
            sideMenu.classList.remove('open');
        }
    });

    // Easter Egg: Click counter on photo
    let clickCount = 0;
    let clickTimer = null;
    const CLICK_THRESHOLD = 10;
    const RESET_DELAY = 3000; // Reset after 3 seconds of no clicks

    // Helper: open the lightbox for the CV photo
    function openLightbox() {
        if (!cvPhoto || !lightbox || !lightboxImage) return;
        lightboxImage.src = cvPhoto.src;
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
    }

    // Lightbox behavior with easter egg
    if (cvPhoto && lightbox && lightboxImage) {
        cvPhoto.style.cursor = 'pointer';
        cvPhoto.addEventListener('click', (e) => {
            clickCount++;

            // Reset/defer timer
            clearTimeout(clickTimer);
            clickTimer = setTimeout(() => {
                // If user stopped clicking before reaching threshold, open lightbox once
                if (clickCount > 0 && clickCount < CLICK_THRESHOLD) {
                    openLightbox();
                }
                clickCount = 0; // always reset after inactivity
            }, RESET_DELAY);

            // Easter egg trigger
            if (clickCount === CLICK_THRESHOLD) {
                e.stopPropagation();
                clearTimeout(clickTimer); // cancel deferred lightbox
                showEasterEgg();
                clickCount = 0;
                return;
            }

            // Show progress hints
            if (clickCount === 5) {
                showClickHint('À mi-chemin... 🤔');
            } else if (clickCount === 8) {
                showClickHint('Encore un peu... 👀');
            }

            // While counting towards the easter egg, do NOT open the lightbox
            return;
        });

        // Close on click outside image
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target === lightboxImage.parentElement) {
                lightbox.classList.remove('open');
                lightbox.setAttribute('aria-hidden', 'true');
                lightboxImage.src = '';
            }
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('open')) {
                lightbox.classList.remove('open');
                lightbox.setAttribute('aria-hidden', 'true');
                lightboxImage.src = '';
            }
        });
    }

    // Show click hint
    function showClickHint(message) {
        const hint = document.createElement('div');
        hint.textContent = message;
        hint.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(168, 85, 247, 0.95);
            color: white;
            padding: 1rem 2rem;
            border-radius: 10px;
            font-size: 1.1rem;
            font-weight: 600;
            z-index: 9999;
            box-shadow: 0 10px 30px rgba(168, 85, 247, 0.5);
            animation: fadeInOut 1.5s ease;
        `;
        document.body.appendChild(hint);
        setTimeout(() => hint.remove(), 1500);
    }

    // Easter egg reveal
    function showEasterEgg() {
        const facts = [
            "🎮 Fun Fact: J'adore démonter et réparer des appareils électroniques depuis mon plus jeune ^ge !",
            "🔧 Fun Fact: Mon premier ordinateur que j'ai démonté était un vieux PC sous Windows vista qui appartenait a ma tante !",
            "💻 Fun Fact: J'ai appris le HTML/CSS en créant un site pendent mon tout premier stage de 3ème !",
            "🎯 Fun Fact: Mon rêve est de travailler dans la cybersécurité ou la réparation électronique !",
            "🌟 Fun Fact: Je passe mon temps libre a écouter de la musique en jouant a des jeux ou même en travaillant !",
            "🛠️ Fun Fact: J'ai réparé plus de 20 ordinateurs pendant mes stages !",
            "📱 Fun Fact: Mon premier site web était un clone de LDLC (un peu trop ambitieux 😅) !",
            "🎨 Fun Fact: Je compte me servir de ce Portfolio comme un artiste utiliserait un Portfolio, un peu comme un complément de CV !"
        ];

        const randomFact = facts[Math.floor(Math.random() * facts.length)];

        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.9);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
        `;

        const modal = document.createElement('div');
        modal.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 3rem;
            border-radius: 20px;
            max-width: 600px;
            text-align: center;
            box-shadow: 0 20px 60px rgba(168, 85, 247, 0.6);
            animation: scaleIn 0.4s ease;
            color: white;
        `;

        modal.innerHTML = `
            <div style="font-size: 4rem; margin-bottom: 1rem;">🎉</div>
            <h2 style="font-size: 2rem; margin-bottom: 1rem; color: white;">Bravo ! Vous avez trouvé l'Easter Egg !</h2>
            <p style="font-size: 1.2rem; line-height: 1.6; margin-bottom: 2rem; color: rgba(255,255,255,0.9);">${randomFact}</p>
            <button id="closeEasterEgg" style="
                background: white;
                color: #764ba2;
                border: none;
                padding: 12px 30px;
                border-radius: 25px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            ">Fermer</button>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Add hover effect to button
        const closeBtn = modal.querySelector('#closeEasterEgg');
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.transform = 'scale(1.05)';
            closeBtn.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
        });
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.transform = 'scale(1)';
            closeBtn.style.boxShadow = 'none';
        });

        // Close easter egg
        closeBtn.addEventListener('click', () => {
            overlay.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => overlay.remove(), 300);
        });

        // Add animations if not already present
        if (!document.querySelector('#easterEggAnimations')) {
            const style = document.createElement('style');
            style.id = 'easterEggAnimations';
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
                @keyframes fadeInOut {
                    0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                    50% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                }
                @keyframes scaleIn {
                    from { transform: scale(0.7); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Smooth delayed follow effect for CV image
    const cvSection = document.querySelector('.cv-section');
    const cvContent = document.querySelector('.cv-content');
    const cvImageWrapper = document.querySelector('.cv-image');
    const cvImageBox = document.querySelector('.image-placeholder');

    if (cvSection && cvContent && cvImageWrapper && cvImageBox) {
        let animationFrameId = 0;
        let currentOffset = 0;
        let targetOffset = 0;
        const ease = 0.12; // delay factor for smoothness
        const topMargin = 120; // start following after this margin from top (accounts for fixed nav)

        // Improve rendering
        cvImageBox.style.willChange = 'transform';
        cvImageBox.style.transform = 'translateY(0px)';

        function clamp(value, min, max) {
            return Math.min(Math.max(value, min), max);
        }

        // ===========================
        // Language Toggle & i18n
        // ===========================
        const translations = {
            fr: {
                // Nav
                'nav.home': 'Accueil',
                'nav.about': 'À propos',
                'nav.path': 'Parcours et Experiences',
                'nav.projects': 'Projets',
                'nav.articles': 'Articles',
                'nav.contact': 'Contact',
                'nav.forum': 'Forum',
                'hero.title': 'Bonjour, bienvenu sur mon Portfolio interactif',
                'hero.subtitle': 'Étudiant en Terminale Bac Pro C.I.E.L',
                'hero.description': "passionné par l'informatique et l'électronique, je développe actuellement mes compétences techniques en réseaux, électronique, dévloppement web et sécurité informatique. Mon objectif est de poursuivre mes études dans le domaine de la cybersécurité tout en appliquant mes connaissances dans des projets concrets.",
                'hero.ctaJourney': 'Mon parcours',
                'hero.ctaArticles': 'Articles',
                'hero.discover': 'Découvrez mon univers',
                'about.title': 'À propos de moi',
                'about.subtitle': 'Étudiant en Bac Pro C.I.E.L',
                'about.email': '📧 Email :',
                'about.phone': '📱 Téléphone :',
                'about.address': '📍 Adresse :',
                'about.age': '🎂 Âge :',
                'about.profile': 'Profil',
                'about.objectives': 'Objectifs',
                // Formation page
                'formation.title': 'Mon Parcours Scolaire',
                'formation.experiences': 'Mes Expériences',
                // Projects page
                'projects.title': 'Mes Projets & Apprentissages',
                'projects.subtitle': "Pourquoi ce projet, mes projets passés et ce que j'en ai tiré",
                'projects.why.title': "Pourquoi j'ai choisi ce projet",
                'projects.past': 'Mes projets passés',
                'projects.learned.title': "Ce que j'ai appris",
                // Forum page
                'forum.title': 'Forum ADEPEM',
                'forum.subtitle': 'Dernières discussions de la communauté en temps réel',
                'forum.search': '🔍 Rechercher une discussion...',
                'forum.refresh': 'Actualiser',
                'forum.visit': 'Visiter le forum',
                'forum.loading': 'Chargement des discussions...',
                'forum.retry': 'Réessayer',
                'forum.noresults.title': 'Aucune discussion trouvée',
                'forum.noresults.desc': 'Essayez une autre recherche ou actualisez la page',
                // Contact page
                'contact.title': 'Contactez-moi',
                'contact.subtitle': "Une question ? Un projet ? N'hésitez pas à me contacter !",
                'contact.form.title': '📨 Envoyez-moi un message',
                'contact.form.success': '✅ Message envoyé avec succès ! Je vous répondrai rapidement.',
                'contact.form.error': "❌ Une erreur s'est produite. Veuillez réessayer.",
                'contact.form.name.label': 'Nom complet *',
                'contact.form.name.ph': 'Votre nom',
                'contact.form.email.label': 'Email *',
                'contact.form.email.ph': 'votre@email.com',
                'contact.form.subject.label': 'Sujet *',
                'contact.form.subject.ph': 'Sujet de votre message',
                'contact.form.message.label': 'Message *',
                'contact.form.message.ph': 'Votre message...',
                'contact.form.submit': 'Envoyer le message',
                'contact.info.title': '📞 Mes coordonnées',
                'contact.info.email': 'Email',
                'contact.info.phone': 'Téléphone',
                'contact.info.location': 'Localisation',
                'contact.info.location.value': 'Auberchicourt, Nord',
                'contact.social.title': '🌐 Réseaux sociaux',
                'contact.cv.title': '📄 Mon CV',
                'contact.cv.desc': 'Téléchargez mon CV complet au format PDF',
                'contact.cv.button': 'Télécharger mon CV'
            },
            en: {
                // Nav
                'nav.home': 'Home',
                'nav.about': 'About',
                'nav.path': 'Education & Experience',
                'nav.projects': 'Projects',
                'nav.articles': 'Articles',
                'nav.contact': 'Contact',
                'nav.forum': 'Forum',
                'hero.title': 'Hello, welcome to my interactive Portfolio',
                'hero.subtitle': 'Final-year student in C.I.E.L vocational baccalaureate',
                'hero.description': 'Passionate about IT and electronics, I am developing my technical skills in networking, electronics, web development and cybersecurity. My goal is to pursue studies in cybersecurity while applying my knowledge in real projects.',
                'hero.ctaJourney': 'My journey',
                'hero.ctaArticles': 'Articles',
                'hero.discover': 'Discover my world',
                'about.title': 'About me',
                'about.subtitle': 'C.I.E.L vocational student',
                'about.email': '📧 Email:',
                'about.phone': '📱 Phone:',
                'about.address': '📍 Address:',
                'about.age': '🎂 Age:',
                'about.profile': 'Profile',
                'about.objectives': 'Objectives',
                // Formation page
                'formation.title': 'My Education',
                'formation.experiences': 'My Experiences',
                // Projects page
                'projects.title': 'My Projects & Learnings',
                'projects.subtitle': 'Why this project, my past projects and what I learned',
                'projects.why.title': 'Why I chose this project',
                'projects.past': 'My past projects',
                'projects.learned.title': 'What I learned',
                // Forum page
                'forum.title': 'ADEPEM Forum',
                'forum.subtitle': 'Latest community discussions in real time',
                'forum.search': '🔍 Search a discussion...',
                'forum.refresh': 'Refresh',
                'forum.visit': 'Visit the forum',
                'forum.loading': 'Loading discussions...',
                'forum.retry': 'Retry',
                'forum.noresults.title': 'No discussions found',
                'forum.noresults.desc': 'Try another search or refresh the page',
                // Contact page
                'contact.title': 'Contact me',
                'contact.subtitle': 'A question? A project? Feel free to contact me!',
                'contact.form.title': '📨 Send me a message',
                'contact.form.success': '✅ Message sent successfully! I will get back to you soon.',
                'contact.form.error': '❌ An error occurred. Please try again.',
                'contact.form.name.label': 'Full name *',
                'contact.form.name.ph': 'Your name',
                'contact.form.email.label': 'Email *',
                'contact.form.email.ph': 'your@email.com',
                'contact.form.subject.label': 'Subject *',
                'contact.form.subject.ph': 'Subject of your message',
                'contact.form.message.label': 'Message *',
                'contact.form.message.ph': 'Your message...',
                'contact.form.submit': 'Send message',
                'contact.info.title': '📞 My contact details',
                'contact.info.email': 'Email',
                'contact.info.phone': 'Phone',
                'contact.info.location': 'Location',
                'contact.info.location.value': 'Auberchicourt, Nord',
                'contact.social.title': '🌐 Social networks',
                'contact.cv.title': '📄 My resume',
                'contact.cv.desc': 'Download my full resume in PDF format',
                'contact.cv.button': 'Download my CV'
            }
        };

        function applyTranslations(lang) {
            const dict = translations[lang] || translations.fr;
            document.querySelectorAll('[data-i18n]').forEach((el) => {
                const key = el.getAttribute('data-i18n');
                if (dict[key]) {
                    el.textContent = dict[key];
                }
            });

            // Initialize i18n regardless of when this script loads
            if (document.readyState !== 'loading') {
                // DOM is already ready
                (function() {
                    try {
                        initI18n();
                    } catch (e) {
                        /* no-op */ }
                })();
            } else {
                document.addEventListener('DOMContentLoaded', () => {
                    try {
                        initI18n();
                    } catch (e) {
                        /* no-op */ }
                });
            }
            // Placeholders
            document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
                const key = el.getAttribute('data-i18n-placeholder');
                if (dict[key]) {
                    el.setAttribute('placeholder', dict[key]);
                }
            });
            document.documentElement.setAttribute('lang', lang);
            const toggleEl = document.getElementById('languageToggle');
            if (toggleEl) {
                toggleEl.textContent = lang === 'fr' ? 'EN' : 'FR';
                toggleEl.setAttribute('aria-label', lang === 'fr' ? 'Switch language to English' : 'Changer la langue en français');
            }
        }

        function initI18n() {
            const current = localStorage.getItem('lang') || 'fr';
            applyTranslations(current);
            const toggle = document.getElementById('languageToggle');
            if (toggle) {
                // Ensure only one listener
                toggle.replaceWith(toggle.cloneNode(true));
                const freshToggle = document.getElementById('languageToggle');
                freshToggle.addEventListener('click', () => {
                    const newLang = (localStorage.getItem('lang') || 'fr') === 'fr' ? 'en' : 'fr';
                    localStorage.setItem('lang', newLang);
                    applyTranslations(newLang);
                });
            }
        }

        function isMobile() {
            return window.matchMedia('(max-width: 768px)').matches;
        }

        function computeTargetOffset() {
            if (isMobile()) {
                return 0; // disable on mobile where layout stacks
            }

            const contentRect = cvContent.getBoundingClientRect();
            const imageRect = cvImageBox.getBoundingClientRect();

            // How far the container's top is above the desired top margin
            const rawOffset = topMargin - contentRect.top;
            const maxOffset = Math.max(0, contentRect.height - imageRect.height);

            // Keep within container bounds
            return clamp(rawOffset, 0, maxOffset);
        }

        function animate() {
            currentOffset += (targetOffset - currentOffset) * ease;
            cvImageBox.style.transform = `translateY(${currentOffset.toFixed(2)}px)`;
            animationFrameId = requestAnimationFrame(animate);
        }

        function onScrollOrResize() {
            targetOffset = computeTargetOffset();
        }

        // Init and listeners
        onScrollOrResize();
        animationFrameId = requestAnimationFrame(animate);
        window.addEventListener('scroll', onScrollOrResize, {
            passive: true
        });
        window.addEventListener('resize', onScrollOrResize);

        // Cleanup if navigating away (single page)
        window.addEventListener('beforeunload', () => {
            cancelAnimationFrame(animationFrameId);
        });
    }
});

// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Check for saved theme preference or default to dark mode
const currentTheme = localStorage.getItem('theme') || 'dark';
if (currentTheme === 'light') {
    body.classList.add('light-mode');
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-mode');

    // Save theme preference
    const theme = body.classList.contains('light-mode') ? 'light' : 'dark';
    localStorage.setItem('theme', theme);

    // Add rotation animation on click
    themeToggle.style.transform = 'rotate(360deg)';
    setTimeout(() => {
        themeToggle.style.transform = 'rotate(0deg)';
    }, 300);
});