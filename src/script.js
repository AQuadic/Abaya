// Load Navbar
document.addEventListener("DOMContentLoaded", function() {
    fetch('./navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar').innerHTML = data;
        })
        .catch(error => console.error('Error loading the navbar:', error));
});

// Load Offer
document.addEventListener("DOMContentLoaded", function() {
    fetch('./offerBar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('offer').innerHTML = data;
        })
        .catch(error => console.log('Error loading the footer:', error));
        
});

// Load Footer
document.addEventListener("DOMContentLoaded", function() {
    fetch('./footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer').innerHTML = data;
        })
        .catch(error => console.log('Error loading the footer:', error));
        
});

// Cart Implementation
const cart = {
    items: [],
    total: 0,

    // Add item to the cart
    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id && item.size === product.size);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.items.push({ ...product, quantity: 1 });
        }
        this.updateCart();
    },

    // Remove item from the cart
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.updateCart();
    },

    // Update item quantity
    updateQuantity(productId, action) {
        const item = this.items.find(item => item.id === productId);
        if (!item) return;

        if (action === 'increase') {
            item.quantity++;
        } else if (action === 'decrease' && item.quantity > 1) {
            item.quantity--;
        } else if (item.quantity === 1) {
            this.removeItem(item.id);
            return;
        }

        this.updateCart();
    },

    // Update the cart UI
    updateCart() {
        const cartCount = document.getElementById('cartCount');
        const cartTotal = document.getElementById('cartTotal');
        const cartItems = document.getElementById('cartItems');

        if (cartCount && cartTotal && cartItems) {
            const count = this.items.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = `الحقيبة (${count})`;

            this.total = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
            cartTotal.textContent = `${this.total} ريال`;

            cartItems.innerHTML = ''; 
            this.items.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'flex gap-2 mb-4';
                itemElement.innerHTML = `
                    <img src="${item.image}" class="w-20 h-20" alt="Product Image">
                    <div>
                        <p>${item.name}</p>
                        <div class="flex items-center gap-4 mt-1">
                            <button onclick="cart.updateQuantity(${item.id}, 'decrease')" class="text-gray-500 hover:text-gray-700">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                                </svg>
                            </button>
                            <span class="text-sm">${item.quantity}</span>
                            <button onclick="cart.updateQuantity(${item.id}, 'increase')" class="text-gray-500 hover:text-gray-700">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                                </svg>
                            </button>
                        </div>
                        <p>السعر: <span>${item.price} ريال</span></p>
                        <p>المقاس: <span>${item.size}</span></p> <!-- Display size here -->
                        <button class="text-red-500 mt-2" onclick="cart.removeItem(${item.id})">حذف</button>
                    </div>
                `;
                cartItems.appendChild(itemElement);
            });

            localStorage.setItem('cartItems', JSON.stringify(this.items));
        } else {
            console.error('Cart elements not found!');
        }
    },

    // Load cart from localStorage
    loadCart() {
        const storedItems = localStorage.getItem('cartItems');
        if (storedItems) {
            this.items = JSON.parse(storedItems); 
            this.updateCart(); 
        }
    }
};

// Favorites Implementation
const favorites = {
    items: [],

    toggleItem(product) {
        const existingItemIndex = this.items.findIndex(item => item.id === product.id);
        if (existingItemIndex === -1) {
            this.items.push({ ...product });
        } else {
            this.items.splice(existingItemIndex, 1);
        }
        this.updateFavorites();
    },
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.updateFavorites();
    
        const heartIcon = document.querySelector(`img[data-id='${productId}']`);
        if (heartIcon) {
            const heartIconState = heartIcon.closest('[x-data]').__x.$data;
            heartIconState.isRedHeart = false; 
        }
    },
    updateFavorites() {
        const favCount = document.getElementById('favCount');
        const favItems = document.getElementById('favItems');

        if (favCount && favItems) {
            favCount.textContent = `قائمة الأمنيات (${this.items.length})`;

            favItems.innerHTML = '';

            if (this.items.length > 0) {
                this.items.forEach(item => {
                    const itemElement = document.createElement('div');
                    itemElement.className = 'flex gap-2 mb-4';
                    itemElement.innerHTML = `
                        <img src="${item.image}" class="w-20 h-20" alt="Product Image">
                        <div>
                            <p>${item.name}</p>
                            <p>السعر: <span>${item.price} ريال</span></p>
                            <button class="text-red-500 mt-2" onclick="favorites.removeItem(${item.id})">حذف</button>
                        </div>
                    `;
                    favItems.appendChild(itemElement);
                });
            } else {
                favItems.innerHTML = `
                    <div class="mt-2 flex flex-col items-center">
                        <img src="../../images/Heart.svg" class="w-20 h-20" alt="Image">
                        <p class="font-medium text-lg">ليس لديك منتجات في قائمة الأمنيات حاليا</p>
                    </div>
                `;
            }

            localStorage.setItem('favorites', JSON.stringify(this.items));
        } else {
            console.error('Favorites elements not found!');
        }
    },

    loadFavorites() {
        const storedItems = localStorage.getItem('favorites');
        if (storedItems) {
            this.items = JSON.parse(storedItems);
            this.updateFavorites();
        }
    }
};

function addToFavorites(event) {
    const button = event.currentTarget;
    const product = {
        id: parseInt(button.getAttribute('data-id')),
        name: button.getAttribute('data-name'),
        price: parseFloat(button.getAttribute('data-price')),
        image: button.getAttribute('data-image'),
    };

    favorites.toggleItem(product);

    const heartIcon = button.closest('[x-data]').__x.$data;
    if (heartIcon) {
        heartIcon.isRedHeart = favorites.items.some(item => item.id === product.id);
    }
}

window.onload = function () {
    cart.loadCart();
    favorites.loadFavorites();
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const product = {
                id: parseInt(button.getAttribute('data-id')),
                name: button.getAttribute('data-name'),
                price: parseFloat(button.getAttribute('data-price')),
                image: button.getAttribute('data-image'),
                size: button.getAttribute('data-size'), // Include size
            };
            console.log(product); // Debugging: Check if size is included
            cart.addItem(product);
        });
    });
};
