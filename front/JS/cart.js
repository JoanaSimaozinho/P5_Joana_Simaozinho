//On appelle le serveur et on lui demande de retourner le produit qui a pour id l'id passé en paramètre

async function getProduct(id) {
  return new Promise((resolve, reject) => {
      const url = `http://localhost:3000/api/products/${id}`;
      fetch(url)
          .then((response) => response.json())
          .then((data) => {
              resolve(data);
          })
          .catch((e) => {
              reject(e);
          });
  });
}

//On recupere la valeur du panier qui est stocké dans le local storage

function getCartArray() {
  //On renvoie la valeur associée à la clé passée en paramètre avec getItem()
  const cart = localStorage.getItem("cart");
  return JSON.parse(cart) || [];
}

//Fonction pour supprimer le ou les produits du panier
function deleteProduct(params) {
  const { id, color } = params;
  const cartArray = getCartArray();
  for (let index = 0; index < cartArray.length; index++) {
      const product = cartArray[index];
      if (product.id === id && product.color === color) {
          cartArray.splice(index, 1);
          localStorage.setItem("cart", JSON.stringify(cartArray));
          break;
      }
  }
  getProductsDisplay();
}

//
async function getProductsDisplay() {
  const cartArray = getCartArray();
  let productsHTML = "";
  let totalPrice = 0;
  let totalQuantity = 0;
  for (const line of cartArray) {
      const prod = await getProduct(line.id);
      productsHTML += `<article class="cart__item" data-id="${line.id}" data-color="${line.color}">
        <div class="cart__item__img">
          <img src="${prod.imageUrl}" alt="Photographie d'un canapé" />
        </div>
        <div class="cart__item__content">
          <div class="cart__item__content__description">
            <h2>${prod.name}</h2>
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
              <p class="deleteItem" data-id="${line.id}" data-color="${line.color}">Supprimer</p>
            </div>
          </div>
        </div>
      </article>`;
      totalPrice += prod.price * line.quantity;
      totalQuantity += parseInt(line.quantity);
  }

  const cartItemsElt = document.getElementById("cart__items");
  if (cartItemsElt) {
      cartItemsElt.innerHTML = productsHTML;
  }
  if (cartArray.length === 0) {
      document.querySelector(".cart__price").style.visibility = "hidden";
      return;
  }

  const deleteItems = document.querySelectorAll(".deleteItem");
  for (const deleteItem of deleteItems) {
      deleteItem.addEventListener("click", (event) => {
          const targetElement = event.target;
          deleteProduct({
              id: targetElement.dataset.id,
              color: targetElement.dataset.color,
          });
      });
  }
  const totalPriceElt = document.getElementById("totalPrice");
  if (totalPriceElt) {
      totalPriceElt.textContent = totalPrice;
  }
  const totalQuantityElt = document.getElementById("totalQuantity");
  if (totalQuantityElt) {
      totalQuantityElt.textContent = totalQuantity;
  }
  const itemQuantity = document.querySelectorAll(".itemQuantity");
  itemQuantity.forEach((item, index) => {
      item.addEventListener("input", function(evt) {
          cartArray[index].quantity = parseInt(this.value);
          localStorage.setItem("cart", JSON.stringify(cartArray));
          getProductsDisplay();
      });
  });
}

function hasNumber(string) {
  return /\d/.test(string);
}

function isEmail(email) {
  return email
      .toLowerCase()
      .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
}

async function sendCommand(payload) {
  return new Promise((resolve, reject) => {
      fetch("http://localhost:3000/api/products/order", {
              method: "POST",
              headers: {
                  // 'Accept': 'application/json',
                  "Content-Type": "application/json",
              },
              // mode: "cors",
              body: JSON.stringify(payload),
          })
          .then((response) => {
              if (response.status !== 201) {
                  alert('Impossible de valider la commande.')
                  return reject()
              }
              resolve(response.json())
          })
          .catch((e) => {
              alert('Impossible contacter le serveur.')
              reject(e);
          });
  });
}

function handleFormSubmit() {
    const products = getCartArray();
    if (products.length === 0) {
        alert("Merci d'ajouter des produits avant de passer commande")
        return false
    } 
    const form = document.querySelector("form");
    if (form) {
        form.addEventListener("submit", async function(event) {
          event.preventDefault();
          const formData = new FormData(form);
          let contact = {};
          for (var pair of formData.entries()) {
              const key = pair[0];
              const result = pair[1];

              if (key === "firstName") {
                  const firstNameError = document.querySelector("#firstNameErrorMsg");
                  if (firstNameError) {
                      if (!result) {
                          return (firstNameError.textContent = " Pas vide non");
                      }
                      if (hasNumber(result)) {
                          return (firstNameError.textContent = "Pas de chiffre, non. ");
                      }
                      firstNameError.textContent = "";
                  }
              }
              if (key === "email") {
                  const emailError = document.querySelector("#emailErrorMsg");
                  if (emailError) {
                      if (!result) {
                          return (emailError.textContent = " Pas vide non");
                      }
                      if (!isEmail(result)) {
                          return (emailError.textContent =
                              "Ca n est pas un email. Attention attention, non.");
                      }
                      emailError.textContent = "";
                  }
              }
              contact[key] = result;
          }
          // sendCommand({ contact: contact, products: ["107fb5b75607497b96722bda5b504926"] });
          // Récupérer le vrai formulaire
          // Récupérer le arrayCart
         

          // Boucler sur les elements
          // Faire un tableau avec les id des produits
          let productsIds = [];

          for (let index = 0; index < products.length; index++) {
              productsIds.push(products[index].id);
          }

          // Remplacer le faux tableau ["107fb5b75607497b96722bda5b504926"] par le résultat du dessus

          const commandResult = await sendCommand({
              contact,
              products: productsIds,
          })

          if (commandResult) {
              localStorage.removeItem("cart")
              window.location.href = `confirmation.html?id=${commandResult.orderId}`;
          }
      });
  }
}

handleFormSubmit();

getProductsDisplay();