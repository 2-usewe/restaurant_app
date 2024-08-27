const { Op } = require("sequelize");
const { responseCode,_,Events, uuidv4 } = require("../config/constants");
const { UserInputValidate, User } = require("../models/user");
const { hashPassword, comparePassword } = require("../helpers/password_encrypt");
const generateToken = require("../helpers/generateToken");
const { blacklistToken, isTokenBlacklisted } = require("../middlewares/authenticateToken");
const { releaseLock, acquireLock } = require("../dataSync");
const userEvent = Events.users;
module.exports = {
    /**
     * @fileName userController
     * @method signup
     * @route POST /api/v1/user/signup
     * @param {*} req
     * @param {*} res
     * @description This api for user signup
     * @autherization []
     * @auther  Abhijit swain
     */
    signup: async (req, res) => {
        console.log("signup API...")
        try {
            let inputData = _.pick(req.body,[
                'firstName',
                'lastName',
                'email',
                'phone',
                'password',
                'confirmPassword'
            ]);
            let result = await UserInputValidate(inputData, userEvent.signup);
            if (result.hasError) {
                return res.status(responseCode.BAD_REQUEST).json({
                    status: responseCode.BAD_REQUEST,
                    data: {},
                    isError: true,
                    error: result.errors,
                    message: 'Invalid input data.'
                })
            }
            //let check if User is already exist or not 
            let user = await User.findOne({
                where: {
                    isDeleted: false,
                    [Op.or]: [
                        {
                            email: inputData.email
                        },
                        {
                            phone: inputData.email
                        }
                    ],
                },
                raw: true
            });
            if (user) {
                return res.status(responseCode.BAD_REQUEST).json({
                    status: responseCode.BAD_REQUEST,
                    data: {},
                    isError: true,
                    error: { msg: 'Phone number or email already exist.' },
                    message: 'Phone number or email already exist.'
                });
            }
            inputData.id = uuidv4();
            //password encrypt
            let encryptedPassword = await hashPassword(inputData.password);
            inputData.password = encryptedPassword
            // console.log(inputData);
            await acquireLock('lock');//lock sync 
            let createUser = await User.create(inputData);
            createUser = createUser.toJSON(); // Convert to plain object if using Mongoose or similar ORM
            delete createUser.password;
            await releaseLock('lock');//release lock
            return res.status(responseCode.CREATED).json({
                status: responseCode.CREATED,
                data: createUser,
                isError: false,
                error: {},
                message: 'Signup success.'
            })
        }
        catch (error) {
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
     * @fileName userController
     * @method login
     * @route POST /api/v1/user/login
     * @param {*} req
     * @param {*} res
     * @description This api for user login
     * @autherization [userAuthenticate]
     * @auther  Abhijit swain
     */
    login: async (req, res) => {
        console.log('Login API...');
        try {
            const inputData =_.pick(req.body,['emaiOrPhone','password']);

            /**validate the input data */
            let result = await UserInputValidate(inputData, userEvent.login);
            // console.log(result);
            if (result.hasError) {
                return res.status(responseCode.BAD_REQUEST).json({
                    status: responseCode.BAD_REQUEST,
                    error: result.errors,
                    isError: true,
                    data: {},
                    message: "Invalid input data.",
                });
            }

            // Find user by email
            const user = await User.findOne({
                where: {
                    [Op.or]: [
                        {
                            email: { [Op.eq]: inputData.emaiOrPhone }
                        },
                        {
                            phone: { [Op.eq]: inputData.emaiOrPhone }
                        }
                    ],
                    isDeleted: false
                },
                raw: true,
            });

            if (!user) {
                return res.status(responseCode.UNAUTERIZED).json({
                    status: responseCode.UNAUTERIZED,
                    error: {},
                    isError: true,
                    data: {},
                    message: "Email or phone number not matched.",
                });
            }
            // Compare the provided password with the stored hashed password
            // console.log(inputData.password, user.password);
            const passwordMatch = await comparePassword(
                inputData.password,
                user.password
            );

            if (!passwordMatch) {
                return res.status(responseCode.UNAUTERIZED).json({
                    status: responseCode.UNAUTERIZED,
                    error: {},
                    isError: true,
                    data: {},
                    message: "Enter correct password",
                });
            }
            // generate jwt token
            const token = await generateToken(
                { firstName: user.firstName, lastName: user.lastName, id: user.id, email: user.email, phone: user.phone }
            );
            res.status(responseCode.OK).json({
                status: responseCode.OK,
                data: {
                    token: token,
                    id: user.id,
                },
                isError: false,
                error: {},
                message: "Login successful",
            });
        }
        catch (error) {
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
   * @fileName userController
   * @method logout
   * @route POST /api/pms/v1/user/logout
   * @param {*} req
   * @param {*} res
   * @description this api used for logout
   * @auther Abhijit swain
   */
    logout: async (req, res) => {
        try{
            const token = req.header("Authorization");
            if (token) {
                blacklistToken(token);
                isTokenBlacklisted(token);
                res.status(responseCode.OK).json({
                    status: responseCode.OK,
                    data: {},
                    isError: false,
                    error: {},
                    message: "Logout success",
                });
            } else {
                res.status(responseCode.BAD_REQUEST).json({
                    status: responseCode.BAD_REQUEST,
                    isError: true,
                    data: {},
                    error: {},
                    message: "Bad request",
                });
            }
        }
        catch (error) {
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