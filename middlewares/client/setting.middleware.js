const Setting = require("../../models/setting.model");

module.exports.general = async(req, res, next) => {
    const settingGeneral = await Setting.findOne({});

    res.locals.settingGeneral = settingGeneral;

    next();
}