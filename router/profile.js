const express = require('express');
const auth = require("../utils/middlewares/auth")
const profileRouter = express.Router();
const { User } = require('../utils/dbModel')
const bcrypt = require('bcrypt')


profileRouter.get("/profile/view", auth, (req, res) => {
    res.json({ "message": "profile page", "data": req.user });
})

profileRouter.patch("/profile/edit", auth, async (req, res) => {

    try {

        const recivedData = req.body;

        console.log(recivedData);

        const allowedEditableFeilds = ["firstName", "LastName", "age", "gender", "photoUrl", "about", "skills"];

        Object.keys(recivedData).forEach(key => {
            if (!allowedEditableFeilds.includes(key)) throw new Error("feild not specified")
        })



        console.log("data recived " + recivedData);

        Object.keys(recivedData).forEach(key => {
            console.log(req.user[key] + " " + recivedData[key]);
            req.user[key] = recivedData[key];
        });


        const updated = await req.user.save();
        console.log(updated)

        res.json({
            "msg": "edit sucesssfull"
        })
    } catch (err) {
        res.status(400).json({
            "message" : `${err}`
        })

    }
})

profileRouter.patch("/profile/forgotPassword",auth,async (req,res)=>{
    const {password} = req.body;
    
    req.user.password =await bcrypt.hash(password,10);

    await req.user.save();
    
    res.json({
        "message" : "password updated"
    })

})
module.exports = profileRouter



