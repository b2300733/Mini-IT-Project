const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

mongoose
  .connect(
    "mongodb+srv://Admin:$$112233@database1.bz4vv.mongodb.net/?retryWrites=true&w=majority&appName=Database1"
  )
  .then(() => {
    console.log("connected to database");
  })
  .catch(() => {
    console.log("connection failed");
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
