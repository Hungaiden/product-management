const Role = require("../../models/role.model");


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