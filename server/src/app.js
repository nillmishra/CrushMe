const express = require('express');
const connectDB = require('./config/database'); // Ensure database connection is established
const app = express();
const User = require('./models/user');

app.post("/signup", async (req, res) => {
    const user = new User(
        {
            firstName: "Nill",
            lastName: "Mishra",
            email: "nill@gmail.com",
            password: "12345",
        });
        try {
    await user.save();
    res.send("User signed up");
        } catch (error) {
            console.error(error);
            res.status(500).send("Error signing up user" + error.message);
        }   
});


connectDB().then(() => {
    console.log('Connected to MongoDB');
    // Start server
    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});



