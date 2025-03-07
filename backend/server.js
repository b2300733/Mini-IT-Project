require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const path = require("path");

const signupRoute = require("./routes/signup.route");
const loginRoute = require("./routes/login.route");
const passport = require("./controllers/auth.controller");
const authRoutes = require("./routes/auth.route");
const profileRoute = require("./routes/profile.route");
const marketRoute = require("./routes/communitymarket.route");
const shopRoute = require("./routes/shop.route");

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  "/marketImgs",
  express.static(path.join(__dirname, "public/marketImgs"))
);
app.use("/shopImgs", express.static(path.join(__dirname, "public/shopImgs")));

mongoose
  .connect(process.env.MongoDB_HOST)
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

    // try {
    //   const collection = mongoose.connection.db.collection("users");
    //   const indexes = await collection.indexes();

    //   // Find and drop the unique index on username
    //   const usernameIndex = indexes.find(
    //     (index) => index.name === "username_1"
    //   );
    //   if (usernameIndex) {
    //     await collection.dropIndex("username_1");
    //     console.log("🚀 Dropped unique index on username.");
    //   }
    // } catch (error) {
    //   console.error("❌ Error dropping index:", error.message);
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

// Market route--------------------------------------------------------------------------------------------
app.use("/api/market", marketRoute);

// Shop route--------------------------------------------------------------------------------------------
app.use("/api/shop", shopRoute);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
