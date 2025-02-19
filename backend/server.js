const mongoose = require("mongoose");
const express = require("express");
const userRoute = require("../backend/routes/user.route");

const app = express();

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

//login--------------------------------------------------------------------------------------------
app.use("/api/signup", userRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
