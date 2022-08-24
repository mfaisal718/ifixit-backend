///////////////////////////////
// DEPENDENCIES
////////////////////////////////
// get .env variables
require("dotenv").config();
// pull PORT from .env, give default value of 3000
const { PORT = 4000, MONGODB_URL } = process.env;
// import express
const express = require("express");
// create application object
const app = express();
// import mongoose
const mongoose = require("mongoose");
// import middlware
const cors = require("cors");
const morgan = require("morgan");

///////////////////////////////

///////////////////////////////
///////////////////////////////
// DATABASE CONNECTION
////////////////////////////////
// Establish Connection
mongoose.connect(MONGODB_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
// Connection Events
mongoose.connection
  .on("open", () => console.log("You are connected to mongoose"))
  .on("close", () => console.log("You are disconnected from mongoose"))
  .on("error", (error) => console.log(error));
///////////////////////////////
// MODELS
////////////////////////////////
const CustomersSchema = new mongoose.Schema({
  name: String,
  damage: String,
  image: String,
  start: Number,
  finish: Number,
  phone: Number,
});

const Customers = mongoose.model("Customers", CustomersSchema);

// MiddleWare
////////////////////////////////
app.use(cors()); // to prevent cors errors, open access to all origins
app.use(morgan("dev")); // logging
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // parse json bodies

// ROUTES
////////////////////////////////
// create a test route
app.get("/", (req, res) => {
  res.send("hello world");
});
// Customers INDEX ROUTE
app.get("/customers", async (req, res) => {
  try {
    // send all customers
    res.json(await Customers.find({}));
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

// Customers CREATE ROUTE
app.post("/customers", async (req, res) => {
  try {
    // send all customers
    res.json(await Customers.create(req.body));
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});
// Customers DELETE ROUTE
app.delete("/customers/:id", async (req, res) => {
  try {
    // send all customers
    res.json(await Customers.findByIdAndRemove(req.params.id));
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

// Customers UPDATE ROUTE
app.put("/customers/:id", async (req, res) => {
  try {
    // send all customers
    res.json(
      await Customers.findByIdAndUpdate(req.params.id, req.body, { new: true })
    );
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

// LISTENER
////////////////////////////////
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));
