const express = require("express");
const productRouter = express.Router();
const admin = require("../middlewares/admin");
const { Product } = require("../models/product");

// Get products
productRouter.get("/", async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Get category product
productRouter.get("/categories", async (req, res) => {
    try {
        const products = await Product.find({ category: req.query.category });
        res.json(products);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Get search product
productRouter.get("/search/:name", async (req, res) => {
    try {
        const products = await Product.find({
            name: { $regex: req.params.name, $options: "i" },
        });

        res.json(products);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Get rating product
productRouter.get("/get-rating", async (req, res) => {
    try {
        let products = [];
        const productss = await Product.find({});

        for (let i = 0; i < productss.length; i++) {
            if (i < 8) {
                if (productss[i].quantity != 0) {
                    products.push(productss[i]);
                }
            }
        }

        products = products.sort((a, b) => {
            let aSum = 0;
            let bSum = 0;

            for (let i = 0; i < a.ratings.length; i++) {
                aSum += a.ratings[i].rating;
            }

            for (let i = 0; i < b.ratings.length; i++) {
                bSum += b.ratings[i].rating;
            }
            return aSum < bSum ? 1 : -1;
        });

        res.json(products);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Get newest product
productRouter.get("/get-newest", async (req, res) => {
    try {
        let products = [];
        const productss = await Product.find({});

        for (let i = 0; i < productss.length; i++) {
            if (productss[i].quantity != 0) {
                products.push(productss[i]);
            }
        }
        res.json(products);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Add product
productRouter.post("/add-product", admin, async (req, res) => {
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

// Update product
productRouter.post("/update-product", admin, async (req, res) => {
    try {
        const { id, name, description, price, quantity } = req.body;
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

// Delete product
productRouter.post("/delete-product", admin, async (req, res) => {
    try {
        const { id } = req.body;
        let product = await Product.findByIdAndDelete(id);
        res.json(product);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = productRouter;

// create a post request route to rate the product.
// productRouter.post("/api/get-rating-products", async (req, res) => {
//     try {
//         const { id, rating } = req.body;
//         let product = await Product.findById(id);

//         for (let i = 0; i < product.ratings.length; i++) {
//             if (product.ratings[i].userId == req.user) {
//                 product.ratings.splice(i, 1);
//                 break;
//             }
//         }

//         const ratingSchema = {
//             userId: req.user,
//             rating,
//         };

//         product.ratings.push(ratingSchema);
//         product = await product.save();
//         res.json(product);
//     } catch (e) {
//         res.status(500).json({ error: e.message });
//     }
// });
