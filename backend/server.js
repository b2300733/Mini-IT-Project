require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const session = require("express-session");

const signupRoute = require("../backend/routes/signup.route");
const loginRoute = require("../backend/routes/login.route");
const passport = require("../backend/controllers/auth.controller");
const authRoutes = require("../backend/routes/auth.route");
const profileRoute = require("../backend/routes/profile.route");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://Admin:$$112233@database1.bz4vv.mongodb.net/L-B-DB?retryWrites=true&w=majority&appName=Database1"
  )
  .then(async () => {
    console.log("connected to database");

    // // Drop the unique index on oauthId if it exists
    // try {
    //   const collection = mongoose.connection.db.collection("users");
    //   const indexes = await collection.indexes();

    //   const oauthIndex = indexes.find((index) => index.name === "oauthId_1");
    //   if (oauthIndex) {
    //     await collection.dropIndex("oauthId_1");
    //     console.log("Dropped unique index on oauthId.");
    //   }
    // } catch (error) {
    //   console.error("Error dropping index:", error.message);
    // }
  })
  .catch(() => {
    console.log("connection failed");
  });

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

//signup--------------------------------------------------------------------------------------------
app.use("/api/signup", signupRoute);

//login--------------------------------------------------------------------------------------------
app.use("/api/login", loginRoute);

//google auth--------------------------------------------------------------------------------------------
app.use(
  session({ secret: "your_secret_key", resave: false, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(authRoutes);

//profile get password--------------------------------------------------------------------------------------------
app.use("/api/profile", profileRoute);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
