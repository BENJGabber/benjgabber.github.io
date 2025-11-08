document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const sideMenu = document.getElementById('sideMenu');
    const navLinks = document.getElementById('navLinks');
    const cvPhoto = document.getElementById('cvPhoto');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');

    if (menuToggle && sideMenu) {
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
    }

    // Easter Egg: Click counter on photo
    let clickCount = 0;
    let clickTimer = null;
    const CLICK_THRESHOLD = 10;
    const RESET_DELAY = 3000;

    function openLightbox() {
        if (!cvPhoto || !lightbox || !lightboxImage) return;
        lightboxImage.src = cvPhoto.src;
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
    }

    if (cvPhoto && lightbox && lightboxImage) {
        cvPhoto.style.cursor = 'pointer';
        cvPhoto.addEventListener('click', (e) => {
            clickCount++;
            clearTimeout(clickTimer);
            clickTimer = setTimeout(() => {
                if (clickCount > 0 && clickCount < CLICK_THRESHOLD) {
                    openLightbox();
                }
                clickCount = 0;
            }, RESET_DELAY);

            if (clickCount === CLICK_THRESHOLD) {
                e.stopPropagation();
                clearTimeout(clickTimer);
                showEasterEgg();
                clickCount = 0;
                return;
            }

            if (clickCount === 5) {
                showClickHint('À mi-chemin... 🤔');
            } else if (clickCount === 8) {
                showClickHint('Encore un peu... 👀');
            }
            return;
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target === lightboxImage.parentElement) {
                lightbox.classList.remove('open');
                lightbox.setAttribute('aria-hidden', 'true');
                lightboxImage.src = '';
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('open')) {
                lightbox.classList.remove('open');
                lightbox.setAttribute('aria-hidden', 'true');
                lightboxImage.src = '';
            }
        });
    }

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

    function showEasterEgg() {
        const facts = [
            "🎮 Fun Fact: J'adore démonter et réparer des appareils électroniques depuis mon plus jeune âge !",
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

        const closeBtn = modal.querySelector('#closeEasterEgg');
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.transform = 'scale(1.05)';
            closeBtn.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
        });
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.transform = 'scale(1)';
            closeBtn.style.boxShadow = 'none';
        });

        closeBtn.addEventListener('click', () => {
            overlay.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => overlay.remove(), 300);
        });

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
        const ease = 0.12;
        const topMargin = 120;

        cvImageBox.style.willChange = 'transform';
        cvImageBox.style.transform = 'translateY(0px)';

        function clamp(value, min, max) {
            return Math.min(Math.max(value, min), max);
        }

        function isMobile() {
            return window.matchMedia('(max-width: 768px)').matches;
        }

        function computeTargetOffset() {
            if (isMobile()) {
                return 0;
            }

            const contentRect = cvContent.getBoundingClientRect();
            const imageRect = cvImageBox.getBoundingClientRect();
            const rawOffset = topMargin - contentRect.top;
            const maxOffset = Math.max(0, contentRect.height - imageRect.height);
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

        onScrollOrResize();
        animationFrameId = requestAnimationFrame(animate);
        window.addEventListener('scroll', onScrollOrResize, {
            passive: true
        });
        window.addEventListener('resize', onScrollOrResize);

        window.addEventListener('beforeunload', () => {
            cancelAnimationFrame(animationFrameId);
        });
    }

    // ===========================
    // ENHANCED AUTO-TRANSLATION SYSTEM
    // ===========================

    const TRANSLATION_CACHE_KEY = 'translationCache';
    const CACHE_EXPIRY_DAYS = 7;
    const originalTranslations = {};
    const originalPlaceholders = {};

    // Manual translations for English (instant display)
    const manualTranslations = {
        en: {
            'nav.brand': 'My Portfolio',
            'nav.home': 'Home',
            'nav.about': 'About',
            'nav.journey': 'Journey & Experience',
            'nav.path': 'Journey & Experience',
            'nav.projects': 'Projects',
            'nav.articles': 'Articles',
            'nav.forum': 'Forum',
            'nav.contact': 'Contact',
            'hero.title': 'Hello, welcome to my interactive portfolio',
            'hero.subtitle': 'Student in Final year of Professional C.I.E.L Baccalaureate',
            'hero.description': "Passionate about IT and electronics, I am currently developing my technical skills in networking, electronics, web development and cybersecurity. My goal is to continue my studies in cybersecurity while applying my knowledge to real-world projects.",
            'hero.ctaJourney': 'My journey',
            'hero.ctaArticles': 'Articles',
            'hero.discover': 'Discover my world<span class="scroll-arrow">↓</span>',
            'about.title': 'About me',
            'about.subtitle': 'Student in Bac Pro C.I.E.L',
            'about.email': '📧 Email:',
            'about.phone': '📱 Phone:',
            'about.address': '📍 Address:',
            'about.age': '🎂 Age:',
            'about.profile': 'Profile',
            'about.objectives': 'Goals',
            'about.profileText': 'Motivated student in the Bac Pro CIEL (Cybersecurity, IT and Networks, Electronics). I am passionate about computers in general, especially repair, user support and network management. My journey has helped me build strong skills in programming, network administration and cybersecurity. I also self-train in troubleshooting and maintenance.',
            'about.objectivesText': "My goal is to continue my studies, ideally through a work-study program so I can progressively enter the professional world. I would love to work in device repair, but I would also enjoy roles in network and IT management.",
            'formation.title': 'My Academic Background',
            'formation.subtitle.one': "Professoinal C.I.E.L Baccalaureate (second and last high-school years",
            'formation.subtitle.two': "First year of high-school in general studies",
            'formation.subtitle.three': "Middle-school years",
            'formation.experiences': 'My Experiences',
            'projects.title': 'My Projects & Learning',
            'projects.subtitle': 'Why this project, my past projects and what I learned from them',
            'projects.why.title': 'Why I chose this project',
            'projects.why.desc': "I chose to create this portfolio as my main project because it brings together my interests: web development, clearly presenting my career path, and showcasing my technical skills. This site allows me to practice HTML, CSS, and JavaScript while creating a professional tool for my job applications and network.",
            'projects.why.desc.two': "It's also a testing ground: accessibility, responsive design, light/dark mode, and integration of dynamic content (articles, experiences, contacts). With each update, I improve the structure, performance, and usability.",
            'projects.past': 'My past projects',
            'projects.onlineLaunchpad': "The 'Launchpad' website replicates a musical device called a 'launchpad' which supposedly allowed users to create sounds using buttons. This project allowed me to discover the basics of JavaScript while testing my existing HTML and CSS skills, acquired through my coursework and a mini-website I created during my final year of middle-school internship.",
            'projects.LDLCLONE': "I created a website that was a clone of the online sales platform 'LDLC,' with a simple interface using the colors of the Saint-Luc school logo. However, I ended up changing projects because it was far too ambitious and I lacked the necessary skills to complete it properly. I even tried learning React to develop it, but I still wasn't able to do it correctly",
            'projects.learned.title': 'What I learned',
            'projects.learned.element.one': "Website organization: clear navigation, visual consistency, responsive design.",
            'projects.learned.element.two': "Reusable components: cards, buttons, forms with consistent styles.",
            'projects.learned.element.three': "Front-end JavaScript: interactions (side menu, lightbox, light/dark theme).",
            'projects.learned.element.four': "Quality: code readability, separation of structure/style/script, multi-screen visual testing.",
            'contact.title': 'Contact Me',
            'contact.subtitle': 'A question? A project? Feel free to contact me!',
            'contact.form.title': '📨 Send me a message',
            'contact.form.name.label': 'Full Name *',
            'contact.form.name.ph': 'Your name',
            'contact.form.email.label': 'Email *',
            'contact.form.email.ph': 'your@email.com',
            'contact.form.subject.label': 'Subject *',
            'contact.form.subject.ph': 'Subject of your message',
            'contact.form.message.label': 'Message *',
            'contact.form.message.ph': 'Your message...',
            'contact.form.submit': 'Send message',
            'contact.form.success': '✅ Message sent successfully! I will reply quickly.',
            'contact.form.error': '❌ An error occurred. Please try again.',
            'contact.info.title': '📞 My contact details',
            'contact.info.email': 'Email',
            'contact.info.phone': 'Phone',
            'contact.info.location': 'Location',
            'contact.info.location.value': 'Auberchicourt, Nord',
            'contact.social.title': '🌐 Social Media',
            'contact.cv.title': '📄 My CV',
            'contact.cv.desc': 'Download my complete CV in PDF format',
            'contact.cv.button': 'Download my CV',
            'forum.title': 'ADEPEM Forum',
            'forum.subtitle': 'Latest community discussions in real time',
            'forum.search': '🔍 Search for a discussion...',
            'forum.refresh': 'Refresh',
            'forum.visit': 'Visit forum',
            'forum.loading': 'Loading discussions...',
            'forum.retry': 'Retry',
            'forum.noresults.title': 'No discussion found',
            'forum.noresults.desc': 'Try another search or refresh the page'
        }
    };

    const manualPlaceholderTranslations = {
        en: {
            'contact.form.name.ph': 'Your name',
            'contact.form.email.ph': 'your@email.com',
            'contact.form.subject.ph': 'Subject of your message',
            'contact.form.message.ph': 'Your message...',
            'forum.search': '🔍 Search for a discussion...'
        }
    };

    // Languages available
    const languages = [{
            code: 'fr',
            name: 'Français',
            flag: '🇫🇷'
        },
        {
            code: 'en',
            name: 'English',
            flag: '🇬🇧'
        },
        {
            code: 'es',
            name: 'Español',
            flag: '🇪🇸'
        }
    ];

    // Capture original French text
    function captureOriginalTranslations() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.dataset.i18n;
            if (!key) return;
            if (!originalTranslations[key]) {
                originalTranslations[key] = element.innerHTML.trim();
            }
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.dataset.i18nPlaceholder;
            if (!key) return;
            if (!originalPlaceholders[key]) {
                originalPlaceholders[key] = element.getAttribute('placeholder');
            }
        });
    }

    // Cache management
    function getCache() {
        try {
            const cache = localStorage.getItem(TRANSLATION_CACHE_KEY);
            if (!cache) return {};
            const parsed = JSON.parse(cache);
            const now = Date.now();
            if (parsed.timestamp && (now - parsed.timestamp) > CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000) {
                localStorage.removeItem(TRANSLATION_CACHE_KEY);
                return {};
            }
            return parsed.data || {};
        } catch (e) {
            return {};
        }
    }

    function saveCache(cache) {
        try {
            localStorage.setItem(TRANSLATION_CACHE_KEY, JSON.stringify({
                timestamp: Date.now(),
                data: cache
            }));
        } catch (e) {
            console.warn('Could not save translation cache:', e);
        }
    }

    function getCachedTranslation(text, targetLang) {
        const cache = getCache();
        const key = `${text}|${targetLang}`;
        return cache[key];
    }

    function setCachedTranslation(text, targetLang, translation) {
        const cache = getCache();
        const key = `${text}|${targetLang}`;
        cache[key] = translation;
        saveCache(cache);
    }

    // Translation using LibreTranslate
    async function translateText(text, targetLang) {
        if (!text || !text.trim()) return text;
        if (targetLang === 'fr') return text;

        // Check cache first
        const cached = getCachedTranslation(text, targetLang);
        if (cached) return cached;

        try {
            // Clean HTML tags for translation
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = text;
            const plainText = tempDiv.textContent || tempDiv.innerText || '';

            if (!plainText.trim()) return text;

            const response = await fetch('https://libretranslate.com/translate', {
                method: 'POST',
                body: JSON.stringify({
                    q: plainText,
                    source: 'fr',
                    target: targetLang,
                    format: 'text'
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Translation failed');
            }

            const data = await response.json();
            const translation = data.translatedText;

            // Cache the translation
            setCachedTranslation(text, targetLang, translation);

            return translation;
        } catch (error) {
            console.error('Translation error:', error);
            return text;
        }
    }

    // Show notification
    function showTranslationNotification(message, isError = false) {
        const existing = document.getElementById('translationNotification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.id = 'translationNotification';
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: ${isError ? 'rgba(239, 68, 68, 0.95)' : 'rgba(168, 85, 247, 0.95)'};
            color: white;
            padding: 12px 24px;
            border-radius: 10px;
            font-weight: 600;
            z-index: 9999;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            animation: slideDown 0.3s ease;
            display: flex;
            align-items: center;
            gap: 10px;
        `;

        notification.innerHTML = `
            <span>${isError ? '⚠️' : '🌐'}</span>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);

        if (!document.querySelector('#translationNotificationStyle')) {
            const style = document.createElement('style');
            style.id = 'translationNotificationStyle';
            style.textContent = `
                @keyframes slideDown {
                    from { opacity: 0; transform: translate(-50%, -20px); }
                    to { opacity: 1; transform: translate(-50%, 0); }
                }
                @keyframes slideUp {
                    from { opacity: 1; transform: translate(-50%, 0); }
                    to { opacity: 0; transform: translate(-50%, -20px); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Apply manual translations (for English)
    function applyManualTranslations(targetLang) {
        if (targetLang === 'fr') {
            // Restore French
            document.querySelectorAll('[data-i18n]').forEach(element => {
                const key = element.dataset.i18n;
                if (originalTranslations[key]) {
                    element.innerHTML = originalTranslations[key];
                }
            });

            document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
                const key = element.dataset.i18nPlaceholder;
                if (originalPlaceholders[key]) {
                    element.setAttribute('placeholder', originalPlaceholders[key]);
                }
            });
            return true;
        }

        if (targetLang === 'en') {
            const langData = manualTranslations[targetLang];
            const placeholderData = manualPlaceholderTranslations[targetLang];

            if (langData) {
                document.querySelectorAll('[data-i18n]').forEach(element => {
                    const key = element.dataset.i18n;
                    if (langData[key]) {
                        element.innerHTML = langData[key];
                    }
                });
            }

            if (placeholderData) {
                document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
                    const key = element.dataset.i18nPlaceholder;
                    if (placeholderData[key]) {
                        element.setAttribute('placeholder', placeholderData[key]);
                    }
                });
            }
            return true;
        }

        return false;
    }

    // Translate all page elements
    async function translatePage(targetLang) {
        const langName = languages.find(l => l.code === targetLang) ?.name || targetLang;

        // Apply manual translations if available
        const manualApplied = applyManualTranslations(targetLang);

        if (manualApplied) {
            showTranslationNotification(`✅ Page displayed in ${langName}`);
            return;
        }

        // Otherwise, use auto-translation
        showTranslationNotification(`🌐 Translating to ${langName}...`);

        const elements = document.querySelectorAll('[data-i18n]');
        const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');

        try {
            // Translate text content
            for (const element of elements) {
                const key = element.dataset.i18n;
                const originalText = originalTranslations[key] || element.textContent.trim();

                if (originalText) {
                    const translated = await translateText(originalText, targetLang);
                    element.innerHTML = translated;
                    await new Promise(resolve => setTimeout(resolve, 100)); // Rate limiting
                }
            }

            // Translate placeholders
            for (const element of placeholderElements) {
                const key = element.dataset.i18nPlaceholder;
                const originalText = originalPlaceholders[key] || element.getAttribute('placeholder');

                if (originalText) {
                    const translated = await translateText(originalText, targetLang);
                    element.setAttribute('placeholder', translated);
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            }

            showTranslationNotification(`✅ Page translated to ${langName}`);
        } catch (error) {
            console.error('Translation error:', error);
            showTranslationNotification('Translation error occurred', true);
        }
    }

    // Initialize language selector
    function initLanguageSelector() {
        const languageToggle = document.getElementById('languageToggle');
        if (!languageToggle) return;

        const currentLang = localStorage.getItem('selectedLang') || 'fr';

        // Create dropdown
        const dropdown = document.createElement('select');
        dropdown.id = 'languageDropdown';
        dropdown.className = 'lang-toggle language-select';

        // Add options
        languages.forEach(lang => {
            const option = document.createElement('option');
            option.value = lang.code;
            option.textContent = `${lang.flag} ${lang.name}`;
            if (lang.code === currentLang) {
                option.selected = true;
            }
            dropdown.appendChild(option);
        });

        // Replace button with dropdown
        languageToggle.parentNode.replaceChild(dropdown, languageToggle);

        // Handle language change
        dropdown.addEventListener('change', async (e) => {
            const newLang = e.target.value;
            localStorage.setItem('selectedLang', newLang);

            dropdown.disabled = true;
            dropdown.style.opacity = '0.5';

            await translatePage(newLang);

            dropdown.disabled = false;
            dropdown.style.opacity = '1';
        });

        // Apply saved language on load
        if (currentLang !== 'fr') {
            translatePage(currentLang);
        }
    }

    // Initialize translation system
    captureOriginalTranslations();
    initLanguageSelector();
}); // <-- This was missing!

// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

if (themeToggle) {
    const currentTheme = localStorage.getItem('theme') || 'dark';
    if (currentTheme === 'light') {
        body.classList.add('light-mode');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        const theme = body.classList.contains('light-mode') ? 'light' : 'dark';
        localStorage.setItem('theme', theme);
        themeToggle.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            themeToggle.style.transform = 'rotate(0deg)';
        }, 300);
    });
}