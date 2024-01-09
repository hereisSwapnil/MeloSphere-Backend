import wrapAsync from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "365d" });
};

const checkUsername = wrapAsync(async (req, res) => {
  let { username } = req.body;
  let user = await User.findOne({ username });
  if (user) {
    return res.status(400).json({
      message: "username taken",
    });
  } else {
    return res.status(200).json({
      message: "username available",
    });
  }
});

const registerUser = wrapAsync(async (req, res) => {
  try {
    const { username, password, email, dob, gender, name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      username,
      dob,
      gender,
      name,
      password: hashedPassword,
    });

    const registeredUser = await newUser.save();

    const token = createToken(registeredUser._id);

    res.status(200).json({ user: registeredUser, token });
  } catch (error) {
    res.status(400).json({
      message: "Register failed",
      error: error.message,
    });
  }
});

const loginUser = wrapAsync(async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      const token = createToken(user._id);

      res.status(200).json({
        user,
        token,
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export { registerUser, loginUser, checkUsername };
