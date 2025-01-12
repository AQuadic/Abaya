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

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.items.push({ ...product, quantity: 1 });
        }
        this.updateCart();
    },

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.updateCart();
    },

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

    loadCart() {
        const storedItems = localStorage.getItem('cartItems');
        if (storedItems) {
            this.items = JSON.parse(storedItems); 
            this.updateCart(); 
        }
    }
};

window.onload = function() {
    cart.loadCart();
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const product = {
                id: parseInt(button.getAttribute('data-id')),
                name: button.getAttribute('data-name'),
                price: parseFloat(button.getAttribute('data-price')),
                image: button.getAttribute('data-image'),
            };
            cart.addItem(product);
        });
    });
};
