const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/products.controllers")

router.get("/",  controller.index);

module.exports = router;
