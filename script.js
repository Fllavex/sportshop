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
    src="https://images.unsplash.com/photo-1559209172-0ff8f6d49ff7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80"
    alt="A kitten sits patiently between a terracotta pot and decorative grasses."
  />

  <strong>Mittens</strong><br />
  This kitten is as cute as he is playful. Bring him home today!<br />
  <small class="wa-caption-s">6 weeks old</small>

  <wa-button slot="footer" variant="brand" pill>More Info</wa-button>
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