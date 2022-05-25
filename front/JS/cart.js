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
  return JSON.parse(cart) || [];
}

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

async function getProductsDisplay() {
  const cartArray = getCartArray();
  let productsHTML = "";
  let totalPrice = 0;
  let totalQuantity = 0;
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
                  <p class="deleteItem"  data-id="${line.id}" data-color="${line.color}">Supprimer</p>
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
    item.addEventListener("input", function (evt) {
      cartArray[index].quantity = parseInt(this.value);
      localStorage.setItem("cart", JSON.stringify(cartArray));
      getProductsDisplay();
    });
  });
}
function handleFormSubmit() {
  var form = document.querySelector("form");
  console.log(form);
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(form);
    for (var pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
      const key = pair[0];
      const result = pair[1];
      // If key === firstName
      // Alors value ne doit pas contenir de chiffre
      // Si chiffre alors return error
    }
    // var username = document.getElementById("username").value
    // console.log(username)

    // var email = document.getElementById("email").value
    // console.log(email)
  });
}

handleFormSubmit();

getProductsDisplay();
