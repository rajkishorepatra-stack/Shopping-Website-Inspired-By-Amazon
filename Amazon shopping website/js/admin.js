/* ==================== ADMIN LOGIN FUNCTIONALITY ==================== */

// Hardcoded credentials
const VALID_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

// Check if user is logged in
function isAdminLoggedIn() {
    return sessionStorage.getItem('adminLoggedIn') === 'true';
}

// Redirect if not logged in
function checkAdminAuth() {
    const currentPage = window.location.pathname;
    const isLoginPage = currentPage.includes('admin-login.html');
    const isDashboardPage = currentPage.includes('admin-dashboard.html');

    if (isDashboardPage && !isAdminLoggedIn()) {
        window.location.href = 'admin-login.html';
    }

    if (isLoginPage && isAdminLoggedIn()) {
        window.location.href = 'admin-dashboard.html';
    }
}

// Initialize login page
if (window.location.pathname.includes('admin-login.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        initLoginPage();
    });
}

function initLoginPage() {
    const loginForm = document.getElementById('loginForm');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    checkAdminAuth();

    // Toggle password visibility
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const icon = this.querySelector('i');
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    }

    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            loginAdmin();
        });
    }
}

function loginAdmin() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const loginError = document.getElementById('loginError');
    const usernameError = document.getElementById('usernameError');
    const passwordError = document.getElementById('passwordError');

    // Clear previous errors
    usernameError.textContent = '';
    passwordError.textContent = '';
    loginError.classList.remove('show');

    // Validate inputs
    let hasError = false;

    if (!username) {
        usernameError.textContent = 'Username is required';
        hasError = true;
    }

    if (!password) {
        passwordError.textContent = 'Password is required';
        hasError = true;
    }

    if (hasError) return;

    // Check credentials
    if (username === VALID_CREDENTIALS.username && password === VALID_CREDENTIALS.password) {
        // Login successful
        sessionStorage.setItem('adminLoggedIn', 'true');
        sessionStorage.setItem('adminUsername', username);

        // Store remember me preference
        if (document.getElementById('rememberMe').checked) {
            localStorage.setItem('rememberAdminLogin', 'true');
            localStorage.setItem('adminUsername', username);
        }

        // Show success message and redirect
        showLoginSuccess();
        setTimeout(() => {
            window.location.href = 'admin-dashboard.html';
        }, 1500);
    } else {
        // Login failed
        loginError.textContent = 'Invalid username or password';
        loginError.classList.add('show');

        // Animate error
        loginError.style.animation = 'none';
        setTimeout(() => {
            loginError.style.animation = 'slideIn 0.3s ease';
        }, 10);
    }
}

function showLoginSuccess() {
    const loginForm = document.querySelector('.login-form');
    loginForm.style.opacity = '0.5';
    loginForm.style.pointerEvents = 'none';

    const successMessage = document.createElement('div');
    successMessage.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 30px;
        border-radius: 12px;
        text-align: center;
        color: #28a745;
    `;
    successMessage.innerHTML = `
        <i class="fas fa-check-circle" style="font-size: 48px; margin-bottom: 15px;"></i>
        <h3>Login Successful!</h3>
        <p>Redirecting to dashboard...</p>
    `;
    document.querySelector('.login-card').appendChild(successMessage);
}

/* ==================== ADMIN DASHBOARD FUNCTIONALITY ==================== */

// Initialize dashboard
if (window.location.pathname.includes('admin-dashboard.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        checkAdminAuth();
        initDashboard();
    });
}

function initDashboard() {
    setupNavigation();
    setupEventListeners();
    loadDashboardData();
    setupSidebarToggle();
}

function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();

            // Remove active class from all items
            navItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');

            // Get section to show
            const section = this.getAttribute('data-section');
            showSection(section);

            // Close sidebar on mobile
            const sidebar = document.getElementById('adminSidebar');
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }
        });
    });
}

function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.remove('active'));

    // Show selected section
    const selectedSection = document.getElementById(sectionName + '-section');
    if (selectedSection) {
        selectedSection.classList.add('active');
    }
}

function setupEventListeners() {
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logoutAdmin);
    }

    // Product Modal
    const addProductBtn = document.getElementById('addProductBtn');
    const closeProductModalBtn = document.getElementById('closeProductModal');
    const closeProductBtn = document.getElementById('closeProductModalBtn');
    const saveProductBtn = document.getElementById('saveProductBtn');
    const productForm = document.getElementById('productForm');

    if (addProductBtn) {
        addProductBtn.addEventListener('click', openAddProductModal);
    }

    if (closeProductModalBtn) {
        closeProductModalBtn.addEventListener('click', closeProductModal);
    }

    if (closeProductBtn) {
        closeProductBtn.addEventListener('click', closeProductModal);
    }

    if (saveProductBtn) {
        saveProductBtn.addEventListener('click', saveProduct);
    }

    if (productForm) {
        productForm.addEventListener('submit', function(e) {
            e.preventDefault();
        });
    }

    // Product search
    const productSearch = document.getElementById('productSearch');
    if (productSearch) {
        productSearch.addEventListener('input', searchProducts);
    }

    // Modal close buttons
    const closeOrderModal = document.getElementById('closeOrderModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalOverlay = document.getElementById('modalOverlay');

    if (closeOrderModal) {
        closeOrderModal.addEventListener('click', closeOrderDetailModal);
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeOrderDetailModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeOrderDetailModal);
    }

    // Update status button
    const updateStatusBtn = document.getElementById('updateStatusBtn');
    if (updateStatusBtn) {
        updateStatusBtn.addEventListener('click', updateOrderStatus);
    }
}

function setupSidebarToggle() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('adminSidebar');

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        }
    });
}

function loadDashboardData() {
    // Load orders from localStorage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];

    // Calculate statistics
    updateStatistics(orders);

    // Load recent orders
    loadRecentOrders(orders);

    // Load all orders
    loadAllOrders(orders);

    // Update analytics
    updateAnalytics(orders);

    // Load products
    renderProductsGrid();

    // Set admin name
    const adminName = sessionStorage.getItem('adminUsername');
    const adminNameElement = document.getElementById('adminName');
    if (adminNameElement) {
        adminNameElement.textContent = adminName || 'Admin';
    }
}

function updateStatistics(orders) {
    // Total orders
    document.getElementById('totalOrders').textContent = orders.length;

    // Total revenue
    let totalRevenue = 0;
    orders.forEach(order => {
        const price = parseFloat(order.total.replace('$', ''));
        totalRevenue += price;
    });
    document.getElementById('totalRevenue').textContent = '$' + totalRevenue.toFixed(2);

    // Total customers (unique orders)
    document.getElementById('totalCustomers').textContent = orders.length;

    // Total products (fixed for demo)
    document.getElementById('totalProducts').textContent = '32';
}

function loadRecentOrders(orders) {
    const tableBody = document.querySelector('#recentOrdersTable tbody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    if (orders.length === 0) {
        tableBody.innerHTML = '<tr class="empty-state"><td colspan="4">No orders yet</td></tr>';
        return;
    }

    // Show only last 5 orders
    orders.slice(0, 5).forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.orderId}</td>
            <td>${new Date(order.date).toLocaleDateString()}</td>
            <td>${order.total}</td>
            <td><span class="status-badge ${order.status.toLowerCase()}">${order.status}</span></td>
        `;
        tableBody.appendChild(row);
    });
}

function loadAllOrders(orders) {
    const tableBody = document.querySelector('#allOrdersTable tbody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    if (orders.length === 0) {
        tableBody.innerHTML = '<tr class="empty-state"><td colspan="6">No orders found</td></tr>';
        return;
    }

    orders.forEach((order, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.orderId}</td>
            <td>${order.items.length}</td>
            <td>${new Date(order.date).toLocaleDateString()}</td>
            <td>${order.total}</td>
            <td><span class="status-badge ${order.status.toLowerCase()}">${order.status}</span></td>
            <td>
                <button class="table-action-btn" onclick="viewOrderDetails(${index})">
                    View
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function updateAnalytics(orders) {
    // Count orders by status
    let processingCount = 0;
    let deliveredCount = 0;
    let pendingCount = 0;

    orders.forEach(order => {
        if (order.status === 'Processing') processingCount++;
        else if (order.status === 'Delivered') deliveredCount++;
        else if (order.status === 'Pending') pendingCount++;
    });

    const total = orders.length || 1;

    // Update bars
    const processingBar = document.getElementById('processingBar');
    const deliveredBar = document.getElementById('deliveredBar');
    const pendingBar = document.getElementById('pendingBar');

    if (processingBar) {
        processingBar.style.width = ((processingCount / total) * 100) + '%';
    }
    if (deliveredBar) {
        deliveredBar.style.width = ((deliveredCount / total) * 100) + '%';
    }
    if (pendingBar) {
        pendingBar.style.width = ((pendingCount / total) * 100) + '%';
    }
}

function viewOrderDetails(orderIndex) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders[orderIndex];

    if (!order) return;

    const modalBody = document.getElementById('orderModalBody');
    modalBody.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h4 style="margin: 0 0 10px 0; color: #333;">Order #${order.orderId}</h4>
            <p style="margin: 5px 0; color: #666;">
                <strong>Date:</strong> ${new Date(order.date).toLocaleDateString()}
            </p>
            <p style="margin: 5px 0; color: #666;">
                <strong>Status:</strong> <span class="status-badge ${order.status.toLowerCase()}">${order.status}</span>
            </p>
        </div>

        <h5 style="margin: 20px 0 10px 0; color: #333;">Items:</h5>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
            ${order.items.map(item => `
                <div style="display: flex; gap: 15px; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #ddd;">
                    <img src="${item.image}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">
                    <div style="flex: 1;">
                        <p style="margin: 0 0 5px 0; font-weight: bold;">${item.name}</p>
                        <p style="margin: 0 0 5px 0; color: #ff9900; font-weight: bold;">${item.price}</p>
                        <p style="margin: 0; color: #666; font-size: 12px;">Qty: ${item.quantity}</p>
                    </div>
                </div>
            `).join('')}
        </div>

        <div style="background: #fff3cd; padding: 15px; border-radius: 4px; border-left: 4px solid #ff9900;">
            <p style="margin: 0; font-weight: bold; color: #333;">
                Total: <span style="color: #ff9900; font-size: 18px;">${order.total}</span>
            </p>
        </div>
    `;

    // Store current order index for update
    document.getElementById('updateStatusBtn').setAttribute('data-order-index', orderIndex);

    // Set current status in select
    document.getElementById('statusSelect').value = order.status;

    // Show modal
    showOrderDetailModal();
}

function showOrderDetailModal() {
    const modal = document.getElementById('orderModal');
    const overlay = document.getElementById('modalOverlay');

    modal.classList.add('active');
    overlay.classList.add('active');
}

function closeOrderDetailModal() {
    const modal = document.getElementById('orderModal');
    const overlay = document.getElementById('modalOverlay');

    modal.classList.remove('active');
    overlay.classList.remove('active');
}

function updateOrderStatus() {
    const orderIndex = parseInt(this.getAttribute('data-order-index'));
    const newStatus = document.getElementById('statusSelect').value;

    if (!newStatus) {
        alert('Please select a status');
        return;
    }

    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders[orderIndex].status = newStatus;
    localStorage.setItem('orders', JSON.stringify(orders));

    // Reload data
    loadDashboardData();

    // Close modal
    closeOrderDetailModal();

    // Show success message
    showSuccessMessage('Order status updated successfully!');
}

function showSuccessMessage(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        font-weight: bold;
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

/* ==================== PRODUCT MANAGEMENT ==================== */

let editingProductId = null;

// Load products from localStorage
function loadProducts() {
    const savedProducts = localStorage.getItem('adminProducts');
    return savedProducts ? JSON.parse(savedProducts) : getDefaultProducts();
}

// Get default products
function getDefaultProducts() {
    return [
        {
            id: 1,
            name: 'Premium Wireless Headphones',
            price: 79.99,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
            description: 'High-quality wireless headphones with noise cancellation',
            category: 'Electronics',
            stock: 45,
            rating: 4.5
        },
        {
            id: 2,
            name: 'Smartwatch Pro',
            price: 199.99,
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
            description: 'Advanced smartwatch with health tracking',
            category: 'Electronics',
            stock: 30,
            rating: 4.8
        },
        {
            id: 3,
            name: 'Designer Sunglasses',
            price: 89.99,
            image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
            description: 'Premium UV protection sunglasses',
            category: 'Fashion',
            stock: 25,
            rating: 4.2
        },
        {
            id: 4,
            name: 'Portable Bluetooth Speaker',
            price: 49.99,
            image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
            description: 'Waterproof portable speaker with great sound',
            category: 'Electronics',
            stock: 60,
            rating: 4.3
        }
    ];
}

// Save products to localStorage
function saveProducts(products) {
    localStorage.setItem('adminProducts', JSON.stringify(products));
    updateTotalProducts(products.length);
}

// Update total products count
function updateTotalProducts(count) {
    const totalProductsElement = document.getElementById('totalProducts');
    if (totalProductsElement) {
        totalProductsElement.textContent = count;
    }
}

// Render products grid
function renderProductsGrid(productsToRender = null) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    const allProducts = loadProducts();
    const products = productsToRender || allProducts;

    if (products.length === 0) {
        productsGrid.innerHTML = '<div class="empty-state">No products available. Click "Add Product" to create one.</div>';
        return;
    }

    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/180?text=No+Image'">
            </div>
            <h4>${product.name}</h4>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <div class="product-stock">Stock: ${product.stock} units</div>
            <div class="product-actions">
                <button class="product-edit-btn" onclick="editProduct(${product.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="product-delete-btn" onclick="deleteProduct(${product.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

// Open add product modal
function openAddProductModal() {
    editingProductId = null;
    clearProductForm();
    document.getElementById('productModalTitle').textContent = 'Add New Product';
    openProductModal();
}

// Open product modal
function openProductModal() {
    const modal = document.getElementById('productModal');
    const overlay = document.getElementById('modalOverlay');
    
    modal.classList.add('active');
    overlay.classList.add('active');
}

// Close product modal
function closeProductModal() {
    const modal = document.getElementById('productModal');
    const overlay = document.getElementById('modalOverlay');
    
    modal.classList.remove('active');
    overlay.classList.remove('active');
}

// Clear product form
function clearProductForm() {
    document.getElementById('productForm').reset();
    document.getElementById('productName').focus();
}

// Save product
function saveProduct() {
    const productName = document.getElementById('productName').value.trim();
    const productPrice = parseFloat(document.getElementById('productPrice').value);
    const productImage = document.getElementById('productImage').value.trim();
    const productDescription = document.getElementById('productDescription').value.trim();
    const productCategory = document.getElementById('productCategory').value;
    const productStock = parseInt(document.getElementById('productStock').value);
    const productRating = parseFloat(document.getElementById('productRating').value) || 4.0;

    // Validation
    if (!productName || !productPrice || !productImage || !productStock) {
        alert('Please fill in all required fields');
        return;
    }

    if (productPrice < 0 || productStock < 0) {
        alert('Price and stock must be positive numbers');
        return;
    }

    const products = loadProducts();

    if (editingProductId === null) {
        // Add new product
        const newProduct = {
            id: Date.now(),
            name: productName,
            price: productPrice,
            image: productImage,
            description: productDescription,
            category: productCategory,
            stock: productStock,
            rating: productRating
        };
        products.push(newProduct);
        showSuccessMessage('Product added successfully!');
    } else {
        // Edit existing product
        const productIndex = products.findIndex(p => p.id === editingProductId);
        if (productIndex !== -1) {
            products[productIndex] = {
                ...products[productIndex],
                name: productName,
                price: productPrice,
                image: productImage,
                description: productDescription,
                category: productCategory,
                stock: productStock,
                rating: productRating
            };
            showSuccessMessage('Product updated successfully!');
        }
    }

    saveProducts(products);
    renderProductsGrid();
    closeProductModal();
}

// Edit product
function editProduct(productId) {
    const products = loadProducts();
    const product = products.find(p => p.id === productId);

    if (!product) return;

    editingProductId = productId;

    // Fill form with product data
    document.getElementById('productName').value = product.name;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productImage').value = product.image;
    document.getElementById('productDescription').value = product.description;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productRating').value = product.rating;

    document.getElementById('productModalTitle').textContent = 'Edit Product';
    openProductModal();
}

// Delete product
function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }

    const products = loadProducts();
    const filteredProducts = products.filter(p => p.id !== productId);

    saveProducts(filteredProducts);
    renderProductsGrid();
    showSuccessMessage('Product deleted successfully!');
}

// Search products
function searchProducts(e) {
    const searchTerm = e.target.value.toLowerCase();
    const products = loadProducts();

    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm)
    );

    renderProductsGrid(filtered);
}

function logoutAdmin() {
    // Clear session storage
    sessionStorage.removeItem('adminLoggedIn');
    sessionStorage.removeItem('adminUsername');

    // Redirect to login
    window.location.href = 'admin-login.html';
}

// Add animation styles to document
const adminStyle = document.createElement('style');
adminStyle.textContent = `
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
document.head.appendChild(adminStyle);