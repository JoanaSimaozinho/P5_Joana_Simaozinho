// Récupérer l'id qui est dans l'url
const idProduct = new URL(window.location.href).searchParams.get("id");

// ON appel le serveur : donne moi le produit qui a l'id récupéré /api/products/idrécupéré
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
// Construire le html
// Injecter dans la page
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
}
displayProducts();


//Je selectionne et stocke le bouton
const btnElt = document.getElementById("addToCart");
if (btnElt !== null) {
  //Ajoutez un écouteur d'événement qui se déclenche lorsqu'on clique sur le bouton 
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
//on boucle sur les produits du panier pour savoir si un canap qui a la meme id et meme couleur existe
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

    //verifier que cart n'est pas null
    //Si cart est nul alors cartArray est egal a un tableau vide
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
