class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.items.push({ ...product, quantity: 1 });
        }
        this.save();
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.save();
    }

    getTotalItems() {
        return this.items.reduce((acc, item) => acc + item.quantity, 0);
    }

    getTotalPrice() {
        return this.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    }

    save() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.updateUI();
    }

    updateUI() {
        const totalItems = this.getTotalItems();
        document.querySelectorAll('.cart-count, .cart-total').forEach(el => {
            el.textContent = totalItems;
        });
        
        const stickyCart = document.querySelector('.sticky-cart');
        totalItems > 0 ? 
            stickyCart.classList.add('visible') : 
            stickyCart.classList.remove('visible');
    }
}

// Initialize Cart
const cart = new Cart();

document.addEventListener('DOMContentLoaded', () => {
    // Add to Cart Functionality
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function(e) {
            const productCard = this.closest('.product-card');
            const product = {
                id: generateProductId(productCard),
                title: productCard.querySelector('h3').textContent,
                price: parseFloat(productCard.querySelector('.price').textContent.replace('$', '')),
                image: productCard.querySelector('img').src
            };
            
            cart.addItem(product);
            animateAddToCart(this);
        });
    });

    // Sticky Cart Click Handler
    document.querySelector('.sticky-cart').addEventListener('click', showCartModal);
});

function generateProductId(productCard) {
    return productCard.querySelector('h3').textContent
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
}

function animateAddToCart(button) {
    const clone = button.cloneNode(true);
    const cartIcon = document.querySelector('.cart-icon');
    
    clone.style.position = 'absolute';
    clone.style.transform = 'scale(0.8)';
    clone.style.opacity = '0.7';
    button.parentElement.appendChild(clone);

    const buttonRect = button.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    clone.animate([
        {
            transform: `translate(${buttonRect.left}px, ${buttonRect.top}px)`,
            opacity: 1
        },
        {
            transform: `translate(${cartRect.left}px, ${cartRect.top}px)`,
            opacity: 0
        }
    ], {
        duration: 800,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }).onfinish = () => clone.remove();
}

function showCartModal() {
    const modalContent = `
        <div class="cart-modal">
            <div class="modal-content">
                <h2>Your Cart (${cart.getTotalItems()})</h2>
                <div class="cart-items">
                    ${cart.items.map(item => `
                        <div class="cart-item">
                            <img src="${item.image}" alt="${item.title}">
                            <div class="item-details">
                                <h3>${item.title}</h3>
                                <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                            </div>
                            <button class="remove-item" data-id="${item.id}">&times;</button>
                        </div>
                    `).join('')}
                </div>
                <div class="cart-total">
                    Total: $${cart.getTotalPrice().toFixed(2)}
                </div>
                <button class="checkout-btn">Proceed to Checkout</button>
            </div>
        </div>
    `;

    const modal = document.createElement('div');
    modal.classList.add('modal-overlay');
    modal.innerHTML = modalContent;
    document.body.appendChild(modal);

    // Close Modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('close-modal')) {
            modal.remove();
        }
    });

    // Remove Item
    modal.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', () => {
            cart.removeItem(button.dataset.id);
            modal.remove();
            showCartModal();
        });
    });
}