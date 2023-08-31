const mongoose = require('mongoose');
const Order = require('../models/order');

module.exports = {
    CHANGE_ORDER_STATUS: async data => {
        const order = await Order.findById(data.orderId);
        order.status = order.status + 1;
        order = await order.save();

        return Order.populate(order);

        // const newProduct = await new Product({
        //     name: data.name,
        //     description: data.description,
        //     images: data.images,
        //     quantity: data.quantity,
        //     price: data.price,
        //     category: data.category,
        // }).save();
    },
};