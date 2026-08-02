/* ============================================================
   Mashariki RESTAURANT - MAIN JS
   ============================================================ */

// 1. AOS Animation Initialization
if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: 680,
        once: true,
        offset: 55
    });
}

/* NAVBAR SCROLL & ACTIVE LINK */
window.addEventListener('scroll', function() {
    var nav = document.getElementById('nav');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
    
    var btt = document.getElementById('btt');
    if (btt) btt.classList.toggle('show', window.scrollY > 300);
    
    document.querySelectorAll('section[id]').forEach(function(sec) {
        var top = sec.offsetTop - 110,
            bot = top + sec.offsetHeight;
        if (window.scrollY >= top && window.scrollY < bot) {
            document.querySelectorAll('.nav-link').forEach(function(l) {
                l.classList.remove('active');
            });
            var lnk = document.querySelector('.nav-link[href="#' + sec.id + '"]');
            if (lnk) lnk.classList.add('active');
        }
    });
});

/* SMOOTH SCROLL + MOBILE NAV CLOSE */
document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
        var href = this.getAttribute('href');
        if (href === '#') return;
        var t = document.querySelector(href);
        if (t) {
            e.preventDefault();
            var navCollapse = document.getElementById('navmenu');
            if (navCollapse && navCollapse.classList.contains('show')) {
                if (typeof bootstrap !== 'undefined' && bootstrap.Collapse) {
                    var bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
                    if (bsCollapse) bsCollapse.hide();
                    else navCollapse.classList.remove('show');
                } else {
                    navCollapse.classList.remove('show');
                }
            }
            setTimeout(function() {
                window.scrollTo({
                    top: t.offsetTop - 78,
                    behavior: 'smooth'
                });
            }, 50);
        }
    });
});

/* SEARCH OVERLAY */
var searchOv = document.getElementById('searchOv');

function openSearch() {
    if (!searchOv) searchOv = document.getElementById('searchOv');
    if (searchOv) {
        searchOv.classList.add('open');
        document.body.style.overflow = 'hidden';
        setTimeout(function() {
            var input = document.getElementById('searchInput');
            if (input) input.focus();
        }, 220);
    }
}

function closeSearch() {
    if (!searchOv) searchOv = document.getElementById('searchOv');
    if (searchOv) {
        searchOv.classList.remove('open');
        document.body.style.overflow = '';
    }
}

// Magnific Popup Video
$(document).ready(function() {
    if ($.fn && $.fn.magnificPopup) {
        $('.magnific_popup').magnificPopup({
            disableOn: 300,
            type: 'iframe',
            mainClass: 'mfp-fade',
            removalDelay: 160,
            preloader: false,
            fixedContentPos: false
        });
    }
});

/* MENU FILTERING */
function filterMenu(cat) {
    document.querySelectorAll('.filtbtn').forEach(function(b) {
        b.classList.toggle('active', b.getAttribute('data-f') === cat);
    });
    document.querySelectorAll('.catcard').forEach(function(c) {
        c.classList.toggle('active', c.getAttribute('data-filter') === cat);
    });
    document.querySelectorAll('.mwrap').forEach(function(w) {
        var c = w.getAttribute('data-c');
        if (cat === 'all' || c === cat) {
            w.classList.remove('gone');
            w.style.opacity = '0';
            w.style.transform = 'translateY(16px)';
            setTimeout(function() {
                w.style.transition = 'opacity .38s,transform .38s';
                w.style.opacity = '1';
                w.style.transform = 'translateY(0)';
            }, 60);
        } else {
            w.classList.add('gone');
        }
    });
}


/* ============================================================
   CART, CHECKOUT & ORDERS STATE MANAGEMENT
   ============================================================ */
var cart = [];
var orders = [];
var activeServiceType = 'delivery';
var activePaymentMethod = 'momo';
var currentPopItem = null;
var lastPlacedOrderId = null;

// Initialize Cart from localStorage
function loadCartFromStorage() {
    try {
        var stored = localStorage.getItem('favcafe_cart');
        if (stored) cart = JSON.parse(stored);
    } catch (e) {
        cart = [];
    }
}

function saveCartToStorage() {
    try {
        localStorage.setItem('favcafe_cart', JSON.stringify(cart));
    } catch (e) {}
}

// Initialize Orders from localStorage with initial demo fallback
function loadOrdersFromStorage() {
    try {
        var stored = localStorage.getItem('favcafe_orders');
        if (stored) {
            orders = JSON.parse(stored);
        } else {
            // Default demo order for rich initial experience
            orders = [
                {
                    id: 'MSH-8492',
                    date: new Date(Date.now() - 45 * 60000).toISOString(),
                    customerName: 'Eric Munyaneza',
                    phone: '+250 788 123 456',
                    address: '108 Kimironko St, Kigali',
                    serviceType: 'delivery',
                    paymentMethod: 'momo',
                    itemsSummary: 'Smash Burger x2, Loaded Fries x1',
                    total: 33.97,
                    status: 'Out for Delivery',
                    timeline: [
                        { label: 'Order Placed', desc: 'Order received & confirmed', status: 'completed' },
                        { label: 'Kitchen Preparing', desc: 'Chef preparing your meal', status: 'completed' },
                        { label: 'Out for Delivery', desc: 'Rider is on the way', status: 'active' },
                        { label: 'Delivered', desc: 'Enjoy your delicious meal!', status: 'pending' }
                    ]
                }
            ];
            saveOrdersToStorage();
        }
    } catch (e) {
        orders = [];
    }
}

function saveOrdersToStorage() {
    try {
        localStorage.setItem('favcafe_orders', JSON.stringify(orders));
    } catch (e) {}
}

function updateCartBadge() {
    var count = cart.reduce(function(acc, item) { return acc + item.quantity; }, 0);
    var cartCountEl = document.getElementById('cartCount');
    if (cartCountEl) cartCountEl.textContent = count;
}

/* CURRENCY FORMATTER FOR RWANDAN FRANCS */
function formatRWF(val) {
    var num = Math.round(parseFloat(val) || 0);
    return num.toLocaleString('en-US') + ' RWF';
}

var appliedDiscount = 0;

function renderCart() {
    var container = document.getElementById('cartItemsList');
    var subtotalEl = document.getElementById('cartSubtotal');
    var totalEl = document.getElementById('cartTotal');
    var countEl = document.getElementById('cartHeaderCount');
    
    if (!container) return;

    var totalCount = cart.reduce(function(acc, i) { return acc + (i.quantity || 1); }, 0);
    if (countEl) countEl.textContent = totalCount + (totalCount === 1 ? ' item' : ' items');

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-shopping-bag fa-3x text-muted mb-3" style="opacity:0.3;"></i>
                <h5 class="text-muted font-weight-bold">Your cart is empty</h5>
                <p class="small text-muted mb-4">Select items from our menu or add quick extras below!</p>
            </div>
        `;
        if (subtotalEl) subtotalEl.textContent = 'RWF 0';
        if (totalEl) totalEl.textContent = 'RWF 0';
        updateCartBadge();
        return;
    }

    var subtotal = 0;
    var html = '';

    cart.forEach(function(item, index) {
        var itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        var priceDisplay = item.price === 0 ? '<span class="free-text">FREE</span>' : formatRWF(item.price);
        var noteDisplay = item.subtitle || item.note || 'Freshly prepared for your order';

        var validImg = (item.img && item.img !== 'undefined' && item.img !== 'null' && item.img !== '') 
                        ? item.img 
                        : ((item.image && item.image !== 'undefined') ? item.image : 'img/menu/1.jpg');

        html += `
            <div class="cart-item-card">
                <img src="${validImg}" alt="${item.title}" class="cart-item-card-img" onerror="this.onerror=null; this.src='img/menu/1.jpg';" />
                <div class="cart-item-card-info">
                    <div class="cart-item-card-title">${item.title}</div>
                    <div class="cart-item-card-price ${item.price === 0 ? 'free-price' : ''}">${priceDisplay}</div>
                    <div class="cart-item-card-note">${noteDisplay}</div>
                </div>
                <div class="cart-item-stepper">
                    <button type="button" onclick="changeCartQty(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button type="button" onclick="changeCartQty(${index}, 1)">+</button>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;

    if (typeof updateCheckoutLoyaltyUI === 'function') {
        updateCheckoutLoyaltyUI();
    }

    var finalTotal = subtotal - (appliedDiscount || 0) - (activeLoyaltyDiscount || 0);
    if (finalTotal < 0) finalTotal = 0;

    if (subtotalEl) subtotalEl.textContent = formatRWF(subtotal);
    if (totalEl) totalEl.textContent = formatRWF(finalTotal);

    updateCartBadge();
}

window.addExtraToCart = function(name, price, img) {
    var validImg = (img && img !== 'undefined' && img !== 'null' && img !== '') ? img : 'img/menu/1.jpg';
    var existing = cart.find(function(i) { return i.title === name; });
    if (existing) {
        existing.quantity += 1;
        if (!existing.img || existing.img === 'undefined') existing.img = validImg;
    } else {
        cart.push({
            title: name,
            price: price,
            img: validImg,
            quantity: 1,
            subtitle: price === 0 ? 'Complementary side extra' : 'Add-on topping extra'
        });
    }
    saveCartToStorage();
    renderCart();
    if (typeof showToast === 'function') {
        showToast(name + ' added to your cart!', 'success', 'Extra Added');
    }
};

window.applyPromoCode = function() {
    var input = document.getElementById('cartPromoInput');
    if (!input) return;
    var code = input.value.trim().toUpperCase();
    if (!code) {
        showToast('Please enter a promo code!', 'warning', 'Promo Code');
        return;
    }
    if (code === 'FAVORITE10' || code === 'WELCOME' || code === 'DISCOUNT') {
        var subtotal = cart.reduce(function(acc, i) { return acc + i.price * i.quantity; }, 0);
        appliedDiscount = Math.round(subtotal * 0.1);
        renderCart();
        showToast('Promo code "' + code + '" applied! 10% discount applied to total.', 'success', 'Promo Applied');
    } else {
        showToast('Invalid promo code. Try "FAVORITE10" or "WELCOME"', 'error', 'Invalid Code');
    }
};

function addToCart(title, priceStr, img, qty) {
    var price = parseFloat(String(priceStr).replace(/[^0-9.]/g, '')) || 0;
    qty = qty || 1;
    var validImg = (img && img !== 'undefined' && img !== 'null' && img !== '') ? img : 'img/menu/1.jpg';

    var existing = cart.find(function(i) { return i.title === title; });
    if (existing) {
        existing.quantity += qty;
        if (!existing.img || existing.img === 'undefined') existing.img = validImg;
    } else {
        cart.push({
            title: title,
            price: price,
            img: validImg,
            quantity: qty
        });
    }

    saveCartToStorage();
    renderCart();
}

function changeCartQty(index, delta) {
    if (cart[index]) {
        cart[index].quantity += delta;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        saveCartToStorage();
        renderCart();
    }
}

function removeCartItem(index) {
    if (cart[index]) {
        cart.splice(index, 1);
        saveCartToStorage();
        renderCart();
    }
}

/* ============================================================
   CUSTOM TOAST NOTIFICATION SYSTEM
   ============================================================ */
function showToast(msg, type, title) {
    type = type || 'info';
    var iconHtml = '<i class="fas fa-info-circle"></i>';
    if (type === 'success') iconHtml = '<i class="fas fa-check-circle"></i>';
    else if (type === 'error') iconHtml = '<i class="fas fa-exclamation-circle"></i>';
    else if (type === 'warning') iconHtml = '<i class="fas fa-exclamation-triangle"></i>';

    if (!title) {
        if (type === 'success') title = 'Success';
        else if (type === 'error') title = 'Error';
        else if (type === 'warning') title = 'Warning';
        else title = 'Notice';
    }

    var container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        document.body.appendChild(container);
    }

    var toast = document.createElement('div');
    toast.className = 'toast-box toast-' + type;
    toast.innerHTML = `
        <div class="toast-icon">${iconHtml}</div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-msg">${msg}</div>
        </div>
        <button type="button" class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    `;

    container.appendChild(toast);

    setTimeout(function() {
        if (toast.parentElement) {
            toast.classList.add('hiding');
            setTimeout(function() {
                if (toast.parentElement) toast.remove();
            }, 300);
        }
    }, 3800);
}

/* ============================================================
   REGISTERED USERS DB & AUTH SYSTEM
   ============================================================ */
var registeredUsers = [];
var currentActiveUser = null;

function loadRegisteredUsers() {
    try {
        var stored = localStorage.getItem('favcafe_registered_users');
        if (stored) {
            registeredUsers = JSON.parse(stored);
        } else {
            registeredUsers = [];
        }
    } catch (e) {
        registeredUsers = [];
    }

    try {
        var active = localStorage.getItem('favcafe_active_user');
        if (active) {
            currentActiveUser = JSON.parse(active);
            updateNavUserButton(currentActiveUser.name);
        }
    } catch (e) {}
}

function saveRegisteredUsers() {
    try {
        localStorage.setItem('favcafe_registered_users', JSON.stringify(registeredUsers));
    } catch (e) {}
}

function updateNavUserButton(name) {
    var navAuthBtn = document.getElementById('navAuthBtn');
    if (navAuthBtn && name) {
        var firstName = name.split(' ')[0];
        navAuthBtn.innerHTML = '<i class="fas fa-user-check me-1" style="color:var(--secondary);"></i>' + firstName;
        navAuthBtn.style.borderColor = 'var(--secondary)';
    }
}

async function processClientRegister() {
    var nameInput = document.getElementById('mRegName');
    var emailInput = document.getElementById('mRegEmail');
    var phoneInput = document.getElementById('mRegPhone');
    var passInput = document.getElementById('mRegPass');

    var name = nameInput ? nameInput.value.trim() : '';
    var email = emailInput ? emailInput.value.trim().toLowerCase() : '';
    var phone = phoneInput ? phoneInput.value.trim() : '';
    var pass = passInput ? passInput.value.trim() : '';

    if (!name || !email || !phone || !pass) {
        showToast('Please fill out all registration fields.', 'warning', 'Incomplete Form');
        return;
    }

    if (pass.length < 6) {
        showToast('Password must be at least 6 characters long.', 'warning', 'Weak Password');
        return;
    }

    // Try PHP MySQL API first
    try {
        var res = await fetch('api/auth.php?action=register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ full_name: name, email: email, phone: phone, password: pass })
        });
        var data = await res.json();
        if (data.status === 'success') {
            var newUser = { name: data.user.full_name || name, email: email, phone: phone, pass: pass };
            currentActiveUser = newUser;
            localStorage.setItem('favcafe_active_user', JSON.stringify(newUser));
            updateNavUserButton(newUser.name);

            loadRegisteredUsers();
            if (!registeredUsers.find(function(u) { return u.email === email; })) {
                registeredUsers.push(newUser);
                saveRegisteredUsers();
            }

            var orderCustName = document.getElementById('orderCustName');
            var orderCustPhone = document.getElementById('orderCustPhone');
            if (orderCustName) orderCustName.value = newUser.name;
            if (orderCustPhone) orderCustPhone.value = phone;

            closeAuthModal();
            showToast(data.message || ('Welcome to Mashariki, ' + newUser.name + '! Your customer account has been created successfully.'), 'success', 'Account Created');
            return;
        } else if (data.status === 'error') {
            showToast(data.message, 'error', 'Registration Failed');
            return;
        }
    } catch (e) {
        console.log('[Auth API] Offline mode active, using Local DB');
    }

    // Fallback: LocalStorage DB Check
    loadRegisteredUsers();
    var existingUser = registeredUsers.find(function(u) { return u.email === email; });
    if (existingUser) {
        showToast('An account with this email (' + email + ') already exists! Please sign in.', 'error', 'Already Registered');
        switchMasharikiTab('login');
        return;
    }

    var newUser = { name: name, email: email, phone: phone, pass: pass };
    registeredUsers.push(newUser);
    saveRegisteredUsers();

    currentActiveUser = newUser;
    localStorage.setItem('favcafe_active_user', JSON.stringify(newUser));
    updateNavUserButton(name);

    var orderCustName = document.getElementById('orderCustName');
    var orderCustPhone = document.getElementById('orderCustPhone');
    if (orderCustName) orderCustName.value = name;
    if (orderCustPhone) orderCustPhone.value = phone;

    closeAuthModal();
    showToast('Welcome to Mashariki, ' + name + '! Your customer account has been created successfully.', 'success', 'Account Created');
}

async function processClientLogin() {
    var emailInput = document.getElementById('mClientEmail');
    var passInput = document.getElementById('mClientPass');

    var email = emailInput ? emailInput.value.trim().toLowerCase() : '';
    var pass = passInput ? passInput.value.trim() : '';

    if (!email || !pass) {
        showToast('Please enter both email address and password.', 'warning', 'Missing Credentials');
        return;
    }

    // Try PHP MySQL API first
    try {
        var res = await fetch('api/auth.php?action=login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: pass })
        });
        var data = await res.json();
        if (data.status === 'success') {
            var userObj = { name: data.user.full_name || email.split('@')[0], email: email, phone: data.user.phone || '', pass: pass };
            currentActiveUser = userObj;
            localStorage.setItem('favcafe_active_user', JSON.stringify(userObj));
            updateNavUserButton(userObj.name);

            var orderCustName = document.getElementById('orderCustName');
            var orderCustPhone = document.getElementById('orderCustPhone');
            if (orderCustName) orderCustName.value = userObj.name;
            if (orderCustPhone && userObj.phone) orderCustPhone.value = userObj.phone;

            closeAuthModal();
            showToast(data.message || ('Welcome back, ' + userObj.name + '! You are now logged in to place orders.'), 'success', 'Welcome Back');
            return;
        } else if (data.status === 'error') {
            showToast(data.message, 'error', 'Login Failed');
            return;
        }
    } catch (e) {
        console.log('[Auth API] Offline mode active, using Local DB');
    }

    // Fallback: LocalStorage DB Check
    loadRegisteredUsers();
    var userInDb = registeredUsers.find(function(u) { return u.email === email; });

    if (!userInDb) {
        // 🔥 USER NOT FOUND IN DB
        showToast('User not found in our database! Please register an account first.', 'error', 'Account Not Found');
        return;
    }

    if (userInDb.pass !== pass) {
        // INVALID PASSWORD
        showToast('Incorrect password! Please check your details and try again.', 'error', 'Login Failed');
        return;
    }

    // SUCCESSFUL LOGIN
    currentActiveUser = userInDb;
    localStorage.setItem('favcafe_active_user', JSON.stringify(userInDb));
    updateNavUserButton(userInDb.name);

    var orderCustName = document.getElementById('orderCustName');
    var orderCustPhone = document.getElementById('orderCustPhone');
    if (orderCustName) orderCustName.value = userInDb.name;
    if (orderCustPhone && userInDb.phone) orderCustPhone.value = userInDb.phone;

    closeAuthModal();
    showToast('Welcome back, ' + userInDb.name + '! You are now logged in to place orders.', 'success', 'Welcome Back');
}

/* CART DRAWER CONTROLS */
function openCartDrawer() {
    renderCart();
    var drawer = document.getElementById('cartDrawerModal');
    if (drawer) {
        drawer.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

function closeCartDrawer() {
    var drawer = document.getElementById('cartDrawerModal');
    if (drawer) {
        drawer.classList.remove('open');
        document.body.style.overflow = '';
    }
}

/* CHECKOUT CONTROLS */
function openCheckoutModal() {
    if (cart.length === 0) {
        showToast('Your cart is empty! Please add some menu items before checking out.', 'warning', 'Empty Cart');
        return;
    }
    closeCartDrawer();
    
    // Auto-fill logged in user info if available
    if (currentActiveUser) {
        var orderCustName = document.getElementById('orderCustName');
        var orderCustPhone = document.getElementById('orderCustPhone');
        if (orderCustName && !orderCustName.value) orderCustName.value = currentActiveUser.name;
        if (orderCustPhone && !orderCustPhone.value && currentActiveUser.phone) orderCustPhone.value = currentActiveUser.phone;
    }

    // Update Checkout Summaries
    var subtotal = cart.reduce(function(acc, i) { return acc + i.price * i.quantity; }, 0) - (appliedDiscount || 0);
    var count = cart.reduce(function(acc, i) { return acc + i.quantity; }, 0);
    
    var summaryItems = document.getElementById('checkoutItemsSummary');
    var summaryTotal = document.getElementById('checkoutTotalSummary');
    
    if (summaryItems) summaryItems.textContent = count + (count === 1 ? ' item' : ' items');
    
    if (typeof updateCheckoutLoyaltyUI === 'function') {
        updateCheckoutLoyaltyUI();
    }

    var finalTotal = subtotal - (activeLoyaltyDiscount || 0);
    if (finalTotal < 0) finalTotal = 0;
    if (summaryTotal) summaryTotal.textContent = formatRWF(finalTotal);

    var modal = document.getElementById('checkoutModal');
    if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

var isLoyaltyPointsRedeemed = false;
var activeLoyaltyPointsUsed = 0;
var activeLoyaltyDiscount = 0;

function getActiveCustomerLoyalty() {
    var storedCust = localStorage.getItem('favcafe_customer_loyalty');
    var loyaltyList = [];
    if (storedCust) {
        try { loyaltyList = JSON.parse(storedCust); } catch(e) {}
    } else {
        loyaltyList = [
            { id: 'CUST-101', name: 'Kayonga Raul', phone: '+250 788 700 870', email: 'kayonga70@gmail.com', loyaltyPoints: 2500 },
            { id: 'CUST-102', name: 'Eric Munyaneza', phone: '+250 788 123 456', email: 'eric@example.com', loyaltyPoints: 1200 }
        ];
    }

    var userEmail = (currentActiveUser && currentActiveUser.email) ? currentActiveUser.email.toLowerCase() : 'kayonga70@gmail.com';
    return loyaltyList.find(function(c) { return c.email.toLowerCase() === userEmail; }) || loyaltyList[0];
}

function updateCheckoutLoyaltyUI() {
    var targetCust = getActiveCustomerLoyalty();

    // Checkout Modal Elements
    var boxEl = document.getElementById('checkoutLoyaltyBox');
    var badgeEl = document.getElementById('checkoutLoyaltyPointsBadge');
    var valEl = document.getElementById('checkoutLoyaltyRwfVal');
    var checkoutInputRow = document.getElementById('checkoutLoyaltyInputRow');
    var checkoutActiveBadge = document.getElementById('checkoutLoyaltyActiveBadge');
    var checkoutAppliedPointsText = document.getElementById('checkoutAppliedPointsText');
    var checkoutAppliedDiscountText = document.getElementById('checkoutAppliedDiscountText');

    // Cart Drawer Elements
    var cartBoxEl = document.getElementById('cartLoyaltyBox');
    var cartBadgeEl = document.getElementById('cartLoyaltyPointsBadge');
    var cartValEl = document.getElementById('cartLoyaltyRwfVal');
    var cartInputRow = document.getElementById('cartLoyaltyInputRow');
    var cartActiveBadge = document.getElementById('cartLoyaltyActiveBadge');
    var cartAppliedPointsText = document.getElementById('cartAppliedPointsText');
    var cartAppliedDiscountText = document.getElementById('cartAppliedDiscountText');

    if (!targetCust || targetCust.loyaltyPoints <= 0) {
        if (boxEl) boxEl.style.display = 'none';
        if (cartBoxEl) cartBoxEl.style.display = 'none';
        isLoyaltyPointsRedeemed = false;
        activeLoyaltyPointsUsed = 0;
        activeLoyaltyDiscount = 0;
        return;
    }

    if (boxEl) boxEl.style.display = 'block';
    if (cartBoxEl) cartBoxEl.style.display = 'block';

    if (badgeEl) badgeEl.textContent = targetCust.loyaltyPoints.toLocaleString() + ' Pts';
    if (valEl) valEl.textContent = formatRWF(targetCust.loyaltyPoints);

    if (cartBadgeEl) cartBadgeEl.textContent = targetCust.loyaltyPoints.toLocaleString() + ' Pts';
    if (cartValEl) cartValEl.textContent = formatRWF(targetCust.loyaltyPoints);

    if (isLoyaltyPointsRedeemed && activeLoyaltyDiscount > 0) {
        if (checkoutInputRow) checkoutInputRow.style.display = 'none';
        if (cartInputRow) cartInputRow.style.display = 'none';

        if (checkoutActiveBadge) checkoutActiveBadge.style.display = 'block';
        if (cartActiveBadge) cartActiveBadge.style.display = 'block';

        if (checkoutAppliedPointsText) checkoutAppliedPointsText.textContent = activeLoyaltyPointsUsed.toLocaleString() + ' Pts';
        if (checkoutAppliedDiscountText) checkoutAppliedDiscountText.textContent = '-' + formatRWF(activeLoyaltyDiscount);

        if (cartAppliedPointsText) cartAppliedPointsText.textContent = activeLoyaltyPointsUsed.toLocaleString() + ' Pts';
        if (cartAppliedDiscountText) cartAppliedDiscountText.textContent = '-' + formatRWF(activeLoyaltyDiscount);
    } else {
        if (checkoutInputRow) checkoutInputRow.style.display = 'block';
        if (cartInputRow) cartInputRow.style.display = 'block';

        if (checkoutActiveBadge) checkoutActiveBadge.style.display = 'none';
        if (cartActiveBadge) cartActiveBadge.style.display = 'none';
    }
}

function applyCustomLoyaltyPoints(source) {
    var targetCust = getActiveCustomerLoyalty();
    if (!targetCust) return;

    var inputId = (source === 'cart') ? 'cartLoyaltyCustomInput' : 'checkoutLoyaltyCustomInput';
    var input = document.getElementById(inputId);
    var requestedPts = input ? parseInt(input.value) : 0;

    if (!requestedPts || requestedPts <= 0) {
        showToast('Please enter a valid points amount to redeem.', 'warning', 'Invalid Points');
        return;
    }

    if (requestedPts > targetCust.loyaltyPoints) {
        showToast('Points requested (' + requestedPts.toLocaleString() + ' Pts) exceeds your balance of ' + targetCust.loyaltyPoints.toLocaleString() + ' Pts.', 'warning', 'Insufficient Points');
        return;
    }

    var subtotal = cart.reduce(function(acc, i) { return acc + i.price * i.quantity; }, 0) - (appliedDiscount || 0);
    if (requestedPts > subtotal) {
        requestedPts = subtotal; // Cap points to order subtotal
    }

    isLoyaltyPointsRedeemed = true;
    activeLoyaltyPointsUsed = requestedPts;
    activeLoyaltyDiscount = requestedPts; // 1 Point = 1 RWF

    updateCheckoutLoyaltyUI();
    recalculateCartAndCheckoutTotals();

    showToast('Applied ' + requestedPts.toLocaleString() + ' Loyalty Points (-' + formatRWF(activeLoyaltyDiscount) + ') discount!', 'success', 'Points Applied');
}

function quickSelectLoyaltyPoints(amount, source) {
    var targetCust = getActiveCustomerLoyalty();
    if (!targetCust) return;

    var inputId = (source === 'cart') ? 'cartLoyaltyCustomInput' : 'checkoutLoyaltyCustomInput';
    var input = document.getElementById(inputId);

    var targetAmount = 0;
    if (amount === 'max') {
        targetAmount = targetCust.loyaltyPoints;
    } else {
        targetAmount = parseInt(amount);
    }

    if (input) input.value = targetAmount;
    applyCustomLoyaltyPoints(source);
}

function removeLoyaltyDiscount() {
    isLoyaltyPointsRedeemed = false;
    activeLoyaltyPointsUsed = 0;
    activeLoyaltyDiscount = 0;

    var cartInput = document.getElementById('cartLoyaltyCustomInput');
    var checkoutInput = document.getElementById('checkoutLoyaltyCustomInput');
    if (cartInput) cartInput.value = '';
    if (checkoutInput) checkoutInput.value = '';

    updateCheckoutLoyaltyUI();
    recalculateCartAndCheckoutTotals();

    showToast('Loyalty points discount removed.', 'info');
}

function recalculateCartAndCheckoutTotals() {
    var subtotal = cart.reduce(function(acc, i) { return acc + i.price * i.quantity; }, 0) - (appliedDiscount || 0);
    var finalTotal = subtotal - (activeLoyaltyDiscount || 0);
    if (finalTotal < 0) finalTotal = 0;

    var checkoutTotalEl = document.getElementById('checkoutTotalSummary');
    var cartTotalEl = document.getElementById('cartTotal');

    if (checkoutTotalEl) checkoutTotalEl.textContent = formatRWF(finalTotal);
    if (cartTotalEl) cartTotalEl.textContent = formatRWF(finalTotal);
}

function toggleLoyaltyPointsRedemption() {
    if (isLoyaltyPointsRedeemed) {
        removeLoyaltyDiscount();
    } else {
        quickSelectLoyaltyPoints('max', 'cart');
    }
}

window.applyCustomLoyaltyPoints = applyCustomLoyaltyPoints;
window.quickSelectLoyaltyPoints = quickSelectLoyaltyPoints;
window.removeLoyaltyDiscount = removeLoyaltyDiscount;
window.updateCheckoutLoyaltyUI = updateCheckoutLoyaltyUI;
window.toggleLoyaltyPointsRedemption = toggleLoyaltyPointsRedemption;


function closeCheckoutModal() {
    var modal = document.getElementById('checkoutModal');
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }
}

function selectServiceType(type, btn) {
    activeServiceType = type;
    document.querySelectorAll('.service-type-btn').forEach(function(b) {
        b.classList.remove('active');
    });
    if (btn) btn.classList.add('active');

    var label = document.getElementById('addressLabel');
    var input = document.getElementById('orderCustAddress');
    if (label && input) {
        if (type === 'delivery') {
            label.textContent = 'Delivery Address *';
            input.placeholder = 'e.g. 108 Kimironko St, House #14';
        } else if (type === 'takeaway') {
            label.textContent = 'Pickup Notes / Expected Time *';
            input.placeholder = 'e.g. Pickup in 20 minutes';
        } else {
            label.textContent = 'Restaurant Table Number *';
            input.placeholder = 'e.g. Table #8';
        }
    }
}

function selectPaymentMethod(method, el) {
    activePaymentMethod = method;
    document.querySelectorAll('.payment-pill').forEach(function(p) {
        p.classList.remove('active');
    });
    if (el) el.classList.add('active');
}

var pendingMoMoOrder = null;

function handleOrderSubmission(e) {
    if (e && e.preventDefault) e.preventDefault();
    var name = document.getElementById('orderCustName').value.trim();
    var phone = document.getElementById('orderCustPhone').value.trim();
    var address = document.getElementById('orderCustAddress').value.trim();

    if (!name || !phone || !address) {
        showToast('Please fill out all required order details.', 'warning', 'Missing Information');
        return;
    }

    var subtotal = cart.reduce(function(acc, i) { return acc + i.price * i.quantity; }, 0);
    var itemsSummaryStr = cart.map(function(i) { return i.title + ' x' + i.quantity; }).join(', ');
    var orderCode = 'MSH-' + Math.floor(1000 + Math.random() * 9000);

    var newOrder = {
        id: orderCode,
        date: new Date().toISOString(),
        customerName: name,
        phone: phone,
        address: address,
        serviceType: activeServiceType,
        paymentMethod: activePaymentMethod,
        itemsSummary: itemsSummaryStr,
        total: subtotal,
        status: 'Kitchen Preparing',
        timeline: [
            { label: 'Order Placed', desc: 'Order received & confirmed', status: 'completed' },
            { label: 'Kitchen Preparing', desc: 'Chefs are cooking your meal', status: 'active' },
            { label: 'Out for Delivery', desc: 'Rider is on the way', status: 'pending' },
            { label: 'Delivered', desc: 'Enjoy your meal!', status: 'pending' }
        ]
    };

    if (activePaymentMethod === 'momo') {
        pendingMoMoOrder = newOrder;
        closeCheckoutModal();
        triggerMomoUssdPrompt(phone, subtotal);
    } else {
        completeOrderPlacement(newOrder);
    }
}

var pendingMoMoOrder = null;
var pendingOrderData = null;
var selectedMomoOperator = 'MTN';
var currentPinDigits = '';

function triggerMomoUssdPrompt(phone, amount) {
    var titleEl = document.getElementById('momoProviderTitle');
    var phoneEl = document.getElementById('momoTargetPhone');
    var amountEl = document.getElementById('momoPaymentAmount');

    if (titleEl) titleEl.textContent = selectedMomoOperator === 'MTN' ? 'MTN Mobile Money' : 'Airtel Money';
    if (phoneEl) phoneEl.textContent = phone || '0788 *** ***';
    if (amountEl) amountEl.textContent = formatRWF(amount);

    var modal = document.getElementById('momoUssdModal');
    if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    showToast('USSD Push Request sent to phone ' + (phone || '') + '. Enter 4-digit PIN to approve.', 'info', 'Mobile Money');
}

function selectMomoOperator(op) {
    selectedMomoOperator = op;
    var mtnBtn = document.getElementById('momoOpMtnBtn');
    var airtelBtn = document.getElementById('momoOpAirtelBtn');
    var titleEl = document.getElementById('momoProviderTitle');
    if (op === 'MTN') {
        if (mtnBtn) { mtnBtn.style.background = '#ffcc00'; mtnBtn.style.color = '#000'; }
        if (airtelBtn) { airtelBtn.style.background = 'transparent'; airtelBtn.style.color = '#64748b'; }
        if (titleEl) titleEl.textContent = 'MTN Mobile Money';
    } else {
        if (mtnBtn) { mtnBtn.style.background = 'transparent'; mtnBtn.style.color = '#64748b'; }
        if (airtelBtn) { airtelBtn.style.background = '#e50914'; airtelBtn.style.color = '#fff'; }
        if (titleEl) titleEl.textContent = 'Airtel Money';
    }
}

function pressPinDigit(d) {
    if (currentPinDigits.length < 4) {
        currentPinDigits += d;
        updatePinDisplay();
        if (currentPinDigits.length === 4) {
            setTimeout(function() {
                confirmMomoUssdSuccess();
            }, 350);
        }
    }
}

function clearPinDigits() {
    currentPinDigits = '';
    updatePinDisplay();
}

function updatePinDisplay() {
    var dotsEl = document.getElementById('momoPinDots');
    if (!dotsEl) return;
    if (currentPinDigits.length === 0) {
        dotsEl.innerHTML = '<span class="text-muted" style="letter-spacing:14px;">• • • •</span>';
    } else {
        var dots = '';
        for (var i = 0; i < currentPinDigits.length; i++) {
            dots += '● ';
        }
        for (var j = currentPinDigits.length; j < 4; j++) {
            dots += '• ';
        }
        dotsEl.innerHTML = '<span class="text-warning font-weight-bold" style="letter-spacing:14px;">' + dots.trim() + '</span>';
    }
}

function confirmMomoUssdSuccess() {
    var modal = document.getElementById('momoUssdModal');
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }
    currentPinDigits = '';
    updatePinDisplay();

    var targetOrder = pendingMoMoOrder || pendingOrderData;

    // Fallback: If no pending order exists but cart has items, build order from active cart!
    if (!targetOrder && cart && cart.length > 0) {
        var subtotal = cart.reduce(function(acc, i) { return acc + i.price * i.quantity; }, 0);
        targetOrder = {
            id: 'MSH-' + Math.floor(1000 + Math.random() * 9000),
            date: new Date().toISOString(),
            customerName: 'Guest Customer',
            phone: '+250 788 700 870',
            address: 'Kigali, Rwanda',
            serviceType: activeServiceType || 'delivery',
            paymentMethod: 'momo',
            itemsSummary: cart.map(function(i) { return i.title + ' x' + i.quantity; }).join(', '),
            total: subtotal,
            status: 'Kitchen Preparing'
        };
    }

    if (targetOrder) {
        completeOrderPlacement(targetOrder);
        showToast(selectedMomoOperator + ' Payment Approved! Order placed & cart cleared.', 'success', 'MoMo Paid');
        logNotification('sms', targetOrder.phone || 'Customer', selectedMomoOperator + ' MoMo Payment of ' + formatRWF(targetOrder.total) + ' approved for #' + targetOrder.id, 'SMS - MoMo Approved');
        pendingMoMoOrder = null;
        pendingOrderData = null;
    } else {
        showToast('Payment verified successfully via Mobile Money!', 'success', 'Payment Approved');
    }
}

function cancelMomoUssd() {
    var modal = document.getElementById('momoUssdModal');
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }
    currentPinDigits = '';
    updatePinDisplay();
    showToast('Mobile Money payment cancelled.', 'warning');
}

function completeOrderPlacement(newOrder) {
    orders.unshift(newOrder);
    saveOrdersToStorage();
    lastPlacedOrderId = newOrder.id;

    logNotification('sms', newOrder.phone || 'Customer', 'Favorite Cafe Order #' + newOrder.id + ' placed successfully! Total: ' + formatRWF(newOrder.total), 'SMS Alert - Order Placed');
    logNotification('email', 'customer@mashariki.com', 'Electronic Tax Invoice #' + newOrder.id + ' generated.', 'Email Ticket - Invoice');

    // Clear Cart
    cart = [];
    saveCartToStorage();
    renderCart();

    // Show Success Modal
    var successCodeEl = document.getElementById('successOrderCode');
    if (successCodeEl) successCodeEl.textContent = '#' + newOrder.id;

    var successModal = document.getElementById('orderSuccessModal');
    if (successModal) {
        successModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

/* ============================================================
   SYSTEM NOTIFICATION LOG ENGINE
   ============================================================ */
var systemNotifications = [];

function loadNotifications() {
    try {
        var stored = localStorage.getItem('favcafe_notifications');
        if (stored) {
            systemNotifications = JSON.parse(stored);
        } else {
            systemNotifications = [
                {
                    id: 'NOTIF-1',
                    type: 'sms',
                    recipient: '+250 788 700 870',
                    title: 'SMS Sent - Order Received',
                    message: 'Your order #MSH-1329 has been received! Est. preparation time: 20 mins.',
                    time: new Date(Date.now() - 10 * 60000).toISOString()
                },
                {
                    id: 'NOTIF-2',
                    type: 'email',
                    recipient: 'customer@mashariki.com',
                    title: 'Email Sent - Booking Confirmed',
                    message: 'Table Reservation #RES-8492 is confirmed for 07:30 PM (Main Hall).',
                    time: new Date(Date.now() - 35 * 60000).toISOString()
                },
                {
                    id: 'NOTIF-3',
                    type: 'alert',
                    recipient: 'Kitchen Staff',
                    title: 'Kitchen Alert - Rush Order',
                    message: 'Order #MSH-1972 (VIP Lounge) includes 14x Mango Shakes!',
                    time: new Date(Date.now() - 50 * 60000).toISOString()
                }
            ];
            saveNotifications();
        }
    } catch (e) {
        systemNotifications = [];
    }
    updateNotificationBadge();
}

function saveNotifications() {
    try {
        localStorage.setItem('favcafe_notifications', JSON.stringify(systemNotifications));
    } catch (e) {}
    updateNotificationBadge();
}

function logNotification(type, recipient, message, title) {
    var newNotif = {
        id: 'NOTIF-' + Math.floor(1000 + Math.random() * 9000),
        type: type || 'sms',
        recipient: recipient || 'Customer',
        title: title || (type === 'sms' ? 'SMS Alert Sent' : 'Email Ticket Sent'),
        message: message,
        time: new Date().toISOString()
    };
    systemNotifications.unshift(newNotif);
    saveNotifications();
}

function updateNotificationBadge() {
    var countEl = document.getElementById('notificationCountBadge');
    var adminDot = document.getElementById('adminNotifyDot');
    var count = systemNotifications.length;
    if (countEl) countEl.textContent = count;
    if (adminDot) adminDot.style.display = count > 0 ? 'inline-block' : 'none';
}

function openNotificationLogModal() {
    loadNotifications();
    renderNotificationLogs('all');
    var modal = document.getElementById('notificationLogModal');
    if (modal) modal.classList.add('open');
}

function closeNotificationLogModal() {
    var modal = document.getElementById('notificationLogModal');
    if (modal) modal.classList.remove('open');
}

function renderNotificationLogs(filterType) {
    filterType = filterType || 'all';
    var container = document.getElementById('notificationFeedContainer');
    var counterEl = document.getElementById('notificationTotalCounter');
    if (!container) return;

    var filtered = systemNotifications.filter(function(n) {
        if (filterType === 'all') return true;
        return n.type === filterType;
    });

    if (counterEl) counterEl.textContent = 'Total: ' + filtered.length + ' logs';

    if (filtered.length === 0) {
        container.innerHTML = '<div class="text-center py-4 text-muted small"><i class="fas fa-bell-slash me-1"></i> No notifications logged yet.</div>';
        return;
    }

    var html = '';
    filtered.forEach(function(n) {
        var badgeClass = 'sms-type';
        var icon = '<i class="fas fa-comment-alt text-primary me-1"></i>';
        if (n.type === 'email') {
            badgeClass = 'email-type';
            icon = '<i class="fas fa-envelope text-success me-1"></i>';
        } else if (n.type === 'alert') {
            badgeClass = 'alert-type';
            icon = '<i class="fas fa-bell text-warning me-1"></i>';
        }

        var dateStr = new Date(n.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        html += `
            <div class="notify-card ${badgeClass}">
                <div class="d-flex justify-content-between align-items-center mb-1">
                    <strong class="text-dark">${icon} ${n.title}</strong>
                    <span class="notify-time">${dateStr}</span>
                </div>
                <div class="small text-muted mb-1">Recipient: <code>${n.recipient}</code></div>
                <div class="small text-dark">${n.message}</div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function filterNotificationLogs(type, btn) {
    if (btn) {
        var parent = btn.parentElement;
        if (parent) {
            parent.querySelectorAll('button').forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
        }
    }
    renderNotificationLogs(type);
}

function clearNotificationLogs() {
    systemNotifications = [];
    saveNotifications();
    renderNotificationLogs('all');
}


/* TABLE RESERVATION FUNCTIONS */
var reservations = JSON.parse(localStorage.getItem('favcafe_reservations') || '[]');

function saveReservationsToStorage() {
    localStorage.setItem('favcafe_reservations', JSON.stringify(reservations));
}

function openReservationModal() {
    var modal = document.getElementById('reservationModal');
    if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
        var dateInp = document.getElementById('resDate');
        if (dateInp && !dateInp.value) {
            var today = new Date().toISOString().split('T')[0];
            dateInp.value = today;
        }
    }
}

function closeReservationModal() {
    var modal = document.getElementById('reservationModal');
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }
}

function handleReservationSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    var date = document.getElementById('resDate').value;
    var time = document.getElementById('resTime').value;
    var guests = document.getElementById('resGuests').value;
    var area = document.getElementById('resArea').value;
    var name = document.getElementById('resCustName').value.trim();
    var phone = document.getElementById('resCustPhone').value.trim();
    var notes = document.getElementById('resNotes').value.trim();

    if (!date || !time || !name || !phone) {
        showToast('Please fill out date, time, name and phone.', 'warning', 'Reservation Incomplete');
        return;
    }

    var resCode = 'RES-' + Math.floor(1000 + Math.random() * 9000);
    var newRes = {
        id: resCode,
        date: date,
        time: time,
        guests: guests,
        area: area,
        customerName: name,
        phone: phone,
        notes: notes,
        status: 'Confirmed',
        createdAt: new Date().toISOString()
    };

    reservations.unshift(newRes);
    saveReservationsToStorage();
    closeReservationModal();

    var codeEl = document.getElementById('resSuccessCode');
    var dtEl = document.getElementById('resSuccessDateTime');
    var gaEl = document.getElementById('resSuccessGuestsArea');

    if (codeEl) codeEl.textContent = '#' + resCode;
    if (dtEl) dtEl.textContent = date + ' at ' + time;
    if (gaEl) gaEl.textContent = guests + ' (' + area + ')';

    var succModal = document.getElementById('reservationSuccessModal');
    if (succModal) {
        succModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    showToast('Table reservation confirmed! Reference: #' + resCode, 'success', 'Table Booked');
}

function closeReservationSuccessModal() {
    var modal = document.getElementById('reservationSuccessModal');
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }
}

/* RECEIPT PRINTING FUNCTIONS */
function openReceiptModal(orderId) {
    loadOrdersFromStorage();
    var target = orders.find(function(o) { return o.id === orderId; }) || orders[0];
    if (!target) {
        showToast('Order receipt not found.', 'error');
        return;
    }

    var numEl = document.getElementById('receiptNum');
    var dateEl = document.getElementById('receiptDate');
    var custEl = document.getElementById('receiptCustomer');
    var typeEl = document.getElementById('receiptServiceType');
    var tbody = document.getElementById('receiptItemsBody');
    var subtotalEl = document.getElementById('receiptSubtotal');
    var taxEl = document.getElementById('receiptTax');
    var totalEl = document.getElementById('receiptTotalAmount');
    var payEl = document.getElementById('receiptPayMethod');

    if (numEl) numEl.textContent = '#' + target.id;
    if (dateEl) dateEl.textContent = new Date(target.date).toLocaleDateString();
    if (custEl) custEl.textContent = target.customerName || 'Customer';
    if (typeEl) typeEl.textContent = (target.serviceType || 'Delivery').toUpperCase();
    if (payEl) payEl.textContent = (target.paymentMethod || 'Mobile Money').toUpperCase();

    if (tbody) {
        var itemsArr = (target.itemsSummary || '').split(',');
        tbody.innerHTML = itemsArr.map(function(itemStr) {
            var parts = itemStr.trim().split('x');
            var qty = parts[1] || '1';
            var name = parts[0] || itemStr;
            return `<tr><td>${qty}</td><td>${name}</td><td class="text-end">-</td></tr>`;
        }).join('');
    }

    var totalVal = parseFloat(target.total) || 0;
    var taxVal = totalVal * 0.18;
    var subtotalVal = totalVal - taxVal;

    if (subtotalEl) subtotalEl.textContent = formatRWF(subtotalVal);
    if (taxEl) taxEl.textContent = formatRWF(taxVal);
    if (totalEl) totalEl.textContent = formatRWF(totalVal);

    var modal = document.getElementById('receiptModal');
    if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

closeReceiptModal = function() {
    var modal = document.getElementById('receiptModal');
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }
};

function triggerReceiptPrint() {
    window.print();
}


function closeOrderSuccessModal() {
    var modal = document.getElementById('orderSuccessModal');
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }
}

function viewOrderFromSuccess() {
    closeOrderSuccessModal();
    if (lastPlacedOrderId) {
        openTimelineModal(lastPlacedOrderId);
    } else {
        openMyOrdersModal();
    }
}

/* MY ORDERS & TIMELINE CONTROLS */
function openMyOrdersModal(e) {
    if (e && e.preventDefault) e.preventDefault();
    closeAuthModal();
    renderMyOrders();
    var modal = document.getElementById('ordersModal');
    if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

function closeMyOrdersModal() {
    var modal = document.getElementById('ordersModal');
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }
}

function renderMyOrders() {
    loadOrdersFromStorage();
    var container = document.getElementById('myOrdersList');
    if (!container) return;

    if (orders.length === 0) {
        container.innerHTML = `
            <div class="text-center py-4">
                <i class="fas fa-receipt fa-3x text-muted mb-3" style="opacity:0.4;"></i>
                <h5 class="text-muted">No Orders Found</h5>
                <p class="small text-muted">You haven't placed any orders yet.</p>
            </div>
        `;
        return;
    }

    var html = '';
    orders.forEach(function(o) {
        var dateFormatted = new Date(o.date).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        var statusBadgeClass = 'bg-info text-dark';
        if (o.status === 'Completed' || o.status === 'Delivered') statusBadgeClass = 'bg-success';
        else if (o.status === 'Out for Delivery') statusBadgeClass = 'bg-warning text-dark';

        html += `
            <div class="my-order-card" onclick="openTimelineModal('${o.id}')">
                <div class="my-order-head">
                    <span class="order-code">#${o.id}</span>
                    <span class="status-badge badge ${statusBadgeClass}">${o.status}</span>
                </div>
                <div class="my-order-body">
                    <div><strong>Items:</strong> ${o.itemsSummary}</div>
                    <div class="order-date mt-1"><i class="far fa-clock me-1"></i>${dateFormatted}</div>
                </div>
                <div class="my-order-foot">
                    <span class="font-weight-bold" style="color:var(--primary);">${formatRWF(o.total)}</span>
                    <span class="small text-primary font-weight-bold">View Timeline <i class="fas fa-chevron-right ms-1"></i></span>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function openTimelineModal(orderId) {
    closeMyOrdersModal();
    loadOrdersFromStorage();
    var target = orders.find(function(o) { return o.id === orderId; }) || orders[0];

    if (!target) return;

    var codeEl = document.getElementById('timelineOrderCode');
    var badgeEl = document.getElementById('timelineStatusBadge');
    var detailsEl = document.getElementById('timelineDetailsContent');
    var stepperEl = document.getElementById('timelineStepper');

    if (codeEl) codeEl.textContent = 'Order #' + target.id;
    if (badgeEl) {
        badgeEl.textContent = target.status;
        badgeEl.className = 'status-badge badge ' + (target.status === 'Completed' || target.status === 'Delivered' ? 'bg-success' : 'bg-info text-dark');
    }

    if (detailsEl) {
        detailsEl.innerHTML = `
            <div class="d-flex justify-content-between mb-1">
                <strong>Items:</strong> <span>${target.itemsSummary}</span>
            </div>
            <div class="d-flex justify-content-between mb-1">
                <strong>Total Amount:</strong> <strong style="color:var(--primary);">${formatRWF(target.total)}</strong>
            </div>
            <div class="d-flex justify-content-between">
                <strong>Option:</strong> <span class="text-capitalize">${target.serviceType} (${target.address})</span>
            </div>
        `;
    }

    if (stepperEl && target.timeline) {
        stepperEl.innerHTML = target.timeline.map(function(step) {
            var stepClass = step.status || 'pending';
            var icon = stepClass === 'completed' ? '<i class="fas fa-check"></i>' : (stepClass === 'active' ? '<i class="fas fa-utensils"></i>' : '<i class="fas fa-circle"></i>');
            return `
                <div class="timeline-step ${stepClass}">
                    <div class="timeline-icon">${icon}</div>
                    <div class="timeline-content">
                        <h6>${step.label}</h6>
                        <p>${step.desc}</p>
                    </div>
                </div>
            `;
        }).join('');
    }

    var modal = document.getElementById('timelineModal');
    if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

function closeTimelineModal() {
    var modal = document.getElementById('timelineModal');
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }
}


/* MENU DETAIL POPUP MODAL */
var menuPop = document.getElementById('menuPop');
var mpQty = 1;

function updateModalPriceDisplay() {
    var elPrice = document.getElementById('mpPrice');
    if (!elPrice || !currentPopItem) return;

    var totalVal = (currentPopItem.unitPrice || 0) * mpQty;
    var totalOldVal = (currentPopItem.unitOldPrice || 0) * mpQty;

    var formatted = formatRWF(totalVal);
    var formattedOld = totalOldVal > 0 ? formatRWF(totalOldVal) : '';

    elPrice.innerHTML = formatted + (formattedOld ? '<small style="color:#ccc;text-decoration:line-through;margin-left:8px;font-size:1rem;">' + formattedOld + '</small>' : '');
}

function changeMenuPopQty(delta) {
    mpQty += delta;
    if (mpQty < 1) mpQty = 1;
    var elQnum = document.getElementById('mpQnum');
    if (elQnum) elQnum.textContent = mpQty;
    updateModalPriceDisplay();
}
window.changeMenuPopQty = changeMenuPopQty;

function openMenuPop(card) {
    if (!card) return;
    if (!menuPop) menuPop = document.getElementById('menuPop');

    var img = card.getAttribute('data-img') || '';
    var title = card.getAttribute('data-title') || 'Menu Item';
    var cat = card.getAttribute('data-cat') || '';
    var price = card.getAttribute('data-price') || '0';
    var old = card.getAttribute('data-old') || '';

    var rawPrice = parseFloat(String(price).replace(/[^0-9.]/g, '')) || 0;
    var rawOld = old ? (parseFloat(String(old).replace(/[^0-9.]/g, '')) || 0) : 0;

    currentPopItem = { 
        title: title, 
        price: price, 
        unitPrice: rawPrice,
        unitOldPrice: rawOld,
        img: img 
    };

    var rating = parseFloat(card.getAttribute('data-rating')) || 5.0;
    var reviews = card.getAttribute('data-reviews') || '0';
    var cal = card.getAttribute('data-cal') || '0';
    var time = card.getAttribute('data-time') || '0';
    var desc = card.getAttribute('data-desc') || '';
    var tags = card.getAttribute('data-tags') || '';

    var elImg = document.getElementById('mpImg');
    if (elImg) elImg.setAttribute('src', img);

    var elCat = document.getElementById('mpCat');
    if (elCat) elCat.textContent = cat;

    var elTitle = document.getElementById('mpTitle');
    if (elTitle) elTitle.textContent = title;

    var full = Math.round(rating),
        empty = Math.max(0, 5 - full);
    var elStars = document.getElementById('mpStars');
    if (elStars) {
        elStars.innerHTML =
            '<i class="fas fa-star"></i>'.repeat(full) + '<i class="far fa-star"></i>'.repeat(empty) +
            ' <span style="color:#bbb;font-size:.78rem;">' + rating + ' (' + reviews + ' reviews)</span>';
    }

    var elDesc = document.getElementById('mpDesc');
    if (elDesc) elDesc.textContent = desc;

    mpQty = 1;
    updateModalPriceDisplay();

    var elMeta = document.getElementById('mpMeta');
    if (elMeta) {
        elMeta.innerHTML =
            '<div class="mpm"><div class="mpmv">' + cal + ' kcal</div><div class="mpml">Calories</div></div>' +
            '<div class="mpm"><div class="mpmv">' + time + ' min</div><div class="mpml">Prep Time</div></div>' +
            '<div class="mpm"><div class="mpmv">' + rating + '/5</div><div class="mpml">Rating</div></div>';
    }

    var elTags = document.getElementById('mpTags');
    if (elTags) {
        elTags.innerHTML = tags.split(',').filter(Boolean).map(function(t) {
            return '<span class="mptag">' + t.trim() + '</span>';
        }).join('');
    }

    var elQnum = document.getElementById('mpQnum');
    if (elQnum) elQnum.textContent = 1;

    var elAddCart = document.getElementById('mpAddCart');
    if (elAddCart) {
        elAddCart.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart (' + formatRWF(rawPrice * mpQty) + ')';
        elAddCart.style.background = '';
        elAddCart.onclick = function() {
            if (!currentPopItem) return;
            var validImg = (currentPopItem.img && currentPopItem.img !== 'undefined') ? currentPopItem.img : 'img/menu/1.jpg';
            var existing = cart.find(function(i) { return i.title === currentPopItem.title; });
            if (existing) {
                existing.quantity += mpQty;
            } else {
                cart.push({
                    title: currentPopItem.title,
                    price: currentPopItem.unitPrice,
                    img: validImg,
                    quantity: mpQty,
                    subtitle: 'Freshly prepared for your order'
                });
            }
            saveCartToStorage();
            renderCart();
            closeMenuPop();
            showToast('Added ' + mpQty + 'x ' + currentPopItem.title + ' to your cart!', 'success', 'Cart Updated');
        };
    }

    if (menuPop) {
        menuPop.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

function closeMenuPop() {
    if (!menuPop) menuPop = document.getElementById('menuPop');
    if (menuPop) menuPop.classList.remove('open');
    document.body.style.overflow = '';
}

/* GALLERY POPUP */
var galPop = document.getElementById('galPop');
var galData = [];
var galIdx = 0;

function openGal(i) {
    if (!galPop) galPop = document.getElementById('galPop');
    if (!galData.length || !galPop) return;
    galIdx = i;
    var g = galData[i];
    var gpImg = document.getElementById('gpImg');
    var gpTitle = document.getElementById('gpTitle');
    var gpDesc = document.getElementById('gpDesc');
    if (gpImg) gpImg.setAttribute('src', g.img);
    if (gpTitle) gpTitle.textContent = g.title;
    if (gpDesc) gpDesc.innerHTML = g.desc;
    galPop.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeGal() {
    if (!galPop) galPop = document.getElementById('galPop');
    if (galPop) galPop.classList.remove('open');
    document.body.style.overflow = '';
}

function checkUserSessionStatus() {
    var storedUser = null;
    try {
        storedUser = JSON.parse(localStorage.getItem('favcafe_active_user'));
    } catch(e) {}

    var active = currentActiveUser || storedUser;
    var loggedInSection = document.getElementById('mLoggedInSection');
    var loginInputs = document.getElementById('mLoginInputs');
    var nameEl = document.getElementById('mLoggedInName');
    var emailEl = document.getElementById('mLoggedInEmail');
    var subtitle = document.getElementById('mAuthSubtitle');

    if (active && active.name) {
        if (loggedInSection) loggedInSection.style.display = 'block';
        if (loginInputs) loginInputs.style.display = 'none';
        if (nameEl) nameEl.textContent = active.name;
        if (emailEl) emailEl.textContent = active.email || active.phone || 'Active Session';
        if (subtitle) subtitle.textContent = 'Account Profile & Session Active';
    } else {
        if (loggedInSection) loggedInSection.style.display = 'none';
        if (loginInputs) loginInputs.style.display = 'block';
        if (subtitle) subtitle.textContent = 'Customer Sign In & Account Access';
    }
}

function logoutClient() {
    currentActiveUser = null;
    localStorage.removeItem('favcafe_active_user');
    updateNavUserButton(null);
    checkUserSessionStatus();
    if (typeof showToast === 'function') {
        showToast('Signed out successfully.', 'info', 'Signed Out');
    }
}
window.logoutClient = logoutClient;
window.checkUserSessionStatus = checkUserSessionStatus;

/* AUTH & ADMIN PORTAL SCRIPT */
function switchMasharikiTab(tab) {
    var loginBtn = document.getElementById('mTabLoginBtn');
    var regBtn = document.getElementById('mTabRegisterBtn');
    var adminBtn = document.getElementById('mTabAdminBtn');

    var loginForm = document.getElementById('mLoginForm');
    var regForm = document.getElementById('mRegisterForm');
    var adminForm = document.getElementById('mAdminForm');
    var subtitle = document.getElementById('mAuthSubtitle');

    if (loginBtn) { loginBtn.classList.remove('active'); loginBtn.style.background = 'transparent'; loginBtn.style.color = '#64748b'; }
    if (regBtn) { regBtn.classList.remove('active'); regBtn.style.background = 'transparent'; regBtn.style.color = '#64748b'; }
    if (adminBtn) { adminBtn.classList.remove('active'); adminBtn.style.background = 'transparent'; adminBtn.style.color = '#64748b'; }

    if (loginForm) loginForm.style.display = 'none';
    if (regForm) regForm.style.display = 'none';
    if (adminForm) adminForm.style.display = 'none';

    if (tab === 'register') {
        if (regBtn) { regBtn.classList.add('active'); regBtn.style.background = 'var(--dark)'; regBtn.style.color = '#ffffff'; }
        if (regForm) regForm.style.display = 'block';
        if (subtitle) subtitle.textContent = 'Create New Customer Account';
    } else if (tab === 'admin') {
        if (adminBtn) { adminBtn.classList.add('active'); adminBtn.style.background = 'var(--dark)'; adminBtn.style.color = '#ffffff'; }
        if (adminForm) adminForm.style.display = 'block';
        if (subtitle) subtitle.textContent = 'Authorized Staff & Admin Portal';
    } else { // default login
        if (loginBtn) { loginBtn.classList.add('active'); loginBtn.style.background = 'var(--dark)'; loginBtn.style.color = '#ffffff'; }
        if (loginForm) loginForm.style.display = 'block';
        checkUserSessionStatus();
    }
}

function openMasharikiModal(initialTab) {
    var modalEl = document.getElementById('MasharikiAuthModal');
    if (modalEl) {
        modalEl.style.setProperty('display', 'flex', 'important');
        modalEl.style.setProperty('opacity', '1', 'important');
        modalEl.style.setProperty('visibility', 'visible', 'important');
        modalEl.classList.add('open');
        document.body.style.overflow = 'hidden';
        switchMasharikiTab(initialTab || 'login');
    }
}

function closeAuthModal() {
    var modalEl = document.getElementById('MasharikiAuthModal');
    if (modalEl) {
        modalEl.style.setProperty('display', 'none', 'important');
        modalEl.classList.remove('open');
        document.body.style.overflow = '';
    }
}

function toggleAuthPass(inputId, btn) {
    var input = document.getElementById(inputId);
    if (!input) return;
    var icon = btn.querySelector('i');
    if (input.type === 'password') {
        input.type = 'text';
        if (icon) { icon.classList.remove('fa-eye'); icon.classList.add('fa-eye-slash'); }
    } else {
        input.type = 'password';
        if (icon) { icon.classList.remove('fa-eye-slash'); icon.classList.add('fa-eye'); }
    }
}

function openAdminPortal() {
    closeAuthModal();
    var adminPortalModal = document.getElementById('adminPortalModal');
    if (adminPortalModal) {
        adminPortalModal.style.setProperty('display', 'flex', 'important');
        adminPortalModal.classList.add('open');
    }
    document.body.style.overflow = 'hidden';
}

function closeAdminPortal() {
    var adminPortalModal = document.getElementById('adminPortalModal');
    if (adminPortalModal) {
        adminPortalModal.style.setProperty('display', 'none', 'important');
        adminPortalModal.classList.remove('open');
    }
    document.body.style.overflow = '';
}

function handleClientRegister() {
    processClientRegister();
}

function handleClientLogin() {
    processClientLogin();
}

function demoClientLogin() {
    var emailInput = document.getElementById('mClientEmail');
    var passInput = document.getElementById('mClientPass');
    if (emailInput) emailInput.value = 'customer@mashariki.com';
    if (passInput) passInput.value = 'password123';
    showToast('Demo customer credentials pre-filled!', 'info', 'Demo Sign In');
    setTimeout(processClientLogin, 300);
}

function openAdminPortal() {
    closeAuthModal();
    if (typeof showToast === 'function') {
        showToast('Launching Admin Dashboard in a new tab...', 'info', 'Admin Portal');
    }
    setTimeout(function() {
        window.open('admin.html', '_blank');
    }, 300);
}

function handleAdminLogin() {
    openAdminPortal();
}

function demoAdminLogin() {
    var userInput = document.getElementById('mAdminUser');
    var passInput = document.getElementById('mAdminPass');
    if (userInput) userInput.value = 'admin_Mashariki';
    if (passInput) passInput.value = 'admin2026';
    setTimeout(openAdminPortal, 300);
}

function advanceOrderStatus(rowId, newStatus) {
    var row = document.getElementById(rowId);
    if (!row) return;
    var badge = row.querySelector('.status-badge');
    var actionCell = row.cells[5];
    if (badge) {
        if (newStatus === 'Ready for Delivery' || newStatus === 'Ready for Table') {
            badge.className = 'badge bg-info text-dark status-badge';
            badge.textContent = newStatus;
            actionCell.innerHTML = '<button class="btn btn-sm btn-outline-success" onclick="advanceOrderStatus(\'' + rowId + '\', \'Completed\')">Complete Order</button>';
        } else if (newStatus === 'Completed') {
            badge.className = 'badge bg-success status-badge';
            badge.textContent = 'Completed';
            actionCell.innerHTML = '<span class="text-muted small"><i class="fas fa-check-double me-1"></i>Done</span>';
        }
    }
}

function refreshAdminOrders() {
    var btn = document.querySelector('.btn-admin-action');
    if (btn) {
        btn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Refreshing...';
        setTimeout(function() {
            btn.innerHTML = '<i class="fas fa-sync-alt me-1"></i>Refresh';
        }, 600);
    }
}

/* DOM CONTENT LOADED EVENT BINDINGS */
document.addEventListener('DOMContentLoaded', function() {
    // Nav search button
    var navSearchBtn = document.getElementById('navSearchBtn');
    if (navSearchBtn) navSearchBtn.addEventListener('click', openSearch);

    // Nav Auth button (Login / Register Modal)
    var navAuthBtn = document.getElementById('navAuthBtn');
    if (navAuthBtn) {
        navAuthBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openMasharikiModal('login');
        });
    }

    // Search overlay close
    var searchClose = document.getElementById('searchClose');
    if (searchClose) searchClose.addEventListener('click', closeSearch);

    // Search backdrop click
    if (searchOv) {
        searchOv.addEventListener('click', function(e) {
            if (e.target === searchOv) closeSearch();
        });
    }

    // Category buttons inside search
    document.querySelectorAll('.sovcat').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.sovcat').forEach(function(b) { b.classList.remove('active'); });
            this.classList.add('active');
            var f = this.getAttribute('data-cat');
            closeSearch();
            setTimeout(function() {
                filterMenu(f);
                var menuEl = document.getElementById('menu');
                if (menuEl) menuEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
        });
    });

    // Trending tags
    document.querySelectorAll('.sovtrend .ttag').forEach(function(t) {
        t.addEventListener('click', function() {
            var searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.value = this.textContent.trim();
                searchInput.focus();
            }
        });
    });

    // Menu filter buttons
    document.querySelectorAll('.filtbtn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            filterMenu(this.getAttribute('data-f'));
        });
    });

    // Category section cards
    document.querySelectorAll('.catcard').forEach(function(card) {
        card.addEventListener('click', function() {
            var f = this.getAttribute('data-filter');
            var menuEl = document.getElementById('menu');
            if (menuEl) {
                window.scrollTo({ top: menuEl.offsetTop - 80, behavior: 'smooth' });
            }
            setTimeout(function() { filterMenu(f); }, 480);
        });
    });

    // Menu card click -> open popup
    document.querySelectorAll('.mcard').forEach(function(card) {
        card.addEventListener('click', function() {
            openMenuPop(this);
        });
    });

    // Plus button -> open popup
    document.querySelectorAll('.madd').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            openMenuPop(this.closest('.mcard'));
        });
    });

    // Heart toggle
    document.querySelectorAll('.mhrt').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            var ico = this.querySelector('i');
            if (ico) {
                ico.classList.toggle('far');
                ico.classList.toggle('fas');
                this.style.color = ico.classList.contains('fas') ? 'var(--primary)' : '#ccc';
            }
        });
    });

    // Menu Popup Close & Qty
    var mpClose = document.getElementById('mpClose');
    if (mpClose) mpClose.addEventListener('click', closeMenuPop);
    if (menuPop) {
        menuPop.addEventListener('click', function(e) {
            if (e.target === this) closeMenuPop();
        });
    }

    var mpPlus = document.getElementById('mpPlus');
    if (mpPlus) {
        mpPlus.addEventListener('click', function() {
            var mpQnum = document.getElementById('mpQnum');
            mpQty++;
            if (mpQnum) mpQnum.textContent = mpQty;
            updateModalPriceDisplay();
        });
    }

    var mpMinus = document.getElementById('mpMinus');
    if (mpMinus) {
        mpMinus.addEventListener('click', function() {
            var mpQnum = document.getElementById('mpQnum');
            if (mpQty > 1) {
                mpQty--;
                if (mpQnum) mpQnum.textContent = mpQty;
                updateModalPriceDisplay();
            }
        });
    }

    var mpAddCart = document.getElementById('mpAddCart');
    if (mpAddCart) {
        mpAddCart.addEventListener('click', function() {
            if (currentPopItem) {
                addToCart(currentPopItem.title, currentPopItem.unitPrice || currentPopItem.price, currentPopItem.img, mpQty);
            }
            this.innerHTML = '<i class="fas fa-check"></i> Added to Cart!';
            this.style.background = 'linear-gradient(135deg,var(--green),#1a4a35)';
            var self = this;
            setTimeout(function() {
                closeMenuPop();
                self.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
                self.style.background = '';
            }, 800);
        });
    }

    // Initialize cart, orders, user db & dynamic menu from storage
    loadCartFromStorage();
    renderCart();
    loadOrdersFromStorage();
    loadRegisteredUsers();
    loadDynamicCategories();
    loadDynamicCustomerMenu();

    // Reservation button
    var resBtn = document.getElementById('resBtn');
    if (resBtn) {
        resBtn.addEventListener('click', function() {
            var btn = this;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';
            btn.disabled = true;
            setTimeout(function() {
                btn.innerHTML = '<i class="fas fa-calendar-check"></i> Confirm Reservation';
                btn.disabled = false;
                showToast('Your reservation request has been received!', 'success', 'Table Booked');
                var ok = document.getElementById('resOk');
                if (ok) {
                    ok.style.display = 'block';
                    ok.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }, 1500);
        });
    }

    // Contact button
    var ctcBtn = document.getElementById('ctcBtn');
    if (ctcBtn) {
        ctcBtn.addEventListener('click', function() {
            var btn = this;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            btn.disabled = true;
            setTimeout(function() {
                btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
                btn.disabled = false;
                showToast('Thank you! Your message has been sent to our team.', 'success', 'Message Sent');
                var ok = document.getElementById('ctcOk');
                if (ok) {
                    ok.style.display = 'block';
                    ok.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }, 1500);
        });
    }

    // Gallery items
    galData = [];
    document.querySelectorAll('.gitem').forEach(function(item) {
        galData.push({
            img: item.getAttribute('data-gimg'),
            title: item.getAttribute('data-gtitle'),
            desc: item.getAttribute('data-gdesc')
        });
        item.addEventListener('click', function() {
            openGal(parseInt(this.getAttribute('data-gi')));
        });
    });

    var gpClose = document.getElementById('gpClose');
    if (gpClose) gpClose.addEventListener('click', closeGal);
    if (galPop) {
        galPop.addEventListener('click', function(e) {
            if (e.target === this) closeGal();
        });
    }

    var gpPrev = document.getElementById('gpPrev');
    if (gpPrev) {
        gpPrev.addEventListener('click', function() {
            if (galData.length) openGal((galIdx - 1 + galData.length) % galData.length);
        });
    }
    var gpNext = document.getElementById('gpNext');
    if (gpNext) {
        gpNext.addEventListener('click', function() {
            if (galData.length) openGal((galIdx + 1) % galData.length);
        });
    }

    // Admin portal close button & backdrop
    var adminPortalClose = document.getElementById('adminPortalClose');
    if (adminPortalClose) adminPortalClose.addEventListener('click', closeAdminPortal);
    var adminPortalModal = document.getElementById('adminPortalModal');
    if (adminPortalModal) {
        adminPortalModal.addEventListener('click', function(e) {
            if (e.target === this) closeAdminPortal();
        });
    }

    // Auth modal backdrop click
    var MasharikiAuthModal = document.getElementById('MasharikiAuthModal');
    if (MasharikiAuthModal) {
        MasharikiAuthModal.addEventListener('click', function(e) {
            if (e.target === this) closeAuthModal();
        });
    }
});

/* ESC key closes everything */
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeSearch();
        closeMenuPop();
        closeGal();
        closeAuthModal();
        closeAdminPortal();
        closeCartDrawer();
        closeCheckoutModal();
        closeOrderSuccessModal();
        closeMyOrdersModal();
        closeTimelineModal();
        if (typeof $ !== 'undefined' && typeof $.magnificPopup !== 'undefined') {
            $.magnificPopup.close();
        }
    }
});

/* DYNAMIC CUSTOMER MENU RENDERER */
async function loadDynamicCustomerMenu(isManualRefresh) {
    var menuGrid = document.querySelector('#menu .row.g-4');
    var statusEl = document.getElementById('menuLoadingStatus');
    if (!menuGrid) return;

    if (statusEl) {
        statusEl.innerHTML = `
            <div class="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill shadow-sm" style="background:var(--cream2); border:1px solid rgba(170,114,98,0.3); font-size:0.83rem; color:var(--dark);">
                <i class="fas fa-spinner fa-spin" style="color:var(--primary);"></i>
                <span>Fetching live menu items...</span>
            </div>
        `;
    }

    var menuItems = [];
    var isDbSource = false;

    // 1. Read localStorage for instant 0ms render
    var localItems = [];
    try {
        var stored = localStorage.getItem('favcafe_menu');
        if (stored) {
            var parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
                localItems = parsed;
            }
        }
    } catch(e) {}

    // Render localItems immediately (0ms latency, zero flicker!)
    if (localItems.length > 0) {
        renderCustomerMenuItems(localItems);
    }

    // 2. Query live Database API (with cache buster and no-store in background)
    try {
        var res = await fetch('api/menu.php?action=get&t=' + Date.now(), { cache: 'no-store' });
        if (res.ok) {
            var data = await res.json();
            if (data && data.status === 'success' && Array.isArray(data.items) && data.items.length > 0) {
                menuItems = data.items;
                isDbSource = true;
            }
        }
    } catch (e) {}

    // 3. Overlay local admin edits if DB loaded
    if (localItems.length > 0) {
        if (menuItems.length === 0) {
            menuItems = localItems;
        } else {
            localItems.forEach(function(loc) {
                if (!loc || !loc.id) return;
                var idx = menuItems.findIndex(function(m) { return parseInt(m.id) === parseInt(loc.id); });
                if (idx !== -1) {
                    menuItems[idx] = loc;
                } else {
                    menuItems.unshift(loc);
                }
            });
        }
    }

    // 4. Fallback to static menu.json if both DB and localStorage are empty
    if (menuItems.length === 0) {
        try {
            var resJson = await fetch('api/menu.json?t=' + Date.now(), { cache: 'no-store' });
            if (resJson.ok) {
                var jsonItems = await resJson.json();
                if (Array.isArray(jsonItems) && jsonItems.length > 0) {
                    menuItems = jsonItems;
                }
            }
        } catch (e) {}
    }

    if (!menuItems || menuItems.length === 0) {
        menuItems = [
            { id: 11, title: 'Special Favorite Omelette', category: 'mains', price: 4500, old_price: 5500, image: 'img/menu/dish_1785231158_5216.jpg', rating: 5.0, reviews_count: 140, calories: 420, prep_time: 12, description: 'Signature fluffy omelette with herbs, cheese, onions, peppers and fresh parsley.', tags: 'Breakfast,Special', is_available: 1 },
            { id: 12, title: 'Chicken Strips & Chips', category: 'mains', price: 6000, old_price: 7500, image: 'img/menu/dish_1785231176_2795.jpg', rating: 4.9, reviews_count: 115, calories: 650, prep_time: 15, description: 'Golden crispy chicken tenders served with crispy french fries and dip.', tags: 'Crispy,Bestseller', is_available: 1 },
            { id: 13, title: 'Crispy Fried Chicken', category: 'mains', price: 6500, old_price: 8000, image: 'img/menu/3.jpg', rating: 5.0, reviews_count: 180, calories: 680, prep_time: 18, description: 'Juicy seasoned chicken fried to a golden crunch.', tags: 'Chicken,Hot', is_available: 1 },
            { id: 14, title: 'Chicken & Rice', category: 'mains', price: 6000, old_price: 7500, image: 'img/menu/dish_1785231327_9665.jpg', rating: 4.8, reviews_count: 92, calories: 580, prep_time: 15, description: 'Roasted chicken leg served with fluffy white rice, fresh cucumber and sauce.', tags: 'Main,Dinner', is_available: 1 },
            { id: 15, title: 'Jollof Rice & Chicken', category: 'mains', price: 7000, old_price: 8500, image: 'img/menu/dish_1785237079_2394.jpg', rating: 5.0, reviews_count: 210, calories: 720, prep_time: 20, description: 'Flavorful West African spiced jollof rice served with grilled chicken and plantain.', tags: 'Special,Spicy', is_available: 1 },
            { id: 16, title: 'Burger & Chips', category: 'mains', price: 6000, old_price: 7500, image: 'img/menu/dish_1785237288_3313.jpg', rating: 4.9, reviews_count: 165, calories: 780, prep_time: 15, description: 'Juicy beef burger with cheese, lettuce, tomatoes, served with fries and cold drink.', tags: 'Burger,Combo', is_available: 1 }
        ];
    }

    renderCustomerMenuItems(menuItems);

    // Re-apply currently active filter if present
    var activeBtn = document.querySelector('#categoryFilterBar .filtbtn.active');
    if (activeBtn) {
        var activeFilter = activeBtn.getAttribute('data-f');
        if (activeFilter && activeFilter !== 'all') {
            filterMenu(activeFilter);
        }
    }

    // Update live loading status bar & toast notifications
    var statusEl = document.getElementById('menuLoadingStatus');
    var availCount = menuItems.filter(function(i) { return parseInt(i.is_available) === 1 || i.is_available === true; }).length;
    if (statusEl) {
        if (isDbSource) {
            statusEl.innerHTML = `
                <div class="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill shadow-sm" style="background:#e8f5e9; border:1px solid #a5d6a7; font-size:0.83rem; color:#1b5e20;">
                    <i class="fas fa-database text-success me-1"></i>
                    <span>Live Database Menu Loaded (${availCount} items)</span>
                    <button type="button" class="btn btn-sm btn-light border py-0 px-2 ms-2" onclick="loadDynamicCustomerMenu(true)" title="Refresh Menu Now" style="font-size:0.75rem; border-radius:12px;">
                        <i class="fas fa-sync-alt text-muted me-1"></i>Refresh
                    </button>
                </div>
            `;
        } else {
            statusEl.innerHTML = `
                <div class="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill shadow-sm" style="background:#e3f2fd; border:1px solid #90caf9; font-size:0.83rem; color:#0d47a1;">
                    <i class="fas fa-check-circle text-primary me-1"></i>
                    <span>Favorite Cafe Standard Menu Loaded (${availCount} items)</span>
                    <button type="button" class="btn btn-sm btn-light border py-0 px-2 ms-2" onclick="loadDynamicCustomerMenu(true)" title="Refresh Menu Now" style="font-size:0.75rem; border-radius:12px;">
                        <i class="fas fa-sync-alt text-primary me-1"></i>Refresh
                    </button>
                </div>
            `;
        }
    }

    if (isManualRefresh && typeof showToast === 'function') {
        showToast('Menu data refreshed live! (' + availCount + ' items updated)', 'success', 'Menu Refreshed');
    }
}

function renderCustomerMenuItems(menuItems) {
    var menuGrid = document.getElementById('mgrid');
    if (!menuGrid || !Array.isArray(menuItems)) return;

    var available = menuItems.filter(function(i) { return parseInt(i.is_available) === 1 || i.is_available === true; });
    if (available.length === 0) return;

    var html = '';
    available.forEach(function(item, idx) {
        if (!item) return;
        var itemTitle = item.title || item.name || 'Special Dish';
        var itemImage = (item.image && item.image !== 'undefined') ? item.image : ((item.img && item.img !== 'undefined') ? item.img : 'img/menu/1.jpg');
        var itemCategory = (item.category || 'mains').toString().toLowerCase();
        var catUpper = itemCategory.charAt(0).toUpperCase() + itemCategory.slice(1);
        var priceFormatted = formatRWF(item.price);
        var oldPriceFormatted = item.old_price ? formatRWF(item.old_price) : '';
        var firstTag = item.tags ? String(item.tags).split(',')[0].trim() : '';

        var aosDelay = (idx % 3) * 80;

        html += `
            <div class="col-sm-6 col-lg-4 mwrap" data-c="${itemCategory}" data-aos="fade-up" ${aosDelay > 0 ? `data-aos-delay="${aosDelay}"` : ''}>
                <div class="mcard" onclick="openMenuPop(this)" data-img="${itemImage}" data-title="${itemTitle}" data-cat="${catUpper}" data-price="${priceFormatted}" data-old="${oldPriceFormatted}" data-rating="${item.rating || 5.0}" data-reviews="${item.reviews_count || 42}" data-cal="${item.calories || 350}" data-time="${item.prep_time || 15}" data-desc="${item.description || ''}" data-tags="${item.tags || ''}">
                    <div class="mimg">
                        <img src="${itemImage}" alt="${itemTitle}" onerror="this.onerror=null; this.src='img/menu/1.jpg';">
                        ${firstTag ? `<div class="mbdg hot"><i class="fas fa-star"></i> ${firstTag}</div>` : ''}
                        <div class="mhrt"><i class="far fa-heart"></i></div>
                    </div>
                    <div class="mbody">
                        <div class="mcat">${catUpper}</div>
                        <div class="mtit">${itemTitle}</div>
                        <div class="mdesc">${item.description || ''}</div>
                        <div class="mfoot">
                            <div>
                                <div class="mprice">${priceFormatted} ${oldPriceFormatted ? `<small class="text-muted text-decoration-line-through ms-1">${oldPriceFormatted}</small>` : ''}</div>
                                <div class="mstars"><i class="fas fa-star"></i> <span style="color:#bbb;font-size:.7rem;">${item.rating || 5.0}</span></div>
                            </div>
                            <button type="button" class="madd" title="View Details" onclick="event.stopPropagation(); openMenuPop(this.closest('.mcard'))"><i class="fas fa-plus"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    menuGrid.innerHTML = html;

    // Rebind menu popup & button click listeners
    document.querySelectorAll('#menu .mcard').forEach(function(card) {
        card.addEventListener('click', function() {
            openMenuPop(this);
        });
    });
    document.querySelectorAll('#menu .madd').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            openMenuPop(this.closest('.mcard'));
        });
    });
    document.querySelectorAll('#menu .mhrt').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            var ico = this.querySelector('i');
            if (ico) {
                ico.classList.toggle('far');
                ico.classList.toggle('fas');
                this.style.color = ico.classList.contains('fas') ? 'var(--primary)' : '#ccc';
            }
        });
    });
}

async function loadDynamicCategories() {
    var bar = document.getElementById('categoryFilterBar');
    if (!bar) return;

    var categories = [];
    try {
        var res = await fetch('api/categories.php?action=get&active_only=1');
        if (res.ok) {
            var data = await res.json();
            if (data && data.status === 'success' && Array.isArray(data.categories)) {
                categories = data.categories;
            }
        }
    } catch (e) {}

    if (categories.length === 0) {
        try {
            var stored = localStorage.getItem('favcafe_categories');
            if (stored) {
                var parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    categories = parsed.filter(function(c) { return parseInt(c.is_active) === 1 || c.is_active === true; });
                }
            }
        } catch (e) {}
    }

    if (!categories || categories.length === 0) return;

    var html = '<button class="filtbtn active" data-f="all">All</button>';
    categories.forEach(function(cat) {
        html += `<button class="filtbtn" data-f="${cat.slug}">${cat.name}</button>`;
    });

    bar.innerHTML = html;

    // Rebind filter buttons
    bar.querySelectorAll('.filtbtn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.querySelectorAll('#categoryFilterBar .filtbtn').forEach(function(b) { b.classList.remove('active'); });
            this.classList.add('active');
            filterMenu(this.getAttribute('data-f'));
        });
    });
}

/* EXPLICIT WINDOW SCOPE BINDINGS */
window.showToast = showToast;
window.processClientRegister = processClientRegister;
window.processClientLogin = processClientLogin;
window.openSearch = openSearch;
window.closeSearch = closeSearch;
window.openMenuPop = openMenuPop;
window.closeMenuPop = closeMenuPop;
window.openGal = openGal;
window.closeGal = closeGal;
window.filterMenu = filterMenu;
window.openMasharikiModal = openMasharikiModal;
window.switchMasharikiTab = switchMasharikiTab;
window.closeAuthModal = closeAuthModal;
window.openAdminPortal = openAdminPortal;
window.closeAdminPortal = closeAdminPortal;
window.handleClientLogin = handleClientLogin;
window.handleClientRegister = handleClientRegister;
window.toggleAuthPass = toggleAuthPass;
window.demoClientLogin = demoClientLogin;
window.handleAdminLogin = handleAdminLogin;
window.demoAdminLogin = demoAdminLogin;
window.advanceOrderStatus = advanceOrderStatus;
window.refreshAdminOrders = refreshAdminOrders;
window.openCartDrawer = openCartDrawer;
window.closeCartDrawer = closeCartDrawer;
window.openCheckoutModal = openCheckoutModal;
window.closeCheckoutModal = closeCheckoutModal;
window.selectServiceType = selectServiceType;
window.selectPaymentMethod = selectPaymentMethod;
window.handleOrderSubmission = handleOrderSubmission;
window.closeOrderSuccessModal = closeOrderSuccessModal;
window.viewOrderFromSuccess = viewOrderFromSuccess;
window.openMyOrdersModal = openMyOrdersModal;
window.closeMyOrdersModal = closeMyOrdersModal;
window.openTimelineModal = openTimelineModal;
window.closeTimelineModal = closeTimelineModal;
window.addToCart = addToCart;
window.changeCartQty = changeCartQty;
window.removeCartItem = removeCartItem;
window.loadDynamicCustomerMenu = loadDynamicCustomerMenu;
window.addExtraToCart = addExtraToCart;
window.applyPromoCode = applyPromoCode;
window.openReservationModal = openReservationModal;
window.closeReservationModal = closeReservationModal;
window.handleReservationSubmit = handleReservationSubmit;
window.closeReservationSuccessModal = closeReservationSuccessModal;
window.triggerReceiptPrint = triggerReceiptPrint;
window.selectMomoOperator = selectMomoOperator;
window.pressPinDigit = pressPinDigit;
window.clearPinDigits = clearPinDigits;
window.logNotification = logNotification;
window.openNotificationLogModal = openNotificationLogModal;
window.closeNotificationLogModal = closeNotificationLogModal;
window.filterNotificationLogs = filterNotificationLogs;
window.clearNotificationLogs = clearNotificationLogs;

function sendDemoTestNotification() {
    var types = ['sms', 'email', 'alert'];
    var randomType = types[Math.floor(Math.random() * types.length)];
    var phones = ['+250 788 123 456', '+250 788 700 870', '+250 733 999 888'];
    var phone = phones[Math.floor(Math.random() * phones.length)];
    var ref = 'MSH-' + Math.floor(1000 + Math.random() * 9000);

    if (randomType === 'sms') {
        logNotification('sms', phone, 'Favorite Cafe SMS: Order #' + ref + ' has been dispatched via express delivery rider!', 'SMS Dispatch Alert');
    } else if (randomType === 'email') {
        logNotification('email', 'customer@mashariki.com', 'Favorite Cafe E-Ticket: Table Reservation #' + ref + ' is confirmed for 08:00 PM.', 'Email Booking Ticket');
    } else {
        logNotification('alert', 'Kitchen Operations', 'Kitchen Dispatch Alert: Order #' + ref + ' priority marked as HIGH VIP!', 'Kitchen VIP Alert');
    }

    renderNotificationLogs('all');
    if (typeof showToast === 'function') {
        showToast('New test notification logged!', 'success', 'Notification Logged');
    }
}
window.sendDemoTestNotification = sendDemoTestNotification;

/* LIVE BROADCAST & STORAGE LISTENERS FOR INSTANT ADMIN UPDATES */
var _lastMenuToastTime = 0;
function handleLiveMenuUpdateSignal() {
    loadDynamicCustomerMenu(false);
    var now = Date.now();
    if (now - _lastMenuToastTime > 2500) {
        _lastMenuToastTime = now;
        if (typeof showToast === 'function') {
            showToast('Front-end menu updated live from Admin Panel!', 'info', 'Menu Updated Live');
        }
    }
}

window.addEventListener('storage', function(e) {
    if (e.key === 'favcafe_menu' || e.key === 'favcafe_menu_timestamp') {
        handleLiveMenuUpdateSignal();
    }
});

try {
    var menuChannel = new BroadcastChannel('favcafe_menu_channel');
    menuChannel.onmessage = function(event) {
        if (event.data && event.data.type === 'menu_updated') {
            handleLiveMenuUpdateSignal();
        }
    };
} catch(e) {}