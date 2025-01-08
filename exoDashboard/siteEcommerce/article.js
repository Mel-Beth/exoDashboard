// ===========================
// Variables globales
// ===========================

// Récupère le panier depuis le localStorage ou initialise un tableau vide
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let article; // Variable pour stocker l'article sélectionné

// ===========================
// Récupérer l'ID de l'article depuis l'URL
// ===========================

// Récupère les paramètres de l'URL (par exemple, ?id=1)
const urlParams = new URLSearchParams(window.location.search);
// Extrait et convertit l'ID en nombre entier
const articleId = parseInt(urlParams.get('id'));

// ===========================
// Charger les données depuis le JSON
// ===========================

// Charge les données des articles depuis le fichier JSON
fetch('../dashboard/data.json')
  .then(response => response.json()) // Convertit la réponse en JSON
  .then(data => {
      // Cherche l'article correspondant à l'ID récupéré dans l'URL
      article = data.articles.find(a => a.id === articleId);

      if (article) {
          afficherDetailsArticle(); // Affiche les détails de l'article
          mettreAJourPanier();      // Met à jour l'affichage du panier
      } else {
          afficherErreur();         // Affiche un message d'erreur si l'article est introuvable
      }
  })
  .catch(err => console.error("Erreur de chargement :", err)); // Gestion des erreurs de chargement

// ===========================
// Afficher les détails de l'article
// ===========================

function afficherDetailsArticle() {
    // Sélectionne le conteneur des détails de l'article
    const container = document.getElementById('article-details');
    // Génère dynamiquement le contenu HTML avec les détails de l'article
    container.innerHTML = `
        <!-- Image de l'article -->
        <img src="${article.image || 'https://via.placeholder.com/300'}" alt="${article.name}" class="w-full h-64 object-cover rounded-md mb-4">
        
        <!-- Nom et description -->
        <h1 class="text-2xl font-bold mb-2">${article.name}</h1>
        <p class="text-gray-700 mb-4">${article.price.toFixed(2)} €</p>
        <p class="text-gray-600 mb-4">${article.description}</p>
        
        <!-- Bouton pour ajouter au panier -->
        <button onclick="ajouterAuPanier(${article.id})" 
                class="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600">
            + Ajouter au panier
        </button>
    `;
}

// ===========================
// Ajouter au panier
// ===========================

function ajouterAuPanier(id) {
    // Ajoute l'article actuel dans le panier
    cart.push(article);

    // Sauvegarde le panier dans le localStorage
    sauvegarderPanier();

    // Met à jour l'affichage du panier
    mettreAJourPanier();

    // Effet visuel sur l'icône du panier
    const count = document.getElementById('cartCount');
    count.classList.remove('hidden'); // Affiche le badge du panier
    count.classList.add('animate-bounce'); // Animation d'ajout
    setTimeout(() => count.classList.remove('animate-bounce'), 300); // Supprime l'animation après 300 ms
}

// ===========================
// Mise à jour du panier
// ===========================

function mettreAJourPanier() {
    // Sélectionne les éléments du DOM pour afficher le contenu du panier
    const count = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');

    // Mise à jour du nombre d'articles dans le panier
    count.textContent = cart.length;
    count.classList.toggle('hidden', cart.length === 0); // Cache le badge si le panier est vide

    // Génère la liste des articles dans le dropdown
    cartItems.innerHTML = '';
    cart.forEach((item, index) => {
        cartItems.innerHTML += `
            <li class="flex justify-between items-center border-b py-2">
                <span>${item.name}</span>
                <span>${item.price.toFixed(2)} €</span>
                <!-- Bouton pour supprimer l'article -->
                <button onclick="supprimerDuPanier(${index})" class="text-red-500 hover:text-red-700">
                    <i class="fas fa-trash"></i>
                </button>
            </li>
        `;
    });

    // Affiche le lien pour voir tout le panier
    const viewAll = document.getElementById('viewAllCart');
    viewAll.classList.remove('hidden');
}

// ===========================
// Supprimer un article du panier
// ===========================

function supprimerDuPanier(index) {
    // Supprime l'article sélectionné du panier
    cart.splice(index, 1);
    sauvegarderPanier();  // Sauvegarde le panier après suppression
    mettreAJourPanier();  // Rafraîchit l'affichage du panier
}

// ===========================
// Sauvegarder le panier
// ===========================

function sauvegarderPanier() {
    // Enregistre le panier dans le localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}

// ===========================
// Affichage d'une erreur
// ===========================

function afficherErreur() {
    // Affiche un message d'erreur si l'article n'est pas trouvé
    const container = document.getElementById('article-details');
    container.innerHTML = `<p class="text-red-500">Article introuvable.</p>`;
}

// ===========================
// Gestion du dropdown du panier
// ===========================

// Sélection des éléments dropdown
const cartButton = document.getElementById('cartButton');
const cartDropdown = document.getElementById('cartDropdown');

// Affiche le dropdown au survol de l'icône
cartButton.addEventListener('mouseenter', () => {
    cartDropdown.classList.remove('hidden'); // Affiche le dropdown
});

// Cache le dropdown si la souris quitte l'icône
cartButton.addEventListener('mouseleave', () => {
    if (!cartDropdown.classList.contains('persistent')) {
        cartDropdown.classList.add('hidden'); // Cache si pas persistant
    }
});

// Affiche ou maintient le dropdown ouvert au clic
cartButton.addEventListener('click', (e) => {
    e.stopPropagation(); // Empêche la fermeture immédiate
    cartDropdown.classList.toggle('persistent'); // Active/désactive la persistance
    cartDropdown.classList.remove('hidden'); // Affiche
});

// Ferme le dropdown si on clique ailleurs
document.addEventListener('click', (e) => {
    if (!cartButton.contains(e.target) && !cartDropdown.contains(e.target)) {
        cartDropdown.classList.add('hidden'); // Cache le dropdown
        cartDropdown.classList.remove('persistent'); // Désactive la persistance
    }
});
