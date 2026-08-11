<div style="font-family: 'Titillium Web', sans-serif; background-color: #f4eee7; color: #2d2320; padding: 40px;">
    
<div style="text-align: center; margin-bottom: 40px;">
    <h1 style="font-family: 'Amatic SC', cursive; font-size: 3.2rem; color: #442406; text-transform: uppercase; letter-spacing: 2px; margin: 0;">Order Lifecycle Design</h1>
    <p style="color: #857570; font-size: 1.1rem; margin-top: 10px;">End-to-End Flow from Customer Cravings to Kitchen Fulfillment</p>
</div>

<div style="background: rgba(255,255,255,0.6); border-radius: 24px; padding: 30px; border: 1px solid rgba(255,255,255,0.8); box-shadow: 0 10px 30px rgba(0,0,0,0.03); margin-bottom: 30px;">
    <h3 style="color: #d8745d; border-bottom: 2px dashed #aa7262; padding-bottom: 10px; margin-bottom: 20px;">
        <i class="fas fa-mobile-alt me-2"></i> 1. The Customer Journey
    </h3>
    <ul style="list-style: none; padding-left: 0;">
        <li style="margin-bottom: 15px;">
            <strong><span style="display:inline-block; width: 24px; height: 24px; background: #442406; color: white; border-radius: 50%; text-align: center; line-height: 24px; margin-right: 10px;">1</span> Registration & Login:</strong><br>
            <span style="color: #556b73; margin-left: 38px; display: block;">The customer enters the app. New users register via a quick form (Name, Phone, Email) backed by local storage or a `users` DB table. Returning users log in to see their past history and saved addresses.</span>
        </li>
        <li style="margin-bottom: 15px;">
            <strong><span style="display:inline-block; width: 24px; height: 24px; background: #442406; color: white; border-radius: 50%; text-align: center; line-height: 24px; margin-right: 10px;">2</span> Menu Discovery & Order Placement:</strong><br>
            <span style="color: #556b73; margin-left: 38px; display: block;">Browsing the dynamic database-driven menu (styled like our PDF menu), the customer adds items to the cart. They proceed to checkout, selecting Dine-In, Takeaway, or Delivery.</span>
        </li>
        <li style="margin-bottom: 15px;">
            <strong><span style="display:inline-block; width: 24px; height: 24px; background: #442406; color: white; border-radius: 50%; text-align: center; line-height: 24px; margin-right: 10px;">3</span> Payment & Receipt:</strong><br>
            <span style="color: #556b73; margin-left: 38px; display: block;">Customer selects Cash, Card, or Mobile Money (MoMo). Upon submission, a unique Order ID (e.g., <code>FC-3825</code>) is generated. A digital receipt is shown and optionally sent via SMS/Email. The order goes live in the DB.</span>
        </li>
        <li style="margin-bottom: 15px;">
            <strong><span style="display:inline-block; width: 24px; height: 24px; background: #442406; color: white; border-radius: 50%; text-align: center; line-height: 24px; margin-right: 10px;">4</span> Real-Time Tracking:</strong><br>
            <span style="color: #556b73; margin-left: 38px; display: block;">The customer views a live timeline (Order Placed ➔ Preparing ➔ Ready/Dispatch ➔ Completed) that auto-updates without refreshing the page.</span>
        </li>
    </ul>
</div>

<div style="background: #442406; color: white; border-radius: 24px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); margin-bottom: 30px;">
    <h3 style="color: #d8745d; border-bottom: 2px dashed #aa7262; padding-bottom: 10px; margin-bottom: 20px;">
        <i class="fas fa-concierge-bell me-2"></i> 2. The Kitchen / Admin Fulfillment
    </h3>
    <ul style="list-style: none; padding-left: 0;">
        <li style="margin-bottom: 15px;">
            <strong><span style="display:inline-block; width: 24px; height: 24px; background: #d8745d; color: white; border-radius: 50%; text-align: center; line-height: 24px; margin-right: 10px;">A</span> Order Received:</strong><br>
            <span style="color: #aebfd1; margin-left: 38px; display: block;">The <code>admin.html</code> dashboard silently polls for new DB orders. When <code>FC-3825</code> hits the DB, the system flashes a notification and injects the ticket into the "Live Orders Dispatch" board. Default status: <em>Kitchen Preparing</em>.</span>
        </li>
        <li style="margin-bottom: 15px;">
            <strong><span style="display:inline-block; width: 24px; height: 24px; background: #d8745d; color: white; border-radius: 50%; text-align: center; line-height: 24px; margin-right: 10px;">B</span> Chef Progression (Status Update):</strong><br>
            <span style="color: #aebfd1; margin-left: 38px; display: block;">The Chef uses the inline dropdown to advance the status to <em>Ready for Delivery</em>. This fires an update query to the DB.</span>
        </li>
        <li style="margin-bottom: 15px;">
            <strong><span style="display:inline-block; width: 24px; height: 24px; background: #d8745d; color: white; border-radius: 50%; text-align: center; line-height: 24px; margin-right: 10px;">C</span> Dispatch & Completion:</strong><br>
            <span style="color: #aebfd1; margin-left: 38px; display: block;">Once the waiter/driver takes the food, the admin marks the order as <em>Completed</em>. The customer's tracker turns green, and the order is filed into the archives.</span>
        </li>
    </ul>
</div>

<div style="margin-top: 40px;">
    <h3 style="color: #442406; text-align: center; font-family: 'Amatic SC', cursive; font-size: 2.2rem;">System Architecture Diagram</h3>
    
```mermaid
sequenceDiagram
    participant C as Customer (index.html)
    participant DB as MySQL API (orders.php)
    participant A as Admin/Chef (admin.html)

    C->>C: Register / Login
    C->>C: Add items to Cart
    C->>C: Select Payment (Cash/MoMo/Card)
    C->>DB: POST /api/orders.php?action=create
    DB-->>C: 200 OK (Order ID FC-1234)
    C->>C: Display Timeline (Kitchen Preparing)
    
    loop Every 1 Second
        A->>DB: GET /api/orders.php
        DB-->>A: New Order Detected!
    end
    
    A->>A: Show Notification 🚨 & Add to Board
    A->>A: Chef cooks food...
    A->>DB: POST /api/orders.php?action=update (Status: Ready)
    
    loop Every 1 Second
        C->>DB: GET /api/orders.php
        DB-->>C: Order is now 'Ready'
    end
    
    C->>C: Timeline advances to Ready!
    
    A->>DB: POST update (Status: Completed)
    DB-->>C: Order is 'Completed'
    C->>C: Enjoy meal! ✅
```
</div>

</div>
