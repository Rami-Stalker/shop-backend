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

// remove from cart
userRouter.delete("/api/remove-from-cart/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        let user = await User.findById(req.user);

        for (let i = 0; i < user.cart.length; i++) {
            if (user.cart[i].product._id.equals(product._id)) {
                if (user.cart[i].quantity == 1) {
                    user.cart.splice(i, 1);
                } else {
                    user.cart[i].quantity -= 1;
                }
            }
        }
        user = await user.save();
        res.json(user);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


// save user address
userRouter.post("/api/save-user-address", auth, async (req, res) => {
    try {
        const { address } = req.body;
        let user = await User.findById(req.user);
        user.address = address;
        user = await user.save();
        res.json(user);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// order product
userRouter.post("/api/order", auth, async (req, res) => {
    try {
        const { products, userQuants, totalPrice, address } = req.body;

        let productss = [];

        for (let i = 0; i < products.length; i++) {
            let product = await Product.findById(products[i]._id);
            productss.push({ product, quantity: userQuants[i] });
        }

        // for (let i = 0; i < products.length; i++) {
        //     let product = await Product.findById(products[i]._id);

        // for (let j = 0; j < userQuants.length; j++) {
        //     if (userQuants[j] <= products[i].quantity) {
        //         products[i].quantity -= userQuants[j];
        //         await product.save();
        //         productss.push({ product, quantity: userQuants[j] });
        //     } else {
        //         return res
        //             .status(400)
        //             .json({ msg: `${product.name} is out of stock!` });
        //     }
            
        // }
        // }

        let order = new Order({
            productss,
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
userRouter.get("/api/orders/me", auth, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user });
        res.json(orders);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = userRouter;