const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/products.controllers")

router.get("/",  controller.index);

router.get("/search", controller.search);

router.get("/detail/:slug",  controller.detail);

router.get("/:slugCategory", controller.category);

module.exports = router;
