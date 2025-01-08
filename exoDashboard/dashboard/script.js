// ===========================
// Graphiques avec Chart.js
// ===========================

// Chargement des données JSON et initialisation des graphiques
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        // === Trafic des utilisateurs par jour ===
        const ctxTraffic = document.getElementById('userTrafficChart').getContext('2d');
        new Chart(ctxTraffic, {
            type: 'line',
            data: {
                labels: data.stats.trafficByDay.map(d => d.date),
                datasets: [{
                    label: 'Trafic Utilisateurs',
                    data: data.stats.trafficByDay.map(d => d.users),
                    borderColor: 'blue',
                    fill: false
                }]
            }
        });

        // === Nombre de commandes par jour ===
        const ctxOrders = document.getElementById('ordersChart').getContext('2d');
        new Chart(ctxOrders, {
            type: 'bar',
            data: {
                labels: data.stats.ordersByDay.map(d => d.date),
                datasets: [{
                    label: 'Commandes',
                    data: data.stats.ordersByDay.map(d => d.orders),
                    backgroundColor: 'green'
                }]
            }
        });

        // === Évolution des commandes par catégorie ===
        const ctxCategory = document.getElementById('categoryChart').getContext('2d');
        new Chart(ctxCategory, {
            type: 'line',
            data: {
                labels: data.stats.ordersByCategory[0].data.map(d => d.date),
                datasets: data.stats.ordersByCategory.map(cat => ({
                    label: cat.category,
                    data: cat.data.map(d => d.orders),
                    borderColor: cat.category === 'Électronique' ? 'red' :
                                 cat.category === 'Mobilier' ? 'blue' : 'green',
                    fill: false
                }))
            }
        });

        // === Recettes entrantes (3 légendes pour Daily, Weekly et Monthly) ===
        const ctxRevenue = document.getElementById('revenueChart').getContext('2d');
        new Chart(ctxRevenue, {
            type: 'bar',
            data: {
                labels: ['Jour', 'Semaine', 'Mois'], // Étiquettes génériques
                datasets: [
                    {
                        label: 'Revenus (Daily)', // Légende Daily
                        data: data.stats.revenues.daily.map(d => d.revenue),
                        backgroundColor: 'orange'
                    },
                    {
                        label: 'Revenus (Weekly)', // Légende Weekly
                        data: data.stats.revenues.weekly.map(d => d.revenue),
                        backgroundColor: 'blue'
                    },
                    {
                        label: 'Revenus (Monthly)', // Légende Monthly
                        data: data.stats.revenues.monthly.map(d => d.revenue),
                        backgroundColor: 'green'
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true // Commence l'axe Y à 0
                    }
                }
            }
        });

    })
    .catch(error => console.error('Erreur lors du chargement des données JSON :', error));
