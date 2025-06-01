const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const validator = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            minLength : 4,
            maxLength : 20,
            lowercase : true,
            trim : true
        },
        LastName: {
            type: String,
            maxLength : 20,
            lowercase : true,
            trim : true
        },
        email: {
            type: String,
            required: true,
            unique: true, // This creates a unique index
            lowercase: true, // Optional: normalize email
            trim: true ,// Optional: remove extra spaces
            validate : {
                validator : (val)=>{
                    return validator.isEmail(val)
                },
                message :"enter a valid email"
            }
        },
        password: {
            type: String,
            required : true,
            minlength: [6, 'Password must be at least 6 characters long'],
            maxlength: [100, 'Password must be less than 100 characters']
        },
        age: {
            type: Number,
            min : 14,
        },
        gender: {
            type: String,
            validate : [(val)=>{
                return ['male','female','none'].includes(val);
            },
            "gender not specified"]
        },
        photoUrl : {
            type : String,
            default: "https://geographyandyou.com/images/user-profile.png",

            validate(value){
                if (!validator.isURL(value)) {
                    throw new Error("Invalid Photo URL: " + value);
                }
            }
            
        },
         about: {
            type: String,
            default: "This is a default about of the user!",
        },
        skills: {
            type: [String],
        },

    },
    {
        timestamps :  true
    }
)

userSchema.methods.getJWT = function (){
    const user = this;

    const token = jwt.sign({id : user._id},"secret",{
        expiresIn : "7d"
    });
    
    return token
}

userSchema.methods.validatePassword = async function(recivedPassword){
    const user  = this;
    const flag =await bcrypt.compare(recivedPassword,user.password)
    return flag
}


module.exports = { User: mongoose.model("User", userSchema) }

