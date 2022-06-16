async function getProducts() {
  return new Promise((resolve, reject) => {
    try {
      const url = "http://localhost:3000/api/products/";
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          resolve(data);
        })
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

async function displayProducts() {
  const canaps = await getProducts();
  let list = "";
  canaps.forEach((canap) => {
    list += `<a href="./product.html?id=${canap._id}"><article><img src="${canap.imageUrl}" alt="${canap.Txt}" /><h3 class="productName">${canap.name}</h3></article></a>`;
  });
  document.getElementById("items").innerHTML = list;
  console.log(list);
}

displayProducts();
