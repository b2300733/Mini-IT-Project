const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const userRoute = require("../backend/routes/user.route");

const app = express();

app.use(cors());

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

//signup--------------------------------------------------------------------------------------------
app.use("/api/signup", userRoute);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
