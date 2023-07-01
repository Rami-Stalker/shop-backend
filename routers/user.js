const express = require("express");
const { Product } = require("../models/product");
const userRouter = express.Router();
const auth = require("../middlewares/auth");
const User = require("../models/user");
const Address = require("../models/address");
const Order = require("../models/order");

// add to cart
userRouter.post("/api/update-product-quantity", async (req, res) => {
    try {
        const { id , ord } = req.body;
        let product = await Product.findById(id);
        
        if (ord < product.quantity) {
            product.quantity -= ord;
        }else {
            await Product.findByIdAndDelete(id);
        }

        product = await product.save();
        res.json(product);

        // let user = await User.findById(req.user);

        // if (user.cart.length == 0) {
        //     user.cart.push({ product, quantity: 1 });
        // } else {
        //     let isProductFound = false;
        //     for (let i = 0; i < user.cart.length; i++) {
        //         if (user.cart[i].product._id.equals(product._id)) {
        //             isProductFound = true;
        //         }
        //     }

        //     if (isProductFound) {
        //         let producttt = user.cart.find((productt) =>
        //             productt.product._id.equals(product._id)
        //         );
        //         producttt.quantity += 1;
        //     } else {
        //         user.cart.push({ product, quantity: 1 });
        //     }
        // }
        // user = await user.save();
        // res.json(user);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// save user data
userRouter.post("/api/save-user-data", auth, async (req, res) => {
    try {
        const { address , name , phone } = req.body;
        let user = await User.findById(req.user);
        user.address = address;
        user.name = name;
        user.phone = phone;
        user = await user.save();
        res.json(user);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// order product
userRouter.post("/api/add-order", auth, async (req, res) => {
    try {
        const { productsId, userQuants, totalPrice, address } = req.body;

        let products = [];

        for (let i = 0; i < productsId.length; i++) {
            let product = await Product.findById(productsId[i]);

        for (let j = 0; j < userQuants.length; j++) {
            if (product.quantity >= userQuants[j] ) {
                product.quantity -= userQuants[j];
                products.push({ product, quantity: userQuants[j] });
                product = await product.save();
            } else {
                product.quantity = 0;
                products.push({ product, quantity: product.quantity });
                product = await product.save();
            }
            
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

// get my order
userRouter.get("/api/get-user-Orders", auth, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user });
        res.json(orders);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = userRouter;