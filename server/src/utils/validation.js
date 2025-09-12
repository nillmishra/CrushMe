const validator = require('validator');

const validateSignupData = (req) => {
    const { firstName, lastName, email, password} = req.body;
    if (!firstName || !lastName) {
        throw new Error("Name is not valid");
    }
    else if (firstName.length < 3 || lastName.length > 50) {
        throw new Error("Name must be between 3 to 50 characters");
    }
    else if(!validator.isEmail(email)){
        throw new Error("Email is not valid");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Password is not strong enough");
    }
};

const validateEditProfileData = (req) => {
    const ALLOWED_UPDATES = ['firstName', 'lastName','gender', 'age', 'photoUrl', 'about', 'skills'];

    const updates = Object.keys(req.body).every((k) => ALLOWED_UPDATES.includes(k));
    if (!updates) {
        throw new Error("Invalid updates!");
    }
    return updates;
};

const validatePassword = (req) => {
    const { password, newPassword } = req.body;
    if (!password || !newPassword) {
        throw new Error("Current and new passwords are required");
    }   
    return true;
}

module.exports = { validateSignupData, validateEditProfileData, validatePassword };