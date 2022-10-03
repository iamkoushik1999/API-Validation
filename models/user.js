const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:String,
    name:String
},{versionKey:false});
const user = new mongoose.model("user",userSchema,"userDb");
module.exports = user;