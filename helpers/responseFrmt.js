// const { responseCode } = require("../config/constants");

// class ApiResponse {
//     constructor(status = 200, data = {}, isError = false, error = {}, message = "") {
//         this.status = status;
//         this.data = data;
//         this.isError = isError;
//         this.error = error;
//         this.message = message;
//     }

//     static success(data = {}, message = "Success") {
//         return new ApiResponse(responseCode.OK, data, false, {}, message);
//     }
//     static created(data = {}, message = "Created") {
//         return new ApiResponse(responseCode.CREATED, data, false, {}, message);
//     }
//     static badrequest(error = {}, message = "An error occurred.") {
//         return new ApiResponse(responseCode.BAD_REQUEST, {}, true, error, message);
//     }
//     static conflict(error = {}, message = "An error occurred.") {
//         return new ApiResponse(responseCode.CONFLICT, {}, true, error, message);
//     }
//     static forbidden(error = {}, message = "An error occurred.") {
//         return new ApiResponse(responseCode.FORBIDDEN, {}, true, error, message);
//     }
//     static notfound(error = {}, message = "An error occurred.") {
//         return new ApiResponse(responseCode.NOT_FOUND, {}, true, error, message);
//     }
//     static internalServerError(error = {}, message = "Somthing went wrong.") {
//         return new ApiResponse(responseCode.INTERNAL_SERVERERROR, {}, true, error, message);
//     }
//     static unautherized(error = {}, message = "Permission denied.") {
//         return new ApiResponse(responseCode.UNAUTERIZED, {}, true, error, message);
//     }
// }
// module.exports=ApiResponse;