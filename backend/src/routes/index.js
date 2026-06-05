const router = require("express").Router();

const authRoutes = require("./auth.routes");
const bookmarkRoutes = require("./bookmark.routes");
const categoryRoutes = require("./category.routes");
const eventRoutes = require("./event.routes");
const notificationRoutes = require("./notification.routes");
const registrationRoutes = require("./registration.routes");
const userRoutes = require("./user.routes");

router.use("/auth", authRoutes);
router.use("/bookmarks", bookmarkRoutes);
router.use("/categories", categoryRoutes);
router.use("/events", eventRoutes);
router.use("/notifications", notificationRoutes);
router.use("/registrations", registrationRoutes);
router.use("/users", userRoutes);

module.exports = router;
