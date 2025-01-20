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

    for (const item of productFeatured) {
        item.newPrice = (1 - item.discountPercentage / 100) * item.price;
        item.newPrice = item.newPrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Cách 1: Tự định dạng
        // Hoặc dùng toLocaleString:
        // item.newPriceFormatted = Math.round(item.newPrice).toLocaleString('vi-VN');
        item.priceFormatted = item.price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
        item.newPrice = item.newPrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Cách 1: Tự định dạng
        // Hoặc dùng toLocaleString:
        // item.newPriceFormatted = Math.round(item.newPrice).toLocaleString('vi-VN');
        item.priceFormatted = item.price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    // Sản phẩm giảm giá
    const productDiscount = await Product.find({
        deleted: false,
        status: "active",
    })
    .sort({
        discountPercentage: "desc"
    })
    .limit(6)

    for(const item of productDiscount) {
        item.newPrice = (1 - item.discountPercentage / 100) * item.price;
        item.newPrice = item.newPrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Cách 1: Tự định dạng
        // Hoặc dùng toLocaleString:
        // item.newPriceFormatted = Math.round(item.newPrice).toLocaleString('vi-VN');
        item.priceFormatted = item.price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    res.render("client/pages/home/index", {
        pageTitle: "Trang chủ",
        productFeatured: productFeatured,
        productNew: productNew,
        productDiscount: productDiscount
    });
}