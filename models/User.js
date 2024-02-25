const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        phone: {
            type: Number,
            required: true
        },
        priority: {
            type: Number,
            enum: [0, 1, 2],
            required: true
        },
        password:{
            type: String,
            required: true
        },
        refreshToken:{
            type: String,
            default: null
        }
    }
)

module.exports = mongoose.model('User', userSchema);