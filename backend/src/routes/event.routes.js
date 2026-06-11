const router = require("express").Router();
const path = require("path");
const multer = require("multer");
const eventController = require("../controllers/event.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../public/uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Hanya file gambar (jpeg, jpg, png, gif, webp) yang diperbolehkan!"));
  }
});

router.get("/", eventController.getEvents);
router.get("/:id", eventController.getEventById);
router.post("/", authenticate, authorize("admin"), upload.single("image"), eventController.createEvent);
router.put("/:id", authenticate, authorize("admin"), upload.single("image"), eventController.updateEvent);
router.delete("/:id", authenticate, authorize("admin"), eventController.deleteEvent);

module.exports = router;
