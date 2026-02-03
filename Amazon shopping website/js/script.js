// Shopping Cart Functionality
let cart = [];
let cartCount = 0;

// Get all "Add to Cart" and "Add" buttons
const addToCartBtns = document.querySelectorAll('.add-to-cart-btn, .add-btn');
const cartCountElement = document.querySelector('.cart-count');
const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');

// Initialize cart from localStorage
function initCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        cartCount = cart.length;
        updateCartCount();
    }
}

// Update cart count display
function updateCartCount() {
    cartCountElement.textContent = cartCount;
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Add to cart functionality
addToCartBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Get product details
        const productCard = this.closest('.product-card, .featured-card');
        const productName = productCard.querySelector('h3, h4').textContent;
        const productPrice = productCard.querySelector('.price').textContent;
        const productImage = productCard.querySelector('img').src;
        
        // Create product object
        const product = {
            id: Date.now(),
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
        };
        
        // Add to cart
        cart.push(product);
        cartCount++;
        updateCartCount();
        
        // Show feedback
        showNotification(`${productName} added to cart!`);
        
        // Button feedback
        this.textContent = 'Added!';
        setTimeout(() => {
            this.innerHTML = this.classList.contains('add-btn') ? 
                '<i class="fas fa-shopping-cart"></i> Add' : 'Add to Cart';
        }, 1500);
    });
});

// Notification system
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        font-weight: bold;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Search functionality
searchBtn.addEventListener('click', function() {
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        showNotification(`Searching for: ${searchTerm}`);
        searchInput.value = '';
    }
});

searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

// Cart icon click
const cartIcon = document.querySelector('.cart');
cartIcon.addEventListener('click', function() {
    if (cartCount > 0) {
        showCartCheckout();
    } else {
        showNotification('Your cart is empty');
    }
});

// Navigation item clicks
const navItems = document.querySelectorAll('.nav-item:not(.cart)');
navItems.forEach(item => {
    item.addEventListener('click', function() {
        showNotification('Sign in or create account');
    });
});

// Back to top functionality
const footerTop = document.querySelector('.footer-top');
if (footerTop) {
    footerTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Navigation links
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const category = this.textContent;
        showNotification(`Browsing: ${category}`);
    });
});

// Menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const categoryMenu = document.getElementById('categoryMenu');
const categoryOverlay = document.getElementById('categoryOverlay');
const closeMenuBtn = document.getElementById('closeMenu');

// Open category menu
function openCategoryMenu() {
    categoryMenu.classList.add('active');
    categoryOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close category menu
function closeCategoryMenu() {
    categoryMenu.classList.remove('active');
    categoryOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Menu toggle click
if (menuToggle) {
    menuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        openCategoryMenu();
    });
}

// Close menu button
if (closeMenuBtn) {
    closeMenuBtn.addEventListener('click', closeCategoryMenu);
}

// Overlay click to close menu
if (categoryOverlay) {
    categoryOverlay.addEventListener('click', closeCategoryMenu);
}

// Category items expand/collapse
const categoryItems = document.querySelectorAll('.category-item h4');
categoryItems.forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        const parentItem = this.parentElement;
        
        // Close all other expanded items
        document.querySelectorAll('.category-item').forEach(cat => {
            if (cat !== parentItem) {
                cat.classList.remove('expanded');
            }
        });
        
        // Toggle current item
        parentItem.classList.toggle('expanded');
    });
});

// Category links click
const categoryLinks = document.querySelectorAll('.category-link');
categoryLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const categoryName = this.textContent;
        showNotification(`Viewing: ${categoryName}`);
        closeCategoryMenu();
    });
});

// Close menu on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeCategoryMenu();
    }
});

/* ================== ORDERS MODULE ================== */

let orders = [];
let currentOrderView = 'list';
let currentOrderIndex = -1;

// Initialize orders module
function initOrdersModule() {
    loadOrders();
    setupOrdersEventListeners();
}

// Setup orders event listeners
function setupOrdersEventListeners() {
    const ordersNavItem = document.querySelector('.orders-nav-item');
    const ordersModal = document.getElementById('ordersModal');
    const ordersOverlay = document.getElementById('ordersOverlay');
    const closeOrdersBtn = document.getElementById('closeOrders');
    const backToOrdersBtn = document.getElementById('backToOrders');

    // Open orders modal
    if (ordersNavItem) {
        ordersNavItem.addEventListener('click', function() {
            openOrdersModal();
        });
    }

    // Close orders modal
    if (closeOrdersBtn) {
        closeOrdersBtn.addEventListener('click', closeOrdersModal);
    }

    if (ordersOverlay) {
        ordersOverlay.addEventListener('click', closeOrdersModal);
    }

    // Back to orders list
    if (backToOrdersBtn) {
        backToOrdersBtn.addEventListener('click', function() {
            showOrdersList();
        });
    }
}

// Load orders from localStorage
function loadOrders() {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
        orders = JSON.parse(savedOrders);
    }
}

// Save orders to localStorage
function saveOrders() {
    localStorage.setItem('orders', JSON.stringify(orders));
}

// Open orders modal
function openOrdersModal() {
    const ordersModal = document.getElementById('ordersModal');
    const ordersOverlay = document.getElementById('ordersOverlay');
    ordersModal.classList.add('active');
    ordersOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    showOrdersList();
}

// Close orders modal
function closeOrdersModal() {
    const ordersModal = document.getElementById('ordersModal');
    const ordersOverlay = document.getElementById('ordersOverlay');
    ordersModal.classList.remove('active');
    ordersOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Show orders list view
function showOrdersList() {
    const ordersEmpty = document.getElementById('ordersEmpty');
    const ordersList = document.getElementById('ordersList');
    const orderDetails = document.getElementById('orderDetails');

    orderDetails.style.display = 'none';
    currentOrderView = 'list';

    if (orders.length === 0) {
        ordersEmpty.style.display = 'flex';
        ordersList.style.display = 'none';
    } else {
        ordersEmpty.style.display = 'none';
        ordersList.style.display = 'flex';
        renderOrdersList();
    }
}

// Render orders list
function renderOrdersList() {
    const ordersList = document.getElementById('ordersList');
    ordersList.innerHTML = '';

    orders.forEach((order, index) => {
        const orderCard = createOrderCard(order, index);
        ordersList.appendChild(orderCard);
    });
}

// Create order card element
function createOrderCard(order, index) {
    const card = document.createElement('div');
    card.className = 'order-card';

    const statusClass = order.status.toLowerCase();
    const firstItem = order.items[0];

    card.innerHTML = `
        <div class="order-header">
            <div>
                <div class="order-number">Order #<strong>${order.orderId}</strong></div>
                <span class="order-status ${statusClass}">${order.status}</span>
            </div>
            <div class="order-date">
                <strong>${new Date(order.date).toLocaleDateString()}</strong>
            </div>
        </div>
        <div class="order-body">
            <div class="order-image">
                <img src="${firstItem.image}" alt="${firstItem.name}">
            </div>
            <div class="order-info">
                <h4>${firstItem.name}</h4>
                <div class="order-price">${firstItem.price}</div>
                <div class="order-quantity">Quantity: ${firstItem.quantity}</div>
                ${order.items.length > 1 ? `<div class="order-quantity">+${order.items.length - 1} more item(s)</div>` : ''}
            </div>
        </div>
        <div class="order-footer">
            <div class="order-total">Total: <strong>${order.total}</strong></div>
            <button class="order-action" data-order-index="${index}">View Details</button>
        </div>
    `;

    // Add click handler for view details button
    const viewBtn = card.querySelector('.order-action');
    viewBtn.addEventListener('click', function() {
        showOrderDetails(index);
    });

    // Also allow clicking anywhere on card to view details
    card.addEventListener('click', function(e) {
        if (!e.target.closest('.order-action')) {
            showOrderDetails(index);
        }
    });

    return card;
}

// Show order details view
function showOrderDetails(orderIndex) {
    const orderDetails = document.getElementById('orderDetails');
    const ordersList = document.getElementById('ordersList');
    const ordersEmpty = document.getElementById('ordersEmpty');
    const order = orders[orderIndex];

    ordersEmpty.style.display = 'none';
    ordersList.style.display = 'none';
    orderDetails.style.display = 'block';
    currentOrderView = 'details';
    currentOrderIndex = orderIndex;

    renderOrderDetails(order);
}

// Render order details
function renderOrderDetails(order) {
    const detailsContent = document.querySelector('.order-details-content');
    
    let itemsHTML = '';
    order.items.forEach((item, index) => {
        itemsHTML += `
            <div class="detail-item">
                <div class="detail-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="detail-item-info">
                    <h4>${item.name}</h4>
                    <div class="detail-item-price">${item.price}</div>
                    <div class="detail-item-meta">
                        <span>Quantity: ${item.quantity}</span>
                    </div>
                </div>
                <div class="detail-item-actions">
                    <button class="increase-qty-btn" data-index="${index}">
                        <i class="fas fa-plus"></i> Increase
                    </button>
                    <button class="remove-item-btn" data-index="${index}">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            </div>
        `;
    });

    const deliveryDate = new Date(new Date(order.date).getTime() + 5 * 24 * 60 * 60 * 1000);

    detailsContent.innerHTML = `
        <div class="detail-section">
            <h3><i class="fas fa-box"></i> Order Items</h3>
            <div class="detail-items">
                ${itemsHTML}
            </div>
        </div>

        <div class="detail-section">
            <h3><i class="fas fa-info-circle"></i> Order Information</h3>
            <div class="detail-grid">
                <div class="detail-box">
                    <label>Order ID</label>
                    <value>${order.orderId}</value>
                </div>
                <div class="detail-box">
                    <label>Order Date</label>
                    <value>${new Date(order.date).toLocaleDateString()}</value>
                </div>
                <div class="detail-box">
                    <label>Status</label>
                    <value>${order.status}</value>
                </div>
                <div class="detail-box">
                    <label>Expected Delivery</label>
                    <value>${deliveryDate.toLocaleDateString()}</value>
                </div>
            </div>
        </div>

        <div class="detail-section">
            <h3><i class="fas fa-dollar-sign"></i> Price Summary</h3>
            <div class="detail-grid">
                <div class="detail-box">
                    <label>Subtotal</label>
                    <value>${order.total}</value>
                </div>
                <div class="detail-box">
                    <label>Shipping</label>
                    <value>Free</value>
                </div>
                <div class="detail-box">
                    <label>Tax</label>
                    <value>$0.00</value>
                </div>
                <div class="detail-box">
                    <label>Order Total</label>
                    <value>${order.total}</value>
                </div>
            </div>
        </div>

        <div class="detail-section">
            <h3><i class="fas fa-truck"></i> Shipping Address</h3>
            <div class="detail-box">
                <label>Delivery Address</label>
                <value>123 Main Street, City, State 12345, USA</value>
            </div>
        </div>
    `;

    // Add event listeners for action buttons
    setTimeout(() => {
        const increaseButtons = detailsContent.querySelectorAll('.increase-qty-btn');
        const removeButtons = detailsContent.querySelectorAll('.remove-item-btn');

        increaseButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const itemIndex = parseInt(this.dataset.index);
                increaseOrderQuantity(itemIndex);
            });
        });

        removeButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const itemIndex = parseInt(this.dataset.index);
                removeOrderItem(itemIndex);
            });
        });
    }, 0);
}

// Add order (called when checkout happens)
function addOrder(items, total) {
    const orderId = 'ORD-' + Date.now();
    const order = {
        orderId: orderId,
        items: items,
        total: total,
        date: new Date().toISOString(),
        status: 'Processing'
    };

    orders.unshift(order);
    saveOrders();
    showNotification(`Order ${orderId} placed successfully!`);
}

// Checkout function (update existing add to cart to support checkout)
function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }

    let total = '$0.00';
    const prices = cart.map(item => parseFloat(item.price.replace('$', '')));
    const totalAmount = prices.reduce((a, b) => a + b, 0).toFixed(2);
    total = '$' + totalAmount;

    // Create order
    addOrder(JSON.parse(JSON.stringify(cart)), total);

    // Clear cart
    cart = [];
    cartCount = 0;
    updateCartCount();
    closeCartCheckout();
}

// Show cart checkout
function showCartCheckout() {
    let cartHTML = '<div style="padding: 20px;"><h3 style="margin-bottom: 20px;">Your Shopping Cart</h3>';
    
    if (cart.length === 0) {
        cartHTML += '<p>Your cart is empty</p>';
    } else {
        let total = 0;
        cart.forEach((item, index) => {
            const price = parseFloat(item.price.replace('$', ''));
            total += price * item.quantity;
            cartHTML += `
                <div style="display: flex; gap: 15px; margin-bottom: 15px; padding: 10px; background: #f5f5f5; border-radius: 4px;">
                    <img src="${item.image}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px;" />
                    <div style="flex: 1;">
                        <h4 style="margin: 0 0 5px 0;">${item.name}</h4>
                        <p style="margin: 0 0 5px 0; color: #ff9900; font-weight: bold;">${item.price}</p>
                        <p style="margin: 0; color: #666;">Qty: ${item.quantity}</p>
                    </div>
                </div>
            `;
        });

        cartHTML += `
            <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-radius: 4px; border-left: 4px solid #ff9900;">
                <h4 style="margin: 0 0 10px 0;">Order Total: <span style="color: #ff9900;">$${total.toFixed(2)}</span></h4>
                <button onclick="checkout()" style="width: 100%; padding: 12px; background: #ff9900; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 14px;">
                    <i class="fas fa-check-circle"></i> Proceed to Checkout
                </button>
            </div>
        `;
    }
    
    cartHTML += '</div>';

    // Create modal
    let modal = document.getElementById('cartModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'cartModal';
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 1002;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        `;
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="margin: 0;">Shopping Cart</h2>
            <button onclick="closeCartCheckout()" style="background: none; border: none; font-size: 24px; cursor: pointer;">×</button>
        </div>
        ${cartHTML}
    `;

    // Add overlay
    let overlay = document.getElementById('cartOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'cartOverlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 1001;
        `;
        overlay.onclick = closeCartCheckout;
        document.body.appendChild(overlay);
    }

    modal.style.display = 'block';
    overlay.style.display = 'block';
}

// Close cart checkout
function closeCartCheckout() {
    const modal = document.getElementById('cartModal');
    const overlay = document.getElementById('cartOverlay');
    if (modal) modal.style.display = 'none';
    if (overlay) overlay.style.display = 'none';
}

// Product card hover effects
const productCards = document.querySelectorAll('.product-card, .featured-card');
productCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
    });
});

// Increase order item quantity
function increaseOrderQuantity(itemIndex) {
    if (currentOrderIndex >= 0 && currentOrderIndex < orders.length) {
        const currentOrder = orders[currentOrderIndex];

        if (currentOrder.items[itemIndex]) {
            currentOrder.items[itemIndex].quantity += 1;
            
            // Update order total
            let newTotal = 0;
            currentOrder.items.forEach(item => {
                const price = parseFloat(item.price.replace('$', ''));
                newTotal += price * item.quantity;
            });
            currentOrder.total = '$' + newTotal.toFixed(2);
            
            saveOrders();
            renderOrderDetails(currentOrder);
            showNotification('Quantity increased!');
        }
    }
}

// Remove order item
function removeOrderItem(itemIndex) {
    if (currentOrderIndex >= 0 && currentOrderIndex < orders.length) {
        const currentOrder = orders[currentOrderIndex];

        if (currentOrder.items.length === 1) {
            showNotification('Cannot remove the last item from order!');
            return;
        }

        currentOrder.items.splice(itemIndex, 1);
        
        // Update order total
        let newTotal = 0;
        currentOrder.items.forEach(item => {
            const price = parseFloat(item.price.replace('$', ''));
            newTotal += price * item.quantity;
        });
        currentOrder.total = '$' + newTotal.toFixed(2);
        
        saveOrders();
        renderOrderDetails(currentOrder);
        showNotification('Item removed from order!');
    }
}

// Footer links
const footerLinks = document.querySelectorAll('.footer-column a');
footerLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        showNotification(`Navigating to: ${this.textContent}`);
    });
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initCart();
    initOrdersModule();
});