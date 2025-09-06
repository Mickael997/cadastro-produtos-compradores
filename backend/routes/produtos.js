const express = require("express");
const router = express.Router();
const controller = require("../controllers/produtoController");
const { verifyToken, requireRole } = require("../middleware/auth");

router.get("/", verifyToken, controller.listar);
router.post("/", verifyToken, requireRole("admin"), controller.criar);
router.put("/:id", verifyToken, requireRole("admin"), controller.atualizar);
router.delete("/:id", verifyToken, requireRole("admin"), controller.remover);

module.exports = router;
