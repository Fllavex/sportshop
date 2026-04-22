document.addEventListener("DOMContentLoaded", () => {


    async function getProducts() {
        let response = await fetch("products.json")
        let products = await response.json()
        return products
    }

function createProductCard(product) {
    return `
        <div class="swiper-slide">
            <wa-card class="card-overview">
                <img slot="media" src="${product.image}" alt="${product.name}" />
                <strong>${product.name}</strong><br />
                ${product.description}<br />
                <small class="wa-caption-s">$${product.price}</small>
                <wa-button slot="footer" variant="brand" pill>Купити</wa-button>
                <wa-rating slot="footer-actions" label="Rating"></wa-rating>
            </wa-card>
        </div>
    `
}

    getProducts().then(products => {
        
        const productList = document.querySelector('.product-list')
        productList.innerHTML= '';
        products.forEach(product => {
            productList.innerHTML+=createProductCard(product)
        });
        // const cards = document.querySelectorAll('.card-overview');
        // cards.forEach(card => {
        //     card.classList.add('swiper-slide');
        // });
        
        let buybtn = document.querySelectorAll('wa-button');
        buybtn.forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelector('.basket_card').classList.remove('hide');

            });
        });
            const swiper = new Swiper('.swiper', { 
    loop: true,
    speed: 600,    
    spaceBetween: 20,
    slidesPerView: 3,
    autoplay: {
        delay: 3000,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    breakpoints: {
        320: { slidesPerView: 1 },
        700: { slidesPerView: 2 },
        1000: { slidesPerView: 3 }
    }
});
    })

});