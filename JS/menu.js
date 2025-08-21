// Array to hold cart items
let cart = [];

// Function to add items to the cart
function addToCart(itemName, itemPrice) {
    const existingItem = cart.find(item => item.name === itemName);

    if (existingItem) {
        // If item already exists, increase quantity
        existingItem.quantity += 1;
    } else {
        // If item doesn't exist, add it to the cart
        cart.push({ name: itemName, price: itemPrice, quantity: 1 });
    }

    updateCartDisplay();
}

// Function to update the cart display
function updateCartDisplay() {
    const cartItemsContainer = document.querySelector('.cart-items-container');
    cartItemsContainer.innerHTML = ''; // Clear existing items

    let totalAmount = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalAmount += itemTotal;

        // Create cart item element
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <span class="fas fa-times" onclick="removeFromCart('${item.name}')"></span>
            <div class="content">
                <h3>${item.name}</h3>
                <div class="price">Rs ${item.price} x ${item.quantity} = Rs ${itemTotal}</div>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    // Add total amount to the cart
    const totalElement = document.createElement('div');
    totalElement.className = 'total-amount';
    totalElement.innerHTML = `<h3>Total Amount: Rs ${totalAmount}</h3>`;
    cartItemsContainer.appendChild(totalElement);
}

// Function to remove item from cart
function removeFromCart(itemName) {
    cart = cart.filter(item => item.name !== itemName);
    updateCartDisplay();
}

// Event listeners for "Add to Cart" buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const box = e.target.closest('.box');
        const itemName = box.querySelector('h3').innerText;
        const itemPriceText = box.querySelector('.price').innerText;
        const itemPrice = parseFloat(itemPriceText.replace(/[^\d.-]/g, ''));

        addToCart(itemName, itemPrice);
    });
});
