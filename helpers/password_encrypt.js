const bcrypt = require("bcrypt");

/**password hashing */
const hashPassword = async (password) => {
  // console.log("calling hash password");

  try {
    // console.log(process.env.SALT);
    const salt_num = parseInt(process.env.SALT) || 10;
    return await bcrypt.hash(password, salt_num);
  } catch (error) {
    return error;
  }
};
/**cpmpare password */
const comparePassword = async (inputs) => {
  try {
    const comp = await bcrypt.compare(inputs.newPassword, inputs.storePassword);
    return comp;
  } catch (error) {
    return error;
  }
};

module.exports = { hashPassword, comparePassword };
