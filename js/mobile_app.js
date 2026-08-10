/* =========================================
   Favorite Cafe - Mobile App JS
   Complete Production Version
   ========================================= */

// ============================================
// GLOBAL STATE
// ============================================
let currentUser = null;
let menuItems = [];
let cart = [];
let favorites = [];
let activeCategory = 'All';
let currentSlide = 0;
let promoInterval = null;
let isOffline = false;

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

async function initApp() {
    // Validate session first
    const valid = await validateSession();
    if (!valid) {
        window.location.href = 'mobile_auth.html';
        return;
    }

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
    initNetworkListener();
    initSearchListener();

    // Auto-refresh token every 50 minutes (before 1hr expiry)
    setInterval(async () => {
        const token = localStorage.getItem('favcafe_token');
        if (token) {
            try {
                const res = await fetch('api/auth.php?action=refresh', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.token) {
                    localStorage.setItem('favcafe_token', data.token);
                    console.log('Token refreshed successfully');
                }
            } catch (e) {
                // Silent fail - token will be refreshed on next login
            }
        }
    }, 50 * 60 * 1000); // 50 minutes
}

// ============================================
// SESSION VALIDATION
// ============================================
async function validateSession() {
    const token = localStorage.getItem('favcafe_token');

    // If no token, but we have a user in localStorage (offline mode)
    if (!token) {
        const userStr = localStorage.getItem('favcafe_active_user');
        if (userStr) {
            console.warn('⚠️ Offline mode - using cached session');
            isOffline = true;
            return true;
        }
        return false;
    }

    try {
        const res = await fetch('api/auth.php?action=verify', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();

        if (data.valid) {
            // Update user data from server
            if (data.user) {
                const currentUser = JSON.parse(localStorage.getItem('favcafe_active_user') || '{}');
                currentUser.id = data.user.id;
                currentUser.name = data.user.full_name;
                currentUser.email = data.user.email;
                currentUser.phone = data.user.phone || '';
                currentUser.role = data.user.role;
                localStorage.setItem('favcafe_active_user', JSON.stringify(currentUser));
            }
            isOffline = false;
            return true;
        } else {
            // Token invalid - clear and redirect
            localStorage.removeItem('favcafe_token');
            localStorage.removeItem('favcafe_active_user');
            return false;
        }
    } catch (e) {
        // Network error - allow offline mode if we have cached user
        const userStr = localStorage.getItem('favcafe_active_user');
        if (userStr) {
            console.warn('⚠️ Offline mode - using cached session');
            isOffline = true;
            return true;
        }
        return false;
    }
}

// ============================================
// NETWORK STATUS LISTENER
// ============================================
function initNetworkListener() {
    window.addEventListener('online', () => {
        isOffline = false;
        showToast('🔄 Back online!');
        // Refresh data
        loadMenu();
    });

    window.addEventListener('offline', () => {
        isOffline = true;
        showToast('📡 You are offline. Using cached data.');
    });
}

// ============================================
// AUTH & USER MANAGEMENT
// ============================================
function checkAuth() {
    const userStr = localStorage.getItem('favcafe_active_user');
    if (!userStr) {
        window.location.href = 'mobile_auth.html';
        return;
    }
    currentUser = JSON.parse(userStr);
    const name = currentUser.name || 'User';

    // Update header title
    const headerTitle = document.getElementById('headerTitle');
    if (headerTitle) headerTitle.innerText = 'Home';

    // Generate initials
    const nameParts = name.split(' ');
    let initials = 'U';
    if (nameParts.length >= 2) {
        initials = (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase();
    } else if (nameParts.length === 1 && nameParts[0].length > 0) {
        initials = nameParts[0].substring(0, 2).toUpperCase();
    }

    const headerAvatar = document.getElementById('headerAvatar');
    const sidebarAvatar = document.getElementById('sidebarAvatar');
    if (headerAvatar) headerAvatar.innerText = initials;
    if (sidebarAvatar) sidebarAvatar.innerText = initials;

    // Update Sidebar
    const sidebarName = document.getElementById('sidebarName');
    const sidebarEmail = document.getElementById('sidebarEmail');
    if (sidebarName) sidebarName.innerText = name;
    if (sidebarEmail) sidebarEmail.innerText = currentUser.email || '';

    // Show user role badge if admin/staff
    const roleBadge = document.getElementById('sidebarRole');
    if (roleBadge && currentUser.role && currentUser.role !== 'customer') {
        roleBadge.innerText = currentUser.role.toUpperCase();
        roleBadge.style.display = 'inline-block';
    } else if (roleBadge) {
        roleBadge.style.display = 'none';
    }
}

function logout() {
    // Clear all session data
    const token = localStorage.getItem('favcafe_token');
    localStorage.removeItem('favcafe_active_user');
    localStorage.removeItem('favcafe_token');
    localStorage.removeItem('favcafe_remembered_email');

    // Stop promo interval
    if (promoInterval) {
        clearInterval(promoInterval);
        promoInterval = null;
    }

    // Optional: Notify server to invalidate token
    if (token) {
        fetch('api/auth.php?action=logout', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch(() => { });
    }

    window.location.href = 'mobile_auth.html';
}

// ============================================
// CART MANAGEMENT
// ============================================
function loadCart() {
    const cartStr = localStorage.getItem('favcafe_cart');
    if (cartStr) cart = JSON.parse(cartStr);

    const total = cart.reduce((sum, item) => sum + (parseFloat(item.price) * parseInt(item.qty)), 0);
    const headerPrice = document.getElementById('headerPrice');
    if (headerPrice) {
        headerPrice.innerText = `${total.toFixed(2)} RWF`;
    }

    // Update cart badge
    const cartBadge = document.getElementById('cartBadge');
    if (cartBadge) {
        const totalItems = cart.reduce((sum, item) => sum + parseInt(item.qty), 0);
        cartBadge.innerText = totalItems;
        cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    }

    renderCartItems();
}

function renderCartItems() {
    const container = document.getElementById('cartContainer');
    const summary = document.getElementById('cartSummary');
    const emptyState = document.getElementById('emptyCart');

    if (!container) return;

    container.innerHTML = '';

    if (cart.length === 0) {
        if (summary) summary.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (summary) summary.style.display = 'block';

    let subtotal = 0;

    cart.forEach(item => {
        const itemTotal = parseFloat(item.price) * parseInt(item.qty);
        subtotal += itemTotal;
        const img = item.image || 'img/menu/1.jpg';

        container.innerHTML += `
            <div class="cart-item" data-id="${item.id}">
                <img src="${img}" onerror="this.src='img/menu/1.jpg'" alt="${item.title}">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">${parseFloat(item.price).toFixed(2)} RWF</div>
                </div>
                <div class="cart-qty-control">
                    <button onclick="updateCartQty(${item.id}, -1)" aria-label="Decrease quantity">
                        <i class="fas fa-minus text-xs"></i>
                    </button>
                    <span class="fw-bold text-sm">${item.qty}</span>
                    <button onclick="updateCartQty(${item.id}, 1)" aria-label="Increase quantity">
                        <i class="fas fa-plus text-xs"></i>
                    </button>
                </div>
            </div>
        `;
    });

    const subtotalEl = document.getElementById('cartSubtotal');
    const totalEl = document.getElementById('cartTotal');
    if (subtotalEl) subtotalEl.innerText = `${subtotal.toFixed(2)} RWF`;
    if (totalEl) totalEl.innerText = `${subtotal.toFixed(2)} RWF`;
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
    loadCart();
}

function addToCart(e, item) {
    if (e) e.stopPropagation();

    // Ensure item has all required fields
    const cartItem = {
        id: item.id,
        title: item.title || 'Menu Item',
        price: parseFloat(item.price) || 0,
        image: item.image || 'img/menu/1.jpg',
        qty: 1
    };

    let found = false;
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === cartItem.id) {
            cart[i].qty = parseInt(cart[i].qty) + 1;
            found = true;
            break;
        }
    }
    if (!found) {
        cart.push(cartItem);
    }

    localStorage.setItem('favcafe_cart', JSON.stringify(cart));
    loadCart();

    showToast(`✅ Added ${cartItem.title} to cart!`);

    // Animate the cart icon
    const cartIcon = document.querySelector('.bottom-nav .nav-item:nth-child(3) i');
    if (cartIcon) {
        cartIcon.classList.add('bounce');
        setTimeout(() => cartIcon.classList.remove('bounce'), 500);
    }
}

function checkout() {
    if (cart.length === 0) {
        showToast('🛒 Your cart is empty!', 'warning');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (parseFloat(item.price) * parseInt(item.qty)), 0);
    showToast(`💳 Proceeding to checkout: ${total.toFixed(2)} RWF`, 'success');

    // Future integration with desktop index.html#checkout
    // window.location.href = "index.html#checkout";
}

// ============================================
// FAVORITES MANAGEMENT
// ============================================
function loadFavorites() {
    const favStr = localStorage.getItem('favcafe_favorites');
    if (favStr) favorites = JSON.parse(favStr);
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
        showToast('❤️ Added to favorites!');
    } else {
        // Was active, make inactive
        iconElement.classList.remove('fas');
        iconElement.classList.remove('text-red');
        iconElement.classList.add('far');
        if (index > -1) favorites.splice(index, 1);
        showToast('💔 Removed from favorites.');
    }

    localStorage.setItem('favcafe_favorites', JSON.stringify(favorites));

    // If we are currently on the favorite view, re-render it
    const favView = document.getElementById('view-favorite');
    if (favView && favView.classList.contains('active')) {
        renderFavoriteGrid();
    }
}

// ============================================
// MENU MANAGEMENT
// ============================================
async function loadMenu() {
    // Try API first
    try {
        const res = await fetch('api/menu.php?action=get');
        if (res.ok) {
            const data = await res.json();
            if (data.status === 'success' && data.data && data.data.length > 0) {
                menuItems = data.data;
                // Cache menu in localStorage for offline use
                localStorage.setItem('favcafe_menu_cache', JSON.stringify(menuItems));
                return;
            }
        }
    } catch (e) {
        console.log('⚠️ API failed, using cached/dummy data');
    }

    // Try cache from localStorage
    const cachedMenu = localStorage.getItem('favcafe_menu_cache');
    if (cachedMenu) {
        menuItems = JSON.parse(cachedMenu);
        return;
    }

    // Fallback dummy data
    menuItems = [
        { id: 1, title: 'Fresh Salad', category: 'Salads', price: '10.99', image: 'img/menu/1.jpg', weight: '200g' },
        { id: 2, title: 'Grilled Steak', category: 'Meat', price: '24.50', image: 'img/menu/2.jpg', weight: '350g' },
        { id: 3, title: 'Pasta Bolognese', category: 'Pasta', price: '14.00', image: 'img/menu/3.jpg', weight: '300g' },
        { id: 4, title: 'Creamy Soup', category: 'Soups', price: '8.50', image: 'img/menu/4.jpg', weight: '250g' },
        { id: 5, title: 'Baked Potatoes', category: 'Potatoes', price: '6.00', image: 'img/menu/5.jpg', weight: '200g' },
        { id: 6, title: 'Salmon Steak', category: 'Salmon', price: '22.00', image: 'img/menu/6.jpg', weight: '300g' },
        { id: 7, title: 'Chicken Wrap', category: 'Fast Food', price: '12.00', image: 'img/menu/7.jpg', weight: '280g' },
        { id: 8, title: 'Veggie Burger', category: 'Burgers', price: '15.50', image: 'img/menu/7.jpg', weight: '320g' }
    ];
}

// ============================================
// RENDER FUNCTIONS
// ============================================
function renderHomeCategories() {
    const container = document.getElementById('homeCategories');
    if (!container) return;

    const categories = [...new Set(menuItems.map(item => item.category || 'Other'))].slice(0, 6);

    container.innerHTML = '';
    categories.forEach(cat => {
        const item = menuItems.find(m => m.category === cat);
        const img = item && item.image ? item.image : 'img/menu/1.jpg';

        container.innerHTML += `
            <div class="cat-card" onclick="switchTab('menu')">
                <img src="${img}" onerror="this.src='img/menu/1.jpg'" alt="${cat}">
                <span class="text-center">${cat}</span>
            </div>
        `;
    });
}

function renderHomeRecommended() {
    const container = document.getElementById('homeRecommended');
    if (!container) return;

    container.innerHTML = '';
    const recommendations = menuItems.slice(0, 4);
    recommendations.forEach(item => {
        container.innerHTML += createMenuCard(item, false);
    });
}

function renderMenuCategories() {
    const container = document.getElementById('menuCategoryChips');
    if (!container) return;

    const categories = ['All', ...new Set(menuItems.map(item => item.category || 'Other'))];

    container.innerHTML = '';
    categories.forEach(cat => {
        const isActive = cat === activeCategory ? 'active' : '';
        const escapedCat = cat.replace(/'/g, "\\'");
        container.innerHTML += `
            <div class="chip ${isActive}" onclick="filterByCategory('${escapedCat}')">
                ${cat}
            </div>
        `;
    });
}

function filterByCategory(cat) {
    activeCategory = cat;
    renderMenuCategories();
    executeSearch();
}

function renderMenuGrid(itemsToRender = null) {
    const container = document.getElementById('menuGrid');
    if (!container) return;

    container.innerHTML = '';
    const items = itemsToRender || menuItems;

    if (items.length === 0) {
        container.innerHTML = `
            <div class="text-center w-100 mt-5 text-gray">
                <i class="fas fa-search" style="font-size: 2rem; opacity: 0.3;"></i>
                <p style="margin-top: 1rem;">No items found</p>
            </div>
        `;
        return;
    }

    items.forEach(item => {
        container.innerHTML += createMenuCard(item, false);
    });
}

function executeSearch() {
    const queryInput = document.getElementById('menuSearchInput');
    const query = queryInput ? queryInput.value.toLowerCase() : '';

    const filtered = menuItems.filter(item => {
        const matchesQuery = item.title.toLowerCase().includes(query) ||
            (item.category && item.category.toLowerCase().includes(query));
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
        container.innerHTML = `
            <div class="text-center w-100 mt-5 text-gray">
                <i class="far fa-heart" style="font-size: 3rem; opacity: 0.3;"></i>
                <p style="margin-top: 1rem;">No favorites yet.</p>
                <p style="font-size: 0.9rem;">Tap the heart icon on a menu item to add it!</p>
            </div>
        `;
        return;
    }

    favoriteItems.forEach(item => {
        container.innerHTML += createMenuCard(item, true);
    });
}

function createMenuCard(item, isFavoriteFlag = null) {
    const img = item.image && item.image !== 'undefined' ? item.image : 'img/menu/1.jpg';
    const price = parseFloat(item.price || 0).toFixed(2);
    const weight = item.weight || '250g';
    const isFavorite = favorites.includes(item.id);
    const heartIcon = isFavorite ? 'fas fa-heart text-red' : 'far fa-heart';

    // Escape JSON for onclick
    const itemJson = JSON.stringify(item).replace(/"/g, '&quot;');

    return `
        <div class="menu-card">
            <i class="${heartIcon} heart-icon" onclick="toggleFavorite(event, this, ${item.id})"></i>
            <img src="${img}" class="menu-img" onerror="this.src='img/menu/1.jpg'" alt="${item.title}">
            <div style="font-size: 0.7rem; color: #888; text-transform: uppercase; margin: 5px 10px 0;">${item.category || 'Other'}</div>
            <div class="menu-title">${item.title}</div>
            <div class="menu-bottom">
                <div>
                    <span class="menu-price">${price} RWF</span>
                    <span class="menu-weight">| ${weight}</span>
                </div>
                <button class="btn-plus" onclick="addToCart(event, ${itemJson})" aria-label="Add to cart">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        </div>
    `;
}

// ============================================
// CAROUSEL
// ============================================
function initCarousel() {
    let slides = [];
    const storedPromos = localStorage.getItem('favcafe_promos');

    if (storedPromos) {
        slides = JSON.parse(storedPromos);
    }

    if (slides.length === 0) {
        slides = [
            { title: "Order Salmon Steak Today", subtitle: "And Save Up To", discount: "35%", img: "img/menu/6.jpg" },
            { title: "Fresh Salads", subtitle: "Healthy & Green", discount: "20%", img: "img/menu/1.jpg" },
            { title: "Coffee & Pastries", subtitle: "Morning Special", discount: "15%", img: "img/menu/4.jpg" }
        ];
    }

    let currentIndex = 0;

    // Clear any existing interval
    if (promoInterval) {
        clearInterval(promoInterval);
        promoInterval = null;
    }

    // Function to update slide
    const updateSlide = () => {
        const content = document.getElementById('promoContent');
        if (!content) return;

        content.style.opacity = 0;

        setTimeout(() => {
            const slide = slides[currentIndex];
            const titleEl = document.getElementById('promoTitle');
            const subtitleEl = document.getElementById('promoSubtitle');
            const discountEl = document.getElementById('promoDiscount');
            const imgEl = document.getElementById('promoImg');
            const dotsEl = document.getElementById('promoDots');

            if (titleEl) titleEl.innerText = slide.title;
            if (subtitleEl) subtitleEl.innerText = slide.subtitle;
            if (discountEl) discountEl.innerText = slide.discount;
            if (imgEl) imgEl.src = slide.img;

            if (dotsEl) {
                const dots = dotsEl.children;
                for (let i = 0; i < dots.length; i++) {
                    dots[i].className = i === currentIndex ? 'dot active' : 'dot';
                }
            }

            content.style.opacity = 1;
        }, 500);
    };

    // Start auto-play
    promoInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlide();
    }, 4000);
}

// ============================================
// SEARCH LISTENER
// ============================================
function initSearchListener() {
    const searchInput = document.getElementById('menuSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', executeSearch);
        searchInput.addEventListener('search', executeSearch);
    }
}

// ============================================
// TOAST NOTIFICATION
// ============================================
function showToast(message, type = 'info') {
    const toast = document.getElementById('appToast');
    if (!toast) {
        // Fallback alert if toast element doesn't exist
        console.log(message);
        return;
    }

    // Always use the requested colors
    toast.style.backgroundColor = '#153848';
    toast.style.color = '#fff';
    toast.innerText = message;
    toast.classList.add('show');

    // Clear existing timeout
    if (window.toastTimeout) {
        clearTimeout(window.toastTimeout);
    }

    window.toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ============================================
// NAVIGATION & UI
// ============================================
function switchTab(tabId, navElement = null) {
    // Hide all views
    document.querySelectorAll('.tab-view').forEach(el => el.classList.remove('active'));

    // Clear Search Input when navigating away from menu
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
        // Find and activate the correct nav item
        const navItems = document.querySelectorAll('.bottom-nav .nav-item');
        const tabMap = {
            'home': 0,
            'menu': 1,
            'order': 2,
            'favorite': 3,
            'notification': 4
        };

        navItems.forEach(el => el.classList.remove('active'));
        if (tabMap[tabId] !== undefined && navItems[tabMap[tabId]]) {
            navItems[tabMap[tabId]].classList.add('active');
        }
    }

    // Update Header Title
    const titleEl = document.getElementById('headerTitle');
    if (titleEl) {
        const titles = {
            'home': 'Home',
            'menu': currentUser ? currentUser.name : 'Menu',
            'order': 'My Orders',
            'favorite': 'Favorites',
            'notification': 'Notifications'
        };
        titleEl.innerText = titles[tabId] || '';
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    if (!sidebar || !overlay) return;

    if (sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    } else {
        sidebar.classList.add('open');
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

// Close sidebar on overlay click
document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('sidebarOverlay');
    if (overlay) {
        overlay.addEventListener('click', toggleSidebar);
    }
});

// ============================================
// BACK BUTTON HANDLING
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Handle browser back button
    window.addEventListener('popstate', (event) => {
        const activeView = document.querySelector('.tab-view.active');
        if (activeView) {
            const viewId = activeView.id.replace('view-', '');
            const navItems = document.querySelectorAll('.bottom-nav .nav-item');
            const tabMap = {
                'home': 0,
                'menu': 1,
                'order': 2,
                'favorite': 3,
                'notification': 4
            };

            navItems.forEach(el => el.classList.remove('active'));
            if (tabMap[viewId] !== undefined && navItems[tabMap[viewId]]) {
                navItems[tabMap[viewId]].classList.add('active');
            }
        }
    });
});

// ============================================
// PWA INSTALLATION
// ============================================
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    // Show install button or banner
    const installBanner = document.getElementById('installBanner');
    if (installBanner) {
        installBanner.style.display = 'flex';
    }
});

function installApp() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                showToast('🎉 App installed successfully!', 'success');
            } else {
                showToast('Installation declined', 'info');
            }
            deferredPrompt = null;

            const installBanner = document.getElementById('installBanner');
            if (installBanner) {
                installBanner.style.display = 'none';
            }
        });
    }
}

// ============================================
// EXPOSE FUNCTIONS TO GLOBAL SCOPE
// ============================================
window.addToCart = addToCart;
window.updateCartQty = updateCartQty;
window.checkout = checkout;
window.toggleFavorite = toggleFavorite;
window.filterByCategory = filterByCategory;
window.executeSearch = executeSearch;
window.switchTab = switchTab;
window.toggleSidebar = toggleSidebar;
window.logout = logout;
window.installApp = installApp;
window.showToast = showToast;