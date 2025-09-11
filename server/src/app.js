const express = require('express');
const connectDB = require('./config/database'); // Ensure database connection is established
const app = express();
const bcrypt = require('bcrypt');
const User = require('./models/user');
const cookieParser = require('cookie-parser');
const { validateSignupData } = require('./utils/validation');
const jwt = require('jsonwebtoken');
const { userAuth } = require('./middleware/auth');

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies
// Signup route

app.post("/signup", async (req, res) => {
    //validation of data
    try {
        validateSignupData(req);
        const { firstName, lastName, email, password } = req.body;
        //encryption of password
        const passwordHash = await bcrypt.hash(password, 10);
        console.log(passwordHash);
        //creating a new instance of user model

        const user = new User({
            firstName,
            lastName,
            email,
            password: passwordHash
        });

        await user.save();
        res.send("User signed up");
    } catch (error) {
        console.error(error);
        res.status(400).send("Error signing up user" + error.message);
    }
});

app.post("/login", async (req, res) => {
    try{
        const { email, password } = req.body;
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send("Invalid Credentials!");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            // CREATE A JWT TOKEN AND SEND IT TO THE USER
            const token = await jwt.sign({ userId: user._id }, "Nill@crushme09");
            console.log(token);
            //ADD THE TOKEN To COOKIE and send the response to the user
            res.cookie("token", token);
        res.send("User logged in successfully");
        } else {
            throw new Error("Invalid Credentials!");
        } 
    } catch (error) {
        res.status(400).send("Error logging in: " + error.message);
    }
});

app.get("/profile",userAuth, async (req, res) => {
    try{
    const user = req.user;                               
    res.send(user);
} catch (error) {
    res.status(401).send("Error fetching profile: " + error.message);       
}
});

//get user by mail
app.get("/user", async (req, res) => {
    const userEmail = req.body.email;
    try {
        const users = await User.findOne({ email: userEmail });
        if (!users) {
            return res.status(404).send("User not found");
        } else {
            res.send(users);
        }
        // Alternative approach using find() which returns an array
        // const users = await User.find({ email: userEmail });
        // if(users.length === 0){
        //     return res.status(404).send("User not found");
        // }else{
        //     res.send(users);

        // }
    } catch (error) {
        res.status(500).send("Error fetching user" + error.message);
    }
});

//Feed API - GET /feed - get all users from database
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (error) {
        res.status(500).send("Error fetching users" + error.message);
    }
});

app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try {
        //const user = await User.findByIdAndDelete(userId);
        const user = await User.findByIdAndDelete({ _id: userId });

        if (!user) {
            return res.status(404).send("User not found");
        }

        res.send("User deleted successfully");
    } catch (error) {
        res.status(500).send("Error deleting user: " + error.message);
    }
});

app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;
    try {
        const ALLOWED_UPDATES = ['userId', 'firstName', 'lastName', 'password', 'age', 'gender', 'photoUrl', 'about', 'skills'];
        const isUpdateAllowed = Object.keys(data).every((k) =>
            ALLOWED_UPDATES.includes(k));
        if (!isUpdateAllowed) {
            throw new Error("Invalid updates!");
        }
        if (data.skills.length > 5) {
            throw new Error("Cannot add more than 5 skills");
        }
        const user = await User.findByIdAndUpdate({ _id: userId }, data, {
            returnDocument: "after",
            runValidators: true
        });
        console.log(user);
        res.send("User updated successfully");
    } catch (error) {
        res.status(500).send("Error updating user: " + error.message);
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



