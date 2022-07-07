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
                reject(e);
            });
    });
}

//Attendre résolution de la promesse
//Executer focntion donnée sur chaque élément du tableau 
//Acceder a un element specifique qui nous envoie sur page product

async function displayProducts() {
    const product = await getProduct();
    // Construire le html
    // Injecter dans la page
    let option = '<option value="">--SVP, choisissez une couleur--</option>';
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

    // Cherche l'élément #title
    const title = document.getElementById("title");
    // Cherche la balise <title>
    const pageTitle = document.querySelector("title");
    if (pageTitle) {
        pageTitle.textContent = product.name;
    }
    if (title) {
        title.textContent = product.name;
    }

    const description = document.getElementById("description");
    if (description) {
        description.textContent = product.description;
    }

    const price = document.getElementById("price");
    if (price) {
        price.textContent = product.price;
    }

    var quantity = document.getElementById("quantity");
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
            alert("Choisissez une couleur");
            return false;
        }
        const colorValue = colorsElt.value;

        // Vérifier qtité
        const quantityValue = quantity.value;
        const minValue = 1;
        quantity.setAttribute("min", minValue);
        const maxValue = 100;
        quantity.setAttribute("max", maxValue);

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
        let cartArray = [];
        // Est ce que le produit existe deja dans le panier ?
        let found = false;
        if (cart !== null) {
            cartArray = JSON.parse(cart);
            //on boucle sur les produits du panier pour savoir si un canap qui a la meme id et meme couleur existe
            for (const item of cartArray) {
                if (item.id === idProduct && item.color === colorValue) {
                    // On a trouvé le produit : on met à jour uniquement la qtité
                    found = true;
                    item.quantity += parseInt(quantityValue);
                    break;
                }
            }
        }

        //verifier que cart n'est pas null
        //Si cart est nul alors cartArray est egal a un tableau vide

        if (found === false) {
            // On a pas trouvé le produit, on l'ajoute au panier
            cartArray.push({
                id: idProduct,
                quantity: parseInt(quantityValue),
                color: colorValue,
            });
        }
        //J'ajoute le produit au panier clé : cart valeur: panier chaque objet sera un canapé
        localStorage.setItem("cart", JSON.stringify(cartArray));
        //alert est un tamplating
        alert(
            //si la quantité est supérieure a 1 ? tu mets un "s" sinon : un tu ne mets rien ""
            `Vous avez ajouté ${quantityValue} canapé${
        quantityValue > 1 ? "s" : "" // le "?" est une écriture ternaire qui permet de faire un test rapidement
      } dans votre panier`
        );
    });
}