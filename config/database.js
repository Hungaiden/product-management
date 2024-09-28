const mongoose = require('mongoose');

module.exports.connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Kết nối database thành công!");
  } catch (error) {
    console.log("Kết nối database không thành công!");
    console.log(error);
  }
}