<?php
require_once __DIR__ . '/db.php';
$stmt = $pdo->query('SELECT * FROM categories');
print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
?>
