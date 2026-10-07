const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  toUserId: {   
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  status: {
    type: String,
    enum: { values: ["interested", "ignored", "accepted", "rejected"], message: "{VALUE} is not a valid status" },
    required: true
  },
}, { timestamps: true });

connectionRequestSchema.index({fromUserId: 1, toUserId: 1});

connectionRequestSchema.pre("save", async function(next){
  const connectionRequest = this;

  // check the formUserId and toUserId is not same
  if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
    return next(new Error("From user and to user cannot be same"));
  }

  next();
})

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);