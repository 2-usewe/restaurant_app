const { Events,_, responseCode, uuidv4 } = require("../config/constants");
const { acquireLock, releaseLock } = require("../dataSync");
const { MenuCategory } = require("../models/menuCategory");
const { MenuItem, ItemInputValidate } = require("../models/menuItem");
const itemEvents = Events.menus.item;
const fs=require('fs');

module.exports = {
    /**
  * @fileName ItemController
  * @method itemCreate
  * @route POST /api/pms/v1/menu/item/create
  * @param {*} req
  * @param {*} res
  * @description this api used create menu item
  * @autherization [userAuthenticate]
  * @auther Abhijit swain
  */
    itemCreate: async (req, res) => {
        console.log('Inside itemController create itemCreate API.. ');
        try{
            let inputData = _.pick(req.body,['itemName','category_id','itemDescription','price','quantity']);
            // console.log('file',req.file);
            let result = await ItemInputValidate(inputData,itemEvents.create);
            if (result.hasError) {
                if(req.file){
                    await fs.unlinkSync(req.file.path);
                }
                return res.status(responseCode.BAD_REQUEST).json({
                    status: responseCode.BAD_REQUEST,
                    error: result.errors,
                    isError: true,
                    data: {},
                    message: "Invalid input data.",
                });
            }
            //let check the category exist or not
            let checkCategory = await MenuCategory.findOne({
                where:{
                    id:inputData.category_id
                },
                raw:true
            });
            if(!checkCategory){
                if(req.file){
                    await fs.unlinkSync(req.file.path);
                }
                return res.status(responseCode.NOT_FOUND).json({
                    status: responseCode.NOT_FOUND,
                    data:{},
                    error: {msg:"Category not found."},
                    isError:true,
                    message:"Category not found."
                });
            }
            // console.log(checkCategory);
            //let check item exist or not on this category wise
            let checkItem = await MenuItem.findOne({
                where:{
                    itemName:inputData.itemName,
                    category_id:inputData.category_id,
                },
                raw:true
            });
            if(checkItem){
                if(req.file){
                    await fs.unlinkSync(req.file.path);
                }
                return res.status(responseCode.BAD_REQUEST).json({
                    status: responseCode.BAD_REQUEST,
                    data:{},
                    isError:true,
                    error:{msg:"Item already exist on this category."},
                    message:"Item already exist on this category."
                });
            }
            inputData.id = uuidv4();
            inputData.createdBy = req.user.id;
            if(req.file){
                inputData.image=req.file.path;
            }
            // console.log(inputData);
            await acquireLock('lock');//lock sync 
            let createItem = await MenuItem.create(inputData);
            await releaseLock('lock');
            return res.status(responseCode.CREATED).json({
                status: responseCode.CREATED,
                data:createItem,
                isError:false,
                error:{},
                message:"Item created successfully."
            });

        }
        catch(error){
            if(req.file){
                await fs.unlinkSync(req.file.path);
            }
            console.log(error);
            return res.status(responseCode.INTERNAL_SERVERERROR).json({
                status: responseCode.INTERNAL_SERVERERROR,
                data: {},
                isError: true,
                error: error,
                message: 'Somthing went wrong.'
            })
        }
    },
     /**
  * @fileName itemController
  * @method getItemByCategory
  * @route get /api/pms/v1/menu/item/get/:category_id
  * @param {*} req
  * @param {*} res
  * @description this api used get menu item by category
  * @autherization [userAuthenticate]
  * @auther Abhijit swain
  */
     getItemByCategory : async(req,res)=>{
        console.log('Inside itemController  getItemByCategory API.. ');
        try{
            let inputData = _.pick(req.params,['category_id']);
            let result = await ItemInputValidate(inputData,itemEvents.getByCategory);
            if(result.hasError){
            return res.status(responseCode.BAD_REQUEST).json({
                    status: responseCode.BAD_REQUEST,
                    error: result.errors,
                    isError: true,
                    data: {},
                    message: "Invalid input data.",
                });
            }
            //let get categories 
            let menuItems = await MenuItem.findAll({
                where:{
                    category_id:inputData.category_id
                },
                include:{
                    model:MenuCategory,
                    as:'category'
                },
                order:[['itemName','asc']],
            });
            if(menuItems.length>0){
                return res.status(responseCode.OK).json({
                    status: responseCode.OK,
                    data:menuItems,
                    isError:false,
                    error:{},
                    message:"Menu item list fetched successfully"
                });
            }else{
                return res.status(responseCode.NOT_FOUND).json({
                    status: responseCode.NOT_FOUND,
                    data: [],
                    isError:false,
                    error:{},
                    message:"Menu items not found for this category."
                });
            }

        }
        catch(error){
            console.log(error);
            return res.status(responseCode.INTERNAL_SERVERERROR).json({
                status: responseCode.INTERNAL_SERVERERROR,
                data: {},
                isError: true,
                error: error,
                message: 'Somthing went wrong.'
            })
        }
    }
}