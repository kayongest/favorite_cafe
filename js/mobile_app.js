/* =========================================
   Mobile App JS Logic (Redesign)
   ========================================= */

let currentUser = null;
let menuItems = [];
let cart = [];
let favorites = [];
let activeCategory = 'All';

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

async function initApp() {
    checkAuth();
    loadCart();
    loadFavorites();
    await loadMenu();
    
    renderHomeCategories();
    renderHomeRecommended();
    renderMenuCategories();
    renderMenuGrid();
    renderFavoriteGrid();
    
    initCarousel();
}

function loadFavorites() {
    const favStr = localStorage.getItem('favcafe_favorites');
    if (favStr) favorites = JSON.parse(favStr);
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
    const nameParts = name.split(' ');
    let initials = 'U';
    if (nameParts.length >= 2) {
        initials = (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase();
    } else if (nameParts.length === 1 && nameParts[0].length > 0) {
        initials = nameParts[0].substring(0, 2).toUpperCase();
    }
    
    const headerAvatar = document.getElementById('headerAvatar');
    const sidebarAvatar = document.getElementById('sidebarAvatar');
    if(headerAvatar) headerAvatar.innerText = initials;
    if(sidebarAvatar) sidebarAvatar.innerText = initials;
    
    // Update Sidebar
    document.getElementById('sidebarName').innerText = name;
    document.getElementById('sidebarEmail').innerText = currentUser.email || '';
}

function loadCart() {
    const cartStr = localStorage.getItem('favcafe_cart');
    if (cartStr) cart = JSON.parse(cartStr);
    
    const total = cart.reduce((sum, item) => sum + (parseFloat(item.price) * parseInt(item.qty)), 0);
    document.getElementById('headerPrice').innerText = `${total.toFixed(2)} RWF`;
    
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

function renderMenuCategories() {
    const container = document.getElementById('menuCategoryChips');
    if (!container) return;
    
    // Get unique categories and prepend 'All'
    const categories = ['All', ...new Set(menuItems.map(item => item.category || 'Other'))];
    
    container.innerHTML = '';
    categories.forEach(cat => {
        const isActive = cat === activeCategory ? 'active' : '';
        container.innerHTML += `<div class="chip ${isActive}" onclick="filterByCategory('${cat}')">${cat}</div>`;
    });
}

function filterByCategory(cat) {
    activeCategory = cat;
    renderMenuCategories(); // Re-render to update active state
    executeSearch(); // Apply filter
}

function renderMenuGrid(itemsToRender = null) {
    const container = document.getElementById('menuGrid');
    container.innerHTML = '';
    const items = itemsToRender || menuItems;
    items.forEach(item => {
        container.innerHTML += createMenuCard(item, false);
    });
}

function executeSearch() {
    const query = document.getElementById('menuSearchInput').value.toLowerCase();
    
    const filtered = menuItems.filter(item => {
        const matchesQuery = item.title.toLowerCase().includes(query) || (item.category && item.category.toLowerCase().includes(query));
        const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
        return matchesQuery && matchesCategory;
    });
    
    renderMenuGrid(filtered);
}

function renderFavoriteGrid() {
    const container = document.getElementById('favoriteGrid');
    if (!container) return;
    container.innerHTML = '';
    const favoriteItems = menuItems.filter(item => favorites.includes(item.id));
    
    if (favoriteItems.length === 0) {
        container.innerHTML = '<div class="text-center w-100 mt-5 text-gray">No favorites yet. Tap the heart icon on a menu item to add it!</div>';
        return;
    }
    
    favoriteItems.forEach(item => {
        container.innerHTML += createMenuCard(item);
    });
}

function createMenuCard(item, isFavoriteFlag = null) {
    const img = item.image && item.image !== 'undefined' ? item.image : 'img/menu/1.jpg';
    const price = parseFloat(item.price || 0).toFixed(2);
    const weight = item.weight || '250g';
    const isFavorite = favorites.includes(item.id);
    const heartIcon = isFavorite ? 'fas fa-heart text-red' : 'far fa-heart';
    
    return `
        <div class="menu-card">
            <i class="${heartIcon} heart-icon" onclick="toggleFavorite(event, this, ${item.id})"></i>
            <img src="${img}" class="menu-img" onerror="this.src='img/menu/1.jpg'">
            <div class="menu-title">${item.title}</div>
            <div class="menu-bottom">
                <div>
                    <span class="menu-price">${price} RWF</span>
                    <span class="menu-weight">| ${weight}</span>
                </div>
                <button class="btn-plus" onclick="addToCart(event, ${JSON.stringify(item).replace(/"/g, '&quot;')})">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        </div>
    `;
}

// --- Carousel ---
function initCarousel() {
    const slides = [
        { title: "Order Salmon Steak Today", subtitle: "And Save Up To", discount: "35%", img: "img/menu/6.jpg" },
        { title: "Fresh Salads", subtitle: "Healthy & Green", discount: "20%", img: "img/menu/1.jpg" },
        { title: "Coffee & Pastries", subtitle: "Morning Special", discount: "15%", img: "img/menu/4.jpg" }
    ];
    let currentIndex = 0;
    
    setInterval(() => {
        const content = document.getElementById('promoContent');
        if(!content) return;
        
        content.style.opacity = 0;
        
        setTimeout(() => {
            currentIndex = (currentIndex + 1) % slides.length;
            const slide = slides[currentIndex];
            
            document.getElementById('promoTitle').innerText = slide.title;
            document.getElementById('promoSubtitle').innerText = slide.subtitle;
            document.getElementById('promoDiscount').innerText = slide.discount;
            document.getElementById('promoImg').src = slide.img;
            
            const dots = document.getElementById('promoDots').children;
            for(let i=0; i<dots.length; i++) {
                dots[i].className = i === currentIndex ? 'dot active' : 'dot';
            }
            
            content.style.opacity = 1;
        }, 500); // Wait for fade out
    }, 4000); // Change every 4 seconds
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
                    <div class="cart-item-price">${parseFloat(item.price).toFixed(2)} RWF</div>
                </div>
                <div class="cart-qty-control">
                    <button onclick="updateCartQty(${item.id}, -1)"><i class="fas fa-minus text-xs"></i></button>
                    <span class="fw-bold text-sm">${item.qty}</span>
                    <button onclick="updateCartQty(${item.id}, 1)"><i class="fas fa-plus text-xs"></i></button>
                </div>
            </div>
        `;
    });
    
    document.getElementById('cartSubtotal').innerText = `${subtotal.toFixed(2)} RWF`;
    document.getElementById('cartTotal').innerText = `${subtotal.toFixed(2)} RWF`;
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

function toggleFavorite(e, iconElement, itemId) {
    if (e) e.stopPropagation();
    
    const index = favorites.indexOf(itemId);
    
    if (iconElement.classList.contains('far')) {
        // Was inactive, make active
        iconElement.classList.remove('far');
        iconElement.classList.add('fas');
        iconElement.classList.add('text-red');
        if (index === -1) favorites.push(itemId);
        showToast("Added to favorites!");
    } else {
        // Was active, make inactive
        iconElement.classList.remove('fas');
        iconElement.classList.remove('text-red');
        iconElement.classList.add('far');
        if (index > -1) favorites.splice(index, 1);
        showToast("Removed from favorites.");
    }
    
    localStorage.setItem('favcafe_favorites', JSON.stringify(favorites));
    
    // If we are currently on the favorite view, re-render it
    const favView = document.getElementById('view-favorite');
    if (favView && favView.classList.contains('active')) {
        renderFavoriteGrid();
    }
}

// --- Interactions ---
function switchTab(tabId, navElement = null) {
    // Hide all views
    document.querySelectorAll('.tab-view').forEach(el => el.classList.remove('active'));
    
    // Clear Search Input when navigating
    const searchInput = document.getElementById('menuSearchInput');
    if (searchInput && tabId !== 'menu') {
        searchInput.value = '';
        executeSearch(); // Reset grid
    }
    
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
