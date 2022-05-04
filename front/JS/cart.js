let totalPrice = 0;
let totalQuantity = 0;

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

function getCartArray() {
  const cart = localStorage.getItem("cart");
  return JSON.parse(cart);
}

async function setProductsAndTotalsDisplay() {
  totalPrice = 0;
  totalQuantity = 0;
  let productsHTML = "";
  const cartArray = getCartArray();
  for (const line of cartArray) {
    const prod = await getProduct(line.id);
    console.log(prod);
    totalPrice += line.quantity * prod.price;
    totalQuantity++;
    productsHTML += `<article class="cart__item" data-id="${line.id}" data-color="${line.color}">
            <div class="cart__item__img">
              <img src="${prod.imageUrl}" alt="Photographie d'un canapé" />
            </div>
            <div class="cart__item__content">
              <div class="cart__item__content__description">
                <h2>Nom du produit</h2>
                <p>${line.color}</p>
                <p>${prod.price} €</p>
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
                  <p class="deleteItem"  onclick="deleteProduct('${line.id},${line.color}')">Supprimer</p>
                </div>
              </div>
            </div>
          </article>`;
  }

  const cartItemsElt = document.getElementById("cart__items");
  if (cartItemsElt) {
    cartItemsElt.innerHTML = productsHTML;
  }

  const totalPriceElement = document.getElementById("totalPrice");
  if (totalPriceElement) {
    totalPriceElement.textContent = totalPrice;
  }
  const totalQuantityElement = document.getElementById("totalQuantity");
  const qtityItems = document.querySelectorAll("input[name='itemQuantity']");
  // debugger;
  if (cartArray.length > 0 && qtityItems.length > 0) {
    qtityItems.addEventListener("input", function (evt) {
      console.log("ok");
    });
  }
}
getDisplay();

function deleteProduct(params) {
  const splitParams = params.split(",");
  const id = splitParams[0];
  const color = splitParams[1];
  const cartArray = getCartArray();
  for (let index = 0; index < cartArray.length; index++) {
    const product = cartArray[index];
    if (product.id === id && product.color === color) {
      cartArray.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cartArray));
      getDisplay();
      break;
    }
  }
}

function getTotalPriceDisplay() {
  // Faire le total
  // Remplacer l'element prix
  // Remplacer le nb d'articles
}

function getDisplay() {
  setProductsAndTotalsDisplay();
  getTotalPriceDisplay();
}

// Récupere mon panier (localstorage)
// Récupere depuis le serveur les infos manquantes des canaps (img, desc, alt, prix)
// Si le serveur ne trouve pas mon canap, indiquer "produit manquant" === checker status 200 dans la réponse
// Pendant je récupere les infos, Je fais la somme des prix avec les produits status 200
// Je mets à jour le html
