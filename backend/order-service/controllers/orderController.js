const Order = require("../models/Order");
require("dotenv").config();

// Helper to compare order items
const isSameOrder = (existingOrder, newOrder) => {
    const existingItems = JSON.stringify(existingOrder.orderItems.sort((a, b) => a.productId.toString().localeCompare(b.productId.toString())));
    const newItems = JSON.stringify(newOrder.orderItems.sort((a, b) => a.productId.localeCompare(b.productId)));
    return existingItems === newItems &&
        existingOrder.shippingAddress.street === newOrder.shippingAddress.street &&
        existingOrder.shippingAddress.city === newOrder.shippingAddress.city &&
        existingOrder.shippingAddress.postalCode === newOrder.shippingAddress.postalCode &&
        existingOrder.shippingAddress.country === newOrder.shippingAddress.country;
};

// Create a new order
exports.createOrder = async (req, res) => {
    try {
        const { userId, orderItems, shippingAddress, totalAmount } = req.body;

        // Check for existing identical order
        const existingOrders = await Order.find({ userId });
        const duplicate = existingOrders.find(order =>
            isSameOrder(order, { orderItems, shippingAddress })
        );

        if (duplicate) {
            return res.status(400).json({ message: "Duplicate order already exists." });
        }

        const newOrder = new Order({
            userId,
            orderItems,
            shippingAddress,
            totalAmount
        });

        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("userId", "name").populate("orderItems.productId", "name price");
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("userId", "name")
            .populate("orderItems.productId", "name price");

        if (!order) return res.status(404).json({ message: "Order not found" });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update order
exports.updateOrder = async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedOrder) return res.status(404).json({ message: "Order not found" });
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete order
exports.deleteOrder = async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        if (!deletedOrder) return res.status(404).json({ message: "Order not found" });
        res.json({ message: "Order deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
