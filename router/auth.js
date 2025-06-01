const express = require('express');
const authRouter = express.Router();
const { User } = require('../utils/dbModel');
const bcrypt = require('bcrypt')


authRouter.post("/signUp", async (req, res) => {

    const { firstName, LastName, email, password } = req.body;

    const hashPassword = await bcrypt.hash(password, 10);

    const userDetails = {
        firstName,
        LastName,
        email,
        password: hashPassword
    }

    try {
        const newUser = await new User(userDetails);
        await newUser.save();
        res.json({
            "message": "sign Up sucessfull",
            "data": newUser
        });
    } catch (err) {
        res.status(400).json({
            "message": "error in sign Up",
            "error": err
        });
    }

})


authRouter.post("/signIn", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({
            "message": "user don't exist",
        });;

    const hashPassword = await user.validatePassword(password);

    if (hashPassword) {
        const token = user.getJWT();
        res.cookie("token", token)
        res.json({
            "message": "sign in sucessfull",
            "data": user
        });
    } else {
        res.status(400).json({
            "message": "invaild credentials",
        });
    }


})

authRouter.get("/signOut", async (req, res) => {
    res.clearCookie("token");
    res.send("sign out sucessful")
})
module.exports = authRouter