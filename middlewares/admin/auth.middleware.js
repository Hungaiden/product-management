const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");

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

    next();
}