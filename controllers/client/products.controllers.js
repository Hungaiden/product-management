const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");

module.exports.index = async (req, res) => {
  const products = await Product
    .find({
      status: "active",
      deleted: false
    })
    .sort({
      position: "desc"
    });

  for (const item of products) {
    item.priceNew = item.price*(100 - item.discountPercentage)/100;
    item.priceNew = (item.priceNew).toFixed(0);
  }
  res.render("client/pages/products/index", {
    pageTitle: "Danh sách sản phẩm",
    products: products  
});
}

module.exports.detail = async (req, res) => {
  const slug = req.params.slug;

  const product = await Product
    .findOne({
      slug: slug,
      status: "active",
      deleted: false
    });

  
  product.priceNew = product.price *(100 - product.discountPercentage)/100;
  product.priceNew = (product.priceNew).toFixed(0);
  

  res.render("client/pages/products/detail", {
    pageTitle: product.title,
    product: product 
});
}

module.exports.category = async (req, res) => {
  const slugCategory = req.params.slugCategory;
  
  const category = await ProductCategory.findOne({
    slug: slugCategory,
    deleted: false,
    status: "active"
  })
  const products = await Product.find({
    category_id: category.id,
    status: "active",
    deleted: false
  }).sort({ position: "desc" });
  for (const product of products) {
    product.priceNew = product.price*(100 - product.discountPercentage)/100;
    product.priceNew = (product.priceNew).toFixed(0);
  }
  res.render("client/pages/products/index", {
    pageTitle: category.title,
    products: products
  });
}