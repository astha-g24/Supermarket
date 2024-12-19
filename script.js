// Product Data
const products = [
    { id: 1, name: 'Milk', price: 1.5, stock: 20 },
    { id: 2, name: 'Bread', price: 1.2, stock: 15 },
    { id: 3, name: 'Eggs', price: 2.5, stock: 30 },
    { id: 4, name: 'Cheese', price: 3.0, stock: 10 },
    { id: 5, name: 'Butter', price: 1.8, stock: 25 }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Display Products
function displayProducts(filteredProducts = products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    filteredProducts.forEach(product => {
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');
        productItem.innerHTML = `
            <h3>${product.name}</h3>
            <p>$${product.price.toFixed(2)}</p>
            <input type="number" id="quantity-${product.id}" value="1" min="1" max="${product.stock}">
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productList.appendChild(productItem);
    });
}

// Add to cart
function addToCart(productId) {
    const quantity = parseInt(document.getElementById(`quantity-${productId}`).value);
    const product = products.find(p => p.id === productId);

    if (quantity > product.stock) {
        alert('Not enough stock available!');
        return;
    }

    const productInCart = cart.find(item => item.product.id === productId);
    if (productInCart) {
        productInCart.quantity += quantity;
    } else {
        cart.push({ product, quantity });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

// Update the cart display
function updateCart() {
    const cartDetails = document.getElementById('cart-details');
    cartDetails.innerHTML = '';
    if (cart.length === 0) {
        cartDetails.innerHTML = '<p>No items in the cart</p>';
    } else {
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <p>${item.product.name} (x${item.quantity}) - $${(item.product.price * item.quantity).toFixed(2)}</p>
                <button onclick="removeFromCart(${item.product.id})">Remove</button>
            `;
            cartDetails.appendChild(cartItem);
        });
    }
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.product.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

// Search functionality
function searchProducts() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(query)
    );
    displayProducts(filteredProducts);
}

// Proceed to Checkout
function goToCheckout() {
    window.location.href = 'checkout.html';
}

// Load cart and display in checkout
function loadCartForCheckout() {
    const cartItemsElement = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    
    cartItemsElement.innerHTML = '';
    let total = 0;

    if (storedCart.length === 0) {
        cartItemsElement.innerHTML = '<li>No items in the cart</li>';
    } else {
        storedCart.forEach(item => {
            const listItem = document.createElement('li');
            listItem.innerText = `${item.product.name} (x${item.quantity}) - $${(item.product.price * item.quantity).toFixed(2)}`;
            cartItemsElement.appendChild(listItem);
            total += item.product.price * item.quantity;
        });
    }

    totalPriceElement.innerText = total.toFixed(2);
}

if (document.title === 'Supermarket - Checkout') {
    window.onload = loadCartForCheckout;
}

// Back to Product Selection
function goBack() {
    window.location.href = 'index.html';
}

// Apply Discount
function applyDiscount() {
    const discountCode = document.getElementById('discount-code').value;
    const totalPriceElement = document.getElementById('total-price');
    let total = parseFloat(totalPriceElement.innerText);

    if (discountCode === 'DISCOUNT10') {
        total *= 0.9; // Apply 10% discount
        document.getElementById('discount-message').innerText = '10% discount applied!';
    } else {
        document.getElementById('discount-message').innerText = 'Invalid discount code.';
    }

    totalPriceElement.innerText = total.toFixed(2);
}

// Generate Receipt
function generateReceipt() {
    const receiptDetails = document.getElementById('receipt-details');
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const customerName = document.getElementById('customer-name').value;
    const customerEmail = document.getElementById('customer-email').value;
    const customerPhone = document.getElementById('customer-phone').value;
    const totalPrice = document.getElementById('total-price').innerText;

    if (!customerName || !customerEmail || !customerPhone) {
        alert('Please fill in all customer details!');
        return;
    }

    let receipt = `Customer Details:\n`;
    receipt += `Name: ${customerName}\n`;
    receipt += `Email: ${customerEmail}\n`;
    receipt += `Phone: ${customerPhone}\n\n`;
    receipt += `Items Purchased:\n`;

    storedCart.forEach(item => {
        receipt += ` - ${item.product.name} (x${item.quantity}): $${(item.product.price * item.quantity).toFixed(2)}\n`;
    });

    receipt += `\nTotal Amount: $${totalPrice}`;
    receiptDetails.innerText = receipt;

    document.getElementById('receipt-modal').style.display = 'block';
}


// Print Receipt
function printReceipt() {
    window.print();
}

// Close Receipt Modal
document.getElementById('close-modal').onclick = function () {
    document.getElementById('receipt-modal').style.display = 'none';
};

// Initial Display
if (document.title === 'Supermarket - Product Selection') {
    displayProducts();
    updateCart();
}
