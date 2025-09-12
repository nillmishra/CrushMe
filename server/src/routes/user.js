const express = require('express');
const userRouter = express.Router();
const { userAuth } = require('../middleware/auth');
const ConnectionRequest = require('../models/connectionRequest');

const USER_FIELDS = "firstName lastName photoUrl age gender about skills";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        // Find all pending connection requests where the logged-in user is the recipient
        const requests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: 'interested',
        }).populate('fromUserId', USER_FIELDS); // Populate sender details

        // Return the list of connection requests
        res.json({
            message: `${requests.length} connection requests found`,
            data: requests
        });
    } catch (error) {
        res.status(500).send("Error fetching connection requests: " + error.message);
    }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        // Find all accepted connection requests involving the logged-in user
        const connections = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, status: 'accepted' },
                { toUserId: loggedInUser._id, status: 'accepted' }
            ]
        }).populate("fromUserId", USER_FIELDS)
            .populate("toUserId", USER_FIELDS);

        const connectionList = connections.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            } else if (row.toUserId._id.toString() === loggedInUser._id.toString()) {
                return row.fromUserId;
            }
            return null; // safety fallback
        }).filter(Boolean); // remove null/undefined

        res.json({
            message: `${connectionList.length} connections found`,
            data: connectionList
        });


    } catch (error) {
        res.status(500).send("Error fetching connections: " + error.message);
    }
});




module.exports = userRouter;

