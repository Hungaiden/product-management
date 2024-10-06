const productRoute = require("./products.route"); // nhung file vao
const homeRouter = require("./home.route");

const categoryMiddleware = require("../../middlewares/client/category.middleware");
module.exports.index = (app) => { // xay dung ham route
    app.use(categoryMiddleware.category);
    
    app.use("/", homeRouter);
      
    app.use("/products/", productRoute);
}