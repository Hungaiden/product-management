const Cart = require("../../models/cart.model");
const Order = require("../../models/order.model");
const Product = require("../../models/product.model");

module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;
  const cart = await Cart.findOne({
    _id: cartId
  });

  const products = cart.products;

  let total = 0;

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
    item.total = item.newPrice * item.quantity;

    // định dạng format tiền
    item.newPriceFormat = item.newPrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','); 
    item.totalFormat = item.total.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');    
    total += item.total;
  }

  totalFormat = total.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  res.render("client/pages/order/index", {
    pageTitle: "Đặt hàng",
    products: products,
    total: total
  });
};

module.exports.orderPost = async (req, res) => {
  const cartId = req.cookies.cartId;
  const order = req.body;
  
  const dataOrder = {
    fullName: order.fullName,
    phone: order.phone,
    address: order.address,
    products: []
  };

  const cart = await Cart.findOne({
    _id: cartId
  });

  const products = cart.products;

  for (const item of products) {
    const infoItem = await Product.findOne({
      _id: item.productId
    });

    const product = {
      productId: item.productId,
      price: infoItem.price,
      discountPercentage: infoItem.discountPercentage,
      quantity: item.quantity
    };

    dataOrder.products.push(product);
  }

  const newOrder = new Order(dataOrder);
  await newOrder.save();

  await Cart.updateOne({
    _id: cartId
  }, {
    products: []
  });

  res.redirect(`/order/success/${newOrder.id}`);
}

module.exports.success = async (req, res) => {
  const orderId = req.params.id;
  
  const order = await Order.findOne({
    _id: orderId
  });
  let total = 0;
  for (const item of order.products) {
    const infoItem = await Product.findOne({
      _id: item.productId
    });
    item.thumbnail = infoItem.thumbnail;
    item.title = infoItem.title;
    item.slug = infoItem.slug;
    item.newPrice = item.price;
    if(item.discountPercentage > 0) {
      item.newPrice = (1 - item.discountPercentage/100) * item.price;
      
    }
    item.total = item.newPrice * item.quantity;
    // định dạng format tiền
    item.newPriceFormat = item.newPrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','); 
    item.totalFormat = item.total.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');    
    total += item.total;
  }

  totalFormat = total.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  res.render("client/pages/order/success", {
    pageTitle: "Đặt hàng thành công",
    order: order,
    total: total
  });
};
