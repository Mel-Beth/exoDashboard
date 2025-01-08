// ===========================
// Variables
// ===========================

// Récupère les articles stockés dans le panier ou initialise un tableau vide
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// ===========================
// Affichage des articles dans le panier
// ===========================

function afficherPanier() {
    // Sélectionne les conteneurs pour les articles et le total
    const cartContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    cartContainer.innerHTML = ''; // Nettoie le conteneur

    let total = 0; // Variable pour calculer le total du panier

    // Vérifie si le panier est vide
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="text-gray-500">Votre panier est vide.</p>';
    } else {
        // Parcourt les articles pour les afficher
        cart.forEach((article, index) => {
            total += article.price * (article.quantity || 1); // Calcule le total en fonction de la quantité

            // Génère la carte pour chaque article
            const articleHTML = `
                <div class="flex items-center justify-between border p-4 rounded-lg shadow-sm">
                    <!-- Image et informations -->
                    <div class="flex items-center space-x-4">
                        <img src="${article.image || 'https://via.placeholder.com/150'}" alt="${article.name}" class="w-16 h-16 object-cover rounded-md">
                        <div>
                            <h3 class="text-lg font-bold">${article.name}</h3>
                            <p class="text-gray-700">${article.price.toFixed(2)} €</p>
                        </div>
                    </div>
                    <!-- Quantité et suppression -->
                    <div class="flex items-center space-x-2">
                        <!-- Champ pour modifier la quantité -->
                        <input type="number" value="${article.quantity || 1}" min="1" onchange="changerQuantite(${index}, this.value)" class="w-16 p-1 border rounded">
                        <!-- Bouton pour supprimer l'article -->
                        <button onclick="supprimerArticle(${index})" class="text-red-500 hover:text-red-700">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            `;
            cartContainer.innerHTML += articleHTML; // Ajoute l'article dans le conteneur
        });
    }

    // Mise à jour du total
    cartTotal.textContent = `${total.toFixed(2)} €`;
}

// ===========================
// Modifier la quantité d'un article
// ===========================

function changerQuantite(index, quantity) {
    // Met à jour la quantité dans le panier
    cart[index].quantity = parseInt(quantity);
    sauvegarderPanier(); // Sauvegarde dans le localStorage
    afficherPanier();    // Rafraîchit l'affichage
}

// ===========================
// Supprimer un article du panier
// ===========================

function supprimerArticle(index) {
    cart.splice(index, 1); // Supprime l'article sélectionné
    sauvegarderPanier();   // Sauvegarde dans le localStorage
    afficherPanier();      // Met à jour l'affichage
}

// ===========================
// Valider la commande
// ===========================

function validerCommande() {
    // Vérifie si le panier est vide
    if (cart.length === 0) {
        alert('Votre panier est vide.');
        return;
    }

    alert('Commande validée !');
    cart = []; // Vide le panier après validation
    localStorage.removeItem('cart'); // Supprime les données du localStorage
    afficherPanier(); // Rafraîchit l'affichage
}

// ===========================
// Sauvegarder dans localStorage
// ===========================

function sauvegarderPanier() {
    localStorage.setItem('cart', JSON.stringify(cart)); // Sauvegarde les données
}

// ===========================
// Gestionnaire du bouton "Valider la commande"
// ===========================

document.getElementById('checkoutButton').addEventListener('click', validerCommande);

// Chargement initial
afficherPanier();
