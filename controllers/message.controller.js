import wrapAsync from "../utils/asyncHandler.js";
import Message from "../models/message.model.js";

const addMessage = wrapAsync(async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const newMessage = new Message({ message, user: req.user._id });

  try {
    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const getMessages = wrapAsync(async (req, res) => {
  try {
    const messages = await Message.find({});
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export { addMessage, getMessages };
