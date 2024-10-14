const express = require("express"); 
const router = express.Router();

const controller = require("../../controllers/client/cart.controllers")

router.get("/", controller.index);

router.post("/add/:id", controller.addPost);

module.exports = router;
