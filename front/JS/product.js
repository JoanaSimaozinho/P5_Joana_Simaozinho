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
    console.log(colorsElt.value);
    if (!colorsElt.value) {
      alert("Choisissez au moins une couleur");
      return false;
    }
    // Vérifier qtité
    // Ajouter au panier :
    // Tester si canap avec cet id est deja au panier (en dernier)
    // Si oui > metrre à jour la quantité
    // Si non > ajouter au localStorage
    // Popup "continuer mes achats" ou "Aller au panier" > à vérifier dans les consignes
  });
}
