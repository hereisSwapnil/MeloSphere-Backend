import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
  {
    message: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
