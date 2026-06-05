const router = require("express").Router();
const userController = require("../controllers/user.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

router.get("/me", authenticate, userController.getMe);
router.get("/", authenticate, authorize("admin"), userController.getUsers);
router.get("/:id", authenticate, authorize("admin"), userController.getUserById);
router.post("/", authenticate, authorize("admin"), userController.createUser);
router.put("/:id", authenticate, authorize("admin"), userController.updateUser);
router.delete("/:id", authenticate, authorize("admin"), userController.deleteUser);

module.exports = router;
