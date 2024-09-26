const mongoose = require("mongoose");
const validator = require("validator");

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
        unique: true,
        lowercase: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email adress "+value);
            }
        }
    },
    password: {
        type: String,
        require: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a strong password "+value);
            }
        }
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
        default: "https://www.seblod.com/images/medias/62057/_thumb2/2205256774854474505_medium.jpg",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid photo url "+value);
            }
        }
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