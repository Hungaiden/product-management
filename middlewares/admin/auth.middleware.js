const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");

const Role = require("../../models/role.model");
module.exports.requireAuth = async (req, res, next) => {
    if(!req.cookies.token ) {
        res.redirect(`/${systemConfig.prefixAdmin}/auth`);
        return;
    }

    const user = await Account.findOne({
        deleted: false,
        token : req.cookies.token,
        status: "active"
    });

    if(!user) {
        res.clearCookie("token");
        res.redirect(`/${systemConfig.prefixAdmin}/auth`);
        return;
    }

    const role = await Role.findOne({
        deleted: false,
        _id: user.role_id
    });

    res.locals.user = user;
    res.locals.role = role;

    next();
}