const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");

module.exports.index = async(req, res) => {
  const listCategory = await ProductCategory.find({
    deleted: false
  });


  res.render("admin/pages/products-category/index", {
    listCategory: listCategory,
    pageTitle: "Danh sách danh mục sản phẩm"
  });
}


module.exports.create = async (req, res) => {
  const listCategory = await ProductCategory.find({
    deleted: false
  });
  res.render("admin/pages/products-category/create", {
    pageTitle: "Tạo danh mục sản phẩm",
    listCategory: listCategory
  });
}
module.exports.createPost = async (req, res) => {
  if(req.body.position) {
    req.body.position = parseInt(req.body.position);
  } else {
    const countRecord = await ProductCategory.countDocuments();
    req.body.position = countRecord + 1;
  }
  const record = new ProductCategory(req.body);
  await record.save();
  res.redirect(`/${systemConfig.prefixAdmin}/products-category`);
}

module.exports.edit = async (req, res) => {
  const id = req.params.id;
  
  const category = await ProductCategory.findOne({
    deleted: false,
    _id: id
  });

  const listCategory = await ProductCategory.find({
    deleted: false
  });

  res.render(
    "admin/pages/products-category/edit", {
      pageTitle: "Chỉnh sửa danh mục sản phẩm",
      listCategory: listCategory,
      category: category
    }
  );
}

module.exports.editPatch = async(req, res) => {
  const id = req.params.id;

  if(req.body.position) {
    req.body.position = parseInt(req.body.position);
  } else {
    delete req.body.position;
  }
  await ProductCategory.updateOne({
    _id: id,
    deleted: false
  }, req.body);

  req.flash("success", "Cập nhật thành công!");
  res.redirect(`back`);
}