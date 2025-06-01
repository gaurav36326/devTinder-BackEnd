const jwt = require("jsonwebtoken");
const {User} = require("../dbModel");


async function auth(req, res, next) {

    try {
        const cookieToken = req.cookies.token;

        if (!cookieToken) {
            return res.json({
                "message" : "invalid token"+cookieToken
            });
        }

        const isValidToken = await jwt.verify(cookieToken, "secret")


        const user = await User.findOne({ _id : isValidToken.id});

        if (!user) {
            throw new Error("User not found");
        }

        req.user = user;

        next();
    } catch (err) {
        res.status(404).send("ERROR: " + err.message);
    }

}

module.exports = auth;