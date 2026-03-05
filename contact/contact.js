// Contact Form Handler
// Handles spam detection, rate limiting, and EmailJS integration

const EMAIL_SERVICE_ID = 'service_7n8wk97';
const TEMPLATE_RECEPTION_ID = 'template_lpd0e4d';
const TEMPLATE_AUTOREPLY_ID = 'template_44urjvt';

// Get DOM elements
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');

// ===== SUPER FINGERPRINTING MULTI-COUCHES =====
async function getSuperFingerprint() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('anti-spam fingerprint', 2, 15);
    const canvasData = canvas.toDataURL();

    // Audio fingerprinting
    let audioHash = 'none';
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const analyser = audioCtx.createAnalyser();
        const gainNode = audioCtx.createGain();
        const scriptProcessor = audioCtx.createScriptProcessor(4096, 1, 1);
        
        gainNode.gain.value = 0;
        oscillator.connect(analyser);
        analyser.connect(scriptProcessor);
        scriptProcessor.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        scriptProcessor.onaudioprocess = function(bins) {
            const output = bins.outputBuffer.getChannelData(0);
            audioHash = output.slice(0, 30).join('');
        };
        
        oscillator.start(0);
        await new Promise(resolve => setTimeout(resolve, 100));
        oscillator.stop();
        audioCtx.close();
    } catch(e) {
        audioHash = 'error';
    }

    // WebGL fingerprinting
    let webglHash = 'none';
    try {
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        webglHash = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    } catch(e) {
        webglHash = 'error';
    }

    // Fonts detection
    const fonts = ['monospace', 'sans-serif', 'serif'];
    const testString = 'mmmmmmmmmmlli';
    const testSize = '72px';
    const h = document.getElementsByTagName('body')[0];
    const s = document.createElement('span');
    s.style.fontSize = testSize;
    s.innerHTML = testString;
    const defaultWidth = {};
    const defaultHeight = {};
    
    for (const font of fonts) {
        s.style.fontFamily = font;
        h.appendChild(s);
        defaultWidth[font] = s.offsetWidth;
        defaultHeight[font] = s.offsetHeight;
        h.removeChild(s);
    }
    
    const fontList = ['Arial', 'Verdana', 'Times New Roman', 'Courier New'];
    const fontsDetected = fontList.filter(font => {
        for (const baseFont of fonts) {
            s.style.fontFamily = `${font},${baseFont}`;
            h.appendChild(s);
            const matched = s.offsetWidth !== defaultWidth[baseFont] || 
                           s.offsetHeight !== defaultHeight[baseFont];
            h.removeChild(s);
            if (matched) return true;
        }
        return false;
    });

    const data = [
        navigator.userAgent,
        navigator.language || navigator.userLanguage,
        screen.width + 'x' + screen.height + 'x' + screen.colorDepth,
        screen.availWidth + 'x' + screen.availHeight,
        new Date().getTimezoneOffset(),
        !!window.sessionStorage,
        !!window.localStorage,
        !!window.indexedDB,
        typeof(window.openDatabase),
        navigator.cpuClass || 'unknown',
        navigator.platform || 'unknown',
        navigator.hardwareConcurrency || 'unknown',
        navigator.deviceMemory || 'unknown',
        navigator.maxTouchPoints || 0,
        !!window.ActiveXObject || "ActiveXObject" in window,
        canvasData.substring(canvasData.length - 100),
        audioHash.substring(0, 50),
        webglHash,
        fontsDetected.join(','),
        navigator.plugins.length,
        navigator.languages ? navigator.languages.join(',') : ''
    ];

    const fingerprint = btoa(data.join('|||'));
    
    // Hash supplémentaire avec crypto
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(fingerprint);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex;
}

// ===== SYSTÈME DE POINTS DE SUSPICION =====
let suspicionScore = 0;
const MAX_SUSPICION = 100;

function addSuspicion(points, reason) {
    suspicionScore += points;
    if (suspicionScore >= MAX_SUSPICION) {
        lockoutUser('Score de suspicion trop élevé');
        return true;
    }
    return false;
}

// Détecter comportement bot
let mouseMovements = 0;
let keyPresses = 0;
let formFocusTime = 0;
let lastInteraction = Date.now();

document.addEventListener('mousemove', () => {
    mouseMovements++;
    lastInteraction = Date.now();
});

document.addEventListener('keydown', () => {
    keyPresses++;
    lastInteraction = Date.now();
});

if (contactForm) {
    contactForm.addEventListener('focus', () => {
        formFocusTime = Date.now();
    }, true);
}

// ===== LOCKOUT SYSTEM =====
function lockoutUser(reason) {
    const lockoutKey = 'contact_lockout';
    const lockoutData = {
        until: Date.now() + (24 * 60 * 60 * 1000), // 24h
        reason: reason
    };
    localStorage.setItem(lockoutKey, JSON.stringify(lockoutData));
    
    showToast(`🚫 Accès bloqué pour 24h. Raison: ${reason}`, 'error', 6000);
    if (submitBtn) {
        submitBtn.disabled = true;
    }
    if (contactForm) {
        contactForm.style.opacity = '0.5';
        contactForm.style.pointerEvents = 'none';
    }
}

function checkLockout() {
    const lockoutKey = 'contact_lockout';
    const lockoutData = localStorage.getItem(lockoutKey);
    
    if (lockoutData) {
        try {
            const data = JSON.parse(lockoutData);
            if (Date.now() < data.until) {
                const hoursLeft = Math.ceil((data.until - Date.now()) / (60 * 60 * 1000));
                lockoutUser(`${data.reason} (${hoursLeft}h restantes)`);
                return true;
            } else {
                localStorage.removeItem(lockoutKey);
            }
        } catch(e) {
            localStorage.removeItem(lockoutKey);
        }
    }
    return false;
}

// ===== RATE LIMITING MULTI-NIVEAUX =====
async function canSendMessage() {
    // Check lockout first
    if (checkLockout()) return false;

    const fp = await getSuperFingerprint();
    const key = 'lastMessage_' + fp;
    const countKey = 'messageCount_' + fp;
    const attemptsKey = 'failedAttempts_' + fp;
    
    const lastSend = localStorage.getItem(key);
    const messageCount = parseInt(localStorage.getItem(countKey) || '0');
    const failedAttempts = parseInt(localStorage.getItem(attemptsKey) || '0');

    // Trop de tentatives échouées = lockout
    if (failedAttempts >= 5) {
        lockoutUser('Trop de tentatives suspectes');
        return false;
    }

    // Trop de messages envoyés = lockout
    if (messageCount >= 3) {
        lockoutUser('Limite de messages atteinte');
        return false;
    }

    if (!lastSend) return true;

    const now = Date.now();
    const timeSinceLast = now - parseInt(lastSend);
    
    // Cooldown progressif
    const baseCooldown = 10 * 60 * 1000; // 10 minutes
    const cooldown = baseCooldown * (messageCount + 1);

    if (timeSinceLast < cooldown) {
        const minutesLeft = Math.ceil((cooldown - timeSinceLast) / 60000);
        localStorage.setItem(attemptsKey, (failedAttempts + 1).toString());
        showToast(`⏳ Cooldown actif: ${minutesLeft} minutes restantes`, 'info', 8000);
        
        if (addSuspicion(20, 'Tentative pendant cooldown')) return false;
        return false;
    }
    return true;
}

// ===== FORM SUBMISSION =====
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Honeypot
        const honeypot = document.getElementById('honeypot');
        if (honeypot && honeypot.value !== '') {
            if (errorMessage) {
                errorMessage.textContent = "Spam détecté. Dégage.";
                errorMessage.classList.add('show');
                setTimeout(() => errorMessage.classList.remove('show'), 5000);
            }
            return;
        }

        // 2. Fingerprint + rate limiting multi-niveaux
        if (!await canSendMessage()) {
            return;
        }

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Envoi en cours...</span><span>⏳</span>';
        }

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            title: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        try {
            // Send both emails
            await emailjs.send(EMAIL_SERVICE_ID, TEMPLATE_RECEPTION_ID, formData);
            await emailjs.send(EMAIL_SERVICE_ID, TEMPLATE_AUTOREPLY_ID, {
                name: formData.name,
                email: formData.email,
                title: formData.title,
                message: formData.message
            });

            // === Enregistrement du fingerprint après succès ===
            const fp = await getSuperFingerprint();
            const countKey = 'messageCount_' + fp;
            const currentCount = parseInt(localStorage.getItem(countKey) || '0');
            localStorage.setItem('lastMessage_' + fp, Date.now().toString());
            localStorage.setItem(countKey, (currentCount + 1).toString());
            localStorage.removeItem('failedAttempts_' + fp);

            showToast('✅ Message envoyé avec succès ! Je vous répondrai rapidement.', 'success', 5000);
            contactForm.reset();
        } catch (error) {
            console.error('Erreur EmailJS:', error);
            const fp = await getSuperFingerprint();
            const attemptsKey = 'failedAttempts_' + fp;
            const failedAttempts = parseInt(localStorage.getItem(attemptsKey) || '0');
            localStorage.setItem(attemptsKey, (failedAttempts + 1).toString());
            
            let errorMsg = "❌ Une erreur s'est produite. Veuillez réessayer.";
            if (error.text && error.text.includes('rate limit')) {
                errorMsg = "⏱️ Trop rapide, calme-toi 15 secondes.";
            }
            showToast(errorMsg, 'error', 5000);
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span>Envoyer le message</span><span>✉️</span>';
            }
        }
    });
}
