const productRoute = require("./products.route"); // nhung file vao
const homeRouter = require("./home.route");
module.exports.index = (app) => { // xay dung ham route
    app.use("/", homeRouter);
      
    app.use("/products/", productRoute);
}