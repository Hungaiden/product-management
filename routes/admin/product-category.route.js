const express = require("express");
const router = express.Router();
const multer  = require('multer');
const upload = multer();
const controller = require("../../controllers/admin/product-category.controller");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
  "/create",
  upload.single('thumbnail'),
  uploadCloud.uploadSingle,
  controller.createPost
);

router.get("/edit/:id", controller.edit);

router.get("/detail/:id", controller.detail);

router.patch(
  "/edit/:id",
  upload.single('thumbnail'),
  uploadCloud.uploadSingle,
  controller.editPatch
);

router.patch("/delete/:id", controller.delete);
module.exports = router;