const mongoose = require('mongoose');

const dbSchema = new mongoose.Schema({
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    latitude: {
        type: Number,
        required: true,
    },
    longitude: {
        type: Number, 
        required: true,
    }
});

const table = mongoose.model('table', dbSchema)
module.exports = table;