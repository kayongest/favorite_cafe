<?php
/* ============================================================
   FAVORITE CAFE - DATABASE CONNECTION & AUTO SETUP
   ============================================================ */
header('Content-Type: application/json');

$host = 'localhost';
$user = 'root';
$pass = '';
$dbname = 'favorite_cafe';

$pdo = null;
$dbError = null;

try {
    // 1. Connect to MySQL server
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
} catch (PDOException $e) {
    try {
        $pdoServer = new PDO("mysql:host=$host", $user, $pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]);
        $pdoServer->exec("CREATE DATABASE IF NOT EXISTS `$dbname` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        $pdoServer->exec("USE `$dbname` ");

        $tableSql = "
        CREATE TABLE IF NOT EXISTS `users` (
          `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
          `full_name` varchar(100) NOT NULL,
          `email` varchar(100) NOT NULL UNIQUE,
          `phone` varchar(20) DEFAULT NULL UNIQUE,
          `password_hash` varchar(255) NOT NULL,
          `role` enum('customer','staff','admin') DEFAULT 'customer',
          `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
          `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          `is_active` tinyint(1) DEFAULT 1
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        ";
        $pdoServer->exec($tableSql);

        $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]);
    } catch (PDOException $e2) {
        $pdo = null;
        $dbError = $e2->getMessage();
    }
}
?>
