const e = require("express");
const express = require("express");
const auth = require("../middlewares/auth");
const Product = require("../models/product");
const { rawListeners } = require("../models/rating");
const Rating = require("../models/rating");
const productRouter = express.Router();

// get Product 
productRouter.get('/api/products', auth, async (req, res) => {
    try {
        const products = await Product.find({ category: req.query.category });
        res.json(products)
    } catch (e) {
        res.status(500).json({ error: e.toString })
    }
});

// create a get request to search products and get them
productRouter.get('/api/products/search/:name', auth, async (req, res) => {
    try {
        const products = await Product.find({
            name: { $regex: req.params.name, $options: "i" }
        });
        res.json(products);
    } catch (e) {
        res.status(500).json({ error: e.message });

    }
});

// create a post request route to rate the product.
productRouter.post("/api/rate-product", auth, async (req, res) => {
    try {
        const { id, rating } = req.body;
        let product = await Product.findById(id);

        // if you did rated before
        for (let i = 0; i < product.ratings.length; i++) {
            if (product.ratings[i].userId == req.user) {
                product.ratings.splice(i, 1); // to delete your breviuos rating
                break;
            }
        }
        
        // your new rating
        const ratingSchema = {
            userId: req.user,
            rating,
        };
        
        // add your new rating
        product.ratings.push(ratingSchema); // like add in dart
        product = await product.save();
        res.json(product);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


module.exports = productRouter;