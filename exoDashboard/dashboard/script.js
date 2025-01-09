// ===========================
// Variables globales
// ===========================
let stats = JSON.parse(localStorage.getItem('stats')) || {};
let commandes = JSON.parse(localStorage.getItem('commandes')) || [];
let articles = JSON.parse(localStorage.getItem('articles')) || [];

let userTrafficChart, ordersChart, categoryChart, revenueChart; // Graphiques

// ===========================
// Chargement initial des données
// ===========================
if (Object.keys(stats).length === 0 || commandes.length === 0 || articles.length === 0) {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            stats = data.stats;
            commandes = data.orders;
            articles = data.articles;

            localStorage.setItem('stats', JSON.stringify(stats));
            localStorage.setItem('commandes', JSON.stringify(commandes));
            localStorage.setItem('articles', JSON.stringify(articles));

            initialiserGraphiques(); // Affiche les graphiques
        })
        .catch(error => console.error('Erreur lors du chargement des données JSON :', error));
} else {
    initialiserGraphiques(); // Affiche directement depuis le localStorage
}

// ===========================
// Initialisation des graphiques
// ===========================
function initialiserGraphiques() {
    afficherTraficUtilisateurs();
    afficherCommandesParJour();
    afficherCommandesParCategorie();
    afficherRevenus();
}

// ===========================
// Mettre à jour tous les graphiques
// ===========================
function mettreAJourGraphiques() {
    // Détruit les graphiques existants
    if (userTrafficChart) userTrafficChart.destroy();
    if (ordersChart) ordersChart.destroy();
    if (categoryChart) categoryChart.destroy();
    if (revenueChart) revenueChart.destroy();

    // Redessine les graphiques avec les nouvelles données
    afficherTraficUtilisateurs();
    afficherCommandesParJour();
    afficherCommandesParCategorie();
    afficherRevenus();
}


// ===========================
// Graphique : Trafic utilisateurs
// ===========================
function afficherTraficUtilisateurs() {
    const ctxTraffic = document.getElementById('userTrafficChart').getContext('2d');
    userTrafficChart = new Chart(ctxTraffic, {
        type: 'line',
        data: {
            labels: stats.trafficByDay.map(d => d.date), // Dates mises à jour
            datasets: [{
                label: 'Trafic Utilisateurs',
                data: stats.trafficByDay.map(d => d.users), // Données mises à jour
                borderColor: 'blue',
                fill: false
            }]
        }
    });
}


// ===========================
// Graphique : Commandes par jour
// ===========================
function afficherCommandesParJour() {
    const ctxOrders = document.getElementById('ordersChart').getContext('2d');
    ordersChart = new Chart(ctxOrders, {
        type: 'bar',
        data: {
            labels: stats.ordersByDay.map(d => d.date), // Dates mises à jour
            datasets: [{
                label: 'Commandes',
                data: stats.ordersByDay.map(d => d.orders), // Données mises à jour
                backgroundColor: 'green'
            }]
        }
    });
}


// ===========================
// Graphique : Commandes par catégorie
// ===========================
function afficherCommandesParCategorie() {
    const ctxCategory = document.getElementById('categoryChart').getContext('2d');
    categoryChart = new Chart(ctxCategory, {
        type: 'line',
        data: {
            labels: stats.ordersByCategory[0].data.map(d => d.date), // Dates mises à jour
            datasets: stats.ordersByCategory.map(cat => ({
                label: cat.category,
                data: cat.data.map(d => d.orders), // Données mises à jour
                borderColor: cat.category === 'Électronique' ? 'red' :
                             cat.category === 'Mobilier' ? 'blue' : 'green',
                fill: false
            }))
        }
    });
}


// ===========================
// Graphique : Revenus
// ===========================
function afficherRevenus() {
    const ctxRevenue = document.getElementById('revenueChart').getContext('2d');
    revenueChart = new Chart(ctxRevenue, {
        type: 'bar',
        data: {
            labels: ['Jour', 'Semaine', 'Mois'], // Labels fixes
            datasets: [
                {
                    label: 'Revenus (Daily)',
                    data: stats.revenues.daily.map(d => d.revenue), // Données mises à jour
                    backgroundColor: 'orange'
                },
                {
                    label: 'Revenus (Weekly)',
                    data: stats.revenues.weekly.map(d => d.revenue), // Données mises à jour
                    backgroundColor: 'blue'
                },
                {
                    label: 'Revenus (Monthly)',
                    data: stats.revenues.monthly.map(d => d.revenue), // Données mises à jour
                    backgroundColor: 'green'
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

