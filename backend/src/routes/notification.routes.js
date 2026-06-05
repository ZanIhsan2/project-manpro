const router = require("express").Router();
const notificationController = require("../controllers/notification.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

router.get("/", authenticate, notificationController.getNotifications);
router.get("/:id", authenticate, notificationController.getNotificationById);
router.post("/", authenticate, authorize("admin"), notificationController.createNotification);
router.put("/:id", authenticate, notificationController.updateNotification);
router.delete("/:id", authenticate, authorize("admin"), notificationController.deleteNotification);

module.exports = router;
