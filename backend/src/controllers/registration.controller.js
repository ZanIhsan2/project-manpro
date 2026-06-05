const registrationService = require("../services/registration.service");

async function getRegistrations(req, res, next) {
  try {
    const registrations = await registrationService.findAll(req.user);
    res.json({ data: registrations });
  } catch (error) {
    next(error);
  }
}

async function getRegistrationById(req, res, next) {
  try {
    const registration = await registrationService.findById(req.params.id, req.user);

    if (!registration) {
      return res.status(404).json({ message: "Registrasi tidak ditemukan" });
    }

    return res.json({ data: registration });
  } catch (error) {
    return next(error);
  }
}

async function createRegistration(req, res, next) {
  try {
    const registration = await registrationService.create(req.body, req.user);
    res.status(201).json({ data: registration });
  } catch (error) {
    next(error);
  }
}

async function updateRegistration(req, res, next) {
  try {
    const registration = await registrationService.update(req.params.id, req.body, req.user);

    if (!registration) {
      return res.status(404).json({ message: "Registrasi tidak ditemukan" });
    }

    return res.json({ data: registration });
  } catch (error) {
    return next(error);
  }
}

async function deleteRegistration(req, res, next) {
  try {
    const deleted = await registrationService.remove(req.params.id, req.user);

    if (!deleted) {
      return res.status(404).json({ message: "Registrasi tidak ditemukan" });
    }

    return res.json({ message: "Registrasi berhasil dihapus" });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getRegistrations,
  getRegistrationById,
  createRegistration,
  updateRegistration,
  deleteRegistration
};
