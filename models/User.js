const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        min: 3,
        max: 255,
    },
    last_name: {
        type: String,
        required: true,
        min: 3,
        max: 255,
    },
    username: {
        type: String,
        required: true,
        min: 3,
        max: 255,
    },
    bio: {
        type: String,
        required: true,
        min: 50,
        max: 1000,
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255,
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 1024,
    }
//         "id": 1,
//         "first_name": "John",
//         "last_name": "Doe",
//         "username": "johndoe",
//         "bio": "I am John Doe",
//         "email": "johndoe@email.com",
//         "password": "test123"

}, {timestamps: true,});

// create User model
module.exports = mongoose.model("User", UserSchema);