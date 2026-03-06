// Forum ADEPEM Handler
// Handles fetching, filtering, and displaying forum topics with CORS proxy fallback

// Configuration du forum ADEPEM
const FORUM_URL = 'https://forum.adepem.com';

// Liste de proxies CORS (avec fallback)
const CORS_PROXIES = [
    'https://corsproxy.io/?',
    'https://api.codetabs.com/v1/proxy?quest=',
    'https://api.allorigins.win/raw?url='
];

let currentProxyIndex = 0;

// State
let allTopics = [];
let filteredTopics = [];

// Elements
const loading = document.getElementById('loading');
const forumGrid = document.getElementById('forumGrid');
const noResults = document.getElementById('noResults');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const searchInput = document.getElementById('searchInput');
const refreshBtn = document.getElementById('refreshBtn');
const retryBtn = document.getElementById('retryBtn');

// Fetch topics from ADEPEM forum
async function fetchForumTopics() {
    try {
        loading.style.display = 'block';
        forumGrid.style.display = 'none';
        noResults.style.display = 'none';
        errorMessage.style.display = 'none';

        // Construire l'URL avec le proxy actuel
        const proxyUrl = CORS_PROXIES[currentProxyIndex] + encodeURIComponent(`${FORUM_URL}/latest.json`);

        // Timeout de 10 secondes
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(proxyUrl, {
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();

        // Limiter à 12 discussions
        allTopics = data.topic_list.topics.slice(0, 12);
        filteredTopics = [...allTopics];
        displayTopics();

        // Réinitialiser l'index du proxy en cas de succès
        currentProxyIndex = 0;
    } catch (error) {
        // Essayer le proxy suivant si disponible
        if (currentProxyIndex < CORS_PROXIES.length - 1) {
            currentProxyIndex++;
            return fetchForumTopics(); // Réessayer avec le proxy suivant
        }

        // Si tous les proxies ont échoué
        loading.style.display = 'none';
        errorMessage.style.display = 'block';
        currentProxyIndex = 0; // Réinitialiser pour la prochaine tentative

        // Message d'erreur
        if (error.name === 'AbortError') {
            errorText.textContent = 'Le serveur met trop de temps à répondre. Réessayez dans quelques instants.';
        } else if (error.message.includes('Failed to fetch')) {
            errorText.textContent = 'Impossible de se connecter au forum. Vérifiez votre connexion internet.';
        } else {
            errorText.textContent = error.message || 'Impossible de charger les discussions du forum';
        }
    }
}

// Display topics
function displayTopics() {
    loading.style.display = 'none';

    if (filteredTopics.length === 0) {
        forumGrid.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }

    forumGrid.style.display = 'grid';
    noResults.style.display = 'none';

    forumGrid.innerHTML = filteredTopics.map(topic => {
        const lastActivityDate = new Date(topic.last_posted_at || topic.created_at);
        const formattedDate = formatDate(lastActivityDate);

        return `
            <a href="${FORUM_URL}/t/${topic.slug}/${topic.id}" target="_blank" rel="noopener noreferrer" class="forum-card">
                <div class="forum-card-header">
                    <div class="forum-card-badges">
                        ${topic.pinned ? '<span class="badge badge-pinned">📌 Épinglé</span>' : ''}
                        ${topic.closed ? '<span class="badge badge-closed">🔒 Fermé</span>' : ''}
                    </div>
                    <span class="external-link-icon">↗</span>
                </div>
                
                <h3 class="forum-card-title">${escapeHtml(topic.title)}</h3>
                
                <div class="forum-card-stats">
                    <span class="stat">
                        <span class="stat-icon">💬</span>
                        <span class="stat-value">${topic.posts_count - 1}</span>
                    </span>
                    <span class="stat">
                        <span class="stat-icon">👤</span>
                        <span class="stat-value">${topic.posters?.length || 0}</span>
                    </span>
                    <span class="stat">
                        <span class="stat-icon">🕒</span>
                        <span class="stat-value">${formattedDate}</span>
                    </span>
                </div>
                
                ${topic.category_id ? `
                    <div class="forum-card-category">
                        <span class="category-badge" style="background-color: #${topic.category_color || '6366f1'}20; border-color: #${topic.category_color || '6366f1'}50; color: #${topic.category_color || 'a5b4fc'}">
                            ${escapeHtml(topic.category_name || 'Général')}
                        </span>
                    </div>
                ` : ''}
            </a>
        `;
    }).join('');
}

// Format date
function formatDate(date) {
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Il y a moins d\'1h';
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    if (diffInHours < 48) return 'Hier';
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `Il y a ${diffInDays}j`;
    return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short'
    });
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Search functionality
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();

    filteredTopics = allTopics.filter(topic =>
        topic.title.toLowerCase().includes(searchTerm)
    );

    displayTopics();
});

// Refresh button
refreshBtn.addEventListener('click', () => {
    searchInput.value = '';
    fetchForumTopics();
});

// Retry button
retryBtn.addEventListener('click', fetchForumTopics);

// Initialize
fetchForumTopics();

// Auto-refresh every 5 minutes
setInterval(fetchForumTopics, 5 * 60 * 1000);
