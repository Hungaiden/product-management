const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/user.controllers");

router.get("/register", controller.register);

router.post("/register", controller.registerPost);


module.exports = router;