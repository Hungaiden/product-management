const Product = require("../../models/product.models");
const systemConfig = require("../../config/system");
module.exports.index = async (req, res) => {
  const find = {
    deleted : false
  }

  // lọc theo trạng thái
  if(req.query.status) {
    find.status = req.query.status;
  }
// hết lọc theo trạng thái


// Tìm kiếm
  if(req.query.keyword) {
    const regex = new RegExp(req.query.keyword, "i");
    find.title = regex;
  }
// Hết tìm kiếm


//Phân trang
  let limitItems = 4;
  let page = 1;

  if(req.query.limit) {
    limitItems = parseInt(req.query.limit);
  }

  if(req.query.page) {
    page = parseInt(req.query.page);
  }
  const skip = (page - 1) * limitItems;
  
  // Tính tổng số trang
  const totalProduct = await Product.countDocuments(find);
  const totalPage = Math.ceil(totalProduct / limitItems);
  
//Hết phân trang
  
// const products = await Product.find(find).limit(limitItems).skip(skip);

  const products = await Product
  .find(find)
  .limit(limitItems)
  .skip(skip)
  .sort({
    position: "ascending"
  });

  res.render("admin/pages/products/index", {
    pageTitle: "Danh sách sản phẩm",
    products: products,
    totalPage: totalPage,// trả ra ngoài giao diện
    currentPage: page
  });
}

module.exports.changeStatus = async (req, res) => {
  await Product.updateOne({
    _id: req.body.id
  }, {
    status: req.body.status
  });

  req.flash('success', 'Đổi trạng thái thành công!');

  res.json({
    code: "success"
  });
}

module.exports.changeMulti = async (req, res) => {
  // await Product.updateMany({
  //   _id: req.body.ids
  // }, {
  //   status: req.body.status
  // });

  // res.json({
  //   code: "success",
  //   message: "Đổi trạng thái thành công!"
  // });
  switch (req.body.status) {
    case "active":
      await Product.updateMany({
        _id: req.body.ids
      }, {
        status: req.body.status
      });
      
      req.flash('success', 'Đổi trạng thái thành công!');

      res.json({
        code: "success"
      });
      break;
    

    case "inactive":
      await Product.updateMany({
        _id: req.body.ids
      }, {
        status: req.body.status
      });
      
      req.flash('success', 'Đổi trạng thái thành công!');

      res.json({
        code: "success"
      });
      break;
    case "delete":
      await Product.updateMany({
        _id: req.body.ids
      }, {
        deleted: "true"
      });
    
      req.flash('success', 'Xoá thành công!');
      res.json({
        code: "success"
      });
      break;
    default:
      req.flash('success', 'Trạng thái không hợp lệ!');
      res.json({
        code: "error"
      });
      break;
  }
}


module.exports.delete = async (req, res) => {
  await Product.updateOne({
    _id: req.body.id
  },{
    deleted: true
  }
  );

  req.flash('success', 'Xoá thành công!');

  res.json({
    code: "success"
  });
}

module.exports.changePosition = async (req, res) => {
  await Product.updateOne({
    _id: req.body.id
  },{
    position: req.body.position
  });

  req.flash('success', 'Đổi vị trí thành công!');

  res.json({
    code: "success"
  })
}

module.exports.create = async (req, res) => {
  res.render("admin/pages/products/create", {
    pageTitle: "Thêm mới sản phẩm"
  });
}

module.exports.createPost = async(req, res) => {
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  
  if(req.body.position) {
    req.body.position = parseInt(req.body.position);
  }
  else {
    const count = await Product.countDocuments();
    req.body.position = count + 1;
  }

  if(req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`
  }
  
  const record = new Product(req.body);

  await record.save(); // đợi đến khi thêm bản ghi xong

  res.redirect(`/${systemConfig.prefixAdmin}/products`);
}

module.exports.edit = async (req, res) => {
  const id = req.params.id;

  const product = await Product.findOne({
    _id: id,
    deleted: false
  });

  console.log(product);

  res.render("admin/pages/products/edit", {
    pageTitle: "Chỉnh sửa sản phẩm",
    product: product
  });
}

module.exports.editPatch = async(req, res) => {
  const id = req.params.id;

  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  
  if(req.body.position) {
    req.body.position = parseInt(req.body.position);
  }

  if(req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`
  }

  await Product.updateOne({
    _id: id,
    deleted: false
  }, req.body)

  req.flash("success", "Cập nhật thành công !")
  res.redirect("back");
}
