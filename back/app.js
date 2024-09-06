require("dotenv").config();
require('express-async-errors');

const connectDB = require("./db/connect");
const express = require("express");
const cors = require('cors')
const app = express();
const mainRouter = require("./routes/main");

app.use(express.json());

app.use(cors())
app.use("/api/v1", mainRouter);

const port = process.env.PORT || 3000;

const start = async () => {

  try {
    // console.log("connected to database", process.env.MONGO_URI);
    console.log("connected to database successfully");

    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    })
 
  } catch (error) {
    console.log(error);
  }
}

start();

