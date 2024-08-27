const mongoose = require('mongoose');
const ItemSchema = new mongoose.Schema(
    {
      id: {
        type: String,
        primaryKey: true,
        required: true,
        unique: true
      },
      category_id:{
        type: String,
        required: true,
        ref:'menu_categories'
    },
    itemName: {
        type: String,
        required: true,
        unique: true,
    },
    itemDescription: {
        type: String,
        required: false,
    },
    image:{
        type: String,
        required: false,
    },
    price: {
        type: Number,
        allowNull: false,
        required: true,
        defaultValue:0
    },
    quantity: {
        type: String,
        required: true,
        defaultValue:3
    },
    createdBy: {
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
const MenuItem = mongoose.model('menu_items', ItemSchema);
module.exports=MenuItem;