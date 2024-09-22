const express = require("express");
const router = express.Router();
const multer  = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) { // nơi lưu file
      cb(null, './public/uploads/')
    },
    filename: function (req, file, cb) { // tên file được lưu
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null, fileName)
    }
});

const upload = multer({ storage: storage });

const controller = require("../../controllers/admin/products.controller");

const validate = require("../../validates/admin/product.validate");

router.get("/", controller.index);

router.patch("/change-status", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.patch("/delete", controller.delete);

router.patch("/change-position", controller.changePosition);

router.get("/create", controller.create);

router.post(
  "/create", 
  upload.single('thumbnail'),
  validate.createPost,
  controller.createPost 
);

router.get("/edit/:id", controller.edit);

router.patch(
  "/edit/:id", 
  upload.single('thumbnail'),
  validate.createPost,
  controller.editPatch 
);

module.exports = router;