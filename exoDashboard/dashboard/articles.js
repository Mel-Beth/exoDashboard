// ===========================
// Variables et chargement initial
// ===========================
let articles = JSON.parse(localStorage.getItem('articles')) || [];
let dataJSON = {}; // Stockage des données JSON d'origine

// Charger les articles depuis le JSON
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    dataJSON = data; // Stocker les données JSON
    if (!articles.length) {
      articles = data.articles; // Si le localStorage est vide, charger les articles
      sauvegarderArticles();   // Sauvegarder dans localStorage
    }
    afficherArticles(articles); // Afficher les articles
  })
  .catch(err => console.error("Erreur de chargement :", err));

// ===========================
// Fonction d'affichage des articles
// ===========================
function afficherArticles(articles) {
  const container = document.getElementById('articles-container');
  container.innerHTML = '';

  articles.forEach(article => {
    const card = `
      <div class="bg-white shadow-lg rounded-lg overflow-hidden p-6">
        <h3 class="font-bold text-lg mb-2">${article.name}</h3>
        <p class="text-gray-700 mb-2">${article.price.toFixed(2)} €</p>
        <p class="text-sm text-gray-500 mb-4">${article.category}</p>
        <p class="text-sm text-gray-500 mb-4">Stock : ${article.stock}</p>
        <a href="article.html?id=${article.id}" 
           class="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 block text-center mb-2">
          Voir les détails
        </a>
        <!-- Boutons pour suppression -->
        <button onclick="supprimerArticle(${article.id})" 
                class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 w-full">
          Supprimer
        </button>
      </div>
    `;
    container.innerHTML += card;
  });
}

// ===========================
// Ajouter un article
// ===========================
function ajouterArticle() {
    const name = document.getElementById('newName').value;
    const price = parseFloat(document.getElementById('newPrice').value);
    const stock = parseInt(document.getElementById('newStock').value);
    const description = document.getElementById('newDescription').value;
    const category = document.getElementById('newCategory').value;
    const createdAt = new Date().toISOString().split('T')[0]; // Date actuelle
  
    if (name && !isNaN(price) && !isNaN(stock)) {
      const newArticle = {
        id: articles.length + 1,
        name,
        category,
        price,
        stock,
        description,
        createdAt,
        updatedAt: createdAt
      };
      articles.push(newArticle); // Ajouter à la liste
      sauvegarderArticles();
      afficherArticles(articles); // Rafraîchir
  
      // Réinitialisation des champs du formulaire
      document.getElementById('newName').value = '';
      document.getElementById('newPrice').value = '';
      document.getElementById('newStock').value = '';
      document.getElementById('newDescription').value = '';
      document.getElementById('newCategory').value = '';
  
      alert('Article ajouté avec succès !');
    } else {
      alert('Veuillez remplir tous les champs correctement.');
    }
  }
  

// ===========================
// Supprimer un article
// ===========================
function supprimerArticle(id) {
  if (confirm('Voulez-vous vraiment supprimer cet article ?')) {
    articles = articles.filter(a => a.id !== id); // Filtrer l'article
    sauvegarderArticles();
    afficherArticles(articles); // Mettre à jour l'affichage
    alert('Article supprimé avec succès.');
  }
}

// ===========================
// Sauvegarder les articles
// ===========================
function sauvegarderArticles() {
  localStorage.setItem('articles', JSON.stringify(articles)); // Sauvegarde locale
}
