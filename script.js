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

function showTab(tab) {
    document.getElementById('tab-login').style.display = tab === 'login' ? 'block' : 'none';
    document.getElementById('tab-register').style.display = tab === 'register' ? 'block' : 'none';
}

function registerUser() {
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value.trim();

    if (!name || !email || !password) {
        document.getElementById('reg-error').textContent = 'Заповніть всі поля!';
        return;
    }

    const users = getJsonCookie('users') || [];
    if (users.find(u => u.email === email)) {
        document.getElementById('reg-error').textContent = 'Такий email вже існує!';
        return;
    }

    users.push({ name, email, password });
    saveJsonCookie('users', users, 3600 * 24 * 30);
    document.getElementById('reg-error').style.color = 'green';
    document.getElementById('reg-error').textContent = 'Успішно зареєстровано! ✅';
}

function loginUser() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    const users = getJsonCookie('users') || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        document.getElementById('login-error').textContent = 'Невірний email або пароль!';
        return;
    }

    saveJsonCookie('currentUser', user, 3600 * 24 * 7);
    document.getElementById('login-btn').textContent = `👤 ${user.name}`;
    document.querySelector('.dialog-login').open = false;
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
                <button type="button" class="btn-close" onclick="removeFromCart(${item.id})" aria-label="Close"></button>
            </div>
        `;
    });
}

function removeFromCart(productId) {
    let cartItem = cart.find(item => item.id === productId);
    if (!cartItem) return;
    
    if (cartItem.quantity > 1) {
        cartItem.quantity--; 
    } else {
        cart = cart.filter(item => item.id !== productId);
    }
    
    saveJsonCookie('cart', cart, 3600 * 24 * 7);
    displayCart();
}

function loadCart() {
    const savedCart = getJsonCookie('cart');
    if (savedCart) {
        cart = savedCart;
    }
    displayCart();

}
    let cart = [];
    let wishlist = [];

function toggleWishlist(productId) {
    let exists = wishlist.find(item => item.id === productId);
    if (exists) {
        wishlist = wishlist.filter(item => item.id !== productId);
    } else {
        let product = products.find(p => p.id === productId);
        if (product) wishlist.push(product);
    }
    saveJsonCookie('wishlist', wishlist, 3600 * 24 * 7);
    displayWishlist();
}

function displayWishlist() {
    const wishlistContainer = document.getElementById('wishlist-items');
    wishlistContainer.innerHTML = '';
    wishlist.forEach(item => {
        wishlistContainer.innerHTML += `
            <div class="cart-item">
                <img src="${item.image}" height="70" alt="${item.name}" />
                <div class="cart-item-details">
                    <strong>${item.name}</strong>
                    <p>Ціна: $${item.price}</p>
                </div>
                <button type="button" onclick="toggleWishlist(${item.id})">🗑️ Видалити</button>
            </div>
        `;
    });
};


    let products = [];
    let dialog;
    const cartContainer = document.getElementById('cart-items');
    totalPrice = document.getElementById('total-price');
    function calculateTotal() {
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        totalPrice.textContent = total;
        saveJsonCookie('totalPrice', total, 3600 * 24 * 7);
    }





    function createProductCard(product) {
        const isWishlisted = wishlist.find(item => item.id === product.id);
        return `
            <div class="swiper-slide">
                <wa-card class="card-overview">
                    <img slot="media" src="${product.image}" alt="${product.name}" />
                    <strong>${product.name}</strong><br />
                    ${product.description}<br />
                    <small class="wa-caption-s">$${product.price}</small>
                    <wa-button class="btn_basket" 
                        onclick="addToCart(${product.id}); calculateTotal(); displayCart(); dialog.open = true; " 
                        slot="footer" variant="brand" pill>Купити</wa-button>
                    <wa-button slot="footer" variant="neutral" pill
                        onclick="toggleWishlist(${product.id})">
                        ${isWishlisted ? '❤️' : '🤍'} Вибране
                    </wa-button>
                    <wa-rating slot="footer-actions" label="Rating"></wa-rating>
                </wa-card>
            </div>
        `;
    }


    function searchProducts(query) {
    const productList = document.querySelector('.product-list');
    const filtered = query.trim() === ''
        ? products
        : products.filter(p =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.category.toLowerCase().includes(query.toLowerCase())
        );

    productList.innerHTML = '';

    if (filtered.length === 0) {
        productList.innerHTML = '<p style="padding:20px; color:white;">Нічого не знайдено 😕</p>';
        return;
    }

    filtered.forEach(p => productList.innerHTML += createProductCard(p));
    };





document.addEventListener("DOMContentLoaded", () => {
     const savedCart = getJsonCookie('cart');
    if (savedCart) {
        cart = savedCart;
        calculateTotal();
        displayCart();
    }
    
    deletecartBtn = document.querySelector('.btn-close');
    dialog = document.querySelector('.dialog-scrolling');
    const openButton = dialog.nextElementSibling;
    openButton.addEventListener('click', () => (dialog.open = true));
     let resetBasketBtn = document.querySelector('.reset_basket');
    resetBasketBtn.addEventListener('click', () => {
        totalPrice.textContent = '0';
        cart = [];
        saveJsonCookie('cart', cart, 3600*24*7);
        displayCart();
    });


    function loadWishlist() {
        const saved = getJsonCookie('wishlist');
        if (saved) wishlist = saved;
        displayWishlist();
    }

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
        
        // let buybtn = document.querySelectorAll('wa-button');
        // buybtn.forEach(btn => {
        //     btn.addEventListener('click', () => {
                

        //     });
        // });
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
        document.getElementById('search-input').addEventListener('input', (e) => {
            searchProducts(e.target.value);
        });

        document.querySelector('form[role="search"]').addEventListener('submit', (e) => {
            e.preventDefault();
        });
    })

    const wishlistDialog = document.querySelector('.dialog-wishlist');
    document.getElementById('wishlist-btn').addEventListener('click', () => {
        wishlistDialog.open = true;
    });


    const loginDialog = document.querySelector('.dialog-login');
    document.getElementById('login-btn').addEventListener('click', () => {
        loginDialog.open = true;
    });

    loadWishlist();


    const currentUser = getJsonCookie('currentUser');
    if (currentUser) {
        document.getElementById('login-btn').textContent = `👤 ${currentUser.name}`;
}

});