# Walkthrough - Editing Dish Metadata (Category, Calories, Prep Time, Rating, Tags)

Administrators can now edit **all metadata fields** displayed on the dish popup modal (`.mpbody`) directly from the **Admin Portal** ([admin.html](file:///c:/xampp/htdocs/restaurante/admin.html))!

---

## 📝 How to Edit Dish Details:

1. Open the Admin Dashboard at [admin.html](file:///c:/xampp/htdocs/restaurante/admin.html) and navigate to the **"Menu Management"** tab.
2. Click **`Edit Dish`** (pencil icon) on any dish or click **`+ Add New Dish`**.
3. In the popup modal, you can now customize:
   - 🏷️ **Category Tag (`#mpCat`)**: Select `Wraps`, `Burgers`, `Pizza`, `Chicken`, `Pasta`, `Desserts`, or `Drinks` from the dropdown.
   - 🔥 **Calories (`#mpMeta`)**: Enter value in the **`Calories (kcal)`** input field (e.g., `400`).
   - ⏱️ **Prep Time (`#mpMeta`)**: Enter preparation minutes in **`Prep Time (mins)`** (e.g., `10`).
   - ⭐ **Rating & Reviews (`#mpStars` & `#mpMeta`)**: Enter values in **`Rating (1-5)`** (e.g., `5.0`) and **`Reviews Count`** (e.g., `12`).
   - 🏷️ **Item Badges/Tags (`#mpTags`)**: Type comma-separated tags into **`Tags`** (e.g., `Bestseller, Cheesy, Spicy`).
4. Click **`Save Dish to Menu`**. The customer dish modal on [index.html](file:///c:/xampp/htdocs/restaurante/index.html) will update instantly!
