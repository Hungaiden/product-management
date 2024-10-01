const Role = require("../../models/role.model");
const Account = require("../../models/account.model");
const md5 = require("md5");

const generateHelper = require("../../helpers/generate.helper");
const systemConfig = require("../../config/system");
module.exports.index = async(req, res) => {
  const records = await Account.find({
    deleted: false
  });
  for(const item of records) {
    const role = await Role.findOne({
      deleted: false,
      _id: item.role_id
    });

    item.role_title = role.title;
  }
  res.render("admin/pages/account/index", {
    pageTitle: "Danh sách tài khoản",
    records: records
  });
}

module.exports.create = async(req, res) => {
  const roles = await Role.find({
    deleted: false,
  })
  res.render("admin/pages/account/create", {
    pageTitle: "Tạo tài khoản",
    roles: roles
  });
}

module.exports.createPost = async(req, res) => {
  req.body.password = md5(req.body.password);
  req.body.token = generateHelper.generateRandomString(30);
  const account = new Account(req.body);
  await account.save();
  
  res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
}