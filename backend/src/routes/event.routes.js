const router = require("express").Router();
const eventController = require("../controllers/event.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

router.get("/", eventController.getEvents);
router.get("/:id", eventController.getEventById);
router.post("/", authenticate, authorize("admin"), eventController.createEvent);
router.put("/:id", authenticate, authorize("admin"), eventController.updateEvent);
router.delete("/:id", authenticate, authorize("admin"), eventController.deleteEvent);

module.exports = router;
