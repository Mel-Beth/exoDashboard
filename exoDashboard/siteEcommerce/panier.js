// ===========================
// Variables
// ===========================

// Récupère les articles stockés dans le panier ou initialise un tableau vide
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let articles = []; // Stock des articles disponibles

// ===========================
// Charger les articles depuis le JSON
// ===========================
fetch('data.json')
  .then(response => response.json())
  .then(data => {
      articles = data.articles; // Charge les articles
      afficherPanier();         // Affiche les articles dans le panier
  })
  .catch(err => console.error("Erreur de chargement des articles :", err));

// ===========================
// Affichage des articles dans le panier
// ===========================
function afficherPanier() {
    const cartContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    cartContainer.innerHTML = '';

    let total = 0; // Calcul du total

    if (cart.length === 0) {
        // Affichage si le panier est vide
        cartContainer.innerHTML = '<p class="text-gray-500">Votre panier est vide.</p>';
    } else {
        // Parcourt chaque article dans le panier
        cart.forEach((article, index) => {
            total += article.price * (article.quantity || 1);

            const articleHTML = `
                <div class="flex items-center justify-between border p-4 rounded-lg shadow-sm">
                    <!-- Image et détails -->
                    <div class="flex items-center space-x-4">
                        <img src="${article.image}" alt="${article.name}" class="w-16 h-16 object-cover rounded-md">
                        <div>
                            <h3 class="text-lg font-bold">${article.name}</h3>
                            <p class="text-gray-700">${article.price.toFixed(2)} €</p>
                        </div>
                    </div>
                    <!-- Quantité et suppression -->
                    <div class="flex items-center space-x-2">
                        <input type="number" value="${article.quantity || 1}" min="1" onchange="changerQuantite(${index}, this.value)" class="w-16 p-1 border rounded">
                        <button onclick="supprimerArticle(${index})" class="text-red-500 hover:text-red-700">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            `;
            cartContainer.innerHTML += articleHTML;
        });
    }

    // Mise à jour du total
    cartTotal.textContent = `${total.toFixed(2)} €`;
}

// ===========================
// Modifier la quantité d'un article
// ===========================
function changerQuantite(index, quantity) {
    cart[index].quantity = parseInt(quantity); // Mise à jour
    sauvegarderPanier();
    afficherPanier();
}

// ===========================
// Supprimer un article
// ===========================
function supprimerArticle(index) {
    cart.splice(index, 1); // Supprime un article
    sauvegarderPanier();
    afficherPanier();
}

// ===========================
// Valider la commande
// ===========================
function validerCommande() {
    if (cart.length === 0) {
        alert('Votre panier est vide.');
        return;
    }

    // Créer une nouvelle commande
    const nouvelleCommande = {
        id: Date.now(), // ID unique basé sur le timestamp
        user: "Client Test", // Nom du client (peut être récupéré via un formulaire)
        status: "Pending",   // Statut en attente
        totalPrice: cart.reduce((total, item) => total + item.price * item.quantity, 0), // Total
        items: cart.map(item => ({ articleId: item.id, quantity: item.quantity })), // Détails
        createdAt: new Date().toISOString().split('T')[0], // Date de création
        updatedAt: null // Pas encore mise à jour
    };

    // Récupérer les commandes existantes dans localStorage
    const commandes = JSON.parse(localStorage.getItem('commandes')) || [];
    commandes.push(nouvelleCommande); // Ajouter la nouvelle commande

    // Sauvegarder dans localStorage
    localStorage.setItem('commandes', JSON.stringify(commandes));

    // Vider le panier
    localStorage.removeItem('cart');
    cart = [];
    afficherPanier();
    alert('Commande validée avec succès !');
}

// ===========================
// Sauvegarder le panier
// ===========================
function sauvegarderPanier() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// ===========================
// Sauvegarder les données mises à jour (stock et commandes)
// ===========================
function sauvegarderDonnees() {
    fetch('data.json', {
        method: 'POST', // Méthode POST pour sauvegarder
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articles }) // Mise à jour du stock
    })
    .then(() => console.log("Stock mis à jour."))
    .catch(err => console.error("Erreur lors de la mise à jour des données :", err));
}

// ===========================
// Sauvegarder la commande validée
// ===========================
function sauvegarderCommande() {
    const nouvelleCommande = {
        id: Date.now(), // Génère un ID unique basé sur le timestamp
        user: "Client", // Nom générique pour le client
        totalPrice: cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0),
        status: "Pending", // Statut par défaut
        updatedAt: new Date().toISOString().split('T')[0] // Date actuelle
    };

    fetch('data.json')
      .then(response => response.json())
      .then(data => {
          data.orders.push(nouvelleCommande); // Ajoute la nouvelle commande
          fetch('data.json', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
          });
      });
}

// ===========================
// Gestionnaire du bouton "Valider la commande"
// ===========================
document.getElementById('checkoutButton').addEventListener('click', validerCommande);

// ===========================
// Chargement initial
// ===========================
afficherPanier();
