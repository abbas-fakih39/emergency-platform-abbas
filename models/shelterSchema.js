const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shelterSchema = new Schema({
    shelter_id: {
        type: String,
        unique: true,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    location:{
        type: Point,
    },
    capacity: {
        type: Number,
        required: true,
        min: 1
    },
    current_occupancy: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    contact_number: {
        type: String,
        required: false,
        trim: true,
        unique: true
    },
    managed_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },

},
{timestamps:true}
);