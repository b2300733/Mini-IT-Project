const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const signupRoute = require("../backend/routes/signup.route");
const loginRoute = require("../backend/routes/login.route");
const passport = require("../backend/controllers/auth.controller");
const authRoutes = require("../backend/routes/auth.route");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://Admin:$$112233@database1.bz4vv.mongodb.net/L-B-DB?retryWrites=true&w=majority&appName=Database1"
  )
  .then(() => {
    console.log("connected to database");
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

//microsoft&google auth--------------------------------------------------------------------------------------------
app.use(
  session({ secret: "your_secret_key", resave: false, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(authRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
