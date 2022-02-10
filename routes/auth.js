const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const passportHttp = require('passport-http');
const logout = require('express-passport-logout');
const passport = require('passport');




//register
router.post("/register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
    });

    try {
        const savedUser = await newUser.save();
        const { password, ...others } = savedUser._doc;

        res.status(200).json(others);
        //console.log(savedUser); 
    } catch (err) {
        res.status(500).json(err);
    }
});


//login

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        //if theres no username matching the submitted, return...
        !user && res.status(400).json("Wrong Credentials");
    

        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        //this excludes password from return object
        const { password, ...others } = user._doc;

        //if theres no password matching the submitted, return...
        originalPassword !== req.body.password && res.status(401).json("Wrong Credentials");

        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin,
        }, process.env.JWT_SEC,{expiresIn:"3d"});

        res.status(200).json({ ...others, accessToken });
        return;
    }
    catch (err) {
        console.log("error "+err);
        return;
    }
    
});


router.get('/logout', function(req, res) {
    console.log("I am Logout")
    req.logout(); 
    res.json({ 
            status: "logout",
            msg:"Please Log In again"
         });
});

module.exports = router