<?php

namespace Database\Seeders;

use App\Models\MenuItem;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $menuItems = [
            ['name' => 'Bruschetta', 'description' => 'Toasted bread with fresh tomatoes, garlic, and basil', 'price' => 12.00, 'category' => 'appetizer'],
            ['name' => 'Caesar Salad', 'description' => 'Crisp romaine lettuce with Caesar dressing and croutons', 'price' => 14.00, 'category' => 'appetizer'],
            ['name' => 'Soup of the Day', 'description' => 'Ask your server for today\'s selection', 'price' => 10.00, 'category' => 'appetizer'],
            ['name' => 'Spring Rolls', 'description' => 'Crispy vegetable spring rolls with sweet chili sauce', 'price' => 11.00, 'category' => 'appetizer'],

            ['name' => 'Grilled Salmon', 'description' => 'Fresh Atlantic salmon with lemon butter sauce', 'price' => 32.00, 'category' => 'main_course'],
            ['name' => 'Ribeye Steak', 'description' => '300g grass-fed ribeye with roasted vegetables', 'price' => 42.00, 'category' => 'main_course'],
            ['name' => 'Chicken Parmesan', 'description' => 'Breaded chicken breast with marinara and mozzarella', 'price' => 26.00, 'category' => 'main_course'],
            ['name' => 'Pasta Carbonara', 'description' => 'Spaghetti with pancetta, egg, and parmesan', 'price' => 22.00, 'category' => 'main_course'],
            ['name' => 'Vegetable Risotto', 'description' => 'Creamy arborio rice with seasonal vegetables', 'price' => 20.00, 'category' => 'main_course'],

            ['name' => 'Tiramisu', 'description' => 'Classic Italian coffee-flavored dessert', 'price' => 14.00, 'category' => 'dessert'],
            ['name' => 'Chocolate Lava Cake', 'description' => 'Warm chocolate cake with molten center', 'price' => 16.00, 'category' => 'dessert'],
            ['name' => 'Cheesecake', 'description' => 'New York style cheesecake with berry compote', 'price' => 14.00, 'category' => 'dessert'],

            ['name' => 'Sparkling Water', 'description' => 'San Pellegrino 750ml', 'price' => 6.00, 'category' => 'beverage'],
            ['name' => 'Fresh Juice', 'description' => 'Orange, apple, or mixed berry', 'price' => 8.00, 'category' => 'beverage'],
            ['name' => 'Coffee', 'description' => 'Espresso, cappuccino, or latte', 'price' => 5.00, 'category' => 'beverage'],
            ['name' => 'Iced Tea', 'description' => 'House-brewed with lemon', 'price' => 5.00, 'category' => 'beverage'],

            ['name' => 'Garlic Bread', 'description' => 'Toasted ciabatta with garlic butter', 'price' => 8.00, 'category' => 'side'],
            ['name' => 'Mashed Potatoes', 'description' => 'Creamy butter mashed potatoes', 'price' => 9.00, 'category' => 'side'],
            ['name' => 'Grilled Vegetables', 'description' => 'Seasonal vegetables with herb oil', 'price' => 10.00, 'category' => 'side'],
        ];

        foreach ($menuItems as $item) {
            MenuItem::create($item);
        }
    }
}
