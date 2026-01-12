// Fonction pour charger les composants HTML
async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
    } catch (error) {
        console.error(`Error loading component ${componentPath}:`, error);
    }
}

// Charger tous les composants au démarrage
document.addEventListener('DOMContentLoaded', async () => {
    // Charger les composants
    await loadComponent('sidebar-container', 'components/sidebar.html');
    await loadComponent('topbar-container', 'components/topbar.html');
    await loadComponent('footer-container', 'components/footer.html');
    
    // Charger le contenu du dashboard
    loadDashboardContent();
    
    // Initialiser les événements
    initializeEventListeners();
});

// Initialiser les event listeners
function initializeEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            console.log('Searching:', e.target.value);
            // TODO: Implémenter la recherche
        });
    }
    
    // Notification button
    const notifBtn = document.getElementById('notifications-btn');
    if (notifBtn) {
        notifBtn.addEventListener('click', () => {
            console.log('Notifications clicked');
            // TODO: Afficher le panneau de notifications
        });
    }
}

// Formater les nombres
function formatNumber(num) {
    return new Intl.NumberFormat('en-US').format(num);
}

// Générer une couleur selon le statut
function getStatusColor(status) {
    const colors = {
        'online': 'primary',
        'offline': 'slate',
        'alert': 'red',
        'charging': 'blue',
        'updating': 'yellow'
    };
    return colors[status] || 'slate';
}