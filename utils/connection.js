const mongoose = require('mongoose');

const connectionSchema = new mongoose.Schema({

    fromUserId: {
        type : mongoose.Schema.Types.ObjectId,
        ref: "User",
        required : true
    },
    toUserId: {
        type : mongoose.Schema.Types.ObjectId,
        ref: "User",
        required : true
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
    }},
},
{
    timestamps: true
}
)

module.exports = {
    connection : new mongoose.model("connection",connectionSchema)
}