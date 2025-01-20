const User = require("../../models/user.model");
const md5 = require("md5");

const generateHelper = require("../../helpers/generate.helper");
const sendMailHelper = require("../../helpers/sendMail.helper");

const ForgotPassword = require("../../models/forgot-password.model");
module.exports.register = async(req, res) => {
    res.render("client/pages/user/register",{
        pageTitle: "Trang đăng ký"
    });
}

module.exports.registerPost = async(req, res) => {
    const user = req.body;

    const existUser = await User.findOne({
        email: user.email,
        deleted: false
    });

    if(existUser) {
        req.flash("error", "Email đã tồn tại trong hệ thống!");
        res.redirect("back");
        return;
    }

    const dataUser = {
        fullName: user.fullName,
        email: user.email,
        password: md5(user.password),
        token: generateHelper.generateRandomString(30),
        status: "active"
    };

    const newUser = new User(dataUser);
    await newUser.save();
    
    res.cookie("tokenUser", newUser.token);
    req.flash("success", "Đăng ký tài khoản thành công!");
    res.redirect("/");
}

module.exports.login = async(req, res) => {
    res.render("client/pages/user/login", {
        pageTitle: "Trang đăng nhập"
    });
}

module.exports.loginPost = async(req, res) => {
    const user = req.body;
    const existUser = await User.findOne({
        email: user.email,
        deleted: false
    });

    if(!existUser) {
        req.flash("error", "Tài khoản không tồn tại");
        res.redirect("back");
        return;
    }

    if(md5(user.password) != existUser.password) {
        req.flash("error", "Sai mật khẩu");
        res.redirect("back");
        return;
    }

    if(existUser.status == "inactive") {
        req.flash("error", "Tài khoản bị khoá");
        res.redirect("back");
        return;
    }

    res.cookie("tokenUser", existUser.token);
    req.flash("success", "Đăng nhập thành công!");
    res.redirect("/");
    
}

module.exports.logout = async (req, res) => {
    res.clearCookie("tokenUser");
    req.flash("success", "Đã đăng xuất!");
    res.redirect("/");
};

module.exports.forgotPassword = async(req, res) => {
    res.render("client/pages/user/forgot-password", {
        pageTitle: "Trang quên mật khẩu"
    });
}

module.exports.forgotPasswordPost = async(req, res) => {
    const email = req.body.email;
    const existUser = await User.findOne({
        email: email,
        status: "active",
        deleted: false
    });
    if(!existUser) {
        req.flash("error", "Email không tồn tại!");
        res.redirect("back");
        return;
    }

    // Việc 1: Lưu email và mã OTP vào database
    const existEmailInForgotPassword = await ForgotPassword.findOne({
        email: email
    });
    if(!existEmailInForgotPassword) {
        const otp = generateHelper.generateRandomNumber(6); // tao otp
        const data = {
          email: email,
          otp: otp,
          expireAt: Date.now() + 5*60*1000 // thoi han  trong 5p doi san milis
        };
      
        const record = new ForgotPassword(data);
        await record.save();

        // Việc 2: Gửi mã OTP qua email cho user

        const subject = "Xác thực mã OTP";
        const text = `Mã xác thực của bạn là <b>${otp}</b>. Mã OTP có hiệu lực trong vòng 5 phút,
        vui lòng không cung cấp mã OTP này cho bất kỳ ai`
       
        sendMailHelper.sendMail(email, subject, text);
    }
    
    
    res.redirect(`/user/password/otp?email=${email}`);
}

module.exports.otpPassword = async (req, res) => {
    const email = req.query.email;
    res.render("client/pages/user/otp-password", {
      pageTitle: "Xác thực OTP",
      email: email
    });
};

module.exports.otpPasswordPost = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;

    const existRecord = await ForgotPassword.findOne({
      email: email,
      otp: otp
    });

    if(!existRecord) {
      req.flash("error", "Mã OTP không hợp lệ!");
      res.redirect("back");
      return;
    }

    const user = await User.findOne({
      email: email
    });

    res.cookie("tokenUser", user.token);
    res.redirect("/user/password/reset");
};

module.exports.resetPassword = async (req, res) => {
    res.render("client/pages/user/reset-password", {
      pageTitle: "Đổi mật khẩu"
    });
};

module.exports.resetPasswordPost = async (req, res) => {
    const password = req.body.password;
    const tokenUser = req.cookies.tokenUser;

    await User.updateOne({
      token: tokenUser,
      status: "active",
      deleted: false
    }, {
      password: md5(password)
    });

    req.flash("success", "Đổi mật khẩu thành công!");
    res.redirect("/");
};