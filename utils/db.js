const mongoose = require('mongoose');

module.exports = async function dbConnect(){
    return await mongoose.connect("mongodb+srv://gauravs36326:mongo123@cluster0.m8s5c.mongodb.net/devTinder");
}
