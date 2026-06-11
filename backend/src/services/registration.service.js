const registrationModel = require("../models/registration.model");
const eventModel = require("../models/event.model");
const ApiError = require("../utils/api-error");

async function findAll(authUser) {
  // Always filter by the current user's ID to enforce personal isolation.
  // Both mahasiswa and admin only see their own registrations on the /registrations page.
  const registrations = await registrationModel.findAllByUserId(authUser.id);

  const enriched = [];
  for (const r of registrations) {
    const event = await eventModel.findById(r.event_id);
    enriched.push({
      ...r,
      event
    });
  }
  return enriched;
}

async function findById(id, authUser) {
  const registration = await registrationModel.findById(id);
  if (!registration) {
    return null;
  }

  if (authUser.role !== "admin" && Number(registration.user_id) !== Number(authUser.id)) {
    throw new ApiError(403, "Akses ditolak");
  }

  const event = await eventModel.findById(registration.event_id);
  return {
    ...registration,
    event
  };
}

async function create(payload, authUser) {
  if (!payload.event_id) {
    throw new ApiError(400, "event_id wajib diisi");
  }

  const userId = authUser.role === "admin" ? payload.user_id || authUser.id : authUser.id;
  const eventId = payload.event_id;

  // Cek apakah pendaftaran aktif sudah ada (status pending atau confirmed)
  const existing = await registrationModel.findAllByUserId(userId);
  const alreadyRegistered = existing.some(
    (r) => Number(r.event_id) === Number(eventId) && r.status !== "cancelled"
  );
  if (alreadyRegistered) {
    throw new ApiError(400, "Anda sudah terdaftar untuk event ini");
  }

  const registration = await registrationModel.create({
    user_id: userId,
    event_id: eventId,
    status: authUser.role === "admin" ? payload.status || "confirmed" : "pending"
  });

  return registration;
}

async function update(id, payload, authUser) {
  const registration = await registrationModel.findById(id);
  if (!registration) {
    return null;
  }

  if (authUser.role !== "admin" && Number(registration.user_id) !== Number(authUser.id)) {
    throw new ApiError(403, "Akses ditolak");
  }

  const status = authUser.role === "admin" ? payload.status : "cancelled";
  const updated = await registrationModel.update(id, { status });
  return updated;
}

async function remove(id, authUser) {
  const registration = await registrationModel.findById(id);
  if (!registration) {
    return false;
  }

  if (authUser.role !== "admin" && Number(registration.user_id) !== Number(authUser.id)) {
    throw new ApiError(403, "Akses ditolak");
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
