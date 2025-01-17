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
  if(res.locals.role.permissions.includes("product-category_create")){
    if(req.body.position) {
      req.body.position = parseInt(req.body.position);
    } else {
      const countRecord = await ProductCategory.countDocuments();
      req.body.position = countRecord + 1;
    }
    const record = new ProductCategory(req.body); 
    await record.save();
    
  }
  res.redirect(`/${systemConfig.prefixAdmin}/products-category`);
}

module.exports.edit = async (req, res) => {
  if(res.locals.role.permissions.includes("products_edit")) {
    const id = req.params.id;
    
    const category = await ProductCategory.findOne({
      deleted: false,
      _id: id
    });

    const listCategory = await ProductCategory.find({
      deleted: false
    });
  }

  res.render(
    "admin/pages/products-category/edit", {
      pageTitle: "Chỉnh sửa danh mục sản phẩm",
      listCategory: listCategory,
      category: category
    }
  );
}

module.exports.editPatch = async(req, res) => {
  if(res.locals.role.permissions.includes("product-category_edit")) {
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

    req.flash("success", "Thay đổi thành công");
    res.redirect("back");
  }
}

module.exports.detail = async (req, res) => {
  if(res.locals.role.permissions.includes("product-category_view")) {
    const id = req.params.id;
    
    const productCategory = await ProductCategory.findOne({
      _id: id,
      deleted: false
    });
    var productCategoryParent;
    if(productCategory.parent_id) {
      const productCategoryParent = await ProductCategory.findOne({
        _id: productCategory.parent_id,
        deleted: false
      });
    }
    
    res.render("admin/pages/products-category/detail", {
      pageTitle: "Chi tiết danh mục sản phẩm",
      productCategory: productCategory,
      productCategoryParent: productCategoryParent || ""
    });
  }
}

module.exports.delete = async (req, res) => {
  if(res.locals.role.permissions.includes("product-category_delete")) {
    await ProductCategory.updateOne({
      _id: req.params.id
    },{
      deleted: true,
      deleteddBy :res.locals.user.id,
      deleteddAt : new Date()
    }
    );

    req.flash('success', 'Xoá thành công!');

    res.json({
      code: "success"
    });
  }
}