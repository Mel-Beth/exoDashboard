// ===========================
// Variables
// ===========================

// Récupère les articles stockés dans le panier ou initialise un tableau vide
let cart = JSON.parse(localStorage.getItem('cart')) || [];
// Tableau pour stocker les articles chargés depuis le fichier JSON
let articles = [];

// ===========================
// Chargement des articles
// ===========================

// Charge les articles depuis un fichier JSON
fetch('../dashboard/data.json')
  .then(response => response.json()) // Convertit la réponse en JSON
  .then(data => {
      articles = data.articles;      // Stocke les articles
      afficherArticles();            // Affiche les articles
      mettreAJourPanier();           // Met à jour l'affichage du panier
  })
  .catch(err => console.error("Erreur de chargement :", err)); // Gère les erreurs

// ===========================
// Affichage des articles
// ===========================

function afficherArticles() {
    const container = document.getElementById('articles-container'); // Conteneur des articles
    container.innerHTML = ''; // Nettoie le conteneur

    // Parcourt tous les articles pour les afficher
    articles.forEach(article => {
        const card = `
            <div class="bg-white shadow-lg rounded-lg p-6">
                <!-- Lien vers la page de détails avec l'ID de l'article -->
                <a href="article.html?id=${article.id}" class="block hover:shadow-xl transition">
                    <!-- Image de l'article -->
                    <img src="${article.image || 'https://via.placeholder.com/150'}" alt="${article.name}" class="w-full h-48 object-cover rounded-md mb-4">
                    <!-- Nom de l'article -->
                    <h3 class="font-bold text-lg mb-2">${article.name}</h3>
                    <!-- Prix -->
                    <p class="text-gray-700 mb-2">${article.price.toFixed(2)} €</p>
                    <!-- Affichage des étoiles -->
                    <div class="flex items-center mb-4">${afficherEtoiles(article.rating || 0)}</div>
                </a>
                <!-- Bouton d'ajout au panier -->
                <button onclick="ajouterAuPanier(${article.id})" class="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 w-full">
                  Ajouter au panier
                </button>
            </div>
        `;
        container.innerHTML += card; // Ajoute chaque carte au conteneur
    });
}

// ===========================
// Fonction pour afficher les étoiles
// ===========================

function afficherEtoiles(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `<i class="fas fa-star ${i <= rating ? 'text-yellow-500' : 'text-gray-300'}"></i>`;
    }
    return stars; // Retourne les étoiles formatées
}

// ===========================
// Ajouter un article au panier
// ===========================

function ajouterAuPanier(id) {
    const article = articles.find(a => a.id === id); // Recherche l'article par ID
    cart.push(article); // Ajoute l'article au panier
    sauvegarderPanier(); // Sauvegarde dans le localStorage
    mettreAJourPanier(); // Met à jour l'affichage

    // Animation sur le badge du panier
    const count = document.getElementById('cartCount');
    count.classList.remove('hidden');
    count.classList.add('animate-bounce'); // Effet visuel
    setTimeout(() => count.classList.remove('animate-bounce'), 300);
}

// ===========================
// Mise à jour du panier
// ===========================

function mettreAJourPanier() {
    const count = document.getElementById('cartCount'); // Compteur sur l'icône du panier
    const cartItems = document.getElementById('cartItems'); // Liste des articles dans le dropdown

    // Mise à jour du badge
    count.textContent = cart.length;
    count.classList.toggle('hidden', cart.length === 0);

    // Génère la liste des articles dans le dropdown
    cartItems.innerHTML = '';
    cart.forEach((item, index) => {
        cartItems.innerHTML += `
            <li class="flex justify-between items-center border-b py-2">
                <span>${item.name}</span>
                <span>${item.price.toFixed(2)} €</span>
                <button onclick="supprimerDuPanier(${index})" class="text-red-500 hover:text-red-700">
                    <i class="fas fa-trash"></i>
                </button>
            </li>
        `;
    });
}

// ===========================
// Supprimer un article du panier
// ===========================

function supprimerDuPanier(index) {
    cart.splice(index, 1); // Supprime l'article par son index
    sauvegarderPanier();   // Sauvegarde après suppression
    mettreAJourPanier();   // Met à jour l'affichage
}

// ===========================
// Sauvegarder dans localStorage
// ===========================

function sauvegarderPanier() {
    localStorage.setItem('cart', JSON.stringify(cart)); // Sauvegarde dans le stockage local
}

// ===========================
// Gestion du dropdown
// ===========================

// Sélectionne les éléments du panier
const cartButton = document.getElementById('cartButton');
const cartDropdown = document.getElementById('cartDropdown');

// Affiche le dropdown au survol
cartButton.addEventListener('mouseenter', () => {
    cartDropdown.classList.remove('hidden'); // Affiche au survol
});

// Cache le dropdown si la persistance n'est pas activée
cartButton.addEventListener('mouseleave', () => {
    if (!cartDropdown.classList.contains('persistent')) {
        cartDropdown.classList.add('hidden');
    }
});

// Affiche/Maintient ouvert au clic
cartButton.addEventListener('click', (e) => {
    e.stopPropagation(); // Empêche la fermeture immédiate
    cartDropdown.classList.toggle('persistent'); // Active/désactive la persistance
    cartDropdown.classList.remove('hidden'); // Affiche
});

// Ferme le dropdown en cliquant ailleurs
document.addEventListener('click', (e) => {
    if (!cartButton.contains(e.target) && !cartDropdown.contains(e.target)) {
        cartDropdown.classList.add('hidden');
        cartDropdown.classList.remove('persistent'); // Désactive la persistance
    }
});
