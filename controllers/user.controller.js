import wrapAsync from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import passport from "passport";

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
    let { username, password, email, dob, gender, name } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "user already exists",
      });
    }
    const newUser = new User({ email, username, dob, gender, name });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, () => {
      res.status(200).json({
        user: req.user,
        message: "register success",
      });
    });
  } catch (error) {
    res.status(400).json({
      message: "register failed",
    });
  }
});

const loginUser = wrapAsync((req, res, next) => {
  passport.authenticate(
    "local",
    { usernameField: "email", passwordField: "password" },
    (err, user, info) => {
      if (err) {
        return res.status(500).json({ message: "Authentication error" });
      }

      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Login error" });
        }

        res.status(200).json({
          user: user,
          message: "Login success",
        });
      });
    }
  )(req, res, next);
});

const logoutUser = wrapAsync((req, res) => {
  req.logout(() => {
    {
      req.session.destroy();
      res.status(200).json({
        message: "logout success",
      });
    }
  });
});

const getUser = wrapAsync(async (req, res) => {
  try {
    let user = await User.findById(req.user._id);
    if (!user) {
      return res.status(400).json({
        message: "User not logged in",
      });
    }
    res.status(200).json({
      user: user,
    });
  } catch (error) {
    res.status(400).json({
      message: "User get failed",
    });
  }
});

export { registerUser, loginUser, logoutUser, checkUsername, getUser };
