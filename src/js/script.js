// Load Navbar
document.addEventListener("DOMContentLoaded", function() {
    fetch('../../src/Components/navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar').innerHTML = data;
        })
        .catch(error => console.error('Error loading the navbar:', error));
});

// Load Offer
document.addEventListener("DOMContentLoaded", function() {
    fetch('../../src/Components/offerBar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('offer').innerHTML = data;
        })
        .catch(error => console.log('Error loading the footer:', error));
        
});

// Load Footer
document.addEventListener("DOMContentLoaded", function() {
    fetch('../../src/Components/footer.html')
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
                        <p>الكمية: <span>${item.quantity}</span></p>
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
