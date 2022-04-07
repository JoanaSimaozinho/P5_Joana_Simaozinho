console.log("start");
const cart = localStorage.getItem("cart");
const cartArray = JSON.parse(cart);
let productsHTML = "";

async function getProduct(id) {
  return new Promise((resolve, reject) => {
    const url = `http://localhost:3000/api/products/${id}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      })
      .catch((e) => {
        console.log(e);
        reject(e);
      });
  });
}

async function getOneLine() {
  for (const line of cartArray) {
    const prod = await getProduct(line.id);
    console.log(prod);
    productsHTML += `<article class="cart__item" data-id="${line.id}" data-color="${line.color}">
  <div class="cart__item__img">
    <img src="${prod.imageUrl}" alt="Photographie d'un canapé" />
  </div>
  <div class="cart__item__content">
    <div class="cart__item__content__description">
      <h2>${prod.name}</h2>
      <p>couleur: ${line.color}</p>
      <p>prix: ${prod.price}€</p>
    </div>
    <div class="cart__item__content__settings">
      <div class="cart__item__content__settings__quantity">
        <p>Qté :</p>
        <input
          type="number"
          class="itemQuantity"
          name="itemQuantity"
          min="1"
          max="100"
          value="${line.quantity}"
        />
      </div>
      <div class="cart__item__content__settings__delete">
        <p class="deleteItem">Supprimer</p>
      </div>
    </div>
  </div>
</article>`;
  }
  const cartItemsElt = document.getElementById("cart__items");
  if (cartItemsElt) {
    cartItemsElt.innerHTML = productsHTML;
  }
}
getOneLine();

// Récupere mon panier (localstorage)
// Récupere depuis le serveur les infos manquantes des canaps (img, desc, alt, prix)
// Si le serveur ne trouve pas mon canap, indiquer "produit manquant" === checker status 200 dans la réponse
// Pendant je récupere les infos, Je fais la somme des prix avec les produits status 200
// Je mets à jour le html
