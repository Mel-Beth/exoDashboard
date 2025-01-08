// Variables globales
let articles = JSON.parse(localStorage.getItem('articles')) || []; // Charger depuis localStorage
const urlParams = new URLSearchParams(window.location.search);
const articleId = parseInt(urlParams.get('id'));
let article = articles.find(a => a.id === articleId);

// Si aucun article trouvé dans localStorage, charger depuis le JSON
if (!article) {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            articles = data.articles; // Met à jour les articles
            localStorage.setItem('articles', JSON.stringify(articles)); // Enregistre dans localStorage
            article = articles.find(a => a.id === articleId); // Recherche l'article par ID
            afficherDetailsArticle(); // Affiche les détails
        })
        .catch(err => console.error('Erreur de chargement des données :', err));
} else {
    afficherDetailsArticle(); // Affiche directement si trouvé
}

// Affiche les détails de l'article
function afficherDetailsArticle() {
    const container = document.getElementById('article-details');
    if (!article) {
        container.innerHTML = `<p class="text-red-500">Article introuvable.</p>`;
        return;
    }

    container.innerHTML = `
        <img src="${article.image || 'https://via.placeholder.com/300'}" alt="${article.name}" class="w-full h-64 object-cover rounded-md mb-4">
        <h1 class="text-2xl font-bold mb-2">${article.name}</h1>
        <p class="text-gray-700 mb-4">${article.price.toFixed(2)} €</p>
        <p class="text-gray-600 mb-4">${article.description}</p>
        <p class="text-gray-500 mb-4">Catégorie: ${article.category}</p>

        <!-- Modifier l'article -->
        <h2 class="text-xl font-bold mb-2 mt-6">Modifier l'article</h2>
        <input type="text" id="editName" value="${article.name}" class="w-full p-2 mb-4 border rounded">
        <input type="number" id="editPrice" value="${article.price}" class="w-full p-2 mb-4 border rounded">
        <textarea id="editDescription" class="w-full p-2 mb-4 border rounded">${article.description}</textarea>
        <input type="text" id="editImage" value="${article.image}" class="w-full p-2 mb-4 border rounded">

        <!-- Boutons -->
        <button onclick="modifierArticle()" class="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600">
          Modifier
        </button>
        <button onclick="supprimerArticle()" class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 ml-2">
          Supprimer
        </button>
    `;
}

// Fonction pour modifier l'article
function modifierArticle() {
    article.name = document.getElementById('editName').value;
    article.price = parseFloat(document.getElementById('editPrice').value);
    article.description = document.getElementById('editDescription').value;
    article.image = document.getElementById('editImage').value;

    sauvegarderArticles();
    alert('Article modifié avec succès !');
    afficherDetailsArticle(); // Rafraîchir les détails
}

// Fonction pour supprimer un article
function supprimerArticle() {
    articles = articles.filter(a => a.id !== article.id); // Supprime l'article
    sauvegarderArticles();
    alert('Article supprimé avec succès !');
    window.location.href = 'articles.html'; // Redirige vers la liste
}

// Sauvegarder les articles
function sauvegarderArticles() {
    localStorage.setItem('articles', JSON.stringify(articles)); // Met à jour localStorage
}
