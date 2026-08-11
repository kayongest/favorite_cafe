<?php
require_once __DIR__ . '/db.php';

try {
    $pdo->exec("DROP TABLE IF EXISTS `menu_items`");
    $tableSql = "
    CREATE TABLE `menu_items` (
      `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
      `title` varchar(150) NOT NULL,
      `category` varchar(50) NOT NULL,
      `price` decimal(10,2) NOT NULL,
      `old_price` decimal(10,2) DEFAULT NULL,
      `image` varchar(255) NOT NULL,
      `rating` decimal(3,1) DEFAULT 5.0,
      `reviews_count` int(11) DEFAULT 12,
      `calories` int(11) DEFAULT 350,
      `prep_time` int(11) DEFAULT 15,
      `description` text DEFAULT NULL,
      `tags` varchar(255) DEFAULT 'Popular',
      `is_available` tinyint(1) DEFAULT 1,
      `created_at` timestamp DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ";
    $pdo->exec($tableSql);

    $jsonFile = __DIR__ . '/menu.json';
    if (file_exists($jsonFile)) {
        $items = json_decode(file_get_contents($jsonFile), true);
        if (is_array($items)) {
            $stmt = $pdo->prepare("INSERT INTO menu_items (id, title, category, price, old_price, image, rating, reviews_count, calories, prep_time, description, tags, is_available) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            foreach ($items as $item) {
                $stmt->execute([
                    $item['id'],
                    $item['title'],
                    $item['category'],
                    $item['price'],
                    $item['old_price'] ?? null,
                    $item['image'],
                    $item['rating'] ?? 5.0,
                    $item['reviews_count'] ?? 50,
                    $item['calories'] ?? 350,
                    $item['prep_time'] ?? 15,
                    $item['description'] ?? '',
                    $item['tags'] ?? 'Popular',
                    $item['is_available'] ?? 1
                ]);
            }
            echo "Successfully re-seeded " . count($items) . " menu items into favorite_cafe database!\n";
        }
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
