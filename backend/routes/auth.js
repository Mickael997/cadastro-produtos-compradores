const express = require("express");
const router = express.Router();
const controller = require("../controllers/authController");

router.post("/", controller.login);
router.get("/me", controller.me);

module.exports = router;
