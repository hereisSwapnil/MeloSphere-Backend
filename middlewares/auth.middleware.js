const isLoggedIn = function (req, res, next) {
  if (req.user) {
    next();
  } else {
    return res.status(401).json({ error: "Unauthorized: User not logged in" });
  }
};

export default isLoggedIn;
