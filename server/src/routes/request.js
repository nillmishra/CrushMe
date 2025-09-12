const express = require('express');
const { userAuth } = require('../middleware/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const { toUserId, status } = req.params;

        const validStatuses = ['intrested', 'ignored'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({message: "Invalid status value" });
        }

        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if a request already exists between these users
        const existingRequest = await ConnectionRequest.findOne({ 
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ],
         });
        if (existingRequest) {
            return res.status(400).json({ message: "Connection request already sent" });
        }

        const conmectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });
        
        const savedRequest = await conmectionRequest.save();
        res.json({ message: 
            req.user.firstName + " is " + status + " to connect with " + toUser.firstName,
             request: savedRequest });
        
    } catch (error) {
        res.status(500).send("Error sending connection request: " + error.message);
    }
});


module.exports = requestRouter;