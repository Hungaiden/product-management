const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/products.controller");

router.get("/", controller.index);

router.patch("/change-status", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.patch("/delete", controller.delete);

router.patch("/change-position", controller.changePosition);

router.get("/create", controller.create);

router.post("/create", controller.createPost);

module.exports = router;