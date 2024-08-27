const { DataTypes } = require('sequelize');
const { uuidv4, Validator, Events, ValidationRules } = require('../config/constants');
const { sequelize } = require('../dbs/connectDB');
const userEvents = Events.users;
const userRules = ValidationRules.users
const User = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      required: true,
      unique: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      required: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      required: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      required: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      required: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      required: true,
    },
    isActive:{
      type:DataTypes.BOOLEAN,
      allowNull:false,
      defaultValue:true
    },
    isDeleted:{
      type:DataTypes.BOOLEAN,
      allowNull:false,
      defaultValue:false
    }
  },

  {
    tableName: "users",
    timestamps: true, // Add this line if you don't want timestamps
    paranoid: true,
  }
);

//user input data validation
const UserInputValidate = (data, event) => {
  let rules;
  switch (event) {
    case userEvents.signup:
      rules = {
        ...userRules.signup
      };
      break;
    case userEvents.login:
      rules = {
        ...userRules.login
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

module.exports={User,UserInputValidate}