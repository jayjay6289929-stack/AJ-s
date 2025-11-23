 // Product data array
const products = [
  { id: ' strawberrry', name: 'strawberry Bliss', price: 1000, desc: ' strawbery , creamy base, loved by all.', emoji: '🍓' },
  { id: 'vanilla', name: 'vanilla Fusion', price: 500, desc: 'vanilla, slightly tart and refreshing.', emoji: '🍺' },
  { id: 'plain', name: ' banana Classic', price: 400, desc: ' banana, unsweetened, perfect for toppings.', emoji: '🍌' },
  { id: 'choco', name: '  chocolate Delight', price: 700, desc: ' chocolate.', emoji: '🍫' },
];

// Cart and Settings
let cart = {}; // { ' strawberry': 2, 'berry': 1 }
const DELIVERY_FEE = 500; //  
const WHATSAPP_NUMBER = '+22942578205'; //  

// --- DOM ELEMENTS ---
const productGrid = document.getElementById('productGrid');
const cartItemsContainer = document.getElementById('cartItems');
const subtotalDisplay = document.getElementById('subtotal');
const deliveryFeeDisplay = document.getElementById('deliveryFee');
const finalTotalDisplay = document.getElementById('finalTotal');
const checkoutForm = document.getElementById('checkoutForm');
const previewBox = document.getElementById('previewBox');
const previewContent = document.getElementById('previewContent');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');

// --- RENDER FUNCTIONS ---

/**
 * Renders the product cards on the homepage.
 */
function renderProducts() {
  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-id', product.id);
    card.innerHTML = `
      <div style="font-size:2.5rem;text-align:center;">${product.emoji}</div>
      <div class="product-title">${product.name}</div>
      <div class="product-desc">${product.desc}</div>
      <div class="product-meta">
        <span style="font-weight:700;">${product.price} FCFA</span>
        <span class="badge-qty">${cart[product.id] || 0} in cart</span>
      </div>
    `;
    card.addEventListener('click', () => addToCart(product.id));
    productGrid.appendChild(card);
  });
}

/**
 * Updates the cart UI and totals.
 */
function updateCartUI() {
  cartItemsContainer.innerHTML = ''; // Clear previous items
  let subtotal = 0;

  for (const id in cart) {
    const quantity = cart[id];
    if (quantity > 0) {
      const product = products.find(p => p.id === id);
      const itemTotal = product.price * quantity;
      subtotal += itemTotal;

      const itemRow = document.createElement('div');
      itemRow.className = 'cart-item';
      itemRow.innerHTML = `
        <div>
          <span style="font-weight:700">${quantity}x</span> ${product.name}
          <button class="btn-remove" data-id="${id}" style="margin-left:8px;padding:2px 6px;font-size:0.8rem;background:none;border:1px solid #FF66B2;border-radius:4px;cursor:pointer;">-1</button>
        </div>
        <span>${itemTotal.toLocaleString()} FCFA</span>
      `;
      cartItemsContainer.appendChild(itemRow);
    }
  }

  // Handle empty cart message
  if (subtotal === 0) {
    cartItemsContainer.innerHTML = '<p class="muted" style="color:#777;padding:12px;">Your cart is empty. Add some bliss!</p>';
    deliveryFeeDisplay.textContent = '0 FCFA';
    finalTotalDisplay.textContent = '0 FCFA';
  } else {
    // Update totals display
    const finalTotal = subtotal + DELIVERY_FEE;
    deliveryFeeDisplay.textContent = `${DELIVERY_FEE.toLocaleString()} FCFA`;
    finalTotalDisplay.textContent = `${finalTotal.toLocaleString()} FCFA`;
  }

  subtotalDisplay.textContent = `${subtotal.toLocaleString()} FCFA`;
  
  // Update badges on product cards
  document.querySelectorAll('.product-card').forEach(card => {
    const id = card.getAttribute('data-id');
    const badge = card.querySelector('.badge-qty');
    badge.textContent = `${cart[id] || 0} in cart`;
  });
}

// --- CART LOGIC ---

/**
 * Adds a product to the cart.
 * @param {string} productId - The ID of the product.
 */
function addToCart(productId) {
  cart[productId] = (cart[productId] || 0) + 1;
  updateCartUI();
  // Optional: Scroll to cart when first item is added
  if (Object.keys(cart).length === 1 && cart[productId] === 1) {
      document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
  }
}

/**
 * Removes one unit of a product from the cart.
 * @param {string} productId - The ID of the product.
 */
function removeFromCart(productId) {
  if (cart[productId] > 0) {
    cart[productId]--;
    if (cart[productId] === 0) {
      delete cart[productId];
    }
    updateCartUI();
  }
}

/**
 * Generates the full WhatsApp order message.
 * @param {Object} details - Customer and order details.
 * @returns {string} - The URL-encoded message.
 */
function generateWhatsAppMessage(details) {
  const { name, phone, address, note, total } = details;
  
  let orderSummary = '';
  let itemsCount = 0;
  
  // 1. Build the list of items
  for (const id in cart) {
    const quantity = cart[id];
    if (quantity > 0) {
      const product = products.find(p => p.id === id);
      orderSummary += `*${quantity}x* ${product.name} (${(product.price * quantity).toLocaleString()} FCFA)\n`;
      itemsCount++;
    }
  }

  if (itemsCount === 0) {
    return encodeURIComponent("Hello Yogurt Bliss! I tried to place an order but my cart was empty. Can you help?");
  }
  
  // 2. Combine all parts into the final message
  const message = `
--- NEW YOGURT BLISS ORDER ---

Customer: ${name}
Phone: ${phone}
Address: ${address}

--- ORDER DETAILS (${itemsCount} Items) ---
${orderSummary}
Subtotal: ${(total - DELIVERY_FEE).toLocaleString()} FCFA
Delivery Fee: ${DELIVERY_FEE.toLocaleString()} FCFA
GRAND TOTAL: ${total.toLocaleString()} FCFA

Note: ${note || 'None'}

Please confirm availability and delivery time. Thank you!
  `;
  
  return encodeURIComponent(message.trim());
}

// --- EVENT LISTENERS ---

// 1. Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderProducts(); // Draw the product cards
  updateCartUI();   // Initialize the cart display
  document.getElementById('year').textContent = new Date().getFullYear();
  document.getElementById('whatsappNumber').href = `https://wa.me/${WHATSAPP_NUMBER}`;
  document.getElementById('floatingWA').href = `https://wa.me/${WHATSAPP_NUMBER}`;
});

// 2. Remove from Cart button delegation (for dynamically created buttons)
cartItemsContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-remove')) {
    removeFromCart(e.target.getAttribute('data-id'));
  }
});

// 3. Add vanilla from Hero section
document.getElementById('hero-add-mango').addEventListener('click', () => {
  addToCart('mango');
});

// 4. Clear Cart button
document.getElementById('clearCartBtn').addEventListener('click', () => {
  cart = {}; // Reset cart object
  updateCartUI();
  previewBox.classList.add('hidden'); // Hide preview box
});

// 5. Preview Order button
document.getElementById('previewBtn').addEventListener('click', (e) => {
  e.preventDefault();
  if (Object.keys(cart).length === 0) {
    modalContent.innerHTML = '<h4>🛒 Cart Empty</h4><p>Please add products to your cart before checking out!</p>';
    modal.classList.remove('hidden');
    return;
  }
  
  // Get form data for preview
  const details = {
    name: document.getElementById('custName').value || 'N/A',
    phone: document.getElementById('custPhone').value || 'N/A',
    address: document.getElementById('custAddress').value || 'N/A',
    note: document.getElementById('custNote').value || 'None',
    total: parseInt(finalTotalDisplay.textContent.replace(/\sFCFA/g, '').replace(/,/g, '') || '0')
  };

  // Build the preview content
  previewContent.innerHTML = `
    <p><strong>Customer:</strong> ${details.name}</p>
    <p><strong>Phone:</strong> ${details.phone}</p>
    <p><strong>Address:</strong> ${details.address.replace(/\n/g, '<br>')}</p>
    <p><strong>Note:</strong> ${details.note}</p>
    <p style="margin-top:10px;font-weight:bold;">Total: ${details.total.toLocaleString()} FCFA</p>
  `;
  previewBox.classList.remove('hidden');
});

// 6. Checkout Form Submission
checkoutForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (Object.keys(cart).length === 0) {
    modalContent.innerHTML = '<h4>🛒 Cart Empty</h4><p>Please add products to your cart before checking out!</p>';
    modal.classList.remove('hidden');
    return;
  }

  // Collect form data
  const details = {
    name: document.getElementById('custName').value,
    phone: document.getElementById('custPhone').value,
    address: document.getElementById('custAddress').value,
    note: document.getElementById('custNote').value,
    total: parseInt(finalTotalDisplay.textContent.replace(/\sFCFA/g, '').replace(/,/g, '') || '0')
  };

  // Validate critical fields
  if (!details.name || !details.phone || !details.address) {
    modalContent.innerHTML = '<h4>Missing Details</h4><p>Please fill in your Name, Phone Number, and Delivery Address to proceed.</p>';
    modal.classList.remove('hidden');
    return;
  }
  
  // Generate the WhatsApp message URL
  const message = generateWhatsAppMessage(details);
  // Ensure the phone number doesn't have a '+' sign for the wa.me link as per standard
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=${message}`;

  // Open WhatsApp in a new window/tab
  window.open(whatsappUrl, '_blank');

  // Optional: Reset the form and cart after successful submission intent
  setTimeout(() => {
    cart = {};
    updateCartUI();
    checkoutForm.reset();
    previewBox.classList.add('hidden');
    modalContent.innerHTML = '<h4>🎉 Order Initiated!</h4><p>Check your WhatsApp to send the final order message to us.</p>';
    modal.classList.remove('hidden');
  }, 500);
});

// --- MODAL & UTILITY FUNCTIONS ---

// Function to close the modal
document.querySelector('.close-button').addEventListener('click', () => {
    modal.classList.add('hidden');
});

// Close modal if user clicks outside of the content
window.onclick = function(event) {
    if (event.target == modal) {
        modal.classList.add('hidden');
    }
}
