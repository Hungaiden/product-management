module.exports.index = (req, res) => {
    res.render("admin/pages/account/index", {
      pageTitle: "Danh sách tài khoản"
    });
  }