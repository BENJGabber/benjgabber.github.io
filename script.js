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
    // AUTO-TRANSLATION SYSTEM
    // ===========================

    const TRANSLATION_CACHE_KEY = 'translationCache';
    const CACHE_EXPIRY_DAYS = 7;

    // Langues disponibles
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
        },
        {
            code: 'de',
            name: 'Deutsch',
            flag: '🇩🇪'
        },
        {
            code: 'it',
            name: 'Italiano',
            flag: '🇮🇹'
        },
        {
            code: 'pt',
            name: 'Português',
            flag: '🇵🇹'
        },
        {
            code: 'nl',
            name: 'Nederlands',
            flag: '🇳🇱'
        },
        {
            code: 'pl',
            name: 'Polski',
            flag: '🇵🇱'
        },
        {
            code: 'ru',
            name: 'Русский',
            flag: '🇷🇺'
        },
        {
            code: 'ja',
            name: '日本語',
            flag: '🇯🇵'
        },
        {
            code: 'zh',
            name: '中文',
            flag: '🇨🇳'
        },
        {
            code: 'ar',
            name: 'العربية',
            flag: '🇸🇦'
        }
    ];

    // Cache management
    function getCache() {
        try {
            const cache = localStorage.getItem(TRANSLATION_CACHE_KEY);
            if (!cache) return {};
            const parsed = JSON.parse(cache);
            const now = Date.now();
            // Check if cache is expired
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

    // Translation function using LibreTranslate
    async function translateText(text, targetLang) {
        if (targetLang === 'fr' || !text) return text;

        // Check cache first
        const cached = getCachedTranslation(text, targetLang);
        if (cached) return cached;

        try {
            const response = await fetch('https://libretranslate.com/translate', {
                method: 'POST',
                body: JSON.stringify({
                    q: text,
                    source: 'fr',
                    target: targetLang,
                    format: 'text'
                }),
                headers: {
                    'Content-Type': 'application/json'
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
            return text; // Return original text on error
        }
    }

    // Show translation notification
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

        // Add animations
        if (!document.querySelector('#translationNotificationStyle')) {
            const style = document.createElement('style');
            style.id = 'translationNotificationStyle';
            style.textContent = `
                @keyframes slideDown {
                    from { 
                        opacity: 0;
                        transform: translate(-50%, -20px);
                    }
                    to { 
                        opacity: 1;
                        transform: translate(-50%, 0);
                    }
                }
                @keyframes slideUp {
                    from { 
                        opacity: 1;
                        transform: translate(-50%, 0);
                    }
                    to { 
                        opacity: 0;
                        transform: translate(-50%, -20px);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Translate all elements with data-i18n
    async function translatePage(targetLang) {
        if (targetLang === 'fr') {
            // Reload page to restore original French text
            location.reload();
            return;
        }

        showTranslationNotification('Traduction en cours...');

        const elements = document.querySelectorAll('[data-i18n]');
        const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');

        let translatedCount = 0;
        const total = elements.length + placeholderElements.length;

        try {
            // Translate text content
            for (const element of elements) {
                const originalText = element.textContent.trim();
                if (originalText) {
                    const translated = await translateText(originalText, targetLang);
                    element.textContent = translated;
                    translatedCount++;

                    // Small delay to avoid rate limiting
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            }

            // Translate placeholders
            for (const element of placeholderElements) {
                const originalText = element.getAttribute('placeholder');
                if (originalText) {
                    const translated = await translateText(originalText, targetLang);
                    element.setAttribute('placeholder', translated);
                    translatedCount++;

                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            }

            const langName = (languages.find(l => l.code === targetLang)?.name) || targetLang;
            showTranslationNotification(`✅ Page traduite en ${langName}`);
        } catch (error) {
            console.error('Translation error:', error);
            showTranslationNotification('Erreur de traduction', true);
        }
    }

    // Initialize language selector
    function initLanguageSelector() {
        const languageToggle = document.getElementById('languageToggle');
        if (!languageToggle) return;

        // Convert button to dropdown
        const currentLang = localStorage.getItem('selectedLang') || 'fr';

        // Create dropdown
        const dropdown = document.createElement('select');
        dropdown.id = 'languageDropdown';
        dropdown.className = 'lang-toggle';
        dropdown.style.cssText = `
            background: rgba(255, 255, 255, 0.1);
            border: 2px solid rgba(255, 255, 255, 0.2);
            border-radius: 20px;
            padding: 6px 12px;
            color: #fff;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 600;
            appearance: none;
            padding-right: 30px;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='white' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 10px center;
        `;

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

    // Initialize on page load
    initLanguageSelector();
});

// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

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
