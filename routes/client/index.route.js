const productRoute = require("./products.route"); // nhung file vao
const homeRouter = require("./home.route");
const cartRoute = require("./cart.route");
const orderRoute = require("./order.route");
const userRoute = require("./user.route");
const chatRoute = require("./chat.route");

const categoryMiddleware = require("../../middlewares/client/category.middleware");

const cartMiddleware = require("../../middlewares/client/cart.middleware");

const userMiddleware = require("../../middlewares/client/user.middleware");

const settingMiddleware = require("../../middlewares/client/setting.middleware");

module.exports.index = (app) => { // xay dung ham route
    app.use(categoryMiddleware.category);
    
    app.use(cartMiddleware.cart);

    app.use(userMiddleware.infoUser);

    app.use(settingMiddleware.general);
    
    app.use("/", homeRouter);
      
    app.use("/products/", productRoute);

    app.use("/cart", cartRoute);

    app.use("/order", orderRoute);

    app.use("/user", userRoute);

    app.use(
        "/chat", 
        userMiddleware.requireAuth,
        chatRoute
    );

    app.get("*", (req, res) => {
        res.render("client/pages/errors/404", {
          pageTitle: "404 Not Found",
        });
    });
}