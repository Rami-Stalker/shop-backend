const mongoose = require("mongoose");

const addressSchema = mongoose.Schema({
    address: {
        type: String,
        default: "",
    },
    addressType: {
        type: String,
        default: "",
    },
    contactPersonName: {
        type: String,
        default: "",
    },
    contactPersonNumber: {
        type: String,
        default: "",
    },
    latitude: {
        type: String,
        default: "",
    },
    longitude: {
        type: String,
        default: "",
    }
});

module.exports = addressSchema;

