const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");

module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;
  const cart = await Cart.findOne({
    _id: cartId
  });
  const products = cart.products;
  let total = 0;
  let totalFormat;
  for (const item of products) {
    const infoItem = await Product.findOne({
      _id: item.productId,
      deleted: false,
      status: "active"
    });
    item.thumbnail = infoItem.thumbnail;
    item.title = infoItem.title;
    item.slug = infoItem.slug;
    item.newPrice = infoItem.price;

    if(infoItem.discountPercentage > 0) {
      item.newPrice = (1 - infoItem.discountPercentage/100) * infoItem.price;     
    }
    // tổng tiền từng món hàng
    item.total = item.newPrice * item.quantity;
    
    // tổng tiền thanh toán
    total += item.total;
    // định dạng format tiền
    item.newPriceFormat = item.newPrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','); 
    item.totalFormat = item.total.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');    
  }
  totalFormat = total.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  res.render("client/pages/cart/index", {
    pageTitle: "Giỏ hàng",
    products: products,
    totalFormat: totalFormat
  });
};

module.exports.delete = async (req, res) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.id;
  const cart = await Cart.findOne({
    _id: cartId
  });
  const products = cart.products.filter(item => item.productId != productId);
  await Cart.updateOne({
    _id: cartId
  }, {
    products: products
  });

  req.flash('success', 'Xoá sản phẩm thành công!');
  res.redirect("back");
}

module.exports.addPost = async(req, res) => {
    const cartId = req.cookies.cartId;
    const cart = await Cart.findOne({
        _id: cartId
    });

    const products = cart.products;
    const existProduct = products.find(item => item.productId == req.params.id);

    if(existProduct) {
        existProduct.quantity = existProduct.quantity + parseInt(req.body.quantity);
    } else {
        const product = {
          productId: req.params.id,
          quantity: parseInt(req.body.quantity)
        };
      
        products.push(product);
    }

    await Cart.updateOne({
        _id: cartId
    }, {
        products: products
    });

    req.flash('success', 'Thêm sản phẩm vào giỏ hàng thành công!');
    res.redirect("back"); 
}

module.exports.updatePatch = async (req, res) => {
  const cartId = req.cookies.cartId;
  const product = req.body;
  const cart = await Cart.findOne({
    _id: cartId
  });
  const products = cart.products;
  const productUpdate = products.find(item => item.productId == product.productId);

  productUpdate.quantity = parseInt(product.quantity); // hàm find trả về tham chiếu của phần tử nên sẽ thay đổi trực tiếp

  await Cart.updateOne({
    _id: cartId
  }, {
    products: products
  });
  
  res.json({
    code: "success",
    message: "Cập nhật thành công!"
  });
}