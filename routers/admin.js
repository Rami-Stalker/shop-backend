const express = require("express");
const adminRouter = express.Router();
const admin = require("../middlewares/admin");
const Order = require("../models/order");
const { Product } = require("../models/product");
const FCM = require("fcm-node");
const { response } = require("express");
const auth = require("../middlewares/auth");
const User = require("../models/user");

const SERVER_KEY = "AAAAA71ZrlU:APA91bGrVFXm6Rm6G0jQDvT0E3zUQSKhVWZK_LzXeo6V46cbSCx5mCv-oC3igHHLJ57kb-dpvKEszl6S2KHHJiZM28FZRbOcTGQsgf-2EuEQERRLbZL9AI1aaKm00m-LAZDzP1xzdKwE";

// add product
adminRouter.post("/admin/add-product", admin, async (req, res) => {
    try {
        const { name, description, images, quantity, price, category } = req.body;
        let product = new Product({
            name,
            description,
            images,
            quantity,
            price,
            category,
        });
        product = await product.save();
        res.json(product);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// get all products
adminRouter.get("/admin/get-products", admin, async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// delete product
adminRouter.post("/admin/delete-product", admin, async (req, res) => {
    try {
        const { id } = req.body;
        let product = await Product.findByIdAndDelete(id);
        res.json(product);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// update product
adminRouter.post("/admin/update-product", admin, async (req, res) => {
    try {
        const {id, name, description, price, quantity } = req.body;
        let product = await Product.findById(id);
        if (price < product.price) {
            product.oldPrice = product.price;
        }
        product.name = name,
        product.description = description,
        product.price = price,
        product.quantity = quantity,
        product = await product.save();
        res.json(product);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// get all orders
adminRouter.get("/admin/get-orders", admin, async (req, res) => {
    try {
        const orders = await Order.find({});
        res.json(orders);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// change order
adminRouter.post("/admin/change-order-status", admin, async (req, res) => {
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

// adminRouter.post("/admin/fcm", auth, async (req, res) => {
//     try {
        
//         const { topics, title, body, userId } = req.body;

//         const user = User.findById(userId);

//         // const firebaseToken = user.firebaseToken;

//         let fcm = new FCM(SERVER_KEY);

//         let message = {
//             to: "/topics/" + topics,
//             //or
//             // to: user.firebaseToken,
//             notification : {
//                 title: title,
//                 body: body,
//                 sound: 'default',
//                 "click_action": "FCM_BLUGIN_ACTIVITY",
//                 "icon": "fcm_push_icon",
//             },
//             data: req.body.data,
//         }

//         fcm.send(message, (err, response) => {
//             if (err) {
//                 res.status(500).json({ error: err });
//             } 
//             else{
//                 res.json(response);
//             }
//         });


//     } catch (e) {
//         res.status(500).json({ error: e.message });
//     }
// });



// delete order
adminRouter.post("/admin/delete-order", admin, async (req, res) => {
    try {
        const { id } = req.body;
        let order = await Order.findByIdAndDelete(id);
        res.json(order);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


adminRouter.get("/admin/analytics", admin, async (req, res) => {
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

async function fetchCategoryWiseProduct(category) {
    let earnings = 0;
    let categoryOrders = await Order.find({
        "products.product.category": category,
    });

    for (let i = 0; i < categoryOrders.length; i++) {
        for (let j = 0; j < categoryOrders[i].products.length; j++) {
            earnings +=
                categoryOrders[i].products[j].quantity *
                categoryOrders[i].products[j].product.price;
        }
    }
    return earnings;
}

module.exports = adminRouter;
