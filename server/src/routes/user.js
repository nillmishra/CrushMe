const express = require('express');
const userRouter = express.Router();
const { userAuth } = require('../middleware/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

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

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    if (limit > 50) limit = 50; // max limit
    const skip = (page - 1) * limit;

    const userId = loggedInUser._id;
    const interestedIn = (loggedInUser.interestedIn || '').trim();



    // Build interestedIn filter
    // If "All" (or empty) -> no filter. Else match gender exactly (case-insensitive).
    let interestFilter = {};
    if (interestedIn && interestedIn.toLowerCase() !== 'all') {
      interestFilter = {
        gender: { $regex: `^${interestedIn}$`, $options: 'i' }
      };
    }

    // Find accepted connections (hide both sides) + hide self
    const acceptedRequests = await ConnectionRequest.find({
      status: { $regex: '^accepted$', $options: 'i' }, // supports 'accepted' or 'ACCEPTED'
      $or: [
        { fromUserId: userId },
        { toUserId: userId }
      ]
    }).select('fromUserId toUserId');

    const hiddenUserIds = new Set([String(userId)]);
    acceptedRequests.forEach((r) => {
      hiddenUserIds.add(String(r.fromUserId));
      hiddenUserIds.add(String(r.toUserId));
    });

    const query = {
      $and: [
        { _id: { $nin: Array.from(hiddenUserIds) } },
        ...(Object.keys(interestFilter).length ? [interestFilter] : [])
      ]
    };

    const feedUsers = await User.find(query)
      .select(USER_FIELDS) // include 'gender' here if you want it in the response
      .lean()
      .skip(skip).limit(limit);

    res.json({
      message: `${feedUsers.length} users found for feed`,
      data: feedUsers
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching feed: " + error.message);
  }
});

module.exports = userRouter;

