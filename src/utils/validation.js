const validator = require("validator");
const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, number, password } = req.body;

    if (!firstName || !lastName) {
        throw new Error("Name is not valid");
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Email is not valid");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Please enter a Strong Password");
    }
}
const validateEditProfileData = (req) => {
    const allowedEditFields = ["firstName", "lastName", "emailId", "photoUrl", "age", "gender", "number", "about", "skills"];

    const isEditAllowed = Object.keys(req.body).every((fields) => allowedEditFields.includes(fields))

    return isEditAllowed;
}

module.exports = { validateSignUpData, validateEditProfileData }