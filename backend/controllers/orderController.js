const supabase = require('../config/supabase');

const RIDERS = [
    { name: "Suresh Kumar", phone: "+91 98450 12345", rating: "4.9 ★", vehicle: "Electric Scooter (KA-05-EV-4421)" },
    { name: "Ramesh Reddy", phone: "+91 98765 54321", rating: "4.8 ★", vehicle: "Hero Electric (KA-01-HE-8890)" },
    { name: "Anand Sharma", phone: "+91 91234 67890", rating: "5.0 ★", vehicle: "Ather 450X (KA-04-AT-1029)" }
];

const orderController = {
    // POST /api/orders - Place a new food delivery order
    async placeOrder(req, res, next) {
        try {
            const { items, delivery_address, contact_phone, delivery_notes, payment_method } = req.body;

            if (!items || !Array.isArray(items) || items.length === 0) {
                return res.status(400).json({ success: false, message: 'Cart is empty. Please add items to place an order.' });
            }

            if (!delivery_address || !delivery_address.trim()) {
                return res.status(400).json({ success: false, message: 'Delivery address is required.' });
            }

            if (!contact_phone || !contact_phone.trim()) {
                return res.status(400).json({ success: false, message: 'Contact phone number is required.' });
            }

            // Calculate totals
            let itemsTotal = 0;
            let totalCalories = 0;
            const sanitizedItems = items.map(item => {
                const qty = parseInt(item.quantity) || 1;
                const price = parseFloat(item.price) || 150;
                const cal = parseInt(item.calories) || 200;
                itemsTotal += price * qty;
                totalCalories += cal * qty;
                return {
                    id: item.id || null,
                    name: item.name || 'Healthy Dish',
                    price: price,
                    quantity: qty,
                    calories: cal,
                    category: item.category || 'Healthy',
                    image: item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600'
                };
            });

            const deliveryFee = itemsTotal > 500 ? 0 : 40;
            const totalAmount = itemsTotal + deliveryFee;

            // Pick a rider
            const rider = RIDERS[Math.floor(Math.random() * RIDERS.length)];
            const orderNumber = `NR-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

            const orderPayload = {
                order_number: orderNumber,
                user_id: req.user.id,
                items: sanitizedItems,
                total_amount: totalAmount,
                delivery_fee: deliveryFee,
                total_calories: totalCalories,
                delivery_address: delivery_address.trim(),
                contact_phone: contact_phone.trim(),
                delivery_notes: delivery_notes ? delivery_notes.trim() : null,
                payment_method: payment_method || 'Cash on Delivery',
                payment_status: payment_method === 'Cash on Delivery' ? 'Pending' : 'Paid',
                order_status: 'Preparing',
                rider_name: rider.name,
                rider_phone: rider.phone,
                rider_lat: 12.9716,
                rider_lng: 77.5946,
                estimated_delivery_minutes: 30,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .insert([orderPayload])
                .select()
                .single();

            if (orderError) {
                console.error('Error placing order:', orderError);
                return res.status(500).json({
                    success: false,
                    message: `Order placement failed: ${orderError.message}`
                });
            }

            return res.status(201).json({
                success: true,
                message: 'Order placed successfully! Healthy kitchen is preparing your meal.',
                order: orderData
            });
        } catch (err) {
            next(err);
        }
    },

    // GET /api/orders - Get user order history
    async getUserOrders(req, res, next) {
        try {
            const { data: orders, error: ordersError } = await supabase
                .from('orders')
                .select('*')
                .eq('user_id', req.user.id)
                .order('created_at', { ascending: false });

            if (ordersError) {
                console.error('Error fetching orders:', ordersError);
                return res.status(500).json({ success: false, message: ordersError.message });
            }

            return res.status(200).json({
                success: true,
                count: orders.length,
                orders: orders || []
            });
        } catch (err) {
            next(err);
        }
    },

    // GET /api/orders/:id - Get single order details with live delivery timeline simulation
    async getOrderById(req, res, next) {
        try {
            const { id } = req.params;

            const { data: order, error: orderError } = await supabase
                .from('orders')
                .select('*')
                .eq('id', id)
                .eq('user_id', req.user.id)
                .single();

            if (orderError || !order) {
                return res.status(404).json({ success: false, message: 'Order not found.' });
            }

            // Calculate live status based on order age (minutes elapsed)
            const createdAt = new Date(order.created_at).getTime();
            const now = Date.now();
            const elapsedMinutes = (now - createdAt) / (1000 * 60);

            let liveStatus = order.order_status;
            let progressPercent = 25;
            let currentStep = 1;
            let etaMinutes = Math.max(0, Math.round(order.estimated_delivery_minutes - elapsedMinutes));

            if (order.order_status !== 'Cancelled') {
                if (elapsedMinutes < 2) {
                    liveStatus = 'Order Placed';
                    progressPercent = 20;
                    currentStep = 1;
                } else if (elapsedMinutes < 7) {
                    liveStatus = 'Kitchen Preparing';
                    progressPercent = 45;
                    currentStep = 2;
                } else if (elapsedMinutes < 15) {
                    liveStatus = 'Rider Dispatched';
                    progressPercent = 70;
                    currentStep = 3;
                } else if (elapsedMinutes < 25) {
                    liveStatus = 'Out for Delivery';
                    progressPercent = 90;
                    currentStep = 4;
                } else {
                    liveStatus = 'Delivered';
                    progressPercent = 100;
                    currentStep = 5;
                    etaMinutes = 0;
                }
            }

            // Simulated GPS rider route position based on progress
            const startLat = 12.9716;
            const startLng = 77.5946;
            const endLat = 12.9785;
            const endLng = 77.6408;
            const fraction = Math.min(1, progressPercent / 100);

            const riderLat = startLat + (endLat - startLat) * fraction;
            const riderLng = startLng + (endLng - startLng) * fraction;

            return res.status(200).json({
                success: true,
                order,
                tracking: {
                    status: liveStatus,
                    step: currentStep,
                    progressPercent,
                    etaMinutes,
                    rider: {
                        name: order.rider_name || 'Suresh Kumar',
                        phone: order.rider_phone || '+91 98450 12345',
                        lat: riderLat,
                        lng: riderLng,
                        rating: "4.9 ★",
                        vehicle: "NutriRoute Eco-Express"
                    }
                }
            });
        } catch (err) {
            next(err);
        }
    },

    // PUT /api/orders/:id/cancel - Cancel pending order
    async cancelOrder(req, res, next) {
        try {
            const { id } = req.params;

            const { data: existing, error: findError } = await supabase
                .from('orders')
                .select('*')
                .eq('id', id)
                .eq('user_id', req.user.id)
                .single();

            if (findError || !existing) {
                return res.status(404).json({ success: false, message: 'Order not found.' });
            }

            if (existing.order_status === 'Delivered') {
                return res.status(400).json({ success: false, message: 'Cannot cancel an order that has already been delivered.' });
            }

            const { data: updated, error: updateError } = await supabase
                .from('orders')
                .update({ order_status: 'Cancelled', updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single();

            if (updateError) {
                return res.status(500).json({ success: false, message: updateError.message });
            }

            return res.status(200).json({
                success: true,
                message: 'Order cancelled successfully.',
                order: updated
            });
        } catch (err) {
            next(err);
        }
    }
};

module.exports = orderController;
