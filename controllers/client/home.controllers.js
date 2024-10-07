const Product = require("../../models/product.model");
module.exports.index =async(req, res) => {
    // Sản phẩm nổi bật
    const productFeatured = await Product.find({
        deleted: false,
        status: "active",
        featured: "1"
    })
    .sort({
        position: "desc"
    })
    .limit(6)

    for(const item of productFeatured) {
        item.newPrice = (1 - item.discountPercentage / 100) * item.price;
        item.newPrice.toFixed(0);
    }

    // Sản phẩm mới
    const productNew = await Product.find({
        deleted: false,
        status: "active",
    })
    .sort({
        position: "desc"
    })
    .limit(6)

    for(const item of productNew) {
        item.newPrice = (1 - item.discountPercentage / 100) * item.price;
        item.newPrice.toFixed(0);
    }

    // Sản phẩm giảm giá
    const productDiscount = await Product.find({
        deleted: false,
        status: "active",
    })
    .sort({
        position: "desc"
    })
    .limit(6)

    for(const item of productDiscount) {
        item.newPrice = (1 - item.discountPercentage / 100) * item.price;
        item.newPrice.toFixed(0);
    }

    res.render("client/pages/home/index", {
        pageTitle: "Trang chủ",
        productFeatured: productFeatured,
        productNew: productNew,
        productDiscount: productDiscount
    });
}