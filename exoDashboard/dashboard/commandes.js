// ===========================
// Variables globales
// ===========================
let commandes = JSON.parse(localStorage.getItem('commandes')) || []; // Récupérer commandes sauvegardées
let articles = JSON.parse(localStorage.getItem('articles')) || [];   // Récupérer articles sauvegardés

// ===========================
// Charger les données depuis le JSON au besoin
// ===========================
if (commandes.length === 0 || articles.length === 0) {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            commandes = data.orders;   // Charge les commandes depuis le JSON
            articles = data.articles; // Charge les articles depuis le JSON

            // Sauvegarder dans le localStorage
            localStorage.setItem('commandes', JSON.stringify(commandes));
            localStorage.setItem('articles', JSON.stringify(articles));

            afficherCommandes(); // Affiche les commandes après chargement
        })
        .catch(err => console.error("Erreur de chargement :", err));
} else {
    afficherCommandes(); // Affiche les commandes sauvegardées
}

// ===========================
// Fonction pour afficher les commandes
// ===========================
function afficherCommandes() {
    const pendingContainer = document.getElementById('pending-orders');
    const approvedContainer = document.getElementById('approved-orders');
    const rejectedContainer = document.getElementById('rejected-orders');

    // Vider les tableaux avant de réafficher
    pendingContainer.innerHTML = '';
    approvedContainer.innerHTML = '';
    rejectedContainer.innerHTML = '';

    // Parcourir toutes les commandes
    commandes.forEach(order => {
        const detailsArticles = order.items.map(item => {
            const article = articles.find(a => a.id === item.articleId);
            return `${item.quantity} x ${article.name} (${article.price.toFixed(2)} €)`;
        }).join('<br>');

        const stocksArticles = order.items.map(item => {
            const article = articles.find(a => a.id === item.articleId);
            return `${article.stock}`;
        }).join('<br>');

        let row = `
            <tr class="border-t">
                <td class="px-4 py-2">${order.id}</td>
                <td class="px-4 py-2">${order.user}</td>
                <td class="px-4 py-2">${order.totalPrice.toFixed(2)} €</td>
                <td class="px-4 py-2">${detailsArticles}</td>
                <td class="px-4 py-2">${stocksArticles}</td>
        `;

        if (order.status === 'Pending') {
            row += `
                <td class="px-4 py-2 space-x-2">
                    <button onclick="accepterCommande(${order.id})" class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">Accepter</button>
                    <button onclick="refuserCommande(${order.id})" class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Refuser</button>
                </td>
            </tr>`;
            pendingContainer.innerHTML += row;
        } else if (order.status === 'Approved') {
            approvedContainer.innerHTML += row + '</tr>';
        } else if (order.status === 'Rejected') {
            rejectedContainer.innerHTML += row + '</tr>';
        }
    });
}

// ===========================
// Accepter une commande
// ===========================
function accepterCommande(id) {
    const commande = commandes.find(order => order.id === id);

    if (commande) {
        const stocksDisponibles = commande.items.every(item => {
            const article = articles.find(a => a.id === item.articleId);
            return article && article.stock >= item.quantity;
        });

        if (!stocksDisponibles) {
            alert(`Stock insuffisant pour la commande ${id}`);
            return;
        }

        commande.items.forEach(item => {
            const article = articles.find(a => a.id === item.articleId);
            article.stock -= item.quantity; // Décrémente le stock
        });

        commande.status = 'Approved'; // Change le statut
        commande.updatedAt = new Date().toISOString().split('T')[0]; // Mise à jour de la date

        // Sauvegarde des modifications
        localStorage.setItem('commandes', JSON.stringify(commandes));
        localStorage.setItem('articles', JSON.stringify(articles));

        afficherCommandes();
        alert(`Commande ${id} acceptée et stock mis à jour !`);
    }
}

// ===========================
// Refuser une commande
// ===========================
function refuserCommande(id) {
    const commande = commandes.find(order => order.id === id);

    if (commande) {
        commande.status = 'Rejected'; // Change le statut
        commande.updatedAt = new Date().toISOString().split('T')[0]; // Mise à jour de la date

        // Sauvegarde des modifications
        localStorage.setItem('commandes', JSON.stringify(commandes));

        afficherCommandes();
        alert(`Commande ${id} refusée.`);
    }
}

// ===========================
// Initialisation
// ===========================
afficherCommandes();
