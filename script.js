document.addEventListener("DOMContentLoaded", () => {
    async function getProducts() {
        let response = await fetch("products.json")
        let products = await response.json()
        return products
    }

    function createProductCard(product) {
        return `
            <wa-card class="card-overview">
  <img
    slot="media"
    src="${product.image}"
    alt="${product.name}"
  />

  <strong>${product.name}</strong><br />
  ${product.description}<br />
  <small class="wa-caption-s">$${product.price}</small>

  <wa-button slot="footer" variant="brand" pill>Купити</wa-button>
  <wa-rating slot="footer-actions" label="Rating"></wa-rating>
</wa-card>

<style>
  .card-overview {
    width: 300px;
  }
</style>

        `
    }

    getProducts().then(products => {
        const productList = document.querySelector('.product-list')
        productList.innerHTML= '';
        products.forEach(product => {
            productList.innerHTML+=createProductCard(product)
        });
    })

});