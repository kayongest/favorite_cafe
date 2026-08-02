<?php
/* ============================================================
   MASHARIKI RESTAURANT - AUTHENTICATION API ENDPOINT
   ============================================================ */
require_once __DIR__ . '/db.php';

// Accept both JSON payload and POST data
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!$data) $data = $_POST;

$action = isset($_GET['action']) ? $_GET['action'] : (isset($data['action']) ? $data['action'] : '');

if ($action === 'register') {
    $fullName = isset($data['full_name']) ? trim($data['full_name']) : (isset($data['name']) ? trim($data['name']) : '');
    $email = isset($data['email']) ? strtolower(trim($data['email'])) : '';
    $phone = isset($data['phone']) ? trim($data['phone']) : null;
    $password = isset($data['password']) ? trim($data['password']) : (isset($data['pass']) ? trim($data['pass']) : '');

    if (empty($fullName) || empty($email) || empty($password)) {
        echo json_encode(['status' => 'error', 'message' => 'Please complete all required fields.']);
        exit;
    }

    if (strlen($password) < 6) {
        echo json_encode(['status' => 'error', 'message' => 'Password must be at least 6 characters long.']);
        exit;
    }

    // Check if email or phone already exists in DB
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ? OR (phone IS NOT NULL AND phone = ?)");
    $stmt->execute([$email, $phone]);
    if ($stmt->fetch()) {
        echo json_encode(['status' => 'error', 'message' => 'An account with this email or phone number already exists! Please sign in.']);
        exit;
    }

    // Hash password
    $passwordHash = password_hash($password, PASSWORD_BCRYPT);

    // Insert user into MySQL users table
    $insertStmt = $pdo->prepare("INSERT INTO users (full_name, email, phone, password_hash, role, is_active) VALUES (?, ?, ?, ?, 'customer', 1)");
    $success = $insertStmt->execute([$fullName, $email, $phone, $passwordHash]);

    if ($success) {
        $userId = $pdo->lastInsertId();
        echo json_encode([
            'status' => 'success',
            'message' => "Welcome to Mashariki, $fullName! Your customer account has been created successfully.",
            'user' => [
                'id' => $userId,
                'full_name' => $fullName,
                'email' => $email,
                'phone' => $phone,
                'role' => 'customer'
            ]
        ]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to create user account. Please try again.']);
    }
    exit;

} elseif ($action === 'login') {
    $email = isset($data['email']) ? strtolower(trim($data['email'])) : '';
    $password = isset($data['password']) ? trim($data['password']) : (isset($data['pass']) ? trim($data['pass']) : '');

    if (empty($email) || empty($password)) {
        echo json_encode(['status' => 'error', 'message' => 'Please enter both email address and password.']);
        exit;
    }

    // Query user by email from MySQL users table
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? LIMIT 1");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    // 1. User not found in DB
    if (!$user) {
        echo json_encode(['status' => 'error', 'message' => 'User not found in our database. Please register an account first!']);
        exit;
    }

    // 2. Account deactivated check
    if (isset($user['is_active']) && (int)$user['is_active'] === 0) {
        echo json_encode(['status' => 'error', 'message' => 'Account is deactivated. Please contact support.']);
        exit;
    }

    // 3. Password verification
    if (!password_verify($password, $user['password_hash']) && $password !== $user['password_hash']) {
        echo json_encode(['status' => 'error', 'message' => 'Incorrect password! Please check your details and try again.']);
        exit;
    }

    // Success
    echo json_encode([
        'status' => 'success',
        'message' => "Welcome back, {$user['full_name']}! You are now logged in to place orders.",
        'user' => [
            'id' => $user['id'],
            'full_name' => $user['full_name'],
            'email' => $user['email'],
            'phone' => $user['phone'],
            'role' => $user['role']
        ]
    ]);
    exit;

} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid action specification.']);
    exit;
}
?>
