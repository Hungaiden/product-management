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
    if(res.locals.role.permissions.includes("roles_create")){
        const role = new Role(req.body);
        await role.save();

        req.flash("success", "Thêm mới thành công");
    }
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
    if(res.locals.role.permissions.includes("roles_edit")){
        const id = req.params.id;

        await Role.updateOne({
            _id: id,
            deleted: false
        }, req.body);

        console.log(req.body);
        req.flash("success", "Cập nhật thành công!");
    }
    res.redirect(`back`);
}

module.exports.permissions = async(req, res) => {
    const records = await Role.find({
        deleted: false
    });
    res.render("admin/pages/role/permissions", {
        pageTitle: "Phân quyền",
        records: records
    });
}

module.exports.permissionsPatch = async(req, res) => {
    if(res.locals.role.permissions.includes("roles_permissions")){
        for(const item of req.body) {
            await Role.updateOne({        
                _id: item.id,
                deleted: false
            }, {
                permissions: item.permissions
            });
        }

        req.flash("success", "Cập nhật thành công !");
        res.json({
            code: "success"
        });
    }
    
}
