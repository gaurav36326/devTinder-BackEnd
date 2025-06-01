const express = require("express");
const requestRouter = express.Router();
const auth = require('../utils/middlewares/auth')
const { connection } = require('../utils/connection')
const { User } = require('../utils/dbModel')

requestRouter.post("/request/send/:status/:userId", auth, async (req, res) => {

  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.userId;
    const status = req.params.status;




    const allowedStatus = ["interested", "ignored"];
    if (!allowedStatus.includes(status)) throw new Error("status invalid");
    console.log(fromUserId + " " + toUserId);
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    if (fromUserId.equals(toUserId)) {
      throw new Error("Can't send request to yourself");
    }

    const alredyRecivingCheck = await connection.findOne({ $or: [{ fromUserId, toUserId }, { fromUserId: toUserId, toUserId: fromUserId }] });
    if (alredyRecivingCheck) throw new Error("request already exist");

    const connectionRequest = new connection({
      fromUserId,
      toUserId,
      status,
    });

    const data = await connectionRequest.save();

    res.json({
      message:
        req.user.firstName + " status " + status + " for " + toUser.firstName,
      data,
    });

    res.send("working ok");
  }
  catch (error) {
    res.status(400).json({
      "message": `${error}`
    })
  }

})


requestRouter.post("/request/review/:status/:requestId", auth, async (req, res) => {

  try {
    const loggedInUser = req.user;
    const { status, requestId } = req.params;

    console.log(loggedInUser);

    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ messaage: "Status not allowed!" });
    }



    const connectionRequest = await connection.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested",
    });


    if (!connectionRequest) {
      return res
        .status(404)
        .json({ message: "Connection request not found" });
    }

    connectionRequest.status = status;

    const data = await connectionRequest.save();

    res.json({ message: "Connection request " + status, data });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }

})

module.exports = requestRouter