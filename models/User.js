const mongoose=require("mongoose");

const UserSchema=new mongoose.Schema({
    username:{type:String,required:true,unique:true},
    email:{type:String,required:true,unique:true},
    img:{type:String},
    fullName:{type:String,required:true},
    address:{type:String,required:true},
    phone:{type:Number,required:true},
    gender:{type:String,required:true},
    password:{type:String,required:true},
    isAdmin:{type:Boolean,default:false}
},{timestamps:true})

module.exports=mongoose.model('user',UserSchema)