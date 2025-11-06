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