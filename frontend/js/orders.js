/**
 * NutriRoute Orders & Live Delivery Tracking Service
 */

const OrderService = {
    // Place new order
    async placeOrder(orderData) {
        return await NutriCommon.apiFetch('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    },

    // Fetch user order history
    async getOrders() {
        return await NutriCommon.apiFetch('/orders');
    },

    // Fetch single order details with live tracking info
    async getOrderTracking(orderId) {
        return await NutriCommon.apiFetch(`/orders/${orderId}`);
    },

    // Cancel order
    async cancelOrder(orderId) {
        return await NutriCommon.apiFetch(`/orders/${orderId}/cancel`, {
            method: 'PUT'
        });
    }
};
