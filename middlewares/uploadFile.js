const multer = require("multer");
const { responseCode } = require("../config/constants");

const multerStorage = (path) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      console.log("file:", file);
      if (!file) {
        throw Error("Image required");
      }
      cb(null, path); //"public/cmsassets"
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}_${file.originalname}`);
    },
  });
};
const fileFilter = (req, file, cb,res) => {
  if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg'  && file.mimetype !== 'application/pdf') {
    cb(new Error('File type not supported. Please use .png, .jpg or .jpeg.'), false);
   } else {
    cb(null, true);
   }
}
const upload =  multer({storage:multerStorage("public/itemImage"),fileFilter:fileFilter});
const uploadImage = (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      // Handle Multer errors
      console.log("error:",err.message);
        console.error(err);
        return res.status(responseCode.BAD_REQUEST).json({ 
          status: responseCode.BAD_REQUEST,
          error:err.message,
          isError:true,
          message:err.message
         });
    }
    next(); 
  });
};
  module.exports = {uploadImage};