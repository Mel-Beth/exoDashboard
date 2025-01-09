// ===========================
// Variables globales
// ===========================

// Récupération des articles stockés dans localStorage ou initialisation d'un tableau vide
let articles = JSON.parse(localStorage.getItem('articles')) || [];
let dataJSON = {}; // Stocke les données JSON d'origine pour référence

// ===========================
// Chargement des articles depuis le fichier JSON
// ===========================

// Charge les articles depuis le fichier data.json
fetch('data.json')
  .then(response => response.json()) // Convertit la réponse en JSON
  .then(data => {
    dataJSON = data; // Stocke toutes les données du fichier JSON

    // Si le localStorage est vide, initialise les articles à partir du fichier JSON
    if (!articles.length) {
      articles = data.articles; // Charge les articles dans la variable
      sauvegarderArticles();   // Sauvegarde les articles dans localStorage
    }

    afficherArticles(articles); // Appelle la fonction pour afficher les articles
  })
  .catch(err => console.error("Erreur de chargement :", err)); // Gestion des erreurs

// ===========================
// Fonction pour afficher les articles
// ===========================
function afficherArticles(articles) {
  const container = document.getElementById('articles-container'); // Récupère l'élément conteneur
  container.innerHTML = ''; // Vide le conteneur avant d'ajouter les articles

  // Parcours tous les articles et crée une carte pour chacun
  articles.forEach(article => {
    const card = `
      <div class="bg-white shadow-lg rounded-lg overflow-hidden p-6">
        <!-- Image de l'article -->
        <img src="${article.image || 'https://via.placeholder.com/150'}" alt="${article.name}" class="w-full h-48 object-cover rounded-md mb-4">

        <!-- Informations sur l'article -->
        <h3 class="font-bold text-lg mb-2">${article.name}</h3>
        <p class="text-gray-700 mb-2">${article.price.toFixed(2)} €</p>
        <p class="text-sm text-gray-500 mb-4">${article.category}</p>
        <p class="text-sm text-gray-500 mb-4">Stock : ${article.stock}</p>

        <!-- Boutons d'action -->
        <a href="article.html?id=${article.id}" class="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 block text-center mb-2">
          Voir les détails
        </a>
        <button onclick="supprimerArticle(${article.id})" class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 w-full">
          Supprimer
        </button>
      </div>
    `;
    container.innerHTML += card; // Ajoute la carte à la galerie
  });
}

// ===========================
// Ajouter un article
// ===========================
function ajouterArticle() {
  // Récupération des valeurs saisies dans le formulaire
  const name = document.getElementById('newName').value;
  const price = parseFloat(document.getElementById('newPrice').value);
  const stock = parseInt(document.getElementById('newStock').value);
  const description = document.getElementById('newDescription').value;
  const category = document.getElementById('newCategory').value;
  const createdAt = new Date().toISOString().split('T')[0]; // Date actuelle

  // Validation des champs
  if (name && !isNaN(price) && !isNaN(stock)) {
    // Création d'un nouvel article
    const newArticle = {
      id: articles.length + 1, // Génère un nouvel ID incrémenté
      name,
      category,
      price,
      stock,
      description,
      createdAt,
      updatedAt: createdAt
    };

    articles.push(newArticle); // Ajoute l'article au tableau
    sauvegarderArticles(); // Sauvegarde les données dans localStorage
    afficherArticles(articles); // Rafraîchit l'affichage des articles

    // Réinitialise les champs du formulaire après ajout
    document.getElementById('newName').value = '';
    document.getElementById('newPrice').value = '';
    document.getElementById('newStock').value = '';
    document.getElementById('newDescription').value = '';
    document.getElementById('newCategory').value = '';

    alert('Article ajouté avec succès !'); // Confirmation à l'utilisateur
  } else {
    alert('Veuillez remplir tous les champs correctement.'); // Message d'erreur en cas de champ vide
  }
}

// ===========================
// Supprimer un article
// ===========================
function supprimerArticle(id) {
  // Confirmation avant suppression
  if (confirm('Voulez-vous vraiment supprimer cet article ?')) {
    // Filtre les articles en excluant celui avec l'ID donné
    articles = articles.filter(a => a.id !== id);

    sauvegarderArticles(); // Met à jour le localStorage
    afficherArticles(articles); // Rafraîchit l'affichage
    alert('Article supprimé avec succès.'); // Confirmation
  }
}

// ===========================
// Sauvegarder les articles dans localStorage
// ===========================
function sauvegarderArticles() {
  localStorage.setItem('articles', JSON.stringify(articles)); // Sauvegarde en format JSON
}
