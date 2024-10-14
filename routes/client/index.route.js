const productRoute = require("./products.route"); // nhung file vao
const homeRouter = require("./home.route");
const cartRoute = require("./cart.route");
const orderRoute = require("./order.route");

const categoryMiddleware = require("../../middlewares/client/category.middleware");

const cartMiddleware = require("../../middlewares/client/cart.middleware");
module.exports.index = (app) => { // xay dung ham route
    app.use(categoryMiddleware.category);
    
    app.use(cartMiddleware.cart);
    
    app.use("/", homeRouter);
      
    app.use("/products/", productRoute);

    app.use("/cart", cartRoute);

    app.use("/order", orderRoute);
}