const router = require("express").Router();
const registrationController = require("../controllers/registration.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

router.get("/", authenticate, registrationController.getRegistrations);
router.get("/:id", authenticate, registrationController.getRegistrationById);
router.post("/", authenticate, authorize("mahasiswa", "admin"), registrationController.createRegistration);
router.put("/:id", authenticate, registrationController.updateRegistration);
router.delete("/:id", authenticate, registrationController.deleteRegistration);

module.exports = router;
