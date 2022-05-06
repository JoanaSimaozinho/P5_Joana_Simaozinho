console.log("product");

// TODO :
// Récupérer l'id qui est dans l'url
// id est un parametre, derriere ?
// si plusieurs parametres ... .html?param1=blabla&param2=bloblo

// Appel au serveur : donne moi le produit qui a l'id récupéré /api/products/idrécupéré

// Construire le html

// Injecter dans la page

console.log("start");
const idProduct = new URL(window.location.href).searchParams.get("id");

async function getProduct() {
  return new Promise((resolve, reject) => {
    const url = `http://localhost:3000/api/products/${idProduct}`;

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

async function displayProducts() {
  const product = await getProduct();
  console.log(product);

  let option = "";
  product.colors.forEach(
    (color) => (option += `<option value="${color}">${color}</option>`)
  );

  const img = document.querySelector("#item .item__img img");
  if (img) {
    img.src = product.imageUrl;
    img.alt = product.altTxt;
    //img.setAttribute("alt", product.altTxt);
  }

  const colorsElt = document.querySelector("#colors");
  console.log(colorsElt.value);
  if (colorsElt !== null) {
    colorsElt.innerHTML += option;
  }

  var title = document.getElementById("title");
  console.log(title);
  if (title) {
    title.innerHTML += product.name;
  }

  var description = document.getElementById("description");
  console.log(description);
  if (description) {
    description.innerHTML += product.description;
  }

  var price = document.getElementById("price");
  console.log(price);
  if (price) {
    price.innerHTML += product.price;
  }

  var quantity = document.getElementById("quantity");
  console.log(quantity);

  // const list = ` <article>
  //   <div class="item__img">
  //     <img src="${product.imageUrl}" alt="${product.altTxt}" />
  //   </div>
  //   <div class="item__content">
  //     <div class="item__content__titlePrice">
  //       <h1 id="title">${product.name}</h1>
  //       <p>Prix : <span id="price">${product.price}</span>€</p>
  //     </div>

  //     <div class="item__content__description">
  //       <p class="item__content__description__title">Description :</p>
  //       <p id="description">
  //         ${product.description}
  //       </p>
  //     </div>

  //     <div class="item__content__settings">
  //       <div class="item__content__settings__color">
  //         <label for="color-select">${product.colors}</label>
  //         <select name="color-select" id="colors">
  //           <option value="">--SVP, choisissez une couleur --</option>
  //           ${option}
  //         </select>
  //       </div>

  //       <div class="item__content__settings__quantity">
  //         <label for="itemQuantity"
  //           >Nombre d'article(s) (1-100) :</label
  //         >
  //         <input
  //           type="number"
  //           name="itemQuantity"
  //           min="1"
  //           max="100"
  //           value="0"
  //           id="quantity"
  //         />
  //       </div>
  //     </div>

  //     <div class="item__content__addButton">
  //       <button id="addToCart">Ajouter au panier</button>
  //     </div>
  //   </div>
  // </article>`;
  // document.getElementById("item").innerHTML = list;
  //console.log(list);
}

displayProducts();

const btnElt = document.getElementById("addToCart");
if (btnElt !== null) {
  btnElt.addEventListener("click", () => {
    // Verifier couleur selectionnée
    const colorsElt = document.querySelector("#colors");
    if (!colorsElt.value) {
      alert("Choisissez au moins une couleur");
      return false;
    }
    const colorValue = colorsElt.value;
    console.log(colorValue);

    // Vérifier qtité
    const quantityValue = quantity.value;
    const minValue = 1;
    quantity.setAttribute("min", minValue);
    console.log(minValue);
    const maxValue = 100;
    quantity.setAttribute("max", maxValue);
    console.log(maxValue);

    if (quantityValue > maxValue) {
      alert("Vous ne pouvez pas dépasser les 100 articles");
      return false;
    }

    if (quantityValue < minValue) {
      alert("Sélectionnez la quantité");
      return false;
    }
    // Ajouter au panier :

    const cart = localStorage.getItem("cart");
    console.log(cart);
    let cartArray = [];
    let found = false;
    if (cart !== null) {
      cartArray = JSON.parse(cart);
      console.log(cartArray);

      for (const item of cartArray) {
        console.log(item);
        if (item.id === idProduct && item.color === colorValue) {
          found = true;
          console.log(typeof item.quantity);
          console.log(typeof quantityValue);
          item.quantity += parseInt(quantityValue);
          break;
        }
      }
    }

    //Todo verifier que cart n'est pas null
    //Si cart est nul alors cartArray est egal a tableau vide
    if (found === false) {
      cartArray.push({
        id: idProduct,
        quantity: parseInt(quantityValue),
        color: colorValue,
      });
    }
    //J'ajoute le produit au panier clé : cart valeur: panier chaque objet sera un canapé
    localStorage.setItem("cart", JSON.stringify(cartArray));
    alert(
      `Vous avez ajouté ${quantityValue} canapé${
        quantityValue > 1 ? "s" : ""
      } dans votre panier`
    );
    // Tester si canap avec cet id est deja au panier (en dernier)
    // Si oui > mettre à jour la quantité
    // Si non > ajouter au localStorage
  });
}

// Popup "continuer mes achats" ou "Aller au panier" > à vérifier dans les consignes

//Je selectionne et stocke le bouton
// const addToCart = document.getElementById("addToCart");
// console.log(addToCart);

//Je selectionne et stocke la DIV container-notifications
// const ctn = document.querySelector(".container-notifications");

// addToCart.addEventListener("click", function () {
//   console.log("bouton cliqué");
//   alert("notifications");

//Je cree un element
// const notifications = document.createElement("div");
// console.log(notifications);

//Je donne une style à la DIV
// notifications.classList.add("toast");

//J'insere du contenu texte
// notifications.innerText = "Votre article a bien été enregistrée";
// console.log(notifications);

//J'accroche notifications à l'element ctn
// ctn.appendChild(notifications);

//A la fin du chrono, je retire la notification du DOM
//   setTimeout(function () {
//     notifications.remove();
//   }, 2000);

// });
