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
    const originalAria = {};

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
            'about.subtitle': 'Student in Final year of Professional C.I.E.L Baccalaureate',
            'about.email': '📧 Email:',
            'about.phone': '📱 Phone:',
            'about.address': '📍 Address:',
            'about.age': '🎂 Age:',
            'about.profile': 'Profile',
            'about.objectives': 'Goals',
            'about.profileText': 'Motivated student in Professional CIEL Baccalaureate (Cybersecurity, IT and Networks, Electronics). I am passionate about computers in general, especially repair, user support and network management. My journey has helped me build strong skills in programming, network administration and cybersecurity. I also self-train in troubleshooting and maintenance.',
            'about.objectivesText': "My goal is to continue my studies, ideally through a work-study program so I can progressively enter the professional world. I would love to work in device repair, but I would also enjoy roles in network and IT management.",
            'formation.title': 'My Academic Background',
            'formation.subtitle.one': "Professoinal C.I.E.L Baccalaureate (second and last high-school years",
            'formation.subtitle.two': "First year of general high-schcool studies",
            'formation.subtitle.three': "Middle-school years",
            'formation.desc.one': "Cybersecurity, IT and networks, Electronics. Training focused on digital systems, cybersecurity and computer networks.",
            'formation.desc.two': "Just a simple first year of general high-school studies where I discovered the CIEL program, which brought me here to Cambrai.",
            'formation.desc.three': "My middle school years allowed me to obtain my middle school diploma with honors. Not far from highest honors.",
            'formation.experiences': 'My Experiences',
            'experience.type.one': "Personal Project (to-do for my two years of baccalaureate)",
            'experience.type.two': "Enterprise Internship",
            'experience.type.three': "volunteering / activity",
            'experience.MM/YY.one': "August 2025 (2 Weeks)",
            'experience.MM/YY.two': "November 2024 (entire month)",
            'experience.MM/YY.three': "June 2024 (2 Weeks)",
            'experience.desc.one': "This 'masterpiece' was created as part of my baccalaureate. The goal was to create a website that serves as my personal portfolio, explaining all my training, studies, and experiences in the general field of computer science.",
            'experience.desc.two': "Organization of tablets for future students of a high school in Lille, diagnosis and repair of several computers, replacement of parts in desktop and laptop computers (graphics cards, processors, hard drives, heatsinks, etc.)",
            'experience.desc.three': "Preparation of around ten laptops for future MELEC students (HDD to SSD replacement, Windows 10 reinstallation and software installations), updating the Adobe suite and optimizing around twenty iMacs, installing KiCad and cleaning the disks of around thirty PCs (unfortunately, I couldn't do much because I was injured during this period).",
            'experience.desc.four': "My first internship was in a town hall, the aim being to understand how a town hall operates and how a computer network works. I supervised the installation of Wi-Fi hotspots in several primary schools in the town of Somain, and took my first steps in network management, including how an IP address works, demonstrating local ticketing software for reporting problems, and using purchase orders. I also created a dual-boot virtual machine (VM) between Windows 10 and Ubuntu, and a Windows Server 2021 VM, and took my first steps in HTML/CSS coding.",
            'experience.desc.five': "An afternoon of electronic device repairs was organized by the Auberchicourt town hall. People could come and have their electronic devices repaired for free, while also relaxing, having a coffee, and chatting. I participated to repair a broken space heater of my own and an LG television that a woman had brought in.",
            'experience.skill': "Skills :",
            'experience.company.one': "Somain Town hall",
            'experience.comp.one': "Diagnostics",
            'experience.comp.two': "Troubleshooting",
            'experience.comp.three': "Disk Cleaning",
            'experience.comp.four': "Network Management Learning",
            'experience.comp.five': "Learning HTML/CSS",
            'experience.comp.six': "Electronic Repair",
            'experience.comp.seven': "Soldering",
            'experience.comp.eight': "Use of electronic measuring tools (multimeter, etc.)",
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
                ,
                'back.toTop': 'Back to top'
        }

            ,
            es: {
                        'back.toTop': 'Volver arriba',
            'nav.brand': 'Mi Portafolio',
            'nav.home': 'Inicio',
            'nav.about': 'Sobre mí',
            'nav.journey': 'Trayectoria y experiencia',
            'nav.path': 'Trayectoria y experiencia',
            'nav.projects': 'Proyectos',
            'nav.articles': 'Artículos',
            'nav.forum': 'Foro',
            'nav.contact': 'Contacto',
            'hero.title': 'Hola, bienvenido a mi portafolio interactivo.',
            'hero.subtitle': 'Estudiante de último año del Bachillerato Profesional C.I.E.L',
            'hero.description': "Apasionado por la informática y la electrónica, actualmente estoy desarrollando mis habilidades técnicas en redes, electrónica, desarrollo web y ciberseguridad. Mi objetivo es continuar mis estudios en ciberseguridad y aplicar mis conocimientos en proyectos prácticos.",
            'hero.ctaJourney': 'Mi viaje',
            'hero.ctaArticles': 'Artículos',
            'hero.discover': 'Descubre mi mundo<span class=\"scroll-arrow\">↓</span>',
            'about.title': 'Sobre mí',
            'about.subtitle': 'Estudiante de Bachillerato Profesional C.I.E.L',
            'about.email': '📧 Correo:',
            'about.phone': '📱 Teléfono:',
            'about.address': '📍 Dirección:',
            'about.age': '🎂 Edad:',
            'about.profile': 'Perfil',
            'about.objectives': 'Objetivos',
            'about.profileText': 'Estudiante motivado del Bachillerato Profesional CIEL (Ciberseguridad, Informática y Redes, Electrónica). Me apasionan los ordenadores en general, especialmente la reparación, el soporte al usuario y la gestión de redes. Mi trayectoria me ha permitido desarrollar sólidas competencias en programación, administración de redes y ciberseguridad. También me formo de manera autodidacta en resolución de problemas y mantenimiento.',
            'about.objectivesText': 'Mi objetivo es continuar mis estudios, preferiblemente mediante un programa de formación en alternancia para acceder progresivamente al mundo profesional. Me encantaría trabajar en reparación de dispositivos, aunque también me interesan puestos en gestión de redes e informática.',
            'formation.title': 'Mi formación académica',
            'formation.subtitle.one': 'Bachillerato Profesional C.I.E.L (2.º y último año)',
            'formation.subtitle.two': 'Primer año de estudios de bachillerato general',
            'formation.subtitle.three': 'Años de escuela secundaria',
            'formation.desc.one': 'Ciberseguridad, informática y redes, electrónica. Formación centrada en sistemas digitales, ciberseguridad y redes informáticas.',
            'formation.desc.two': 'Un primer año de estudios generales donde descubrí el programa CIEL, lo que me trajo a Cambrai.',
            'formation.desc.three': 'Mis años de secundaria me permitieron obtener el diploma con honores, cerca de la máxima calificación.',
            'formation.experiences': 'Mis experiencias',
            'experience.type.one': 'Proyecto personal (realizado durante mis dos años de bachillerato)',
            'experience.type.two': 'Prácticas en empresa',
            'experience.type.three': 'Voluntariado / actividad',
            'experience.MM/YY.one': 'Agosto 2025 (2 semanas)',
            'experience.MM/YY.two': 'Noviembre 2024 (mes completo)',
            'experience.MM/YY.three': 'Junio 2024 (2 semanas)',
            'experience.desc.one': "Este 'proyecto' fue realizado como parte de mi bachillerato. El objetivo era crear un sitio web que sirviera como mi portafolio personal, explicando toda mi formación, estudios y experiencias en el ámbito de la informática.",
            'experience.desc.two': 'Organización de tabletas para futuros alumnos de un instituto en Lille: diagnóstico y reparación de varios ordenadores, sustitución de componentes en equipos de sobremesa y portátiles (tarjetas gráficas, procesadores, discos duros, disipadores, etc.).',
            'experience.desc.three': 'Preparación de unos diez portátiles para futuros estudiantes de MELEC (cambio de HDD por SSD, reinstalación de Windows 10 e instalación de software), actualización de la suite Adobe y optimización de unos veinte iMacs, instalación de KiCad y limpieza de discos de alrededor de treinta PCs (desgraciadamente, no pude hacer mucho debido a una lesión durante ese periodo).',
            'experience.desc.four': 'Mi primera práctica fue en un ayuntamiento; el objetivo era comprender cómo funciona un ayuntamiento y cómo opera una red informática. Supervisé la instalación de puntos de acceso Wi-Fi en varias escuelas primarias de Somain, y di mis primeros pasos en la gestión de redes: funcionamiento de direcciones IP, demostración de un software de ticketing local y uso de órdenes de compra. También creé una VM de arranque dual entre Windows 10 y Ubuntu, y una VM con Windows Server 2021, y comencé con HTML/CSS.',
            'experience.desc.five': 'El ayuntamiento de Auberchicourt organizó una tarde de reparación de dispositivos electrónicos. La gente podía traer sus dispositivos para repararlos gratuitamente, mientras conversaban y tomaban un café. Participé en la reparación de un calefactor y de un televisor LG que trajo una vecina.',
            'experience.skill': 'Habilidades :',
            'experience.company.one': 'Ayuntamiento de Somain',
            'experience.comp.one': 'Diagnóstico',
            'experience.comp.two': 'Resolución de problemas',
            'experience.comp.three': 'Limpieza de discos',
            'experience.comp.four': 'Aprendizaje de gestión de redes',
            'experience.comp.five': 'Aprendizaje de HTML/CSS',
            'experience.comp.six': 'Reparación electrónica',
            'experience.comp.seven': 'Soldadura',
            'experience.comp.eight': 'Uso de herramientas de medición electrónica (multímetro, etc.)',
            'projects.title': 'Mis proyectos y aprendizaje',
            'projects.subtitle': 'Por qué este proyecto, mis proyectos pasados y lo que aprendí de ellos',
            'projects.why.title': 'Por qué elegí este proyecto',
            'projects.why.desc': 'Elegí crear este portafolio como mi proyecto principal porque reúne mis intereses: el desarrollo web, presentar claramente mi trayectoria profesional y mostrar mis habilidades técnicas. Este sitio me permite practicar HTML, CSS y JavaScript mientras creo una herramienta profesional para mis solicitudes de empleo y mi red de contactos.',
            'projects.why.desc.two': 'También es un banco de pruebas: accesibilidad, diseño responsivo, modo claro/oscuro e integración de contenido dinámico (artículos, experiencias, contactos). Con cada actualización, mejoro la estructura, el rendimiento y la usabilidad.',
            'projects.past': 'Mis proyectos anteriores',
            'projects.onlineLaunchpad': "El sitio 'Launchpad' replica un dispositivo musical llamado 'launchpad' que permite crear sonidos usando botones. Este proyecto me permitió descubrir los fundamentos de JavaScript mientras probaba mis habilidades de HTML y CSS adquiridas en clase y con un mini sitio que creé en mi primer periodo de prácticas.",
            'projects.LDLCLONE': "Creé un sitio que era una réplica de la plataforma de ventas online 'LDLC', con una interfaz sencilla usando los colores del logo del colegio Saint-Luc. Sin embargo, lo dejé porque era demasiado ambicioso y me faltaban las habilidades necesarias para completarlo adecuadamente. Incluso intenté aprender React para desarrollarlo, pero no fui capaz de finalizarlo correctamente.",
            'projects.learned.title': 'Lo que aprendí',
            'projects.learned.element.one': 'Organización del sitio web: navegación clara, coherencia visual y diseño responsivo.',
            'projects.learned.element.two': 'Componentes reutilizables: tarjetas, botones y formularios con estilos consistentes.',
            'projects.learned.element.three': 'JavaScript front-end: interacciones (menú lateral, lightbox, tema claro/oscuro).',
            'projects.learned.element.four': 'Calidad: legibilidad del código, separación de estructura/estilo/script y pruebas visuales en múltiples pantallas.',
            'contact.title': 'Contáctame',
            'contact.subtitle': '¿Una pregunta? ¿Un proyecto? ¡No dudes en contactarme!',
            'contact.form.title': '📨 Envíame un mensaje',
            'contact.form.name.label': 'Nombre completo *',
            'contact.form.name.ph': 'Tu nombre',
            'contact.form.email.label': 'Correo electrónico *',
            'contact.form.email.ph': 'tu@email.com',
            'contact.form.subject.label': 'Asunto *',
            'contact.form.subject.ph': 'Asunto de tu mensaje',
            'contact.form.message.label': 'Mensaje *',
            'contact.form.message.ph': 'Tu mensaje...',
            'contact.form.submit': 'Enviar mensaje',
            'contact.form.success': '✅ ¡Mensaje enviado con éxito! Te responderé pronto.',
            'contact.form.error': '❌ Ocurrió un error. Por favor, inténtalo de nuevo.',
            'contact.info.title': '📞 Mis datos de contacto',
            'contact.info.email': 'Correo',
            'contact.info.phone': 'Teléfono',
            'contact.info.location': 'Ubicación',
            'contact.info.location.value': 'Auberchicourt, Nord',
            'contact.social.title': '🌐 Redes sociales',
            'contact.cv.title': '📄 Mi CV',
            'contact.cv.desc': 'Descarga mi CV completo en formato PDF',
            'contact.cv.button': 'Descargar mi CV',
            'forum.title': 'Foro ADEPEM',
            'forum.subtitle': 'Últimas discusiones de la comunidad en tiempo real',
            'forum.search': '🔍 Buscar una discusión...',
            'forum.refresh': 'Actualizar',
            'forum.visit': 'Visitar foro',
            'forum.loading': 'Cargando discusiones...',
            'forum.retry': 'Reintentar',
            'forum.noresults.title': 'No se encontró ninguna discusión',
            'forum.noresults.desc': 'Intenta otra búsqueda o actualiza la página'
        }
    };

    const manualPlaceholderTranslations = {
        en: {
            'contact.form.name.ph': 'Your name',
            'contact.form.email.ph': 'your@email.com',
            'contact.form.subject.ph': 'Subject of your message',
            'contact.form.message.ph': 'Your message...',
            'forum.search': '🔍 Search for a discussion...'
        },
        es: {
            'contact.form.name.ph': 'Tu nombre',
            'contact.form.email.ph': 'tu@email.com',
            'contact.form.subject.ph': 'Asunto de tu mensaje',
            'contact.form.message.ph': 'Tu mensaje...',
            'forum.search': '🔍 Buscar una discusión...'
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

        // Capture original aria-labels for elements that require aria translation
        document.querySelectorAll('[data-i18n-aria]').forEach(element => {
            const key = element.dataset.i18nAria;
            if (!key) return;
            if (!originalAria[key]) {
                originalAria[key] = element.getAttribute('aria-label');
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

            // Restore original aria-labels
            document.querySelectorAll('[data-i18n-aria]').forEach(element => {
                const key = element.dataset.i18nAria;
                if (originalAria[key]) {
                    element.setAttribute('aria-label', originalAria[key]);
                }
            });
            return true;
        }

        if (targetLang === 'en' || targetLang === 'es') {
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

            // Apply aria-label translations when available
            if (langData) {
                document.querySelectorAll('[data-i18n-aria]').forEach(element => {
                    const key = element.dataset.i18nAria;
                    if (langData[key]) {
                        element.setAttribute('aria-label', langData[key]);
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

// ===========================
// BACK TO TOP BUTTON
// ===========================
const backToTopButton = document.getElementById('backToTop');

if (backToTopButton) {
    // Show/hide button on scroll
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

    // Scroll to top on click
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}