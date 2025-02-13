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
  if(res.locals.role.permissions.includes("accounts_create")){
    req.body.password = md5(req.body.password);
    req.body.token = generateHelper.generateRandomString(30);
    const account = new Account(req.body);
    await account.save();
  }
  res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
}

module.exports.edit = async (req, res) => {
  const roles = await Role.find({
    deleted: false
  });

  const id = req.params.id;
  
  const account = await Account.findOne({
    deleted: false,
    _id: id
  });

  res.render("admin/pages/account/edit", {
    pageTitle: "Chỉnh sửa tài khoản",
    account: account,
    roles: roles
  })
}

module.exports.editPatch = async(req, res) => {
  if(res.locals.role.permissions.includes("accounts_edit")){
    await Account.updateOne({
      _id: req.params.id,
      deleted: false
    }, req.body);

    req.flash("success", "Thay đổi thành công");
  }
  res.redirect("back");
}

module.exports.detail = async (req, res) => {
  const id = req.params.id;
  
  const accounts = await Account.findOne({
    deleted: false,
    _id: id
  });

  
  res.render("admin/pages/account/detail", {
    pageTitle: "Chỉnh sửa tài khoản",
    accounts: accounts,
  })
}

module.exports.delete = async (req, res) => {
  if(res.locals.role.permissions.includes("accounts_delete")) {
    await Account.updateOne({
      _id: req.params.id
    },{
      deleted: true,
    }
    );

    req.flash('success', 'Xoá thành công!');

    res.json({
      code: "success"
    });
  }
}

module.exports.changePassword = async (req, res) => {
  const account = await Account.findOne({
    _id: req.params.id,
    deleted: false
  });
  res.render("admin/pages/account/change-password", {
    pageTitle: "Đổi mật khẩu",
    account: account
  });
}
module.exports.changePasswordPatch = async (req, res) => {
  if(res.locals.role.permissions.includes("accounts_edit")){
    const user = await Account.findOne({
      _id: req.params.id,
      deleted: false 
    });
    if(md5(req.body.old_password) != user.password) {
      req.flash("error", "Sai mật khẩu");
      res.redirect("back");
      
    }
  
    else {
      await Account.updateOne({
        _id: req.params.id,
        deleted: false
      }, {
        password: md5(req.body.new_password)
      });
      req.flash("success", "Cập nhật mật khẩu thành công!");
    } 
  };
  res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
}

module.exports.myProfile = async (req, res) => {
  res.render("admin/pages/account/my-profile", {
    pageTitle: "Trang thông tin cá nhân",
  });
}

module.exports.editProfile = async(req, res) => {
  const roles = await Role.find({
    deleted: false
  });
  res.render("admin/pages/account/edit-profile", {
    pageTitle: "Chỉnh sửa tài khoản",
    roles: roles
  })
}

module.exports.editProfilePatch = async(req, res) => {
  if(res.locals.role.permissions.includes("accounts_edit")){
    await Account.updateOne({
      _id: res.locals.user.id,
      deleted: false
    }, req.body);
  
    req.flash("success", "Thay đổi thành công");
  }
  
  res.redirect("back");
}



