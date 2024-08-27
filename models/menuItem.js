const { DataTypes } = require('sequelize');
const { uuidv4, Validator, Events, ValidationRules } = require('../config/constants');
const { sequelize } = require('../dbs/connectDB');
const { MenuCategory } = require('./menuCategory');
const itemEvents = Events.menus.item;
const itemRules = ValidationRules.menus.item;
const MenuItem = sequelize.define(
    "menu_items",
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
            required: true,
            unique: true
        },
        category_id:{
            type: DataTypes.STRING,
            allowNull: false,
            required: true,
            references:{
                model: MenuCategory,
                key:'id'
            }
        },
        itemName: {
            type: DataTypes.STRING,
            allowNull: false,
            required: true,
            unique: true,
        },
        itemDescription: {
            type: DataTypes.STRING,
            allowNull: true,
            required: false,
        },
        image:{
            type: DataTypes.STRING,
            allowNull: true,
            required: false,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
            required: true,
            defaultValue:0
        },
        quantity: {
            type: DataTypes.STRING,
            allowNull: false,
            required: true,
            defaultValue:3
        },
        createdBy: {
            type: DataTypes.STRING,
            allowNull: false,
            required: true,
        }
    },

    {
        tableName: "menu_items",
        timestamps: true,
        paranoid: true,
    }
);
MenuCategory.hasMany(MenuItem,{foreignKey:'category_id',as:'items'});
MenuItem.belongsTo(MenuCategory,{foreignKey:'category_id',as:'category'});

//Category input data validation
const ItemInputValidate = (data, event) => {
    let rules;
    switch (event) {
        case itemEvents.create:
            rules = {
                ...itemRules.create
            };
            break;
        case itemEvents.getByCategory:
            rules = {
                ...itemRules.getByCategoryId
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

module.exports = { MenuItem, ItemInputValidate }