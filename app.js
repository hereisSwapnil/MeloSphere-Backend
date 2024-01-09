import express from "express";
import cors from "cors";
// import session from "express-session";
// import MongoStore from "connect-mongo";
import dotenv from "dotenv";
import { DB_NAME } from "./constants.js";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);

app.use(async (req, res, next) => {
  res.locals.currUser = req.user;
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(methodOverride("_method"));

// for testing
app.get("/", (req, res) => {
  res.send("Working for testing purpose");
});

// routes import
import userRoutes from "./routes/user.routes.js";
import messageRoutes from "./routes/message.routes.js";

// routes declare
app.use("/user", userRoutes);
app.use("/message", messageRoutes);

export default app;
