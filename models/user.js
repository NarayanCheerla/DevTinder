const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    age: {
        type: Number
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Invalid gender");
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://www.seblod.com/images/medias/62057/_thumb2/2205256774854474505_medium.jpg"
    },
    about: {
        type: String,
        default: "This is default about user"
    },
    skills: {
        type: [String],
    },
}, {
    timestamps: true
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;