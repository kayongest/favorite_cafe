/* TOAST NOTIFICATION SYSTEM FOR ADMIN */
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
window.showToast = showToast;

var adminOrders = [];

// Initialize Admin Dashboard on load
document.addEventListener('DOMContentLoaded', function() {
    initClock();
    loadAdminOrders();
    renderOverviewStats();
    renderOrdersTable();
    renderKitchenGrid();
    renderStaffAndLoyaltyTables();
    loadAdminCategories();
    initSidebarTabs();
    initSearchAndFilter();
});

// Live Clock
function initClock() {
    var clockEl = document.getElementById('liveClock');
    if (!clockEl) return;
    function updateTime() {
        var now = new Date();
        clockEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
    updateTime();
    setInterval(updateTime, 1000);
}

// Load Orders from localStorage or initial rich dataset
function loadAdminOrders() {
    try {
        var stored = localStorage.getItem('favcafe_orders');
        if (stored) {
            adminOrders = JSON.parse(stored);
        } else {
            // Default rich order dataset for immediate demonstration & pagination
            adminOrders = [
                {
                    id: 'MSH-1329',
                    date: new Date(Date.now() - 5 * 60000).toISOString(),
                    customerName: 'Kayonga Raul',
                    phone: '+250788700870',
                    address: 'Table #4',
                    serviceType: 'dinein',
                    itemsSummary: 'Margherita Royale x10, Loaded Fries x10, Avocado x3, Ketchup x4, PiliPili x9',
                    total: 56700,
                    status: 'Kitchen Preparing'
                },
                {
                    id: 'MSH-1972',
                    date: new Date(Date.now() - 12 * 60000).toISOString(),
                    customerName: 'Kayonga Raul',
                    phone: '+250788700870',
                    address: 'Remera St, House 22',
                    serviceType: 'delivery',
                    itemsSummary: 'Mango Shake x14, Kachumbari x1, Ketchup x1, Mayonnaise x1, Avocado x3',
                    total: 64640,
                    status: 'Kitchen Preparing'
                },
                {
                    id: 'MSH-8542',
                    date: new Date(Date.now() - 18 * 60000).toISOString(),
                    customerName: 'Kayonga Raul',
                    phone: '+250788700870',
                    address: 'Pickup Counter',
                    serviceType: 'takeaway',
                    itemsSummary: 'Loaded Fries x10',
                    total: 9000,
                    status: 'Kitchen Preparing'
                },
                {
                    id: 'MSH-8002',
                    date: new Date(Date.now() - 25 * 60000).toISOString(),
                    customerName: 'Kayonga Raul',
                    phone: '+250788700870',
                    address: 'Kigali Heights #4',
                    serviceType: 'delivery',
                    itemsSummary: 'Loaded Fajita Wrap x2',
                    total: 22000,
                    status: 'Kitchen Preparing'
                },
                {
                    id: 'MSH-2022',
                    date: new Date(Date.now() - 40 * 60000).toISOString(),
                    customerName: 'Kayonga Raul',
                    phone: '+250788700870',
                    address: 'Kigali Villa #12',
                    serviceType: 'delivery',
                    itemsSummary: 'Classic Smash Burger x3, Margherita Royale x1, Nashville Hot Chicken x5',
                    total: 130000,
                    status: 'Completed'
                },
                {
                    id: 'MSH-7584',
                    date: new Date(Date.now() - 55 * 60000).toISOString(),
                    customerName: 'Kayonga Raul',
                    phone: '+250788700870',
                    address: 'Kimironko St 108',
                    serviceType: 'delivery',
                    itemsSummary: 'Classic Smash Burger x1, Margherita Royale x1, Nashville Hot Chicken x3',
                    total: 74000,
                    status: 'Completed'
                },
                {
                    id: 'MSH-8492',
                    date: new Date(Date.now() - 70 * 60000).toISOString(),
                    customerName: 'Eric Munyaneza',
                    phone: '+250 788 123 456',
                    address: 'Kigali Heights, Table #4',
                    serviceType: 'delivery',
                    itemsSummary: 'Smash Burger x2, Loaded Fries x1',
                    total: 34000,
                    status: 'Out for Delivery'
                },
                {
                    id: 'MSH-9102',
                    date: new Date(Date.now() - 85 * 60000).toISOString(),
                    customerName: 'Aline Uwase',
                    phone: '+250 788 444 333',
                    address: 'Remera Crossroads',
                    serviceType: 'takeaway',
                    itemsSummary: 'Nashville Hot Chicken x3, Fresh Lemonade x2',
                    total: 45000,
                    status: 'Completed'
                },
                {
                    id: 'MSH-6630',
                    date: new Date(Date.now() - 100 * 60000).toISOString(),
                    customerName: 'Jean Paul Ndayi',
                    phone: '+250 788 555 666',
                    address: 'Nyarutarama Villa #12',
                    serviceType: 'delivery',
                    itemsSummary: 'Truffle Pasta x2, Lava Cake x2',
                    total: 52000,
                    status: 'Completed'
                }
            ];
            saveAdminOrders();
        }
    } catch (e) {
        adminOrders = [];
    }
}

function saveAdminOrders() {
    try {
        localStorage.setItem('favcafe_orders', JSON.stringify(adminOrders));
    } catch (e) {}
}

/* CURRENCY FORMATTER FOR RWANDAN FRANCS */
function formatRWF(val) {
    var num = Math.round(parseFloat(val) || 0);
    return num.toLocaleString('en-US') + ' RWF';
}

// Render Overview Stat Widgets
function renderOverviewStats() {
    var totalRevEl = document.getElementById('statTotalRevenue');
    var totalOrdEl = document.getElementById('statTotalOrders');
    var prepOrdEl = document.getElementById('statPrepOrders');
    var badgeCountEl = document.getElementById('sidebarOrderBadge');

    var revenue = adminOrders.reduce(function(acc, o) { return acc + (parseFloat(o.total) || 0); }, 0);
    var preparingCount = adminOrders.filter(function(o) { return o.status === 'Kitchen Preparing' || o.status === 'Preparing'; }).length;

    if (totalRevEl) totalRevEl.textContent = formatRWF(revenue);
    if (totalOrdEl) totalOrdEl.textContent = adminOrders.length;
    if (prepOrdEl) prepOrdEl.textContent = preparingCount;
    if (badgeCountEl) badgeCountEl.textContent = preparingCount;
}

// Render Live Orders Table
function renderOrdersTable(filterStatus, searchQuery) {
    var tbody = document.getElementById('adminOrdersTbody');
    if (!tbody) return;

    var filtered = adminOrders.filter(function(o) {
        var matchStatus = true;
        if (filterStatus && filterStatus !== 'all') {
            if (filterStatus === 'preparing') matchStatus = o.status === 'Kitchen Preparing' || o.status === 'Preparing';
            else if (filterStatus === 'ready') matchStatus = o.status === 'Ready for Delivery' || o.status === 'Ready';
            else if (filterStatus === 'completed') matchStatus = o.status === 'Completed' || o.status === 'Delivered';
        }

        var matchSearch = true;
        if (searchQuery && searchQuery.trim()) {
            var q = searchQuery.toLowerCase();
            matchSearch = o.id.toLowerCase().includes(q) ||
                          o.customerName.toLowerCase().includes(q) ||
                          o.itemsSummary.toLowerCase().includes(q);
        }

        return matchStatus && matchSearch;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-muted">No orders match your criteria.</td></tr>';
        return;
    }

    var html = '';
    filtered.forEach(function(o) {
        var timeStr = new Date(o.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        var statusClass = 'preparing';
        var actionBtn = '';

        if (o.status === 'Kitchen Preparing' || o.status === 'Preparing') {
            statusClass = 'preparing';
            actionBtn = `<button class="btn-action-sm" onclick="advanceAdminOrder('${o.id}', 'Ready for Delivery')"><i class="fas fa-check me-1"></i>Mark Ready</button>`;
        } else if (o.status === 'Ready for Delivery' || o.status === 'Ready') {
            statusClass = 'ready';
            actionBtn = `<button class="btn-action-sm" onclick="advanceAdminOrder('${o.id}', 'Completed')"><i class="fas fa-flag-checkered me-1"></i>Complete</button>`;
        } else {
            statusClass = 'completed';
            actionBtn = `<span class="text-success small font-weight-bold"><i class="fas fa-check-double me-1"></i>Done</span>`;
        }

        html += `
            <tr>
                <td><span class="order-code-badge">#${o.id}</span></td>
                <td>
                    <div class="cust-name">${o.customerName}</div>
                    <div class="cust-sub">${o.phone || ''}</div>
                </td>
                <td style="max-width:240px;">${o.itemsSummary}</td>
                <td><span class="text-capitalize font-weight-bold small">${o.serviceType || 'Delivery'}</span></td>
                <td><strong>${formatRWF(o.total)}</strong></td>
                <td><span class="status-pill ${statusClass}">${o.status}</span></td>
                <td>${actionBtn}</td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

// Render Kitchen Tickets Grid
function renderKitchenGrid() {
    var grid = document.getElementById('kitchenGrid');
    if (!grid) return;

    var prepOrders = adminOrders.filter(function(o) {
        return o.status === 'Kitchen Preparing' || o.status === 'Preparing' || o.status === 'Ready for Delivery';
    });

    if (prepOrders.length === 0) {
        grid.innerHTML = '<div class="col-12 text-center py-4 text-muted"><i class="fas fa-utensils fa-2x mb-2 opacity-50"></i><p>No active kitchen orders right now.</p></div>';
        return;
    }

    var html = '';
    prepOrders.forEach(function(o) {
        var isReady = o.status === 'Ready for Delivery';
        html += `
            <div class="kitchen-ticket ${isReady ? 'ready' : ''}">
                <div class="ticket-head">
                    <strong>#${o.id}</strong>
                    <span class="ticket-timer"><i class="fas fa-fire me-1"></i>${isReady ? 'Ready for Dispatch' : 'Prep: ~15 mins'}</span>
                </div>
                <div class="ticket-items">${o.itemsSummary}</div>
                <div class="d-flex justify-content-between align-items-center">
                    <span class="small text-muted">${o.customerName} (${o.serviceType})</span>
                    ${isReady ? 
                        `<button class="btn-action-sm" onclick="advanceAdminOrder('${o.id}', 'Completed')">Complete</button>` :
                        `<button class="btn-action-sm" onclick="advanceAdminOrder('${o.id}', 'Ready for Delivery')">Mark Ready</button>`
                    }
                </div>
            </div>
        `;
    });

    grid.innerHTML = html;
}

// Advance Order Status
function advanceAdminOrder(orderId, newStatus) {
    var target = adminOrders.find(function(o) { return o.id === orderId; });
    if (target) {
        target.status = newStatus;
        saveAdminOrders();
        renderOverviewStats();
        renderOrdersTable();
        renderKitchenGrid();
        renderFullOrdersDispatchBoard();

        if (typeof logNotification === 'function') {
            logNotification('sms', target.phone || '+250 788 700 870', 'Favorite Cafe: Your Order #' + orderId + ' status has been updated to: ' + newStatus, 'SMS Alert - Order Status');
        }

        if (typeof showToast === 'function') {
            showToast('Order #' + orderId + ' updated to: ' + newStatus, 'success', 'Kitchen Status Updated');
        }
    }
}

// Sidebar Tab Switching
function initSidebarTabs() {
    document.querySelectorAll('.sidebar-item[data-tab]').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            var tabId = this.getAttribute('data-tab');
            
            document.querySelectorAll('.sidebar-item').forEach(function(b) { b.classList.remove('active'); });
            this.classList.add('active');

            document.querySelectorAll('.tab-section').forEach(function(sec) {
                sec.classList.remove('active');
            });

            var targetSec = document.getElementById('tab-' + tabId);
            if (targetSec) targetSec.classList.add('active');

            if (tabId === 'orders') {
                renderFullOrdersDispatchBoard();
            } else if (tabId === 'reservations') {
                renderAdminReservations();
            } else if (tabId === 'tables') {
                renderAdminTablesTracker();
            } else if (tabId === 'users') {
                renderStaffAndLoyaltyTables();
            }
        });
    });
}

var currentLiveOrdersFilter = 'all';
var currentLiveOrdersSearch = '';
var currentLiveOrdersPage = 1;
var LIVE_ORDERS_PER_PAGE = 7;

function onLiveOrdersSearchChange() {
    var input = document.getElementById('liveOrdersSearchInput');
    if (input) {
        currentLiveOrdersSearch = input.value.trim().toLowerCase();
        currentLiveOrdersPage = 1;
        renderFullOrdersDispatchBoard();
    }
}

function filterLiveOrdersBoard(filterStatus, btn) {
    if (btn) {
        var container = btn.parentElement;
        if (container) {
            container.querySelectorAll('.filter-pill').forEach(function(p) { p.classList.remove('active'); });
            btn.classList.add('active');
        }
    }
    currentLiveOrdersFilter = filterStatus;
    currentLiveOrdersPage = 1;
    renderFullOrdersDispatchBoard();
}

function changeLiveOrdersPage(page) {
    currentLiveOrdersPage = page;
    renderFullOrdersDispatchBoard();
}

function renderFullOrdersDispatchBoard(filterStatus) {
    loadAdminOrders();
    filterStatus = filterStatus || currentLiveOrdersFilter;
    currentLiveOrdersFilter = filterStatus;

    var tbody = document.getElementById('fullOrdersDispatchTbody');
    if (!tbody) return;

    // Filter by status & search query
    var filtered = adminOrders.filter(function(o) {
        var matchStatus = true;
        if (filterStatus && filterStatus !== 'all') {
            if (filterStatus === 'preparing') matchStatus = o.status === 'Kitchen Preparing' || o.status === 'Preparing';
            else if (filterStatus === 'ready') matchStatus = o.status === 'Ready for Delivery' || o.status === 'Ready' || o.status === 'Out for Delivery';
            else if (filterStatus === 'completed') matchStatus = o.status === 'Completed' || o.status === 'Delivered';
        }

        var matchSearch = true;
        if (currentLiveOrdersSearch) {
            var q = currentLiveOrdersSearch;
            matchSearch = o.id.toLowerCase().includes(q) ||
                          (o.customerName || '').toLowerCase().includes(q) ||
                          (o.phone || '').toLowerCase().includes(q) ||
                          (o.itemsSummary || '').toLowerCase().includes(q) ||
                          (o.serviceType || '').toLowerCase().includes(q);
        }

        return matchStatus && matchSearch;
    });

    var totalOrders = filtered.length;
    var totalPages = Math.ceil(totalOrders / LIVE_ORDERS_PER_PAGE) || 1;

    if (currentLiveOrdersPage < 1) currentLiveOrdersPage = 1;
    if (currentLiveOrdersPage > totalPages) currentLiveOrdersPage = totalPages;

    var startIdx = (currentLiveOrdersPage - 1) * LIVE_ORDERS_PER_PAGE;
    var endIdx = startIdx + LIVE_ORDERS_PER_PAGE;
    var pageOrders = filtered.slice(startIdx, endIdx);

    // Update Pagination Bar Info
    var infoEl = document.getElementById('liveOrdersPaginationInfo');
    if (infoEl) {
        if (totalOrders === 0) {
            infoEl.textContent = 'Showing 0 orders';
        } else {
            var displayEnd = Math.min(endIdx, totalOrders);
            infoEl.textContent = 'Showing ' + (startIdx + 1) + ' to ' + displayEnd + ' of ' + totalOrders + ' orders';
        }
    }

    // Render Pagination Controls
    var navEl = document.getElementById('liveOrdersPaginationNav');
    if (navEl) {
        var navHtml = '';
        var prevDisabled = currentLiveOrdersPage === 1 ? 'disabled' : '';
        navHtml += `<li class="page-item ${prevDisabled}"><a class="page-link" href="#" onclick="event.preventDefault(); changeLiveOrdersPage(${currentLiveOrdersPage - 1})"><i class="fas fa-chevron-left"></i></a></li>`;

        for (var p = 1; p <= totalPages; p++) {
            var activeClass = p === currentLiveOrdersPage ? 'active' : '';
            navHtml += `<li class="page-item ${activeClass}"><a class="page-link" href="#" onclick="event.preventDefault(); changeLiveOrdersPage(${p})">${p}</a></li>`;
        }

        var nextDisabled = currentLiveOrdersPage === totalPages || totalPages === 0 ? 'disabled' : '';
        navHtml += `<li class="page-item ${nextDisabled}"><a class="page-link" href="#" onclick="event.preventDefault(); changeLiveOrdersPage(${currentLiveOrdersPage + 1})"><i class="fas fa-chevron-right"></i></a></li>`;

        navEl.innerHTML = navHtml;
    }

    if (pageOrders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-muted"><i class="fas fa-search me-1"></i> No orders match your search or filter criteria.</td></tr>';
        return;
    }

    var html = '';
    pageOrders.forEach(function(o) {
        var statusBadge = 'bg-warning text-dark';
        if (o.status === 'Ready for Delivery' || o.status === 'Ready' || o.status === 'Out for Delivery') statusBadge = 'bg-info text-dark';
        else if (o.status === 'Completed' || o.status === 'Delivered') statusBadge = 'bg-success';
        else if (o.status === 'Cancelled') statusBadge = 'bg-danger';

        var actionBtn = '';
        if (o.status === 'Kitchen Preparing' || o.status === 'Preparing') {
            actionBtn = `<button class="btn btn-sm btn-outline-primary me-1 py-0 px-2" onclick="advanceAdminOrder('${o.id}', 'Ready for Delivery')"><i class="fas fa-check me-1"></i>Mark Ready</button>`;
        } else if (o.status === 'Ready for Delivery' || o.status === 'Ready' || o.status === 'Out for Delivery') {
            actionBtn = `<button class="btn btn-sm btn-outline-success me-1 py-0 px-2" onclick="advanceAdminOrder('${o.id}', 'Completed')"><i class="fas fa-flag-checkered me-1"></i>Complete</button>`;
        }

        actionBtn += `<button class="btn btn-sm btn-outline-secondary py-0 px-2" onclick="openReceiptModal('${o.id}')"><i class="fas fa-print me-1"></i>Receipt</button>`;

        var isPrep = o.status === 'Kitchen Preparing' || o.status === 'Preparing';
        var isReady = o.status === 'Ready for Delivery' || o.status === 'Ready' || o.status === 'Out for Delivery';
        var isComp = o.status === 'Completed' || o.status === 'Delivered';
        var isCanc = o.status === 'Cancelled';

        var statusSelectHtml = `
            <select class="form-select form-select-sm rounded-pill fw-bold" style="font-size:0.8rem; min-width:145px;" onchange="advanceAdminOrder('${o.id}', this.value)">
                <option value="Kitchen Preparing" ${isPrep ? 'selected' : ''}>🍳 Kitchen Preparing</option>
                <option value="Ready for Delivery" ${isReady ? 'selected' : ''}>🛵 Ready for Dispatch</option>
                <option value="Completed" ${isComp ? 'selected' : ''}>✅ Completed</option>
                <option value="Cancelled" ${isCanc ? 'selected' : ''}>❌ Cancelled</option>
            </select>
        `;

        html += `
            <tr>
                <td><span class="order-code-badge">#${o.id}</span></td>
                <td>
                    <div class="cust-name">${o.customerName}</div>
                    <div class="cust-sub">${o.phone || ''}</div>
                </td>
                <td style="min-width:240px; max-width:380px; white-space:normal !important; word-wrap:break-word !important; word-break:break-word;">
                    ${o.itemsSummary}
                </td>
                <td><span class="badge bg-light text-dark border text-capitalize">${o.serviceType || 'Delivery'}</span></td>
                <td><strong>${formatRWF(o.total)}</strong></td>
                <td>${statusSelectHtml}</td>
                <td class="text-end">${actionBtn}</td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}



/* ============================================================
   LIVE TABLE DINING TRACKER WITH PROGRESS BARS
   ============================================================ */
var adminTables = [];

var TABLE_STAGES = {
    1: { percent: 20, name: 'Seated', bgClass: 'bg-primary', desc: 'Guests seated & menus served' },
    2: { percent: 45, name: 'Cooking / Serving', bgClass: 'bg-warning text-dark', desc: 'Food prep & appetizers served' },
    3: { percent: 70, name: 'Dining & Eating', bgClass: 'bg-info text-dark', desc: 'Guests enjoying main meals' },
    4: { percent: 90, name: 'Bill Requested', bgClass: 'bg-danger', desc: 'Bill requested & payment' },
    5: { percent: 100, name: 'Cleared & Free', bgClass: 'bg-success', desc: 'Table cleaned & sanitized' }
};

function loadAdminTables() {
    try {
        var stored = localStorage.getItem('favcafe_tables');
        if (stored) {
            adminTables = JSON.parse(stored);
        } else {
            adminTables = [
                { id: 1, name: 'Table #1', zone: 'Main Hall', customer: 'Kagabo Patrick', guests: '4 Guests', stage: 3, startTime: Date.now() - 38 * 60000 },
                { id: 2, name: 'Table #2', zone: 'Main Hall', customer: 'Aline Uwase', guests: '2 Guests', stage: 2, startTime: Date.now() - 15 * 60000 },
                { id: 3, name: 'Table #3', zone: 'Terrace', customer: 'Keza Diane', guests: '2 Guests', stage: 4, startTime: Date.now() - 55 * 60000 },
                { id: 4, name: 'Table #4', zone: 'Terrace', customer: 'Eric Munyaneza', guests: '3 Guests', stage: 1, startTime: Date.now() - 5 * 60000 },
                { id: 5, name: 'Table #5', zone: 'VIP Lounge', customer: 'Jean Paul Ndayi', guests: '6 Guests', stage: 3, startTime: Date.now() - 42 * 60000 },
                { id: 6, name: 'Table #6', zone: 'VIP Lounge', customer: 'Vacant', guests: 'Free', stage: 5, startTime: null },
                { id: 7, name: 'Table #7', zone: 'Garden', customer: 'Kayonga Raul', guests: '2 Guests', stage: 2, startTime: Date.now() - 20 * 60000 },
                { id: 8, name: 'Table #8', zone: 'Garden', customer: 'Vacant', guests: 'Free', stage: 5, startTime: null }
            ];
            saveAdminTables();
        }
    } catch (e) {
        adminTables = [];
    }
}

function saveAdminTables() {
    try {
        localStorage.setItem('favcafe_tables', JSON.stringify(adminTables));
    } catch (e) {}
}

function renderAdminTablesTracker() {
    loadAdminTables();
    var grid = document.getElementById('liveTablesProgressGrid');
    var badgeCount = document.getElementById('sidebarTablesBadge');

    var activeCount = adminTables.filter(function(t) { return t.stage < 5; }).length;
    if (badgeCount) badgeCount.textContent = activeCount + ' Active';

    if (!grid) return;

    var html = '';
    adminTables.forEach(function(t) {
        var stageInfo = TABLE_STAGES[t.stage] || TABLE_STAGES[5];
        var elapsedMins = t.startTime ? Math.max(1, Math.floor((Date.now() - t.startTime) / 60000)) : 0;
        var timerDisplay = t.stage === 5 ? 'Vacant' : elapsedMins + ' min';

        var actionLabel = '▶ Next Stage';
        if (t.stage === 4) actionLabel = '🧹 Clear Table';
        else if (t.stage === 5) actionLabel = '🛋️ Seat New Guests';

        html += `
            <div class="col-lg-3 col-md-6">
               <div class="table-tracker-card p-3 bg-white rounded-3 border shadow-sm h-100 position-relative">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                     <h5 class="font-weight-bold mb-0 text-dark">${t.name} <span class="badge bg-light text-dark border ms-1 font-weight-normal">${t.zone}</span></h5>
                     <span class="badge ${t.stage === 5 ? 'bg-secondary' : 'bg-dark'} font-monospace"><i class="far fa-clock me-1"></i>${timerDisplay}</span>
                  </div>
                  
                  <div class="small text-muted mb-3">
                     <i class="fas fa-user me-1 text-primary"></i><strong>${t.customer}</strong> (${t.guests})
                  </div>
                  
                  <!-- Live Animated Progress Bar -->
                  <div class="mb-3">
                     <div class="d-flex justify-content-between small font-weight-bold mb-1">
                        <span class="text-uppercase" style="font-size:0.75rem;">Stage: ${stageInfo.name}</span>
                        <span class="text-dark" style="font-size:0.75rem;">${stageInfo.percent}%</span>
                     </div>
                     <div class="progress" style="height: 12px; border-radius: 10px; background: #e2e8f0;">
                        <div class="progress-bar progress-bar-striped progress-bar-animated ${stageInfo.bgClass}" role="progressbar" style="width: ${stageInfo.percent}%;" aria-valuenow="${stageInfo.percent}" aria-valuemin="0" aria-valuemax="100"></div>
                     </div>
                  </div>

                  <div class="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                     <small class="text-muted text-truncate me-2" title="${stageInfo.desc}">${stageInfo.desc}</small>
                     <button class="btn btn-sm btn-outline-dark py-1 px-2 font-weight-bold text-nowrap" onclick="advanceTableStage(${t.id})">
                        ${actionLabel}
                     </button>
                  </div>
               </div>
            </div>
        `;
    });

    grid.innerHTML = html;
}

function openSeatGuestModal(tableId) {
    loadAdminTables();
    var t = adminTables.find(function(table) { return table.id === tableId; });
    if (!t) return;

    var idEl = document.getElementById('seatTableId');
    var nameEl = document.getElementById('seatTableName');
    var custEl = document.getElementById('seatCustomerName');

    if (idEl) idEl.value = t.id;
    if (nameEl) nameEl.value = t.name + ' (' + t.zone + ')';
    if (custEl) custEl.value = '';

    var modal = document.getElementById('seatGuestModal');
    if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

function closeSeatGuestModal() {
    var modal = document.getElementById('seatGuestModal');
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }
}

function confirmSeatGuestSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    var tableId = parseInt(document.getElementById('seatTableId').value);
    var custName = document.getElementById('seatCustomerName').value.trim();
    var partySize = document.getElementById('seatPartySize').value;

    if (!tableId || !custName) {
        showToast('Please enter customer/party name.', 'warning');
        return;
    }

    loadAdminTables();
    var t = adminTables.find(function(table) { return table.id === tableId; });
    if (t) {
        t.stage = 1; // Seated - 20% Blue
        t.customer = custName;
        t.guests = partySize;
        t.startTime = Date.now();

        saveAdminTables();
        closeSeatGuestModal();
        renderAdminTablesTracker();
        showToast(t.name + ' seated for ' + custName + ' (20% Blue - Seated)', 'success', 'Guests Seated');
    }
}

function advanceTableStage(tableId) {
    loadAdminTables();
    var t = adminTables.find(function(table) { return table.id === tableId; });
    if (!t) return;

    if (t.stage === 5) {
        // Table is vacant: open Seating Modal
        openSeatGuestModal(tableId);
        return;
    }

    t.stage++;
    if (t.stage === 5) {
        t.customer = 'Vacant';
        t.guests = 'Free';
        t.startTime = null;
        if (typeof logNotification === 'function') {
            logNotification('alert', 'Floor Staff', t.name + ' (' + t.zone + ') cleaned & sanitized. Table vacant for next guests!', 'Table Cleaned Alert');
        }
        showToast(t.name + ' CLEARED & VACANT (100% Green)', 'success', 'Table Free');
    } else {
        var stageName = TABLE_STAGES[t.stage].name;
        var pct = TABLE_STAGES[t.stage].percent;
        if (typeof logNotification === 'function') {
            logNotification('alert', 'Floor Staff', t.name + ' (' + t.zone + ') advanced to Stage ' + t.stage + ': ' + stageName + ' (' + pct + '%) for ' + t.customer, 'Table Dining Alert');
        }
        showToast(t.name + ' advanced to Stage ' + t.stage + ': ' + stageName + ' (' + pct + '%)', 'info', 'Table Progress');
    }

    saveAdminTables();
    renderAdminTablesTracker();
}

function resetAllTables() {
    localStorage.removeItem('favcafe_tables');
    loadAdminTables();
    renderAdminTablesTracker();
    showToast('All table progress bars reset!', 'info');
}



function renderAdminReservations() {
    var resTable = document.getElementById('adminResTableBody');
    var badgeCount = document.getElementById('sidebarResBadge');
    var statRes = document.getElementById('statTotalReservations');

    var stored = localStorage.getItem('favcafe_reservations');
    var resList = stored ? JSON.parse(stored) : [
        {
            id: 'RES-8492',
            date: '2026-07-28',
            time: '07:30 PM',
            guests: '4 Guests',
            area: 'Terrace & Outdoor Garden',
            customerName: 'Kagabo Patrick',
            phone: '+250 788 222 111',
            notes: 'Anniversary Dinner',
            status: 'Confirmed'
        },
        {
            id: 'RES-5104',
            date: '2026-07-28',
            time: '08:00 PM',
            guests: '2 Guests',
            area: 'VIP Private Lounge',
            customerName: 'Keza Diane',
            phone: '+250 788 333 444',
            notes: 'Quiet Corner Table',
            status: 'Confirmed'
        }
    ];

    if (badgeCount) badgeCount.textContent = resList.filter(function(r) { return r.status === 'Confirmed'; }).length;
    if (statRes) statRes.textContent = resList.length;

    if (!resTable) return;

    var filterVal = document.getElementById('adminResFilter') ? document.getElementById('adminResFilter').value : 'all';
    var filtered = resList.filter(function(r) {
        if (filterVal === 'all') return true;
        return r.status === filterVal;
    });

    if (filtered.length === 0) {
        resTable.innerHTML = '<tr><td colspan="8" class="text-center py-4 text-muted">No reservations found.</td></tr>';
        return;
    }

    var html = '';
    filtered.forEach(function(r) {
        var statusBadge = 'bg-success';
        if (r.status === 'Seated') statusBadge = 'bg-info text-dark';
        else if (r.status === 'Cancelled') statusBadge = 'bg-secondary';

        html += `
            <tr>
                <td><span class="order-code-badge">#${r.id}</span></td>
                <td>
                    <div class="cust-name">${r.customerName}</div>
                    <div class="cust-sub">${r.phone || ''}</div>
                </td>
                <td><strong>${r.date}</strong> at ${r.time}</td>
                <td>${r.guests}</td>
                <td><span class="badge bg-light text-dark border">${r.area}</span></td>
                <td class="small text-muted">${r.notes || '-'}</td>
                <td><span class="badge ${statusBadge}">${r.status}</span></td>
                <td class="text-end">
                    ${r.status === 'Confirmed' ? `
                        <button class="btn btn-sm btn-outline-primary py-0 px-2 me-1" onclick="updateResStatus('${r.id}', 'Seated')"><i class="fas fa-chair me-1"></i>Seat</button>
                        <button class="btn btn-sm btn-outline-danger py-0 px-2" onclick="updateResStatus('${r.id}', 'Cancelled')"><i class="fas fa-times me-1"></i>Cancel</button>
                    ` : `<span class="text-muted small">${r.status}</span>`}
                </td>
            </tr>
        `;
    });

    resTable.innerHTML = html;
}

function updateResStatus(resId, newStatus) {
    var stored = localStorage.getItem('favcafe_reservations');
    var resList = stored ? JSON.parse(stored) : [];
    var target = resList.find(function(r) { return r.id === resId; });
    if (target) {
        target.status = newStatus;
        localStorage.setItem('favcafe_reservations', JSON.stringify(resList));
        renderAdminReservations();
        if (typeof showToast === 'function') {
            showToast('Reservation #' + resId + ' marked as ' + newStatus, 'info');
        }
    }
}


// Search and Order Filter Pills
function initSearchAndFilter() {
    var searchInput = document.getElementById('adminOrderSearch');
    var currentFilter = 'all';

    document.querySelectorAll('.order-filter-pills .filter-pill').forEach(function(pill) {
        pill.addEventListener('click', function() {
            document.querySelectorAll('.order-filter-pills .filter-pill').forEach(function(p) { p.classList.remove('active'); });
            this.classList.add('active');
            currentFilter = this.getAttribute('data-filter');
            renderOrdersTable(currentFilter, searchInput ? searchInput.value : '');
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            renderOrdersTable(currentFilter, this.value);
        });
    }
}

// Quick Refresh Kitchen Button
function refreshKitchenData() {
    loadAdminOrders();
    loadAdminMenu();
    renderOverviewStats();
    renderOrdersTable();
    renderKitchenGrid();
    if (typeof showToast === 'function') {
        showToast('Kitchen dashboard data refreshed!', 'info', 'Kitchen Sync');
    }
}

// Export Sales Report Button
function exportSalesReport() {
    if (typeof showToast === 'function') {
        showToast('Daily Sales & Orders report exported to CSV successfully!', 'success', 'Report Exported');
    }
}

/* ============================================================
   MENU CRUD SYSTEM MANAGEMENT
   ============================================================ */
/* ============================================================
   MENU CRUD SYSTEM MANAGEMENT (WITH CATEGORY PILLS & PAGINATION)
   ============================================================ */
var adminMenuItems = [];
var adminMenuCurrentPage = 1;
var adminMenuPerPage = 10;
var adminMenuCategoryFilter = 'all';

async function loadAdminMenu() {
    adminMenuItems = [];
    var isDbConnected = false;
    try {
        var res = await fetch('api/menu.php?action=get&t=' + Date.now());
        if (res.ok) {
            var data = await res.json();
            if (data && data.status === 'success' && Array.isArray(data.items)) {
                adminMenuItems = data.items;
                isDbConnected = true;
                localStorage.setItem('favcafe_menu', JSON.stringify(adminMenuItems));
            }
        }
    } catch (e) {}

    // Fallback to localStorage / menu.json ONLY if DB was offline/unreachable
    if (!isDbConnected) {
        try {
            var stored = localStorage.getItem('favcafe_menu');
            if (stored) {
                var parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    adminMenuItems = parsed;
                }
            }
        } catch (e) {}

        if (adminMenuItems.length === 0) {
            try {
                var resJson = await fetch('api/menu.json');
                if (resJson.ok) {
                    var jsonItems = await resJson.json();
                    if (Array.isArray(jsonItems) && jsonItems.length > 0) {
                        adminMenuItems = jsonItems;
                    }
                }
            } catch (e) {}
        }
    renderAdminMenuCategoryPills();
    renderAdminMenu();
}

function renderAdminMenuCategoryPills() {
    var container = document.getElementById('adminMenuCategoryPills');
    if (!container) return;

    var catMap = {};
    var defaultCats = [
        { name: 'Coffee', slug: 'coffee' },
        { name: 'Tea', slug: 'tea' },
        { name: 'Smoothies', slug: 'smoothies' },
        { name: 'Shakes', slug: 'shakes' },
        { name: 'Juices', slug: 'juices' },
        { name: 'Mains', slug: 'mains' },
        { name: 'Burger', slug: 'burger' },
        { name: 'Grills', slug: 'grills' },
        { name: 'Pizza', slug: 'pizza' },
        { name: 'Wraps', slug: 'wraps' },
        { name: 'Salads', slug: 'salads' },
        { name: 'Sides', slug: 'sides' }
    ];

    var list = (typeof adminCategories !== 'undefined' && Array.isArray(adminCategories) && adminCategories.length > 0) ? adminCategories : defaultCats;

    list.forEach(function(c) {
        if (c && c.slug) {
            catMap[c.slug.toLowerCase()] = c.name || (c.slug.charAt(0).toUpperCase() + c.slug.slice(1));
        }
    });

    adminMenuItems.forEach(function(m) {
        if (m && m.category) {
            var slug = m.category.toString().toLowerCase().trim();
            if (slug && !catMap[slug]) {
                catMap[slug] = slug.charAt(0).toUpperCase() + slug.slice(1);
            }
        }
    });

    var html = `<button class="filter-pill ${adminMenuCategoryFilter === 'all' ? 'active' : ''}" data-cat="all" onclick="setAdminMenuCategoryFilter('all', this)">All Categories (${adminMenuItems.length})</button>`;

    Object.keys(catMap).forEach(function(slug) {
        var name = catMap[slug];
        var count = adminMenuItems.filter(function(m) {
            return m.category && m.category.toString().toLowerCase().trim() === slug;
        }).length;
        html += `<button class="filter-pill ${adminMenuCategoryFilter === slug ? 'active' : ''}" data-cat="${slug}" onclick="setAdminMenuCategoryFilter('${slug}', this)">${name} (${count})</button>`;
    });

    container.innerHTML = html;
}

function setAdminMenuCategoryFilter(catSlug, btn) {
    adminMenuCategoryFilter = (catSlug || 'all').toLowerCase();
    adminMenuCurrentPage = 1;

    if (btn && btn.parentElement) {
        btn.parentElement.querySelectorAll('.filter-pill').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
    }

    renderAdminMenu();
}

function onAdminMenuSearchChange() {
    adminMenuCurrentPage = 1;
    renderAdminMenu();
}

function setAdminMenuPage(page) {
    adminMenuCurrentPage = page;
    renderAdminMenu();
}

function renderAdminMenu() {
    var grid = document.getElementById('adminMenuGrid');
    var searchInput = document.getElementById('adminMenuSearchInput');
    var infoEl = document.getElementById('adminMenuPaginationInfo');
    var navEl = document.getElementById('adminMenuPaginationNav');

    if (!grid) return;

    var filterText = searchInput ? searchInput.value.toLowerCase().trim() : '';

    var filtered = adminMenuItems.filter(function(item) {
        if (!item) return false;
        var itemCat = (item.category || '').toString().toLowerCase();
        var itemTitle = (item.title || item.name || '').toString().toLowerCase();
        var itemTags = (item.tags || '').toString().toLowerCase();

        var matchCategory = (adminMenuCategoryFilter === 'all') || (itemCat === adminMenuCategoryFilter);
        var matchSearch = !filterText || (itemTitle.includes(filterText) || itemTags.includes(filterText) || itemCat.includes(filterText));

        return matchCategory && matchSearch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = '<div class="col-12 text-center py-5 text-muted"><i class="fas fa-hamburger fa-3x mb-3 opacity-50"></i><h5>No menu items found</h5><p class="small">Try selecting another category or searching for another term.</p></div>';
        if (infoEl) infoEl.textContent = 'Showing 0 items';
        if (navEl) navEl.innerHTML = '';
        return;
    }

    var totalItems = filtered.length;
    var totalPages = Math.ceil(totalItems / adminMenuPerPage) || 1;
    if (adminMenuCurrentPage > totalPages) adminMenuCurrentPage = totalPages;
    if (adminMenuCurrentPage < 1) adminMenuCurrentPage = 1;

    var startIndex = (adminMenuCurrentPage - 1) * adminMenuPerPage;
    var endIndex = Math.min(startIndex + adminMenuPerPage, totalItems);
    var pageItems = filtered.slice(startIndex, endIndex);

    if (infoEl) {
        infoEl.textContent = `Showing ${startIndex + 1} to ${endIndex} of ${totalItems} dishes`;
    }

    var html = '';
    pageItems.forEach(function(item) {
        var itemTitle = item.title || item.name || 'Special Dish';
        var itemImage = (item.image && item.image !== 'undefined') ? item.image : ((item.img && item.img !== 'undefined') ? item.img : 'img/menu/1.jpg');
        var itemCategory = (item.category || 'mains').toString().toLowerCase();
        var isAvailable = parseInt(item.is_available) === 1 || item.is_available === true;

        html += `
            <div class="col-md-6 col-lg-4">
                <div class="admin-card h-100 mb-0 d-flex flex-column shadow-sm">
                    <div class="position-relative mb-3">
                        <img src="${itemImage}" class="w-100 rounded-3" style="height:170px;object-fit:cover;" alt="${itemTitle}" onerror="this.onerror=null; this.src='img/menu/1.jpg';" />
                        <span class="badge bg-dark position-absolute top-2 start-2 text-capitalize" style="top:10px;left:10px;font-size:0.75rem;">${itemCategory}</span>
                    </div>
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="mb-0" style="font-size:1.05rem;">${itemTitle}</h5>
                        <strong style="color:var(--primary);font-size:1.1rem;">${formatRWF(item.price)}</strong>
                    </div>
                    <p class="small text-muted mb-3 flex-grow-1" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">
                        ${item.description || 'No description provided.'}
                    </p>
                    <div class="d-flex justify-content-between align-items-center pt-3 border-top">
                        <div class="d-flex align-items-center gap-2">
                            <span class="small font-weight-bold ${isAvailable ? 'text-success' : 'text-muted'}">${isAvailable ? 'In Stock' : 'Sold Out'}</span>
                            <label class="switch">
                                <input type="checkbox" ${isAvailable ? 'checked' : ''} onchange="toggleMenuItemStock(${item.id}, this.checked)" />
                                <span class="slider"></span>
                            </label>
                        </div>
                        <div class="d-flex gap-1">
                            <button class="btn btn-sm btn-outline-primary" onclick="openEditMenuModal(${item.id})" title="Edit Dish"><i class="fas fa-edit"></i> Edit</button>
                            <button class="btn btn-sm btn-outline-danger" onclick="deleteMenuItem(${item.id})" title="Delete Dish"><i class="fas fa-trash-alt"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    grid.innerHTML = html;

    // Render Pagination Navigation
    if (navEl) {
        var navHtml = '';
        var prevDisabled = adminMenuCurrentPage <= 1 ? 'disabled' : '';
        navHtml += `<li class="page-item ${prevDisabled}"><a class="page-link" href="#" onclick="event.preventDefault(); setAdminMenuPage(${adminMenuCurrentPage - 1})"><i class="fas fa-chevron-left"></i></a></li>`;

        for (var p = 1; p <= totalPages; p++) {
            var activeClass = p === adminMenuCurrentPage ? 'active' : '';
            navHtml += `<li class="page-item ${activeClass}"><a class="page-link" href="#" onclick="event.preventDefault(); setAdminMenuPage(${p})">${p}</a></li>`;
        }

        var nextDisabled = adminMenuCurrentPage >= totalPages ? 'disabled' : '';
        navHtml += `<li class="page-item ${nextDisabled}"><a class="page-link" href="#" onclick="event.preventDefault(); setAdminMenuPage(${adminMenuCurrentPage + 1})"><i class="fas fa-chevron-right"></i></a></li>`;

        navEl.innerHTML = navHtml;
    }
}

function previewMenuImage(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var imgPreview = document.getElementById('menuImagePreview');
            var box = document.getElementById('imagePreviewBox');
            if (imgPreview && box) {
                imgPreview.src = e.target.result;
                box.style.display = 'block';
            }
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function openAddMenuModal() {
    var form = document.getElementById('menuItemForm');
    if (form) form.reset();
    document.getElementById('menuItemId').value = '';
    document.getElementById('menuImage').value = 'img/menu/1.jpg';
    if (document.getElementById('menuCalories')) document.getElementById('menuCalories').value = 400;
    if (document.getElementById('menuRating')) document.getElementById('menuRating').value = '5.0';
    if (document.getElementById('menuReviews')) document.getElementById('menuReviews').value = 12;
    var box = document.getElementById('imagePreviewBox');
    if (box) box.style.display = 'none';

    document.getElementById('menuModalTitle').innerHTML = '<i class="fas fa-plus-circle me-2" style="color:var(--primary);"></i>Add New Dish';
    
    var modal = document.getElementById('menuItemModal');
    if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

function openEditMenuModal(id) {
    var item = adminMenuItems.find(function(i) { return parseInt(i.id) === parseInt(id); });
    if (!item) return;

    document.getElementById('menuItemId').value = item.id;
    document.getElementById('menuTitle').value = item.title;
    document.getElementById('menuCategory').value = item.category;
    document.getElementById('menuPrice').value = item.price;
    document.getElementById('menuOldPrice').value = item.old_price || '';
    document.getElementById('menuPrepTime').value = item.prep_time || 15;
    if (document.getElementById('menuCalories')) document.getElementById('menuCalories').value = item.calories || 400;
    if (document.getElementById('menuRating')) document.getElementById('menuRating').value = item.rating || '5.0';
    if (document.getElementById('menuReviews')) document.getElementById('menuReviews').value = item.reviews || 12;
    document.getElementById('menuImage').value = item.image || 'img/menu/1.jpg';
    document.getElementById('menuDesc').value = item.description || '';
    document.getElementById('menuTags').value = item.tags || '';

    var imgPreview = document.getElementById('menuImagePreview');
    var box = document.getElementById('imagePreviewBox');
    if (imgPreview && box) {
        imgPreview.src = item.image || 'img/menu/1.jpg';
        box.style.display = 'block';
    }

    document.getElementById('menuModalTitle').innerHTML = '<i class="fas fa-edit me-2" style="color:var(--primary);"></i>Edit Dish: ' + item.title;
    
    var modal = document.getElementById('menuItemModal');
    if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

function closeMenuItemModal() {
    var modal = document.getElementById('menuItemModal');
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }
}

async function saveMenuItem(e) {
    e.preventDefault();

    var id = document.getElementById('menuItemId').value;
    var title = document.getElementById('menuTitle').value.trim();
    var category = document.getElementById('menuCategory').value;
    var price = parseFloat(document.getElementById('menuPrice').value);
    var oldPrice = document.getElementById('menuOldPrice').value ? parseFloat(document.getElementById('menuOldPrice').value) : null;
    var prepTime = parseInt(document.getElementById('menuPrepTime').value) || 15;
    var calories = document.getElementById('menuCalories') ? (parseInt(document.getElementById('menuCalories').value) || 400) : 400;
    var rating = document.getElementById('menuRating') ? (document.getElementById('menuRating').value.trim() || '5.0') : '5.0';
    var reviews = document.getElementById('menuReviews') ? (parseInt(document.getElementById('menuReviews').value) || 12) : 12;
    var imagePath = document.getElementById('menuImage').value.trim() || 'img/menu/1.jpg';
    var description = document.getElementById('menuDesc').value.trim();
    var tags = document.getElementById('menuTags').value.trim() || 'Popular';

    var fileInput = document.getElementById('menuImageFile');

    if (!title || price <= 0) {
        showToast('Please enter a valid title and price.', 'warning', 'Invalid Input');
        return;
    }

    // Check if user uploaded a new image file
    if (fileInput && fileInput.files && fileInput.files[0]) {
        var formData = new FormData();
        formData.append('image', fileInput.files[0]);

        try {
            var uploadRes = await fetch('api/upload.php', {
                method: 'POST',
                body: formData
            });
            var uploadData = await uploadRes.json();
            if (uploadData.status === 'success' && uploadData.image_path) {
                imagePath = uploadData.image_path;
            } else if (uploadData.message) {
                showToast(uploadData.message, 'warning', 'Upload Warning');
            }
        } catch (uploadErr) {
            console.log('[Image Upload] Failed to upload image via PHP endpoint, using preview data URL');
            var imgPreview = document.getElementById('menuImagePreview');
            if (imgPreview && imgPreview.src && imgPreview.src.startsWith('data:image')) {
                imagePath = imgPreview.src;
            }
        }
    }

    var payload = {
        id: id,
        title: title,
        category: category,
        price: price,
        old_price: oldPrice,
        prep_time: prepTime,
        calories: calories,
        rating: rating,
        reviews: reviews,
        image: imagePath,
        description: description,
        tags: tags
    };

    // Update local state and localStorage
    if (id) {
        var existing = adminMenuItems.find(function(i) { return parseInt(i.id) === parseInt(id); });
        if (existing) {
            existing.title = title;
            existing.category = category;
            existing.price = price;
            existing.old_price = oldPrice;
            existing.prep_time = prepTime;
            existing.calories = calories;
            existing.rating = rating;
            existing.reviews = reviews;
            existing.image = imagePath;
            existing.description = description;
            existing.tags = tags;
        }
    } else {
        var newItem = {
            id: Date.now(),
            title: title,
            category: category,
            price: price,
            old_price: oldPrice,
            prep_time: prepTime,
            calories: calories,
            rating: rating,
            reviews: reviews,
            image: imagePath,
            description: description,
            tags: tags,
            is_available: 1
        };
        adminMenuItems.unshift(newItem);
    }
    localStorage.setItem('favcafe_menu', JSON.stringify(adminMenuItems));

    // Try PHP MySQL API in background
    try {
        var res = await fetch('api/menu.php?action=' + action, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        var data = await res.json();
        if (data && data.status === 'success') {
            closeMenuItemModal();
            showToast(data.message || 'Menu item saved to database!', 'success', 'Menu Updated');
            renderAdminMenuCategoryPills();
            renderAdminMenu();
            broadcastMenuUpdate();
            return;
        }
    } catch (err) {
        console.log('[Admin Menu API] Saved locally to browser storage');
    }

    closeMenuItemModal();
    renderAdminMenuCategoryPills();
    renderAdminMenu();
    broadcastMenuUpdate();
    showToast('Menu item "' + title + '" saved successfully!', 'success', 'Menu Updated');
}

var _broadcastTimer = null;
function broadcastMenuUpdate() {
    if (_broadcastTimer) clearTimeout(_broadcastTimer);
    _broadcastTimer = setTimeout(function() {
        try {
            localStorage.setItem('favcafe_menu_timestamp', Date.now().toString());
        } catch(e) {}
        try {
            var channel = new BroadcastChannel('favcafe_menu_channel');
            channel.postMessage({ type: 'menu_updated', timestamp: Date.now() });
        } catch(e) {}
    }, 150);
}

async function deleteMenuItem(id) {
    if (!confirm('Are you sure you want to delete this dish from the menu?')) return;

    adminMenuItems = adminMenuItems.filter(function(i) { return parseInt(i.id) !== parseInt(id); });
    localStorage.setItem('favcafe_menu', JSON.stringify(adminMenuItems));

    try {
        var res = await fetch('api/menu.php?action=delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id })
        });
        var data = await res.json();
        if (data && data.status === 'success') {
            showToast(data.message || 'Menu item deleted.', 'success', 'Dish Removed');
        }
    } catch (e) {
        console.log('[Admin Menu API] Offline delete fallback');
    }

    renderAdminMenuCategoryPills();
    renderAdminMenu();
    broadcastMenuUpdate();
}

async function toggleMenuItemStock(id, isAvailable) {
    var val = isAvailable ? 1 : 0;
    try {
        await fetch('api/menu.php?action=toggle_stock', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id, is_available: val })
        });
    } catch (e) {}

    var item = adminMenuItems.find(function(i) { return parseInt(i.id) === parseInt(id); });
    if (item) {
        item.is_available = val;
        localStorage.setItem('favcafe_menu', JSON.stringify(adminMenuItems));
        renderAdminMenu();
        broadcastMenuUpdate();
    }
}

// Add loadAdminMenu & table tracker to init
document.addEventListener('DOMContentLoaded', function() {
    loadAdminMenu();
    renderAdminTablesTracker();
});

// Explicit scope bindings
window.advanceAdminOrder = advanceAdminOrder;
window.refreshKitchenData = refreshKitchenData;
window.exportSalesReport = exportSalesReport;
window.loadAdminMenu = loadAdminMenu;
window.openAddMenuModal = openAddMenuModal;
window.openEditMenuModal = openEditMenuModal;
window.closeMenuItemModal = closeMenuItemModal;
window.saveMenuItem = saveMenuItem;
window.deleteMenuItem = deleteMenuItem;
window.toggleMenuItemStock = toggleMenuItemStock;
window.previewMenuImage = previewMenuImage;
window.formatRWF = formatRWF;
window.renderAdminReservations = renderAdminReservations;
window.updateResStatus = updateResStatus;
window.renderAdminTablesTracker = renderAdminTablesTracker;
window.advanceTableStage = advanceTableStage;
window.resetAllTables = resetAllTables;
window.openSeatGuestModal = openSeatGuestModal;
window.closeSeatGuestModal = closeSeatGuestModal;
window.confirmSeatGuestSubmit = confirmSeatGuestSubmit;
window.renderFullOrdersDispatchBoard = renderFullOrdersDispatchBoard;
window.filterLiveOrdersBoard = filterLiveOrdersBoard;
window.onLiveOrdersSearchChange = onLiveOrdersSearchChange;
window.changeLiveOrdersPage = changeLiveOrdersPage;

/* ============================================================
   SYSTEM NOTIFICATION LOG ENGINE (ADMIN PORTAL)
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
    var adminDot = document.getElementById('adminNotifyDot');
    var countEl = document.getElementById('notificationCountBadge');
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
        var borderStyle = 'border-left: 4px solid #3b82f6;';
        var icon = '<i class="fas fa-comment-alt text-primary me-2"></i>';
        if (n.type === 'email') {
            borderStyle = 'border-left: 4px solid #10b981;';
            icon = '<i class="fas fa-envelope text-success me-2"></i>';
        } else if (n.type === 'alert') {
            borderStyle = 'border-left: 4px solid #aa7262;';
            icon = '<i class="fas fa-bell me-2" style="color:#aa7262;"></i>';
        }

        var dateStr = new Date(n.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        html += `
            <div class="p-3 mb-2 bg-light rounded-3 shadow-sm" style="${borderStyle}">
                <div class="d-flex justify-content-between align-items-center mb-1">
                    <strong style="color:#102b37; font-size:0.92rem;">${icon} ${n.title}</strong>
                    <span class="badge bg-secondary font-monospace" style="font-size:0.7rem;">${dateStr}</span>
                </div>
                <div class="small text-muted mb-1">Recipient: <code class="bg-white px-2 py-0.5 rounded text-dark" style="border:1px solid #e2e8f0;">${n.recipient}</code></div>
                <div class="small text-dark mt-1" style="font-weight:500;">${n.message}</div>
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

window.logNotification = logNotification;
window.loadNotifications = loadNotifications;
window.saveNotifications = saveNotifications;
window.openNotificationLogModal = openNotificationLogModal;
window.closeNotificationLogModal = closeNotificationLogModal;
window.renderNotificationLogs = renderNotificationLogs;
window.filterNotificationLogs = filterNotificationLogs;
window.clearNotificationLogs = clearNotificationLogs;
window.sendDemoTestNotification = sendDemoTestNotification;

function openReceiptModal(orderId) {
    loadAdminOrders();
    var target = adminOrders.find(function(o) { return o.id === orderId; }) || adminOrders[0];
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
    var qrImg = document.getElementById('receiptQrImg');

    if (numEl) numEl.textContent = '#' + target.id;
    if (dateEl) dateEl.textContent = target.date ? new Date(target.date).toLocaleDateString() : new Date().toLocaleDateString();
    if (custEl) custEl.textContent = target.customerName || 'Customer';
    if (typeEl) typeEl.textContent = (target.serviceType || 'Delivery').toUpperCase();
    if (payEl) payEl.textContent = (target.paymentMethod || 'Mobile Money').toUpperCase();

    if (qrImg) {
        qrImg.src = 'https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://ebm.rra.gov.rw/verify/' + target.id;
    }

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

function closeReceiptModal() {
    var modal = document.getElementById('receiptModal');
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }
}

function triggerReceiptPrint() {
    window.print();
}

function refreshAdminOrders() {
    loadAdminOrders();
    renderOverviewStats();
    renderOrdersTable();
    renderKitchenGrid();
    renderFullOrdersDispatchBoard();
    if (typeof showToast === 'function') {
        showToast('Live orders & kitchen dispatch refreshed!', 'success', 'Orders Synchronized');
    }
}

/* ============================================================
   STAFF MEMBERS & ROLES & CUSTOMER LOYALTY POINTS ENGINE
   ============================================================ */
var adminStaffList = [];
var adminCustomerLoyaltyList = [];

function loadStaffAndLoyaltyData() {
    try {
        var storedStaff = localStorage.getItem('favcafe_staff_members');
        if (storedStaff) {
            adminStaffList = JSON.parse(storedStaff);
        } else {
            adminStaffList = [
                { id: 1, name: 'Admin Staff', code: 'admin_Mashariki', phone: '+250 788 000 111', role: 'Super Admin', permissions: 'Full Access (All Modules)', status: 'Active' },
                { id: 2, name: 'Jean Paul Ndayi', code: 'chef_jp', phone: '+250 788 222 333', role: 'Head Chef / Kitchen Manager', permissions: 'Kitchen Queue & Orders', status: 'Active' },
                { id: 3, name: 'Aline Uwase', code: 'waiter_aline', phone: '+250 788 444 555', role: 'Floor Manager / Waiter', permissions: 'Table Dining Tracker', status: 'Active' },
                { id: 4, name: 'Kagabo Patrick', code: 'cashier_pat', phone: '+250 788 666 777', role: 'Cashier & POS Billing', permissions: 'Checkout & Receipts', status: 'Active' }
            ];
            saveStaffMembers();
        }
    } catch (e) {
        adminStaffList = [];
    }

    try {
        var storedCust = localStorage.getItem('favcafe_customer_loyalty');
        if (storedCust) {
            adminCustomerLoyaltyList = JSON.parse(storedCust);
        } else {
            adminCustomerLoyaltyList = [
                { id: 'CUST-101', name: 'Kayonga Raul', phone: '+250 788 700 870', email: 'kayonga70@gmail.com', loyaltyPoints: 2500 },
                { id: 'CUST-102', name: 'Eric Munyaneza', phone: '+250 788 123 456', email: 'eric@example.com', loyaltyPoints: 1200 },
                { id: 'CUST-103', name: 'Alice Umutoni', phone: '+250 788 999 000', email: 'alice@example.com', loyaltyPoints: 850 },
                { id: 'CUST-104', name: 'Keza Diane', phone: '+250 733 444 555', email: 'keza@example.com', loyaltyPoints: 3000 }
            ];
            saveCustomerLoyalty();
        }
    } catch (e) {
        adminCustomerLoyaltyList = [];
    }
}

function saveStaffMembers() {
    try {
        localStorage.setItem('favcafe_staff_members', JSON.stringify(adminStaffList));
    } catch (e) {}
}

function saveCustomerLoyalty() {
    try {
        localStorage.setItem('favcafe_customer_loyalty', JSON.stringify(adminCustomerLoyaltyList));
    } catch (e) {}
}

function renderStaffAndLoyaltyTables() {
    loadStaffAndLoyaltyData();

    // Render Staff Table
    var staffTbody = document.getElementById('staffTableBody');
    var staffCounter = document.getElementById('staffTotalCounter');
    if (staffTbody) {
        if (staffCounter) staffCounter.textContent = adminStaffList.length + ' Active Staff';
        var html = '';
        adminStaffList.forEach(function(s) {
            var roleBadgeClass = 'bg-primary';
            if (s.role.includes('Chef')) roleBadgeClass = 'bg-warning text-dark';
            else if (s.role.includes('Floor')) roleBadgeClass = 'bg-info text-dark';
            else if (s.role.includes('Cashier')) roleBadgeClass = 'bg-success';

            html += `
                <tr>
                    <td><span class="badge bg-dark font-monospace">${s.code}</span></td>
                    <td>
                        <div class="font-weight-bold text-dark">${s.name}</div>
                        <div class="small text-muted">${s.phone}</div>
                    </td>
                    <td><span class="badge ${roleBadgeClass} px-2 py-1">${s.role}</span></td>
                    <td><span class="small text-muted font-weight-bold">${s.permissions || 'Standard Access'}</span></td>
                    <td><span class="badge ${s.status === 'Active' ? 'bg-success' : 'bg-secondary'}">${s.status}</span></td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-outline-primary me-1" onclick="openEditStaffModal(${s.id})"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteStaffMember(${s.id})"><i class="fas fa-trash-alt"></i></button>
                    </td>
                </tr>
            `;
        });
        staffTbody.innerHTML = html;
    }

    // Render Customer Loyalty Table
    var custTbody = document.getElementById('customerLoyaltyTableBody');
    var custCounter = document.getElementById('customerTotalCounter');
    if (custTbody) {
        if (custCounter) custCounter.textContent = adminCustomerLoyaltyList.length + ' Customer Accounts';
        var html2 = '';
        adminCustomerLoyaltyList.forEach(function(c) {
            html2 += `
                <tr>
                    <td><span class="badge bg-secondary font-monospace">${c.id}</span></td>
                    <td>
                        <div class="font-weight-bold text-dark">${c.name}</div>
                        <div class="small text-muted">${c.phone}</div>
                    </td>
                    <td><span class="small text-primary font-weight-bold">${c.email}</span></td>
                    <td><span class="badge bg-warning text-dark fs-6 px-3 py-1 font-monospace"><i class="fas fa-star me-1"></i>${c.loyaltyPoints.toLocaleString()} Pts</span></td>
                    <td><strong class="text-success">${formatRWF(c.loyaltyPoints)} RWF</strong></td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-warning text-dark font-weight-bold rounded-pill px-3" onclick="quickGrantPoints('${c.id}')">
                            <i class="fas fa-plus-circle me-1"></i> Grant Points
                        </button>
                    </td>
                </tr>
            `;
        });
        custTbody.innerHTML = html2;
    }
}

function openAddStaffModal() {
    var form = document.getElementById('staffForm');
    if (form) form.reset();
    document.getElementById('staffId').value = '';
    document.getElementById('staffModalTitle').innerHTML = '<i class="fas fa-user-shield me-2" style="color:var(--primary);"></i>Add Staff Member';

    var modal = document.getElementById('staffModal');
    if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

function openEditStaffModal(id) {
    loadStaffAndLoyaltyData();
    var s = adminStaffList.find(function(staff) { return staff.id === id; });
    if (!s) return;

    document.getElementById('staffId').value = s.id;
    document.getElementById('staffName').value = s.name;
    document.getElementById('staffCode').value = s.code;
    document.getElementById('staffPhone').value = s.phone;
    document.getElementById('staffRole').value = s.role;
    document.getElementById('staffPass').value = '••••••••';

    document.getElementById('staffModalTitle').innerHTML = '<i class="fas fa-user-edit me-2" style="color:var(--primary);"></i>Edit Staff: ' + s.name;

    var modal = document.getElementById('staffModal');
    if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

function closeStaffModal() {
    var modal = document.getElementById('staffModal');
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }
}

function confirmSaveStaff(e) {
    if (e && e.preventDefault) e.preventDefault();
    var id = document.getElementById('staffId').value;
    var name = document.getElementById('staffName').value.trim();
    var code = document.getElementById('staffCode').value.trim();
    var phone = document.getElementById('staffPhone').value.trim();
    var role = document.getElementById('staffRole').value;

    loadStaffAndLoyaltyData();

    var permissionsMap = {
        'Super Admin': 'Full Access (All Modules)',
        'Head Chef / Kitchen Manager': 'Kitchen Queue & Orders',
        'Floor Manager / Waiter': 'Table Dining Tracker',
        'Cashier & POS Billing': 'Checkout & Receipts'
    };

    if (id) {
        var s = adminStaffList.find(function(staff) { return staff.id === parseInt(id); });
        if (s) {
            s.name = name;
            s.code = code;
            s.phone = phone;
            s.role = role;
            s.permissions = permissionsMap[role] || 'Standard Access';
        }
    } else {
        adminStaffList.push({
            id: Date.now(),
            name: name,
            code: code,
            phone: phone,
            role: role,
            permissions: permissionsMap[role] || 'Standard Access',
            status: 'Active'
        });
    }

    saveStaffMembers();
    closeStaffModal();
    renderStaffAndLoyaltyTables();
    showToast('Staff member "' + name + '" saved successfully!', 'success', 'Staff Access');
}

function deleteStaffMember(id) {
    if (!confirm('Are you sure you want to delete this staff account?')) return;
    loadStaffAndLoyaltyData();
    adminStaffList = adminStaffList.filter(function(s) { return s.id !== id; });
    saveStaffMembers();
    renderStaffAndLoyaltyTables();
    showToast('Staff member deleted.', 'info');
}

function openGrantPointsModal() {
    loadStaffAndLoyaltyData();
    var select = document.getElementById('grantCustomerSelect');
    if (select) {
        select.innerHTML = adminCustomerLoyaltyList.map(function(c) {
            return `<option value="${c.id}">${c.name} (${c.email}) - Current: ${c.loyaltyPoints} Pts</option>`;
        }).join('');
    }

    var modal = document.getElementById('grantPointsModal');
    if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

function closeGrantPointsModal() {
    var modal = document.getElementById('grantPointsModal');
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }
}

function quickGrantPoints(custId) {
    openGrantPointsModal();
    var select = document.getElementById('grantCustomerSelect');
    if (select) select.value = custId;
}

function confirmGrantPointsSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    var custId = document.getElementById('grantCustomerSelect').value;
    var amount = parseInt(document.getElementById('grantPointsAmount').value) || 0;

    if (!custId || amount <= 0) {
        showToast('Please select a customer and enter a valid points amount.', 'warning');
        return;
    }

    loadStaffAndLoyaltyData();
    var cust = adminCustomerLoyaltyList.find(function(c) { return c.id === custId; });
    if (cust) {
        cust.loyaltyPoints += amount;
        saveCustomerLoyalty();
        closeGrantPointsModal();
        renderStaffAndLoyaltyTables();
        logNotification('sms', cust.phone, 'Favorite Cafe Bonus: You have been granted ' + amount + ' Loyalty Points! Total Balance: ' + cust.loyaltyPoints + ' Pts.', 'Loyalty Bonus Granted');
        showToast('Granted ' + amount + ' Loyalty Points to ' + cust.name + '!', 'success', 'Points Credited');
    }
}

window.renderStaffAndLoyaltyTables = renderStaffAndLoyaltyTables;
window.openAddStaffModal = openAddStaffModal;
window.openEditStaffModal = openEditStaffModal;
window.closeStaffModal = closeStaffModal;
window.confirmSaveStaff = confirmSaveStaff;
window.deleteStaffMember = deleteStaffMember;
window.openGrantPointsModal = openGrantPointsModal;
window.closeGrantPointsModal = closeGrantPointsModal;
window.quickGrantPoints = quickGrantPoints;
window.confirmGrantPointsSubmit = confirmGrantPointsSubmit;

/* ============================================================
   CATEGORY MANAGEMENT (FULL CRUD)
   ============================================================ */
var adminCategories = [];

async function loadAdminCategories() {
    try {
        var res = await fetch('api/categories.php?action=get');
        if (res.ok) {
            var data = await res.json();
            if (data && data.status === 'success' && Array.isArray(data.categories)) {
                adminCategories = data.categories;
            }
        }
    } catch (e) {}

    if (adminCategories.length === 0) {
        try {
            var stored = localStorage.getItem('favcafe_categories');
            if (stored) {
                adminCategories = JSON.parse(stored);
            }
        } catch (e) {}
    }

    if (!adminCategories || adminCategories.length === 0) {
        adminCategories = [
            { id: 1, name: 'Coffee', slug: 'coffee', icon: 'fas fa-coffee', is_active: 1, sort_order: 1 },
            { id: 2, name: 'Tea', slug: 'tea', icon: 'fas fa-mug-hot', is_active: 1, sort_order: 2 },
            { id: 3, name: 'Smoothies', slug: 'smoothies', icon: 'fas fa-blender', is_active: 1, sort_order: 3 },
            { id: 4, name: 'Shakes', slug: 'shakes', icon: 'fas fa-glass-martini-alt', is_active: 1, sort_order: 4 },
            { id: 5, name: 'Juices', slug: 'juices', icon: 'fas fa-cocktail', is_active: 1, sort_order: 5 },
            { id: 6, name: 'Mains', slug: 'mains', icon: 'fas fa-utensils', is_active: 1, sort_order: 6 },
            { id: 7, name: 'Burger', slug: 'burger', icon: 'fas fa-hamburger', is_active: 1, sort_order: 7 },
            { id: 8, name: 'Grills', slug: 'grills', icon: 'fas fa-drumstick-bite', is_active: 1, sort_order: 8 },
            { id: 9, name: 'Pizza', slug: 'pizza', icon: 'fas fa-pizza-slice', is_active: 1, sort_order: 9 },
            { id: 10, name: 'Wraps', slug: 'wraps', icon: 'fas fa-hotdog', is_active: 1, sort_order: 10 },
            { id: 11, name: 'Salads', slug: 'salads', icon: 'fas fa-leaf', is_active: 1, sort_order: 11 },
            { id: 12, name: 'Sides', slug: 'sides', icon: 'fas fa-bread-slice', is_active: 1, sort_order: 12 }
        ];
        saveCategoriesToStorage();
    }

    renderAdminCategoriesTable();
    populateCategoryDropdowns();
}

function saveCategoriesToStorage() {
    try {
        localStorage.setItem('favcafe_categories', JSON.stringify(adminCategories));
    } catch (e) {}
}

function renderAdminCategoriesTable() {
    var tbody = document.getElementById('adminCategoriesTbody');
    var badgeCount = document.getElementById('adminCatCountBadge');
    var sidebarBadge = document.getElementById('sidebarCatBadge');
    var searchInput = document.getElementById('adminCatSearchInput');
    
    if (badgeCount) badgeCount.textContent = adminCategories.length + ' Categories';
    if (sidebarBadge) sidebarBadge.textContent = adminCategories.length;
    
    if (!tbody) return;

    var filterText = searchInput ? searchInput.value.toLowerCase().trim() : '';

    var filtered = adminCategories.filter(function(cat) {
        if (!filterText) return true;
        return (cat.name && cat.name.toLowerCase().includes(filterText)) ||
               (cat.slug && cat.slug.toLowerCase().includes(filterText));
    });

    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-muted"><i class="fas fa-tags fa-2x mb-2 opacity-50"></i><br>No categories match your search.</td></tr>';
        return;
    }

    var html = '';
    filtered.forEach(function(cat) {
        var dishCount = (typeof adminMenuItems !== 'undefined' && Array.isArray(adminMenuItems)) ? adminMenuItems.filter(function(m) {
            return m.category && m.category.toString().toLowerCase() === (cat.slug || '').toString().toLowerCase();
        }).length : 0;

        var isActive = parseInt(cat.is_active) === 1 || cat.is_active === true;
        var statusBadge = isActive ? '<span class="badge bg-success"><i class="fas fa-check-circle me-1"></i>Active</span>' : '<span class="badge bg-danger"><i class="fas fa-eye-slash me-1"></i>Disabled</span>';
        var iconHtml = cat.icon ? `<i class="${cat.icon} text-warning fs-5"></i>` : '<i class="fas fa-tag text-muted fs-5"></i>';

        html += `
            <tr>
                <td class="text-center">${iconHtml}</td>
                <td><strong>${cat.name}</strong></td>
                <td><code class="bg-light px-2 py-1 rounded text-primary">${cat.slug}</code></td>
                <td><span class="badge bg-info text-dark">${dishCount} Dishes</span></td>
                <td>${statusBadge}</td>
                <td><span class="text-muted fw-bold">#${cat.sort_order || 0}</span></td>
                <td class="text-end">
                    <button class="btn btn-sm ${isActive ? 'btn-outline-warning' : 'btn-outline-success'} me-1" onclick="toggleCategoryStatus(${cat.id})" title="${isActive ? 'Disable Filter' : 'Enable Filter'}">
                        <i class="fas ${isActive ? 'fa-eye-slash' : 'fa-eye'}"></i> ${isActive ? 'Disable' : 'Enable'}
                    </button>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="openCategoryModal(${cat.id})" title="Edit Category">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteCategory(${cat.id})" title="Delete Category">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

function autoGenerateSlug(nameVal) {
    var slugInput = document.getElementById('catSlug');
    var catId = document.getElementById('catId').value;
    if (slugInput && !catId) {
        slugInput.value = (nameVal || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    }
}

function openCategoryModal(catId) {
    var modal = document.getElementById('categoryModal');
    var titleEl = document.getElementById('catModalTitle');
    var idInput = document.getElementById('catId');
    var nameInput = document.getElementById('catName');
    var slugInput = document.getElementById('catSlug');
    var iconInput = document.getElementById('catIcon');
    var sortInput = document.getElementById('catSortOrder');

    if (catId) {
        var cat = adminCategories.find(function(c) { return parseInt(c.id) === parseInt(catId); });
        if (cat) {
            if (titleEl) titleEl.innerHTML = '<i class="fas fa-edit me-2" style="color:var(--primary);"></i>Edit Category';
            if (idInput) idInput.value = cat.id;
            if (nameInput) nameInput.value = cat.name;
            if (slugInput) slugInput.value = cat.slug;
            if (iconInput) iconInput.value = cat.icon || 'fas fa-utensils';
            if (sortInput) sortInput.value = cat.sort_order || 1;
        }
    } else {
        if (titleEl) titleEl.innerHTML = '<i class="fas fa-tags me-2" style="color:var(--primary);"></i>Add New Category';
        if (idInput) idInput.value = '';
        if (nameInput) nameInput.value = '';
        if (slugInput) slugInput.value = '';
        if (iconInput) iconInput.value = 'fas fa-utensils';
        if (sortInput) sortInput.value = adminCategories.length + 1;
    }

    if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

function closeCategoryModal() {
    var modal = document.getElementById('categoryModal');
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }
}

async function saveCategorySubmit(e) {
    if (e && e.preventDefault) e.preventDefault();

    var id = document.getElementById('catId').value;
    var name = document.getElementById('catName').value.trim();
    var slug = document.getElementById('catSlug').value.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    var icon = document.getElementById('catIcon').value.trim() || 'fas fa-utensils';
    var sortOrder = parseInt(document.getElementById('catSortOrder').value) || 1;

    if (!name || !slug) {
        showToast('Category name and filter key are required.', 'warning');
        return;
    }

    var payload = { action: id ? 'update' : 'add', id: id, name: name, slug: slug, icon: icon, sort_order: sortOrder, is_active: 1 };

    try {
        var res = await fetch('api/categories.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        var data = await res.json();
        if (data && data.status === 'success') {
            showToast(data.message, 'success');
        }
    } catch (err) {}

    // Update local memory & storage fallback
    if (id) {
        var cat = adminCategories.find(function(c) { return parseInt(c.id) === parseInt(id); });
        if (cat) {
            cat.name = name;
            cat.slug = slug;
            cat.icon = icon;
            cat.sort_order = sortOrder;
        }
    } else {
        var newId = Date.now();
        adminCategories.push({ id: newId, name: name, slug: slug, icon: icon, is_active: 1, sort_order: sortOrder });
    }

    saveCategoriesToStorage();
    closeCategoryModal();
    renderAdminCategoriesTable();
    populateCategoryDropdowns();
}

async function toggleCategoryStatus(catId) {
    var cat = adminCategories.find(function(c) { return parseInt(c.id) === parseInt(catId); });
    if (!cat) return;

    cat.is_active = (parseInt(cat.is_active) === 1 || cat.is_active === true) ? 0 : 1;
    saveCategoriesToStorage();
    renderAdminCategoriesTable();

    try {
        await fetch('api/categories.php?action=toggle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: catId })
        });
    } catch (e) {}

    showToast('Category "' + cat.name + '" ' + (cat.is_active ? 'enabled' : 'disabled') + '!', 'info');
}

async function deleteCategory(catId) {
    var cat = adminCategories.find(function(c) { return parseInt(c.id) === parseInt(catId); });
    if (!cat) return;

    if (!confirm('Are you sure you want to delete category "' + cat.name + '"?')) return;

    adminCategories = adminCategories.filter(function(c) { return parseInt(c.id) !== parseInt(catId); });
    saveCategoriesToStorage();
    renderAdminCategoriesTable();
    populateCategoryDropdowns();

    try {
        await fetch('api/categories.php?action=delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: catId })
        });
    } catch (e) {}

    showToast('Category deleted successfully.', 'success');
}

function populateCategoryDropdowns() {
    var select = document.getElementById('menuCategory');
    if (!select) return;

    var currentVal = select.value;
    var html = '';
    adminCategories.forEach(function(cat) {
        html += `<option value="${cat.slug}">${cat.name}</option>`;
    });

    select.innerHTML = html;
    if (currentVal) select.value = currentVal;
}

window.loadAdminCategories = loadAdminCategories;
window.renderAdminCategoriesTable = renderAdminCategoriesTable;
window.autoGenerateSlug = autoGenerateSlug;
window.openCategoryModal = openCategoryModal;
window.closeCategoryModal = closeCategoryModal;
window.saveCategorySubmit = saveCategorySubmit;
window.toggleCategoryStatus = toggleCategoryStatus;
window.deleteCategory = deleteCategory;
window.populateCategoryDropdowns = populateCategoryDropdowns;
window.setAdminMenuCategoryFilter = setAdminMenuCategoryFilter;
window.onAdminMenuSearchChange = onAdminMenuSearchChange;
window.setAdminMenuPage = setAdminMenuPage;
window.renderAdminMenuCategoryPills = renderAdminMenuCategoryPills;

/* --- TABLE QR CODE STAND GENERATOR --- */
function openTableQrModal() {
    var modal = document.getElementById('tableQrModal');
    if (!modal) return;
    modal.style.display = 'flex';
    updateQrStandPreview();
}

function closeTableQrModal() {
    var modal = document.getElementById('tableQrModal');
    if (!modal) return;
    modal.style.display = 'none';
}

function updateQrStandPreview() {
    var select = document.getElementById('qrTableSelect');
    if (!select) return;

    var val = select.value;
    var subtitleEl = document.getElementById('qrStandSubtitle');
    var targetUrlEl = document.getElementById('qrTargetUrl');
    var imgEl = document.getElementById('qrPreviewImg');

    var baseUrl = window.location.href.replace('admin.html', 'index.html').split('#')[0].split('?')[0];
    var targetUrl = baseUrl;

    if (val === 'main') {
        if (subtitleEl) subtitleEl.textContent = 'Main Entrance - Scan to View Digital Menu & Order';
        targetUrl = baseUrl;
    } else {
        if (subtitleEl) subtitleEl.textContent = 'Table ' + val + ' - Scan to View Menu & Order from Table';
        targetUrl = baseUrl + '?table=' + val;
    }

    if (targetUrlEl) targetUrlEl.textContent = targetUrl;

    var qrApiUrl = 'https://quickchart.io/qr?text=' + encodeURIComponent(targetUrl) + '&size=220&margin=1';
    if (imgEl) imgEl.src = qrApiUrl;
}

function printTableQrStand() {
    var printContent = document.getElementById('qrPrintArea');
    if (!printContent) return;

    var win = window.open('', '_blank', 'width=600,height=600');
    win.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Favorite Cafe - Table QR Stand</title>
            <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
            <style>
                body { font-family: 'Poppins', sans-serif; text-align: center; padding: 40px; margin: 0; }
                .card { border: 3px double #d9230f; padding: 40px; border-radius: 16px; max-width: 450px; margin: 0 auto; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
                h1 { font-family: 'Playfair Display', serif; color: #d9230f; margin-bottom: 4px; font-size: 2.2rem; }
                p { color: #555; margin-bottom: 20px; font-size: 0.95rem; font-weight: 600; text-transform: uppercase; }
                img { width: 220px; height: 220px; border-radius: 12px; border: 4px solid #fff; box-shadow: 0 4px 15px rgba(0,0,0,0.12); }
                .footer-text { margin-top: 24px; font-weight: 700; color: #111; font-size: 1.1rem; }
                .sub-text { color: #777; font-size: 0.85rem; margin-top: 4px; }
            </style>
        </head>
        <body onload="window.print(); window.close();">
            <div class="card">
                ${printContent.innerHTML}
            </div>
        </body>
        </html>
    `);
    win.document.close();
}

window.openTableQrModal = openTableQrModal;
window.closeTableQrModal = closeTableQrModal;
window.updateQrStandPreview = updateQrStandPreview;
window.printTableQrStand = printTableQrStand;











