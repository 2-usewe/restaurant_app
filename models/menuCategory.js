const { DataTypes } = require('sequelize');
const { uuidv4, Validator, Events, ValidationRules } = require('../config/constants');
const { sequelize } = require('../dbs/connectDB');
const catEvents = Events.menus.category;
const catRules = ValidationRules.menus.category
const MenuCategory = sequelize.define(
  "menu_categories",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      required: true,
      unique: true
    },
    catName: {
      type: DataTypes.STRING,
      allowNull: false,
      required: true,
      unique:true,
    },
    catDescription: {
      type: DataTypes.STRING,
      allowNull: true,
      required: false,
    },
    createdBy:{
      type: DataTypes.STRING,
      allowNull: false,
      required: true,
    }
  },

  {
    tableName: "menu_categories",
    timestamps: true, 
    paranoid: true,
  }
);

//Category input data validation
const CategoryInputValidate = (data, event) => {
  let rules;
  switch (event) {
    case catEvents.create:
      rules = {
        ...catRules.create
      };
      break;
    default:
      break;
  }
  let validation = new Validator(data, rules);
  let result = {};

  if (validation.passes()) {
    result["hasError"] = false;
  }
  if (validation.fails()) {
    result["hasError"] = true;
    result["errors"] = validation.errors.all();
  }
  return result;
}

module.exports={MenuCategory,CategoryInputValidate}