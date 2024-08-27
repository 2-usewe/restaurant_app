const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema(
    {
      id: {
        type: String,
        primaryKey: true,
        required: true,
        unique: true
      },
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      isActive:{
        type:Boolean,
        default:true
      },
      isDeleted:{
        type:Boolean,
        default:false
      },
      createdAt:{
        type:Date,
        default:Date.now
      },
      updatedAt:{
        type:Date,
        default:Date.now
      },
      deletedAt:{
        type:Date,
      },
    },
  
  );
  // Create User model
const User = mongoose.model('users', UserSchema);
module.exports=User;