const router = require("express").Router();
const bookmarkController = require("../controllers/bookmark.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

router.get("/", authenticate, bookmarkController.getBookmarks);
router.get("/:id", authenticate, bookmarkController.getBookmarkById);
router.post("/", authenticate, authorize("mahasiswa", "admin"), bookmarkController.createBookmark);
router.delete("/:id", authenticate, bookmarkController.deleteBookmark);

module.exports = router;
