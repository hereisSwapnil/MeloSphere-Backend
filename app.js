import express from "express";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
import { DB_NAME } from "./constants.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import LocalStrategy from "passport-local";
import User from "./models/user.model.js";
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

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: `${process.env.MONGODB_URI}${DB_NAME}`,
      ttl: null,
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(
  new GoogleStrategy(
    {
      clientID: "YOUR_GOOGLE_CLIENT_ID",
      clientSecret: "YOUR_GOOGLE_CLIENT_SECRET",
      callbackURL: "YOUR_CALLBACK_URL",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        } else {
          user = new User({
            googleId: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value,
          });

          await user.save();
          return done(null, user);
        }
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(methodOverride("_method"));

// routes import
import userRoutes from "./routes/user.routes.js";

// routes declare
app.use("/user", userRoutes);

export default app;
