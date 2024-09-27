const validator = require("validator");

const validateSignUpDate = (req) => {
    const { firstName, lastName, emailId, password } = req.body;

    if (!firstName || !lastName) {
        throw new Error("Name is not valid !");
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Email Id is not valid");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Please enter a strong password");
    }
}

const validateEditProfileData = (req) => {
    const allowedEditFields = ["firstName", "lastName", "about", "photoUrl", "age", "gender", "skills"];
    const isEditAllowed = Object.keys(req.body).every(field => allowedEditFields.includes(field));
    return isEditAllowed;
}

module.exports = {
    validateSignUpDate,
    validateEditProfileData
}