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

            // Lightbox behavior
            if (cvPhoto && lightbox && lightboxImage) {
                cvPhoto.style.cursor = 'zoom-in';
                cvPhoto.addEventListener('click', () => {
                    lightboxImage.src = cvPhoto.src;
                    lightbox.classList.add('open');
                    lightbox.setAttribute('aria-hidden', 'false');
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
                window.addEventListener('scroll', onScrollOrResize, { passive: true });
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