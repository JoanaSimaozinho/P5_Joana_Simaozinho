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
  const splitParams = params.split(",");
  const id = splitParams[0];
  const color = splitParams[1];
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
                  <p class="deleteItem"  onclick="deleteProduct('${line.id},${line.color}')">Supprimer</p>
                </div>
              </div>
            </div>
          </article>`;
    totalPrice += prod.price * line.quantity;
    totalQuantity += parseInt(line.quantity);
  }
  if (cartArray.length === 0) {
    document.querySelector(".cart__price").style.visibility = "hidden";
    return;
  }
  console.log("totalPrice");
  console.log(totalPrice);
  const cartItemsElt = document.getElementById("cart__items");
  if (cartItemsElt) {
    cartItemsElt.innerHTML = productsHTML;
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

getProductsDisplay();
