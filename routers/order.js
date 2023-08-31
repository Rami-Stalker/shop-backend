const express = require("express");
const orderRouter = express.Router();
const admin = require("../middlewares/admin");
const auth = require("../middlewares/auth");
const Order = require("../models/order");
const { Product } = require("../models/product");
const fetchCategoryWiseProduct = require("../controller/order");

// Get order
orderRouter.get("/", admin, async (req, res) => {
    try {
        const orders = await Order.find({});
        res.json(orders);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Get by id
orderRouter.get("/get-by-id", auth, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user });
        res.json(orders);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Add order
orderRouter.post("/add-order", auth, async (req, res) => {
    try {
        const { productsId, userQuants, totalPrice, address } = req.body;

        let products = [];

        for (let i = 0; i < productsId.length; i++) {
            let product = await Product.findById(productsId[i]);

            if (product.quantity >= userQuants[i] ) {
                product.quantity -= userQuants[i];
                products.push({ product, quantity: userQuants[i] });
                product = await product.save();
            } else {
                product.quantity = 0;
                products.push({ product, quantity: product.quantity });
                product = await product.save();
            }
        }

        let order = new Order({
            products,
            totalPrice,
            address,
            userId: req.user,
            orderedAt: new Date().getTime(),
        });
        order = await order.save();
        res.json(order);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


// Change order status
orderRouter.post("/change-order-status", admin, async (req, res) => {
    try {
        const { id, status } = req.body;
        let order = await Order.findById(id);
        order.status = status,
            order = await order.save();
        res.json(order);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Delete order
orderRouter.post("/delete-order", admin, async (req, res) => {
    try {
        const { id } = req.body;
        let order = await Order.findByIdAndDelete(id);
        res.json(order);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

orderRouter.get("/analytics", admin, async (req, res) => {
    try {
        const orders = await Order.find({});
        let totalEarnings = 0;

        for (let i = 0; i < orders.length; i++) {
            for (let j = 0; j < orders[i].products.length; j++) {
                totalEarnings +=
                    orders[i].products[j].quantity * orders[i].products[j].product.price;
            }
        }
        // CATEGORY WISE ORDER FETCHING
        let mobileEarnings = await fetchCategoryWiseProduct("Mobiles");
        let essentialEarnings = await fetchCategoryWiseProduct("Essentials");
        let applianceEarnings = await fetchCategoryWiseProduct("Appliances");
        let booksEarnings = await fetchCategoryWiseProduct("Books");
        let fashionEarnings = await fetchCategoryWiseProduct("Fashion");

        let earnings = {
            totalEarnings,
            mobileEarnings,
            essentialEarnings,
            applianceEarnings,
            booksEarnings,
            fashionEarnings,
        };

        res.json(earnings);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = orderRouter;