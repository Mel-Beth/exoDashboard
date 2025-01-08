// Charger les commandes depuis le JSON
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    const commandes = data.orders;
    afficherCommandes(commandes);
  })
  .catch(err => console.error("Erreur de chargement :", err));

// Fonction pour afficher les commandes
function afficherCommandes(commandes) {
    const pendingContainer = document.getElementById('pending-orders');
    const approvedContainer = document.getElementById('approved-orders');
    const rejectedContainer = document.getElementById('rejected-orders');

    // Réinitialiser les conteneurs
    pendingContainer.innerHTML = '';
    approvedContainer.innerHTML = '';
    rejectedContainer.innerHTML = '';

    commandes.forEach(order => {
        const row = `
            <tr class="border-t">
                <td class="px-4 py-2">${order.id}</td>
                <td class="px-4 py-2">${order.user}</td>
                <td class="px-4 py-2">${order.totalPrice.toFixed(2)} €</td>
        `;

        if (order.status === 'Pending') {
            pendingContainer.innerHTML += row + `
                <td class="px-4 py-2 space-x-2">
                    <button onclick="accepterCommande(${order.id})" class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                        Accepter
                    </button>
                    <button onclick="refuserCommande(${order.id})" class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                        Refuser
                    </button>
                </td>
            </tr>`;
        } else if (order.status === 'Approved') {
            approvedContainer.innerHTML += row + '</tr>';
        } else if (order.status === 'Rejected') {
            rejectedContainer.innerHTML += row + '</tr>';
        }
    });
}

// Accepter une commande
function accepterCommande(id) {
    alert(`Commande ${id} acceptée !`);
}

// Refuser une commande
function refuserCommande(id) {
    alert(`Commande ${id} refusée !`);
}
