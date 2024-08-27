const { v4: uuidv4 } = require('uuid');
const Validator = require("validatorjs");
const _ = require("lodash");

//error status codes
const responseCode = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    CONFLICT: 409,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVERERROR: 500,
    UNAUTERIZED: 401,
    TEMPERARILY_SERVER_FAILED:503
  };
const Events={
    users:{
        signup:'signup',
        login:'login',
    },
    menus:{
        category:{
            create:'create_menu'
        },
        item:{
            create:'item_create',
            getByCategory:'item_get_by_category'
        }

    }
  };
const ValidationRules={
    users:{
        signup:{
            firstName:'required|string',
            lastName:'required|string',
            email:'required|email',
            phone: ['required', 'regex:/^\\d+$/'],
            password: ['required','regex:/^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*\\d)[A-Za-z\\d!@#$%^&*(),.?":{}|<>]{8,}$/'],
            confirmPassword:'required|string|same:password',
        },
        login:{
            emaiOrPhone: [
                'required',
                `regex:/^\\+?\\d{1,4}[-.\\s]?\\(?\\d{1,4}\\)?[-.\\s]?\\d{1,9}|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$/`
            ],
            password: ['required','regex:/^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*\\d)[A-Za-z\\d!@#$%^&*(),.?":{}|<>]{8,}$/'],
        }
    },
    menus:{
        category:{
           create:{
                catName:'required|string',
                catDescription:'string',
            }
        },
        item:{
            create:{
                itemName:'required|string',
                category_id:'required|string',
                itemDescription:'string',
                price:'required|numeric',
                quantity:'required|string'
            },
            getByCategoryId:{
                category_id:'required|string',
            }
        }
        
    }
}
module.exports={
    uuidv4,
    _,
    responseCode,
    Validator,
    Events,
    ValidationRules
}