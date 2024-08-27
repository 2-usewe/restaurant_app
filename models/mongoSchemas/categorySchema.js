const mongoose = require('mongoose');
const CategorySchema = new mongoose.Schema(
    {
      id: {
        type: String,
        primaryKey: true,
        required: true,
        unique: true
      },
      catName: {
        type: String,
        required: true,
        unique:true,
      },
      catDescription: {
        type: String,
        required: false,
      },
      createdBy:{
        type: String,
        required: true,
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
const MenuCategory = mongoose.model('menu_categories', CategorySchema);
module.exports=MenuCategory;