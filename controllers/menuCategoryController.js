const { Events,_,responseCode, uuidv4 } = require("../config/constants");
const { releaseLock, SyncLock, acquireLock } = require("../dataSync");
const { CategoryInputValidate, MenuCategory } = require("../models/menuCategory");
const catEvents = Events.menus.category;

module.exports = {
    /**
  * @fileName menuCategoryController
  * @method categoryCreate
  * @route POST /api/pms/v1/menu/category/create
  * @param {*} req
  * @param {*} res
  * @description this api used create menu category
  * @autherization [userAuthenticate]
  * @auther Abhijit swain
  */
    categoryCreate: async (req, res) => {
        console.log('Inside menuCategoryController create categoryCreate API.. ');
        try{
            let inputData = _.pick(req.body,['catName','catDescription']);
            let result = await CategoryInputValidate(inputData,catEvents.create);
            if (result.hasError) {
                return res.status(responseCode.BAD_REQUEST).json({
                    status: responseCode.BAD_REQUEST,
                    error: result.errors,
                    isError: true,
                    data: {},
                    message: "Invalid input data.",
                });
            }
            //let check if the category name is already exist
            let checkCategory = await MenuCategory.findOne({
                where:{
                    catName:inputData.catName,
                },
                raw:true
            });
            if(checkCategory){
                return res.status(responseCode.BAD_REQUEST).json({
                    status: responseCode.BAD_REQUEST,
                    data:{},
                    error: {msg:"Category name already exist."},
                    isError:true,
                    message:"Category name already exist."
                });
            }
            inputData.id = uuidv4();
            inputData.createdBy = req.user.id;
            // console.log(inputData);
            await acquireLock('lock');//lock sync 
            let createCategory = await MenuCategory.create(inputData);
            await releaseLock('lock');
            return res.status(responseCode.CREATED).json({
                status: responseCode.CREATED,
                data:createCategory,
                isError:false,
                error:{},
                message:"Category created successfully."
            });

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
    },
     /**
  * @fileName menuCategoryController
  * @method getCategory
  * @route POST /api/pms/v1/menu/category/get
  * @param {*} req
  * @param {*} res
  * @description this api used get menu category
  * @autherization [userAuthenticate]
  * @auther Abhijit swain
  */
    getCategory : async(req,res)=>{
        console.log('Inside menuCategoryController create categoryCreate API.. ');
        try{
            //let get categories 
            let categories = await MenuCategory.findAll({
                order:[['catName','asc']],
                raw:true
            });
            if(categories.length>0){
                return res.status(responseCode.OK).json({
                    status: responseCode.OK,
                    data:categories,
                    isError:false,
                    error:{},
                    message:"Categories list fetched successfully"
                });
            }else{
                return res.status(responseCode.NOT_FOUND).json({
                    status: responseCode.NOT_FOUND,
                    data: [],
                    isError:false,
                    error:{},
                    message:"Category not found"
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