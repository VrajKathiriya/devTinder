const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post("/request/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const fromUserId = loggedInUser._id;
    const status = req.params.status.toLowerCase();
    const toUserId = req.params.toUserId;

    const toUser = await User.findById(toUserId);
    if(!toUser){
      return res.status(404).json({message:"User not found"});
    } 

    const allowedStatuses = ["ignored", "interested"]
    if(!allowedStatuses.includes(status)){
      return res.status(400).json({message:`Invalid status: ${status}.`});
    }

    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });
    if(existingConnectionRequest){
      return res.status(400).json({message:`${status} connection request already exists.`});
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    await connectionRequest.save();

    res.send(`${loggedInUser.firstName} ${status} the connection request to user ${toUserId}`);

  } catch (err) {
    return res.status(400).send(err.message);
  }
})

module.exports = requestRouter;