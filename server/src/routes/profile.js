const express = require('express');
const { userAuth } = require('../middleware/auth');
const {validateEditProfileData} = require('../utils/validation');
const { validatePassword } = require('../utils/validation'); 
const bcrypt = require('bcrypt');  

const profileRouter = express.Router();

profileRouter.get("/profile/view",userAuth, async (req, res) => {
    try{
    const user = req.user;                               
    res.send(user);
} catch (error) {
    res.status(401).send("Error fetching profile: " + error.message);       
}
});

profileRouter.patch("/profile/edit",userAuth, async (req, res) => {
    try{
        if(!validateEditProfileData(req)){
            throw new Error("Invalid data");
        }
        const loggedInUser = req.user;
        console.log(loggedInUser);
        Object.keys(req.body).forEach((key) => {
            loggedInUser[key] = req.body[key];
        });
        await loggedInUser.save();
        console.log(loggedInUser);
        res.json({message : `${loggedInUser.firstName}, Profile updated successfully`, user: loggedInUser} );                 
    }
    catch (error) {
        res.status(401).send("Error editing profile: " + error.message);       
    }
});
// Password update route /profile/password & forgo password
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = req.user;
        const isPasswordValid = await user.validatePassword (currentPassword);
        if (!isPasswordValid) {
            return res.status(400).send("Current password is incorrect");
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword; // Update the password field
        // Save the updated user document
        await user.save();
        res.send("Password updated successfully");
    } catch (error) {
        res.status(400).send("Error updating password: " + error.message);
    }
});

module.exports = profileRouter;