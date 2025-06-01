const express = require('express');
const userRouter = express.Router();
const {connection} = require('../utils/connection');
const auth = require("../utils/middlewares/auth.js")
const { User } = require("../utils/dbModel.js"); 


userRouter.get("/user/requests/received",auth,async (req,res)=>{
    
    const toUserId = req.user._id;

    const recivedRequests = await connection.find({
        toUserId,
        status : "interested"
    }).populate("fromUserId")

    res.json({
        "message" : "recevied requests",
        "data" : recivedRequests,
    });


})

userRouter.get("/user/connections",auth,async (req,res)=>{
    
    const toUserId = req.user._id;

    const recivedRequests = await connection.find({
        toUserId,
        status : "accepted"
    }).populate("fromUserId toUserId");

    res.json({
        "message" : "connnections",
        "data" : recivedRequests,
    });


})


userRouter.get("/feed",auth,async (req,res)=>{
    try{
        const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionRequests = await connection.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId  toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({ data: users });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }


})

module.exports = userRouter;