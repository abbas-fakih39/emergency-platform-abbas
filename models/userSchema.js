const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    id:{
        type: Number,
        unique: true,
        required: true,
    },
    fullname:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: false,
        lowercase: true,
        trim: true,
        unique: true,
    },
    phoneNumber:{
        type: String,
        unique: true,
        required: [true, "Phone number is required"],
        trim: true,
    },
    userType:{
        type:String,
        required: true,
        enum:["Shelter_requester", "Shelter_provider", "Admin"],
    },
    location:{
        type: Point,
    },
    created_at:{
    type: Date,
    required: true,
    default: Date.now,
    }
},
{timestamps:true}
);

module.exports = mongoose.model("User", userSchema);