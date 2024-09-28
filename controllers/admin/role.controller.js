const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");


module.exports.index = async (req, res) => {
    const records = await Role.find({
        deleted: false
    });
    res.render("admin/pages/role/index", {
      pageTitle: "Trang nhóm quyền",
      records: records
    });
}

module.exports.create = async(req, res) => {
    res.render("admin/pages/role/create", {
        pageTitle: "Trang thêm mới",       
    });
}

module.exports.createPost = async(req, res) => {
    const role = new Role(req.body);
    await role.save();

    res.redirect(`/${systemConfig.prefixAdmin}/roles`);
}

module.exports.edit = async(req, res) => {
    const id = req.params.id;

    const role = await Role.findOne({
        deleted: false,
        _id: id
    });
    
    res.render("admin/pages/role/edit", {
        pageTitle: "Trang chỉnh sửa",     
        role: role  
    });
}

module.exports.editPatch = async(req, res) => {
    const id = req.params.id;

    await Role.updateOne({
        _id: id,
        deleted: false
      }, req.body);

      console.log(req.body);
      req.flash("success", "Cập nhật thành công!");
      res.redirect(`back`);
}
