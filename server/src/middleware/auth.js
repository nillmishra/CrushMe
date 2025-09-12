const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req, res, next) => {
    try {
        // Read the token from cookies
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).send("No token provided. Authentication failed!");
        }

        // Verify the token
        const decodedObj = jwt.verify(token, "Nill@crushme09");

        // Extract userId from token
        const userId = decodedObj.userId;

        // Find user in DB
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }

        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send("Authentication failed: " + error.message);
    }
};

module.exports = { userAuth };
