const dashboardRoute = require("./dashboard.route");

const productRoute = require("./products.route");

const systemConfig = require("../../config/system");


module.exports.index = (app) => {
  const PATH_ADMIN = `/admin`
  app.use(`${PATH_ADMIN}/dashboard`, dashboardRoute);




  app.use(`${PATH_ADMIN}/products`, productRoute);

}