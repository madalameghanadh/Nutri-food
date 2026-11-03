/**
 * NutriRoute Cart System
 * Manages shopping cart state, calorie computation, and order preparation.
 */

const CartService = {
    CART_KEY: 'nutri_cart',

    // Get all items in cart
    getItems() {
        try {
            const raw = localStorage.getItem(this.CART_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.error('Error reading cart:', e);
            return [];
        }
    },

    // Save cart
    saveItems(items) {
        localStorage.setItem(this.CART_KEY, JSON.stringify(items));
        this.updateBadge();
    },

    // Add item to cart
    addItem(food, quantity = 1) {
        const items = this.getItems();
        const existingIdx = items.findIndex(i => (i.id && i.id === food.id) || i.name === food.name);

        const price = parseFloat(food.price) || 150;
        const calories = parseInt(food.calories) || 200;
        const protein = parseFloat(food.protein) || 0;
        const carbs = parseFloat(food.carbohydrates) || 0;
        const fat = parseFloat(food.fat) || 0;

        if (existingIdx > -1) {
            items[existingIdx].quantity += quantity;
        } else {
            items.push({
                id: food.id || `temp-${Date.now()}`,
                name: food.name,
                category: food.category || 'Healthy Food',
                price: price,
                calories: calories,
                protein: protein,
                carbohydrates: carbs,
                fat: fat,
                image: food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
                diet_type: food.diet_type || 'Vegetarian',
                serving_size: food.serving_size || '1 serving',
                quantity: quantity
            });
        }

        this.saveItems(items);
        if (typeof NutriCommon !== 'undefined' && NutriCommon.showToast) {
            NutriCommon.showToast(`Added "${food.name}" to cart! 🥗`, 'success');
        }
    },

    // Remove item from cart
    removeItem(idOrName) {
        let items = this.getItems();
        items = items.filter(i => i.id !== idOrName && i.name !== idOrName);
        this.saveItems(items);
        if (typeof NutriCommon !== 'undefined' && NutriCommon.showToast) {
            NutriCommon.showToast('Item removed from cart.', 'info');
        }
    },

    // Update quantity (+1 or -1)
    updateQuantity(idOrName, delta) {
        const items = this.getItems();
        const item = items.find(i => i.id === idOrName || i.name === idOrName);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) {
                this.removeItem(idOrName);
                return;
            }
            this.saveItems(items);
        }
    },

    // Clear cart
    clear() {
        localStorage.removeItem(this.CART_KEY);
        this.updateBadge();
    },

    // Calculate all totals
    getTotals() {
        const items = this.getItems();
        let subtotal = 0;
        let totalCalories = 0;
        let totalProtein = 0;
        let totalCarbs = 0;
        let totalFat = 0;
        let totalCount = 0;

        items.forEach(i => {
            const qty = i.quantity || 1;
            subtotal += (parseFloat(i.price) || 0) * qty;
            totalCalories += (parseInt(i.calories) || 0) * qty;
            totalProtein += (parseFloat(i.protein) || 0) * qty;
            totalCarbs += (parseFloat(i.carbohydrates) || 0) * qty;
            totalFat += (parseFloat(i.fat) || 0) * qty;
            totalCount += qty;
        });

        const deliveryFee = subtotal === 0 ? 0 : (subtotal >= 500 ? 0 : 40);
        const total = subtotal + deliveryFee;

        return {
            itemCount: totalCount,
            subtotal: Math.round(subtotal),
            deliveryFee: deliveryFee,
            total: Math.round(total),
            totalCalories: Math.round(totalCalories),
            totalProtein: Math.round(totalProtein * 10) / 10,
            totalCarbs: Math.round(totalCarbs * 10) / 10,
            totalFat: Math.round(totalFat * 10) / 10
        };
    },

    // Update cart badge across all navigation bars
    updateBadge() {
        const totals = this.getTotals();
        const badges = document.querySelectorAll('.cart-count-badge');
        badges.forEach(b => {
            b.textContent = totals.itemCount;
            b.style.display = totals.itemCount > 0 ? 'inline-flex' : 'none';
        });
    }
};

// Auto-update badge on page load
document.addEventListener('DOMContentLoaded', () => {
    CartService.updateBadge();
});
