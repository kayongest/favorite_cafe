/* =========================================
   Mobile App JS Logic (Redesign)
   ========================================= */

let currentUser = null;
let menuItems = [];
let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

async function initApp() {
    checkAuth();
    loadCart();
    await loadMenu();
    
    renderHomeCategories();
    renderHomeRecommended();
    renderMenuGrid();
    renderFavoriteGrid();
}

// --- Auth & Data Loading ---
function checkAuth() {
    const userStr = localStorage.getItem('favcafe_active_user');
    if (!userStr) {
        window.location.href = 'mobile_auth.html';
        return;
    }
    currentUser = JSON.parse(userStr);
    const name = currentUser.name || 'User';
    
    document.getElementById('headerTitle').innerText = 'Home'; // default
    
    // Update Sidebar
    document.getElementById('sidebarName').innerText = name;
    document.getElementById('sidebarEmail').innerText = currentUser.email || '';
}

function loadCart() {
    const cartStr = localStorage.getItem('favcafe_cart');
    if (cartStr) cart = JSON.parse(cartStr);
    
    const total = cart.reduce((sum, item) => sum + (parseFloat(item.price) * parseInt(item.qty)), 0);
    document.getElementById('headerPrice').innerText = `$${total.toFixed(2)}`;
    
    renderCartItems();
}

async function loadMenu() {
    // Try API
    try {
        const res = await fetch('api/menu.php?action=get');
        if (res.ok) {
            const data = await res.json();
            if (data.status === 'success' && data.data) {
                menuItems = data.data;
                return;
            }
        }
    } catch (e) {
        console.log("API failed, using local/dummy data");
    }
    
    // Local / Dummy
    const localMenu = localStorage.getItem('favcafe_menu');
    if (localMenu) {
        menuItems = JSON.parse(localMenu);
    } else {
        menuItems = [
            { id: 1, title: 'Fresh Salad', category: 'Salads', price: '10.99', image: 'img/menu/1.jpg', weight: '200g' },
            { id: 2, title: 'Grilled Steak', category: 'Meat', price: '24.50', image: 'img/menu/2.jpg', weight: '350g' },
            { id: 3, title: 'Pasta Bolognese', category: 'Pasta', price: '14.00', image: 'img/menu/3.jpg', weight: '300g' },
            { id: 4, title: 'Creamy Soup', category: 'Soups', price: '8.50', image: 'img/menu/4.jpg', weight: '250g' },
            { id: 5, title: 'Baked Potatoes', category: 'Potatoes', price: '6.00', image: 'img/menu/5.jpg', weight: '200g' },
            { id: 6, title: 'Salmon Steak', category: 'Salmon', price: '22.00', image: 'img/menu/6.jpg', weight: '300g' }
        ];
    }
}

// --- Renderers ---
function renderHomeCategories() {
    const container = document.getElementById('homeCategories');
    const categories = [...new Set(menuItems.map(item => item.category || 'Other'))].slice(0, 4);
    
    container.innerHTML = '';
    categories.forEach(cat => {
        // Find an item image for this category
        const item = menuItems.find(m => m.category === cat);
        const img = item && item.image ? item.image : 'img/menu/1.jpg';
        
        const html = `
            <div class="cat-card" onclick="switchTab('menu')">
                <img src="${img}" onerror="this.src='img/menu/1.jpg'">
                <span class="text-center">${cat}</span>
            </div>
        `;
        container.innerHTML += html;
    });
}

function renderHomeRecommended() {
    const container = document.getElementById('homeRecommended');
    container.innerHTML = '';
    menuItems.slice(0, 4).forEach(item => {
        container.innerHTML += createMenuCard(item, false);
    });
}

function renderMenuGrid() {
    const container = document.getElementById('menuGrid');
    container.innerHTML = '';
    menuItems.forEach(item => {
        container.innerHTML += createMenuCard(item, false);
    });
}

function renderFavoriteGrid() {
    const container = document.getElementById('favoriteGrid');
    container.innerHTML = '';
    // Let's just assume the first 2 items are favorites for demo
    menuItems.slice(0, 2).forEach(item => {
        container.innerHTML += createMenuCard(item, true);
    });
}

function createMenuCard(item, isFavorite = false) {
    const img = item.image && item.image !== 'undefined' ? item.image : 'img/menu/1.jpg';
    const price = parseFloat(item.price || 0).toFixed(2);
    const weight = item.weight || '250g';
    const heartIcon = isFavorite ? 'fas fa-heart text-red' : 'far fa-heart';
    
    return `
        <div class="menu-card">
            <i class="${heartIcon} heart-icon"></i>
            <img src="${img}" class="menu-img" onerror="this.src='img/menu/1.jpg'">
            <div class="menu-title">${item.title}</div>
            <div class="menu-bottom">
                <div>
                    <span class="menu-price">$${price}</span>
                    <span class="menu-weight">| ${weight}</span>
                </div>
                <button class="btn-plus" onclick="addToCart(event, ${JSON.stringify(item).replace(/"/g, '&quot;')})">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        </div>
    `;
}

// --- Cart ---
function renderCartItems() {
    const container = document.getElementById('cartContainer');
    const summary = document.getElementById('cartSummary');
    const emptyState = document.getElementById('emptyCart');
    
    if (!container) return; // not initialized yet
    
    container.innerHTML = '';
    
    if (cart.length === 0) {
        summary.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    summary.style.display = 'block';
    
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = parseFloat(item.price) * parseInt(item.qty);
        subtotal += itemTotal;
        const img = item.image || 'img/menu/1.jpg';
        
        container.innerHTML += `
            <div class="cart-item">
                <img src="${img}" onerror="this.src='img/menu/1.jpg'">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">$${parseFloat(item.price).toFixed(2)}</div>
                </div>
                <div class="cart-qty-control">
                    <button onclick="updateCartQty(${item.id}, -1)"><i class="fas fa-minus text-xs"></i></button>
                    <span class="fw-bold text-sm">${item.qty}</span>
                    <button onclick="updateCartQty(${item.id}, 1)"><i class="fas fa-plus text-xs"></i></button>
                </div>
            </div>
        `;
    });
    
    document.getElementById('cartSubtotal').innerText = `$${subtotal.toFixed(2)}`;
    document.getElementById('cartTotal').innerText = `$${subtotal.toFixed(2)}`;
}

function updateCartQty(id, delta) {
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id == id) {
            cart[i].qty = parseInt(cart[i].qty) + delta;
            if (cart[i].qty < 1) {
                cart.splice(i, 1);
            }
            break;
        }
    }
    localStorage.setItem('favcafe_cart', JSON.stringify(cart));
    loadCart(); // Updates header and re-renders cart UI
}

function addToCart(e, item) {
    if (e) e.stopPropagation();
    
    let found = false;
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === item.id) {
            cart[i].qty = parseInt(cart[i].qty) + 1;
            found = true;
            break;
        }
    }
    if (!found) {
        cart.push({ id: item.id, title: item.title, price: item.price, image: item.image, qty: 1 });
    }
    
    localStorage.setItem('favcafe_cart', JSON.stringify(cart));
    loadCart(); // Update header price and re-render cart
    
    showToast(`Added ${item.title} to cart!`);
}

function checkout() {
    showToast("Proceeding to checkout...");
    // Future integration with desktop index.html#checkout
    // window.location.href = "index.html#checkout";
}

// --- Toast Notification ---
function showToast(message) {
    const toast = document.getElementById('appToast');
    if (!toast) return;
    toast.innerText = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// --- Interactions ---
function switchTab(tabId, navElement = null) {
    // Hide all views
    document.querySelectorAll('.tab-view').forEach(el => el.classList.remove('active'));
    
    // Show target view
    const target = document.getElementById(`view-${tabId}`);
    if (target) target.classList.add('active');
    
    // Update bottom nav active state
    if (navElement) {
        document.querySelectorAll('.bottom-nav .nav-item').forEach(el => el.classList.remove('active'));
        navElement.classList.add('active');
    } else {
        // If triggered programmatically, find the right nav icon manually
        const icons = {
            'home': 0, 'menu': 1, 'order': 2, 'favorite': 3, 'notification': 4
        };
        const navItems = document.querySelectorAll('.bottom-nav .nav-item');
        navItems.forEach(el => el.classList.remove('active'));
        if (navItems[icons[tabId]]) {
            navItems[icons[tabId]].classList.add('active');
        }
    }

    // Update Header Title based on tab
    const titleEl = document.getElementById('headerTitle');
    const titles = {
        'home': '',
        'menu': currentUser ? currentUser.name : 'Menu',
        'order': 'Orders',
        'favorite': 'Favorite',
        'notification': 'Notifications'
    };
    titleEl.innerText = titles[tabId] || '';
    
    // Scroll to top
    window.scrollTo(0,0);
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        overlay.classList.remove('open');
    } else {
        sidebar.classList.add('open');
        overlay.classList.add('open');
    }
}

function logout() {
    localStorage.removeItem('favcafe_active_user');
    window.location.href = 'mobile_auth.html';
}
