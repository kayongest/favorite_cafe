<?php
require_once __DIR__ . '/db.php';

$pdo->beginTransaction();

try {
    // 1. Delete all recent messy categories
    $pdo->exec("DELETE FROM categories WHERE id >= 16");

    // 2. Define clean categories based on the PDF and CSV
    $cleanCats = [
        ['Black Coffee', 'black-coffee', 'fas fa-mug-hot'],
        ['Coffee with Milk', 'coffee-with-milk', 'fas fa-mug-hot'],
        ['Iced Coffee', 'iced-coffee', 'fas fa-glass-whiskey'],
        ['Teas', 'teas', 'fas fa-leaf'],
        ['Milk Shakes', 'milk-shakes', 'fas fa-blender'],
        ['Fresh Juices', 'fresh-juices', 'fas fa-lemon'],
        ['Ice Cream', 'ice-cream', 'fas fa-ice-cream'],
        ['Smoothies', 'smoothies', 'fas fa-blender-phone'],
        ['Soda', 'soda', 'fas fa-wine-bottle'],
        ['Burgers', 'burgers', 'fas fa-hamburger'],
        ['Drinks', 'drinks', 'fas fa-cocktail'],
        ['Salads', 'salads', 'fas fa-carrot']
    ];

    $stmt = $pdo->prepare("INSERT IGNORE INTO categories (name, slug, icon, is_active, sort_order) VALUES (?, ?, ?, 1, ?)");
    
    $order = 16;
    foreach ($cleanCats as $cat) {
        $stmt->execute([$cat[0], $cat[1], $cat[2], $order]);
        $order++;
    }

    // 3. Update menu_items to point to these new slugs exactly
    $pdo->exec("UPDATE menu_items SET category = 'black-coffee' WHERE category LIKE '%black%coffee%' OR category = 'blackcoffee'");
    $pdo->exec("UPDATE menu_items SET category = 'coffee-with-milk' WHERE category LIKE '%coffee%milk%' OR category = 'coffeewithmilk'");
    $pdo->exec("UPDATE menu_items SET category = 'iced-coffee' WHERE category LIKE '%iced%coffee%'");
    $pdo->exec("UPDATE menu_items SET category = 'teas' WHERE category = 'teas'");
    $pdo->exec("UPDATE menu_items SET category = 'milk-shakes' WHERE category LIKE '%milk%shake%' OR category = 'milkshakes'");
    $pdo->exec("UPDATE menu_items SET category = 'fresh-juices' WHERE category LIKE '%fresh%juice%'");
    $pdo->exec("UPDATE menu_items SET category = 'ice-cream' WHERE category LIKE '%iced%cream%' OR category LIKE '%ice%cream%' OR category = 'icedcream'");
    $pdo->exec("UPDATE menu_items SET category = 'smoothies' WHERE category = 'smoothies'");
    $pdo->exec("UPDATE menu_items SET category = 'soda' WHERE category = 'soda'");
    
    $pdo->commit();
    echo "Categories cleaned up and synced!\n";
} catch (Exception $e) {
    $pdo->rollBack();
    echo "Error: " . $e->getMessage() . "\n";
}
?>
