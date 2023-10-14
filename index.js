const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

app.use(express.json());
app.use(cors());

// PORT
const port = process.env.PORT;
// CONNECT TO MONGODB
const uri = process.env.ATLAS_URI;
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    console.log("connected to database successfully");
    app.listen(port, () => console.log(`Listening on port ${port}...`));
  })
  .catch((error) => console.log(error));

// API endpoints
// users
const userRouter = require("./routes/users");
app.use("/");
app.use("/users", userRouter);
