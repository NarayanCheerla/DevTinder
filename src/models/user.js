const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50,
    },
    lastName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email adress " + value);
            }
        }
    },
    password: {
        type: String,
        require: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Enter a strong password " + value);
            }
        }
    },
    age: {
        type: Number
    },
    gender: {
        type: String,
        enum: {
            values: ["male", "female", "others"],
            message: `{VALUE} is not allowed`
        }
    },
    photoUrl: {
        type: String,
        default: "https://www.seblod.com/images/medias/62057/_thumb2/2205256774854474505_medium.jpg",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid photo url " + value);
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

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, "Dev@Tinder@345", {
        expiresIn: "1h"
    });
    return token;
}

userSchema.methods.validatePassword = async function (password) {
    const user = this;
    const isPasswordValid = await bcrypt.compare(password, user.password);
    return isPasswordValid;
}

const userModel = new mongoose.model("User", userSchema);

module.exports = userModel;