const registrationModel = require("../models/registration.model");
const ApiError = require("../utils/api-error");

function findAll(authUser) {
  if (authUser.role === "admin") {
    return registrationModel.findAll();
  }

  return registrationModel.findAllByUserId(authUser.id);
}

async function findById(id, authUser) {
  const registration = await registrationModel.findById(id);
  if (!registration) {
    return null;
  }

  if (authUser.role !== "admin" && Number(registration.user_id) !== Number(authUser.id)) {
    throw new ApiError(403, "Akses ditolak");
  }

  return registration;
}

function create(payload, authUser) {
  if (!payload.event_id) {
    throw new ApiError(400, "event_id wajib diisi");
  }

  return registrationModel.create({
    user_id: authUser.role === "admin" ? payload.user_id : authUser.id,
    event_id: payload.event_id,
    status: authUser.role === "admin" ? payload.status || "confirmed" : "pending"
  });
}

async function update(id, payload, authUser) {
  const registration = await findById(id, authUser);
  if (!registration) {
    return null;
  }

  const status = authUser.role === "admin" ? payload.status : "cancelled";
  return registrationModel.update(id, { status });
}

async function remove(id, authUser) {
  const registration = await findById(id, authUser);
  if (!registration) {
    return false;
  }

  await registrationModel.remove(id);
  return true;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove
};
