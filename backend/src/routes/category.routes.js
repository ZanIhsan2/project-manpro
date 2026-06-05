const router = require("express").Router();
const categoryController = require("../controllers/category.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategoryById);
router.post("/", authenticate, authorize("admin"), categoryController.createCategory);
router.put("/:id", authenticate, authorize("admin"), categoryController.updateCategory);
router.delete("/:id", authenticate, authorize("admin"), categoryController.deleteCategory);

module.exports = router;
