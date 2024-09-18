const mongoose = require('mongoose');

module.exports.connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Kết nối databse thành công!");
  } catch (error) {
    console.log("Kết nối databse không thành công!");
    console.log(error);
  }
}