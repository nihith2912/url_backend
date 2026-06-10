const express = require('express');
const connectMongoDB = require('./connection');
const urlRoutes = require('./routes/url');
const cookieParser = require('cookie-parser');
const URL = require('./models/url');
const path = require('path');
const dotenv = require("dotenv");
require('dotenv').config();
const userRoutes = require('./routes/user');
const {checkForAuthentication, restrictTo} = require("./middlewares/auth")

const app = express();
const PORT = process.env.PORT || 8001;
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(checkForAuthentication);

connectMongoDB(process.env.MONGODB_URL)
    .then(() => {console.log("Connected to MongoDB");})
    .catch((err) => {console.error("Error connecting to MongoDB", err);});

app.get("/test", async (req, res) => {
    const allUrls = await URL.find({});
    return res.render('home')
});

app.use("/url",restrictTo(["NORMAL"]), urlRoutes);
app.use("/user", userRoutes);
app.use("/", require("./routes/staticRouter"));

app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    { shortId },
    { $push: { VisitHistory: { timestamp: Date.now() } } }
  );

  if (!entry) {
    return res.status(404).send("Short URL not found 😢");
  }

  res.redirect(entry.redirectURL);
});


app.listen(PORT, () => {console.log(`Server is running on port ${PORT};`)});