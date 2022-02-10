const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth");
const cors = require("cors");


dotenv.config();


mongoose.connect(process.env.MONGO_URL).then(console.log("connected to mongo")).
    catch(err => console.log(err));

app.use(express.json());

app.use(cors());

app.use("/api/auth", authRoute);

app.listen(process.env.PORT || 5000, () => {
    console.log("Backend server is running") 
 });