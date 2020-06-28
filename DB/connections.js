var  mongoose = require("mongoose");


const URL = 
    "mongodb+srv://sushantbasak:mongo@123@cluster0-g6bk4.mongodb.net/Blogs?retryWrites=true&w=majority";

const connectDB = async()=>{
    await mongoose.connect(URL,{useNewUrlParser : true,useUnifiedTopology: true});
    console.log("db connected..!");
}

module.exports = connectDB;