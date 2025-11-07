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

        sideMenu.querySelectorAll('.side-nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                sideMenu.classList.remove('open');
            });
        });

        document.addEventListener('click', (event) => {
            if (!sideMenu.contains(event.target) && !menuToggle.contains(event.target) && sideMenu.classList.contains('open')) {
                sideMenu.classList.remove('open');
            }
        });
    }

    const TRANSLATION_CACHE_KEY = 'translationCache';
    const CACHE_EXPIRY_DAYS = 7;
    const originalTranslations = {};
    const originalPlaceholders = {};

    const manualTranslations = {
        en: {
            'projects.launchpad': `I chose to create this portfolio as my main project because it brings together my interests: web development, clearly presenting my career path, and showcasing my technical skills. This site allows me to practice HTML, CSS, and JavaScript while creating a professional tool for my job applications and network.<br><br>It's also a testing ground: accessibility, responsive design, light/dark mode, and integration of dynamic content (articles, experiences, contacts). With each update, I improve the structure, performance, and usability.`
        }
    };

    function applyManualTranslations(targetLang) {
        if (targetLang === 'en') {
            const langData = manualTranslations[targetLang];

            if (langData) {
                document.querySelectorAll('[data-i18n]').forEach(element => {
                    const key = element.dataset.i18n;
                    if (langData[key]) {
                        element.innerHTML = langData[key];
                    }
                });
            }

            return true;
        }

        return false;
    }

    async function translatePage(targetLang) {
        const langName = targetLang === 'en' ? 'English' : 'French';

        // Apply manual translations if available
        const manualApplied = applyManualTranslations(targetLang);

        if (manualApplied) {
            const notification = `\u2705 Page displayed in ${langName}`;
            console.log(notification);
            return;
        }

        console.log(`Translation to ${langName} not implemented yet.`);
    }

    function initLanguageSelector() {
        const languageToggle = document.getElementById('languageToggle');
        if (!languageToggle) return;

        languageToggle.addEventListener('change', async (e) => {
            const newLang = e.target.value;
            localStorage.setItem('selectedLang', newLang);

            await translatePage(newLang);
        });

        const currentLang = localStorage.getItem('selectedLang') || 'fr';
        if (currentLang !== 'fr') {
            translatePage(currentLang);
        }
    }

    captureOriginalTranslations();
    initLanguageSelector();

    function captureOriginalTranslations() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.dataset.i18n;
            if (!key) return;
            if (!originalTranslations[key]) {
                originalTranslations[key] = element.innerHTML.trim();
            }
        });
    }
});