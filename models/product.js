const mongoose = require("mongoose");
const Rating = require("./rating");

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    images: [
        {
            type: String,
            required: true,
        },
    ],
    quantity: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    rating: [Rating],
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
