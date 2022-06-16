//interrogation du serveur pour qu'il nous donne la liste des produits
//s'assurer que le serveur nous envoie la liste demandée
//On boucle sur cette liste pour générer du HTML
//Quand c'est fait on ré injecte le HTML dans le document

async function getProducts() {

  //on renvoi une promise pour faire un chainage
  return new Promise((resolve, reject) => {
    try {
      const url = "http://localhost:3000/api/products/";

      //On boucle avec fetch
      fetch(url)
      //Renvoie de la promise
        .then((response) => response.json())
        .then((data) => {
          resolve(data);
        })

        //revoie la promise et ne traite que dans le cas ou la promise initiale est rejetée
        .catch((e) => {
          console.log(e);
          reject(e);
        });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

//Permet d'aller sur chaque page produit avec le "list" en récupérant l'id du canapé choisi
//Boucle sur le résultat du serveur pour afficher les infos du canapé choisi avec le href de l'image, de la description et du nom

async function displayProducts() {
  //On force la fonction a attendre la resolution de la promesse avec await
  const canaps = await getProducts();
  let list = "";
  //exécute la fonction donnée sur chaque element du tableau
  canaps.forEach((canap) => {
    list += `<a href="./product.html?id=${canap._id}"><article><img src="${canap.imageUrl}" alt="${canap.Txt}" /><h3 class="productName">${canap.name}</h3></article></a>`;
  });
  //On accède a un element specifique avec get element by id 
  document.getElementById("items").innerHTML = list;
  console.log(list);
}

displayProducts();
