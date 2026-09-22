/* =========================================
   Foodia Dark Navy Theme JS Logic (From Scratch)
   ========================================= */

// GLOBAL STATE
let currentUser = null;
let menuItems = [];
let cart = [];
let favorites = [];
let activeCategory = 'All';
let currentOrderFilter = 'all';
let isOffline = false;

// INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

async function initApp() {
    initThemeMode();
    await validateSession();
    checkAuth();
    loadCart();
    loadFavorites();
    await loadMenu();

    renderHomeCategories();
    renderHomeRecommended();
    renderMenuCategories();
    renderMenuGrid();
    renderFavoriteGrid();
    loadMobileOrderHistory();

    initNetworkListener();
}

// SESSION VALIDATION
async function validateSession() {
    const token = localStorage.getItem('favcafe_token');
    if (!token) {
        const userStr = localStorage.getItem('favcafe_active_user');
        if (userStr) {
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
        if (data.valid && data.user) {
            const userObj = JSON.parse(localStorage.getItem('favcafe_active_user') || '{}');
            userObj.id = data.user.id;
            userObj.name = data.user.full_name;
            userObj.email = data.user.email;
            userObj.phone = data.user.phone || '';
            userObj.address = data.user.address || userObj.address || '';
            localStorage.setItem('favcafe_active_user', JSON.stringify(userObj));
            return true;
        }
    } catch (e) {
        isOffline = true;
    }
    return true;
}

function initNetworkListener() {
    window.addEventListener('online', () => {
        isOffline = false;
        showToast('🔄 Back online!');
        loadMenu();
    });
    window.addEventListener('offline', () => {
        isOffline = true;
        showToast('📡 Offline mode activated');
    });
}

// AUTH & USER STATE
function checkAuth() {
    const userStr = localStorage.getItem('favcafe_active_user');
    if (userStr) {
        try {
            currentUser = JSON.parse(userStr);
        } catch (e) {
            currentUser = { name: 'James Hawkins', email: 'jameshawkins@mail.com', phone: '+12 345 678 92', address: 'Franklin Avenue, Corner St.London, 24125151' };
        }
    } else {
        currentUser = { name: 'James Hawkins', email: 'jameshawkins@mail.com', phone: '+12 345 678 92', address: 'Franklin Avenue, Corner St.London, 24125151' };
    }

    renderUserContacts();
}

function renderUserContacts() {
    if (!currentUser) return;
    const name = currentUser.name || currentUser.full_name || 'James Hawkins';
    const firstName = name.split(' ')[0] || 'James';

    const greetingUser = document.getElementById('greetingUserName');
    if (greetingUser) greetingUser.innerText = `${firstName} 👋`;

    const greetingTime = document.getElementById('greetingTimeText');
    if (greetingTime) {
        const hour = new Date().getHours();
        if (hour < 12) greetingTime.innerText = 'Good Morning';
        else if (hour < 17) greetingTime.innerText = 'Good Afternoon';
        else greetingTime.innerText = 'Good Evening';
    }

    const profileTabName = document.getElementById('profileTabName');
    if (profileTabName) profileTabName.innerText = name;

    const sidebarUserName = document.getElementById('sidebarUserName');
    if (sidebarUserName) sidebarUserName.innerText = name;

    // Mobile Phone
    const phoneRow = document.getElementById('contactRowPhone');
    const profilePhoneVal = document.getElementById('profilePhoneVal');
    if (profilePhoneVal) {
        if (currentUser.phone && currentUser.phone.trim() !== '') {
            profilePhoneVal.innerText = currentUser.phone;
            if (phoneRow) phoneRow.style.display = 'flex';
        } else {
            profilePhoneVal.innerText = 'Not set';
            if (phoneRow) phoneRow.style.display = 'flex';
        }
    }

    // Email Address
    const emailRow = document.getElementById('contactRowEmail');
    const profileEmailVal = document.getElementById('profileEmailVal');
    if (profileEmailVal) {
        if (currentUser.email && currentUser.email.trim() !== '') {
            profileEmailVal.innerText = currentUser.email;
            if (emailRow) emailRow.style.display = 'flex';
        } else {
            profileEmailVal.innerText = 'Not set';
            if (emailRow) emailRow.style.display = 'flex';
        }
    }

    // Physical / Delivery Address
    const addressRow = document.getElementById('contactRowAddress');
    const profileAddressVal = document.getElementById('profileAddressVal');
    if (profileAddressVal) {
        const addrText = currentUser.address || currentUser.delivery_address || 'Franklin Avenue, Corner St.London, 24125151';
        if (addrText && addrText.trim() !== '') {
            profileAddressVal.innerText = addrText;
            if (addressRow) addressRow.style.display = 'flex';
        } else {
            profileAddressVal.innerText = 'Not set';
            if (addressRow) addressRow.style.display = 'flex';
        }
    }

    // Render Custom Extra Contacts
    renderCustomContactsList();
}

function renderCustomContactsList() {
    const listContainer = document.getElementById('customContactsList');
    if (!listContainer) return;
    listContainer.innerHTML = '';

    const contacts = currentUser.custom_contacts || [];
    contacts.forEach((c, idx) => {
        const row = document.createElement('div');
        row.className = 'contact-row-item';
        row.style.cssText = 'display: flex; align-items: center; justify-content: space-between; margin-top: 10px;';
        row.innerHTML = `
            <div class="d-flex align-items-center flex-grow-1">
                <div class="contact-icon-circle me-3"><i class="${c.icon || 'fas fa-address-book'}"></i></div>
                <div>
                    <div class="contact-info-label">${escapeHtml(c.label || 'Contact')}</div>
                    <div class="contact-info-val">${escapeHtml(c.val || c.value || '')}</div>
                </div>
            </div>
            <button type="button" class="btn-clear-field" onclick="deleteCustomContact(${idx})" title="Delete"><i class="fas fa-trash-alt"></i></button>
        `;
        listContainer.appendChild(row);
    });
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// PROFILE CONTACTS EDIT MODAL CONTROLLERS
function openMobileAuthModal(modalType) {
    if (modalType === 'profile_edit' || modalType === 'contacts_edit') {
        const nameInput = document.getElementById('editProfileName');
        const phoneInput = document.getElementById('editProfilePhone');
        const emailInput = document.getElementById('editProfileEmail');
        const addressInput = document.getElementById('editProfileAddress');

        if (currentUser) {
            if (nameInput) nameInput.value = currentUser.name || currentUser.full_name || '';
            if (phoneInput) phoneInput.value = currentUser.phone || '';
            if (emailInput) emailInput.value = currentUser.email || '';
            if (addressInput) addressInput.value = currentUser.address || currentUser.delivery_address || '';
        }

        populateModalCustomContacts();

        const modal = document.getElementById('profileEditModal');
        if (modal) modal.classList.add('active');
    }
}
window.openMobileAuthModal = openMobileAuthModal;

function closeMobileAuthModal(modalType) {
    if (modalType === 'profile_edit' || modalType === 'contacts_edit') {
        const modal = document.getElementById('profileEditModal');
        if (modal) modal.classList.remove('active');
    }
}
window.closeMobileAuthModal = closeMobileAuthModal;

function populateModalCustomContacts() {
    const container = document.getElementById('modalCustomContactsContainer');
    if (!container) return;
    container.innerHTML = '';

    const contacts = (currentUser && currentUser.custom_contacts) ? currentUser.custom_contacts : [];
    contacts.forEach((c) => {
        addCustomContactInput(c.label, c.val || c.value);
    });
}

function addCustomContactInput(label = '', value = '') {
    const container = document.getElementById('modalCustomContactsContainer');
    if (!container) return;

    const div = document.createElement('div');
    div.className = 'd-flex gap-2 align-items-center mb-2 custom-contact-row';
    div.style.cssText = 'display: flex; gap: 8px; margin-bottom: 8px; align-items: center;';
    div.innerHTML = `
        <input type="text" class="form-control-custom custom-contact-label" placeholder="Label (e.g. Work)" value="${escapeHtml(label)}" style="flex: 1;">
        <input type="text" class="form-control-custom custom-contact-value" placeholder="Value (e.g. 078...)" value="${escapeHtml(value)}" style="flex: 1.5;">
        <button type="button" class="btn-clear-field" onclick="this.parentElement.remove()" style="opacity:1;"><i class="fas fa-times text-coral"></i></button>
    `;
    container.appendChild(div);
}
window.addCustomContactInput = addCustomContactInput;

async function saveMobileProfileContacts() {
    const nameInput = document.getElementById('editProfileName');
    const phoneInput = document.getElementById('editProfilePhone');
    const emailInput = document.getElementById('editProfileEmail');
    const addressInput = document.getElementById('editProfileAddress');

    const newName = nameInput ? nameInput.value.trim() : (currentUser.name || '');
    const newPhone = phoneInput ? phoneInput.value.trim() : (currentUser.phone || '');
    const newEmail = emailInput ? emailInput.value.trim() : (currentUser.email || '');
    const newAddress = addressInput ? addressInput.value.trim() : (currentUser.address || '');

    // Collect extra custom contacts
    const customRows = document.querySelectorAll('#modalCustomContactsContainer .custom-contact-row');
    const customContacts = [];
    customRows.forEach(row => {
        const lblInput = row.querySelector('.custom-contact-label');
        const valInput = row.querySelector('.custom-contact-value');
        const lbl = lblInput ? lblInput.value.trim() : '';
        const val = valInput ? valInput.value.trim() : '';
        if (lbl && val) {
            customContacts.push({ label: lbl, val: val, icon: 'fas fa-address-book' });
        }
    });

    if (!currentUser) currentUser = {};

    const prevEmail = currentUser.email || '';

    currentUser.name = newName;
    currentUser.full_name = newName;
    currentUser.phone = newPhone;
    currentUser.email = newEmail;
    currentUser.address = newAddress;
    currentUser.custom_contacts = customContacts;

    // Save to localStorage immediately
    localStorage.setItem('favcafe_active_user', JSON.stringify(currentUser));

    // Send to API update endpoint if possible
    try {
        const payload = {
            action: 'update_profile',
            id: currentUser.id || 0,
            current_email: prevEmail,
            full_name: newName,
            phone: newPhone,
            email: newEmail,
            address: newAddress
        };

        const res = await fetch('api/auth.php?action=update_profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const resData = await res.json();
        if (resData.status === 'success' && resData.user) {
            currentUser.id = resData.user.id || currentUser.id;
            localStorage.setItem('favcafe_active_user', JSON.stringify(currentUser));
        } else if (resData.status === 'error') {
            showToast('⚠️ ' + resData.message);
            return;
        }
    } catch (e) {
        console.warn('API update failed, saved locally:', e);
    }

    renderUserContacts();
    closeMobileAuthModal('profile_edit');
    showToast('✅ Contacts updated successfully!');
}
window.saveMobileProfileContacts = saveMobileProfileContacts;

async function deleteContactField(fieldKey) {
    if (!currentUser) return;
    const labelMap = { phone: 'Mobile Phone', email: 'Email Address', address: 'Address' };
    const label = labelMap[fieldKey] || fieldKey;

    if (!confirm(`Are you sure you want to clear your ${label}?`)) return;

    if (fieldKey === 'phone') currentUser.phone = '';
    if (fieldKey === 'email') currentUser.email = '';
    if (fieldKey === 'address') currentUser.address = '';

    localStorage.setItem('favcafe_active_user', JSON.stringify(currentUser));

    try {
        await fetch('api/auth.php?action=update_profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'update_profile',
                id: currentUser.id || 0,
                current_email: currentUser.email || '',
                full_name: currentUser.name || currentUser.full_name || '',
                phone: currentUser.phone,
                email: currentUser.email,
                address: currentUser.address
            })
        });
    } catch (e) { }

    renderUserContacts();
    showToast(`🗑️ ${label} cleared`);
}
window.deleteContactField = deleteContactField;

function deleteCustomContact(index) {
    if (!currentUser || !currentUser.custom_contacts) return;
    currentUser.custom_contacts.splice(index, 1);
    localStorage.setItem('favcafe_active_user', JSON.stringify(currentUser));
    renderUserContacts();
    showToast('🗑️ Contact deleted');
}
window.deleteCustomContact = deleteCustomContact;

function toggleDarkMode() {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('favcafe_mobile_theme_mode', isLight ? 'light' : 'dark');

    const icon = document.getElementById('darkModeIcon');
    if (icon) {
        if (isLight) {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            icon.style.color = '#161d31';
        } else {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            icon.style.color = '#ffffff';
        }
    }
    showToast(isLight ? '☀️ Light Mode Enabled' : '🌙 Dark Mode Enabled');
}
window.toggleDarkMode = toggleDarkMode;

function initThemeMode() {
    const saved = localStorage.getItem('favcafe_mobile_theme_mode');
    if (saved === 'light') {
        document.body.classList.add('light-theme');
        const icon = document.getElementById('darkModeIcon');
        if (icon) {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            icon.style.color = '#161d31';
        }
    }
}

function logout() {
    const token = localStorage.getItem('favcafe_token');
    localStorage.removeItem('favcafe_active_user');
    localStorage.removeItem('favcafe_token');
    localStorage.removeItem('favcafe_remembered_email');

    if (token) {
        fetch('api/auth.php?action=logout', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch(() => { });
    }

    showToast('👋 Signed out successfully. Redirecting to login...');
    setTimeout(() => {
        window.location.href = 'mobile_auth.html';
    }, 1200);
}
window.logout = logout;

// SIDEBAR DRAWER TOGGLE
function toggleSidebarDrawer() {
    const drawer = document.getElementById('sidebarDrawer');
    const overlay = document.getElementById('sidebarDrawerOverlay');
    if (drawer && overlay) {
        drawer.classList.toggle('open');
        overlay.classList.toggle('open');
    }
}
window.toggleSidebarDrawer = toggleSidebarDrawer;

// CATEGORY ICON CONFIG (SCREEN 4)
function getCategoryIconConfig(categoryName) {
    const cat = (categoryName || '').toLowerCase();
    if (cat.includes('salad')) return { icon: 'fas fa-seedling', bg: '#26de81', label: 'Salads' };
    if (cat.includes('meat') || cat.includes('steak')) return { icon: 'fas fa-drumstick-bite', bg: '#ff5252', label: 'Meat' };
    if (cat.includes('pasta') || cat.includes('noodle')) return { icon: 'fas fa-utensils', bg: '#ff7043', label: 'Pasta' };
    if (cat.includes('soup')) return { icon: 'fas fa-bowl-food', bg: '#26c6da', label: 'Soups' };
    if (cat.includes('potato')) return { icon: 'fas fa-border-all', bg: '#a55eea', label: 'Potatoes' };
    if (cat.includes('salmon') || cat.includes('fish')) return { icon: 'fas fa-fish', bg: '#ff79ac', label: 'Fish' };
    if (cat.includes('burger')) return { icon: 'fas fa-hamburger', bg: '#2b5cff', label: 'Foods' };
    if (cat.includes('wrap') || cat.includes('fast') || cat.includes('snack')) return { icon: 'fas fa-cookie-bite', bg: '#26de81', label: 'Snack' };
    if (cat.includes('drink') || cat.includes('coffee') || cat.includes('beverage')) return { icon: 'fas fa-coffee', bg: '#ff7043', label: 'Drink' };
    if (cat.includes('dessert') || cat.includes('dissert') || cat.includes('cake')) return { icon: 'fas fa-ice-cream', bg: '#a55eea', label: 'Dissert' };
    return { icon: 'fas fa-utensils', bg: '#2b5cff', label: categoryName || 'Foods' };
}

// MENU & DATA FETCHING
async function loadMenu() {
    try {
        const res = await fetch('api/menu.php?action=get');
        if (res.ok) {
            const data = await res.json();
            if (data.status === 'success' && data.data && data.data.length > 0) {
                menuItems = data.data;
                localStorage.setItem('favcafe_menu_cache', JSON.stringify(menuItems));
                return;
            }
        }
    } catch (e) {}

    const cached = localStorage.getItem('favcafe_menu_cache');
    if (cached) {
        menuItems = JSON.parse(cached);
        return;
    }

    // Default reference menu items matching screens
    menuItems = [
        { id: 1, title: 'Chicken Briyani Haji Mahmud', category: 'Foods', price: 4.0, subtitle: 'Coffe, Milk', image: 'img/menu/1.jpg' },
        { id: 2, title: 'Deluxe Super Burger Spicy', category: 'Burgers', price: 7.2, subtitle: 'Coffe, Milk', image: 'img/menu/7.jpg' },
        { id: 3, title: 'Coffee Mocha / White Mocha', category: 'Drink', price: 5.0, subtitle: 'Coffe, Milk', image: 'img/menu/4.jpg' },
        { id: 4, title: 'Chicken Wings Spicy', category: 'Meat', price: 5.0, subtitle: 'Spicy Sauce', image: 'img/menu/2.jpg' },
        { id: 5, title: 'Vanilla Sweet Cream Cold', category: 'Drink', price: 5.0, subtitle: 'Cold Brew', image: 'img/menu/3.jpg' },
        { id: 6, title: 'Mily Cream Ice Coffee', category: 'Drink', price: 5.0, subtitle: 'Fresh Milk', image: 'img/menu/5.jpg' },
        { id: 7, title: 'Salmon Steak Special', category: 'Fish', price: 12.0, subtitle: 'Grilled Lemon', image: 'img/menu/6.jpg' },
        { id: 8, title: 'French Fries Deluxe', category: 'Snack', price: 3.5, subtitle: 'Crispy Potato', image: 'img/menu/1.jpg' }
    ];
}

// RENDER HOME CATEGORIES (SCREEN 4)
function renderHomeCategories() {
    const container = document.getElementById('homeCategories');
    if (!container) return;

    const presetCategories = ['Foods', 'Drink', 'Snack', 'Dissert', 'Foods', 'Foods', 'Foods'];
    const categories = [...new Set(menuItems.map(item => item.category || 'Foods'))];

    container.innerHTML = '';
    
    // Default 7 category cards from image 2
    const catsToRender = categories.length >= 4 ? categories : presetCategories;
    catsToRender.forEach((cat, idx) => {
        const conf = getCategoryIconConfig(cat);
        const escapedCat = cat.replace(/'/g, "\\'");
        
        container.innerHTML += `
            <a href="javascript:void(0);" class="cat-icon-card" onclick="filterByCategory('${escapedCat}'); switchTab('menu');">
                <div class="cat-icon-box" style="background:${conf.bg};">
                    <i class="${conf.icon}"></i>
                </div>
                <span class="cat-icon-label">${conf.label}</span>
            </a>
        `;
    });
}

function renderHomeRecommended() {
    const container = document.getElementById('homeRecommended');
    if (!container) return;

    container.innerHTML = '';
    const recommendations = menuItems.slice(0, 4);
    recommendations.forEach(item => {
        container.innerHTML += createMenuCard(item);
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
            <button type="button" class="status-pill-btn ${isActive}" onclick="filterByCategory('${escapedCat}')">
                ${cat}
            </button>
        `;
    });
}

function filterByCategory(cat) {
    activeCategory = cat;
    renderMenuCategories();
    executeSearch();
}
window.filterByCategory = filterByCategory;

function renderMenuGrid(itemsToRender = null) {
    const container = document.getElementById('menuGrid');
    if (!container) return;

    container.innerHTML = '';
    const items = itemsToRender || menuItems;

    if (items.length === 0) {
        container.innerHTML = `<div class="text-center w-100 py-5 text-muted-custom">No items found</div>`;
        return;
    }

    items.forEach(item => {
        container.innerHTML += createMenuCard(item);
    });
}

function createMenuCard(item) {
    const img = item.image && item.image !== 'undefined' ? item.image : 'img/menu/1.jpg';
    const priceVal = parseFloat(item.price || 0);
    const priceStr = priceVal > 0 ? `$${priceVal.toFixed(1)}` : '$5.0';
    const subStr = item.subtitle || item.category || 'Coffe, Milk';

    const itemJson = JSON.stringify(item).replace(/"/g, '&quot;');

    return `
        <div class="food-card">
            <div class="food-card-img-wrapper">
                <img src="${img}" class="food-card-img" onerror="this.src='img/menu/1.jpg'" alt="${item.title}">
                <button type="button" class="food-card-btn-add" onclick="addToCart(event, ${itemJson})" title="Add to cart">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            <div class="food-card-body">
                <div class="food-card-title">${item.title}</div>
                <div class="food-card-subtitle">${subStr}</div>
                <div class="food-card-footer">
                    <span class="food-card-price">${priceStr}</span>
                </div>
            </div>
        </div>
    `;
}

function executeSearch() {
    const input = document.getElementById('menuSearchInput');
    const query = input ? input.value.toLowerCase() : '';

    const filtered = menuItems.filter(item => {
        const matchesQuery = item.title.toLowerCase().includes(query) || (item.category && item.category.toLowerCase().includes(query));
        const matchesCat = activeCategory === 'All' || item.category === activeCategory;
        return matchesQuery && matchesCat;
    });

    renderMenuGrid(filtered);
}
window.executeSearch = executeSearch;

function executeMenuSearch(val) {
    const query = (val || '').toLowerCase();
    const filtered = menuItems.filter(item => item.title.toLowerCase().includes(query) || (item.category && item.category.toLowerCase().includes(query)));
    renderMenuGrid(filtered);
}
window.executeMenuSearch = executeMenuSearch;

// CART & CHECKOUT (SCREEN 3)
function loadCart() {
    const stored = localStorage.getItem('favcafe_cart');
    if (stored) {
        try { cart = JSON.parse(stored); } catch (e) {}
    }

    if (!cart || cart.length === 0) {
        cart = [
            { id: 1, title: 'Chicken Briyani Haji Mahmud', subtitle: 'Coffe, Milk', price: 4.0, qty: 3, image: 'img/menu/1.jpg' },
            { id: 2, title: 'Deluxe Super Burger Spicy', subtitle: 'Coffe, Milk', price: 7.2, qty: 3, image: 'img/menu/7.jpg' },
            { id: 3, title: 'Coffee Mocha / White Mocha', subtitle: 'Coffe, Milk', price: 12.0, qty: 3, image: 'img/menu/4.jpg' }
        ];
    }

    const totalItems = cart.reduce((sum, item) => sum + parseInt(item.qty), 0);
    const badge = document.getElementById('cartBadge');
    if (badge) badge.innerText = totalItems;

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
            <div class="cart-list-item">
                <button type="button" class="cart-remove-btn" onclick="updateCartQty(${item.id}, -${item.qty})">&times;</button>
                <img src="${img}" onerror="this.src='img/menu/1.jpg'" class="cart-item-img" alt="${item.title}">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.title}</div>
                    <div class="cart-item-sub">${item.subtitle || 'Coffe, Milk'}</div>
                    <div class="cart-item-price-row">
                        <span class="cart-item-price">$${parseFloat(item.price).toFixed(1)}</span>
                        <span class="cart-item-old-price">$0.9</span>
                    </div>
                </div>
                <div class="cart-qty-picker">
                    <button type="button" class="cart-qty-btn" onclick="updateCartQty(${item.id}, -1)">-</button>
                    <span class="cart-qty-val">${item.qty}</span>
                    <button type="button" class="cart-qty-btn" onclick="updateCartQty(${item.id}, 1)">+</button>
                </div>
            </div>
        `;
    });

    const tax = subtotal * 0.02; // 2% tax
    const finalTotal = subtotal - tax;

    const subtotalEl = document.getElementById('cartSubtotal');
    const taxEl = document.getElementById('cartTax');
    const totalEl = document.getElementById('cartTotal');

    if (subtotalEl) subtotalEl.innerText = `$${subtotal.toFixed(2)}`;
    if (taxEl) taxEl.innerText = `-$${tax.toFixed(2)}`;
    if (totalEl) totalEl.innerText = `$${finalTotal.toFixed(2)}`;
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
window.updateCartQty = updateCartQty;

function addToCart(e, item) {
    if (e) e.stopPropagation();

    const cartItem = {
        id: item.id,
        title: item.title || 'Food Item',
        subtitle: item.subtitle || item.category || 'Coffe, Milk',
        price: parseFloat(item.price) || 5.0,
        image: item.image || 'img/menu/1.jpg',
        qty: 1
    };

    let found = false;
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === cartItem.id) {
            cart[i].qty += 1;
            found = true;
            break;
        }
    }
    if (!found) cart.push(cartItem);

    localStorage.setItem('favcafe_cart', JSON.stringify(cart));
    loadCart();
    showToast(`✅ Added ${cartItem.title} to cart!`);
}
window.addToCart = addToCart;

function checkout() {
    showToast('💳 Order Confirmed! Thank you for ordering.', 'success');
}
window.checkout = checkout;

// YOUR ORDERS & STATUS FILTERING (SCREEN 1)
function filterOrderHistoryTab(status, element) {
    currentOrderFilter = status;
    document.querySelectorAll('#orderStatusFilterPills .status-pill-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    if (element) element.classList.add('active');
    loadMobileOrderHistory();
}
window.filterOrderHistoryTab = filterOrderHistoryTab;

function loadMobileOrderHistory() {
    const container = document.getElementById('mobileOrderHistoryList');
    if (!container) return;

    const sampleOrders = [
        {
            id: '0012345',
            statusCategory: 'delivery',
            statusLabel: 'ON DELIVERY',
            statusDotColor: '#ff5e57',
            actionText: 'Track Location',
            items: [
                { title: 'Coffee Mocha / White Mocha', price: 5.0, qty: 2, img: 'img/menu/4.jpg' },
                { title: 'Chicken Wings Spicy', price: 5.0, qty: 2, img: 'img/menu/2.jpg' }
            ]
        },
        {
            id: '0012345',
            statusCategory: 'done',
            statusLabel: 'DONE',
            statusDotColor: '#2ed573',
            actionText: 'View Details',
            items: [
                { title: 'Vanilla Sweet Cream Cold', price: 5.0, qty: 2, img: 'img/menu/3.jpg' },
                { title: 'Mily Cream Ice Coffee', price: 5.0, qty: 2, img: 'img/menu/5.jpg' }
            ]
        }
    ];

    let filtered = sampleOrders;
    if (currentOrderFilter !== 'all') {
        filtered = sampleOrders.filter(o => o.statusCategory === currentOrderFilter);
    }

    container.innerHTML = '';
    filtered.forEach(o => {
        let itemsHtml = '';
        o.items.forEach(item => {
            itemsHtml += `
                <div class="order-item-row">
                    <img src="${item.img}" onerror="this.src='img/menu/1.jpg'" class="order-item-thumb" alt="${item.title}">
                    <div class="order-item-detail">
                        <div class="order-item-title">${item.title}</div>
                        <div class="order-item-price">$${item.price.toFixed(1)} <span style="text-decoration:line-through; font-size:0.7rem; color:var(--text-muted);">$0.9</span></div>
                    </div>
                    <div class="order-item-qty">${item.qty}x</div>
                </div>
            `;
        });

        container.innerHTML += `
            <div class="order-ticket-card">
                <div class="order-ticket-header">
                    <div>
                        <span class="order-id-txt">Order ID #${o.id}</span>
                        <div class="order-status-badge mt-1" style="color:${o.statusDotColor};">
                            <span class="status-pill-dot" style="background:${o.statusDotColor};"></span>
                            ${o.statusLabel}
                        </div>
                    </div>
                    <a href="javascript:void(0);" class="order-action-link" onclick="showToast('📍 Tracking ${o.id}')">${o.actionText}</a>
                </div>
                <div>
                    ${itemsHtml}
                </div>
            </div>
        `;
    });
}
window.loadMobileOrderHistory = loadMobileOrderHistory;

function filterOrdersListByQuery(query) {
    showToast(`Searching orders: "${query}"`);
}
window.filterOrdersListByQuery = filterOrdersListByQuery;

// FAVORITES / OFFERS
function loadFavorites() {
    const favStr = localStorage.getItem('favcafe_favorites');
    if (favStr) {
        try { favorites = JSON.parse(favStr); } catch (e) {}
    }
}

function renderFavoriteGrid() {
    const container = document.getElementById('favoriteGrid');
    if (!container) return;

    container.innerHTML = '';
    const items = menuItems.slice(0, 4);
    items.forEach(item => {
        container.innerHTML += createMenuCard(item);
    });
}

// TAB NAVIGATION & VIEW SWITCHER
function switchTab(tabId, element) {
    document.querySelectorAll('.bottom-nav-bar .bottom-nav-item').forEach(item => {
        item.classList.remove('active');
    });

    if (element) {
        element.classList.add('active');
    } else {
        const targetNav = document.querySelector(`.bottom-nav-bar .bottom-nav-item[data-tab="${tabId}"]`);
        if (targetNav) targetNav.classList.add('active');
    }

    document.querySelectorAll('.tab-view').forEach(view => {
        view.classList.remove('active');
    });

    const targetView = document.getElementById(`view-${tabId}`);
    if (targetView) {
        targetView.classList.add('active');
    }

    const titles = {
        'home': 'Favorite Cafe',
        'menu': 'Cafe Menu',
        'order': 'Shopping Cart',
        'history': 'Your Orders',
        'notification': 'Notification',
        'profile': 'Profile',
        'favorite': 'Offers & Deals'
    };

    const headerTitleText = document.getElementById('headerTitleText');
    if (headerTitleText) {
        headerTitleText.innerText = titles[tabId] || 'Favorite Cafe';
    }

    const globalBackBtn = document.getElementById('globalBackBtn');
    if (globalBackBtn) {
        if (tabId === 'home') {
            globalBackBtn.style.display = 'none';
        } else {
            globalBackBtn.style.display = 'inline-flex';
        }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}
window.switchTab = switchTab;

// TOAST NOTIFICATION
function showToast(message, type = 'info') {
    const toast = document.getElementById('appToast');
    if (!toast) return;

    toast.innerText = message;
    toast.classList.add('show');

    if (window.toastTimeout) clearTimeout(window.toastTimeout);
    window.toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}
window.showToast = showToast;