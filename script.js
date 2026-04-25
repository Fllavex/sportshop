// 1.Універсальна функція для збереження будь-яких даних (масивів/об'єктів) у
function getJsonCookie(cookieName) {
    const allCookies = document.cookie.split('; ');
    const targetCookie = allCookies.find(row => row.startsWith(cookieName + '='));
    if (targetCookie) {
        const encodedData = targetCookie.split('=')[1];
        return JSON.parse(decodeURIComponent(encodedData));
    }
    return null;
}

// 2. Універсальна функція для збереження будь-яких даних (масивів/об'єктів) у
function saveJsonCookie(cookieName, data, seconds) {
    const jsonString = JSON.stringify(data);
    const safeString = encodeURIComponent(jsonString);
    document.cookie = `${cookieName}=${safeString}; max-age=${seconds}; path=/`;
}

function addToCart(productId) {
        let product = products.find(p => p.id === productId);
        if (!product) return;
        let cartItem = cart.find(item => item.id === productId);
        if (cartItem) {
            cartItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        console.log(cart);
        saveJsonCookie('cart', cart, 3600*24*7);
}

function displayCart() {
    cartContainer.innerHTML = '';
    cart.forEach(item => {
        cartContainer.innerHTML += `
            <div class="cart-item">
                <img src="${item.image}" height="70" alt="${item.name}" />
                <div class="cart-item-details">
                    <strong>${item.name}</strong>
                    <p>Quantity: ${item.quantity}</p>
                    <p>Price: $${item.price}</p>
                </div>
            </div>
        `;
    });
}

function loadCart() {
    const savedCart = getJsonCookie('cart');
    if (savedCart) {
        cart = savedCart;
    }
    displayCart();

}
    let cart = [];
    let products = [];
    const cartContainer = document.getElementById('cart-items');

    function createProductCard(product) {
    return `
        <div class="swiper-slide">
            <wa-card class="card-overview">
                <img slot="media" src="${product.image}" alt="${product.name}" />
                <strong>${product.name}</strong><br />
                ${product.description}<br />
                <small class="wa-caption-s">$${product.price}</small>
                <wa-button onclick="addToCart(${product.id})" slot="footer" variant="brand" pill>Купити</wa-button>
                <wa-rating slot="footer-actions" label="Rating"></wa-rating>
            </wa-card>
        </div>
    `
}

document.addEventListener("DOMContentLoaded", () => {

    loadCart();

    async function getProducts() {
        let response = await fetch("products.json")
        let products = await response.json()
        return products
    }






    getProducts().then(productsData => {
        products = productsData;
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
    const dialog = document.querySelector('.dialog-scrolling');
    const openButton = dialog.nextElementSibling;
    
    openButton.addEventListener('click', () => (dialog.open = true));


});