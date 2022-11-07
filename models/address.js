const mongoose = require("mongoose");

const addressSchema = mongoose.Schema({
    address: {
        required: true,
        type: String,
    },
    addressType: {
        required: true,
        type: String,
    },
    contactPersonName: {
        required: true,
        type: String,
    },
    contactPersonNumber: {
        type: String,
        required: true,
    },
    latitude: {
        type: String,
        required: true,
    },
    longitude: {
        type: String,
        required: true,
    }
});

const Address = mongoose.model("Address", addressSchema);
module.exports = Address;
