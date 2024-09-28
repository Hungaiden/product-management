const dashboardRoute = require("./dashboard.route");

const productRoute = require("./product.route");

const productCategoryRoute = require("./product-category.route");

const systemConfig = require("../../config/system");


module.exports.index = (app) => {
  const PATH_ADMIN = `/admin`
  app.use(`${PATH_ADMIN}/dashboard`, dashboardRoute);

  app.use(`${PATH_ADMIN}/products`, productRoute);

  app.use(`${PATH_ADMIN}/products-category`, productCategoryRoute);

}