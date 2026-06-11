const eventModel = require("../models/event.model");
const userModel = require("../models/user.model");
const notificationModel = require("../models/notification.model");
const ApiError = require("../utils/api-error");

function findAll() {
  return eventModel.findAll();
}

function findById(id) {
  return eventModel.findById(id);
}

function validatePayload(payload) {
  if (!payload.title || !payload.start_time || !payload.end_time) {
    throw new ApiError(400, "Title, start_time, dan end_time wajib diisi");
  }
}

async function create(payload, adminId) {
  validatePayload(payload);
  const event = await eventModel.create({
    ...payload,
    admin_id: payload.admin_id || adminId
  });

  try {
    const users = await userModel.findAll();
    const students = users.filter((u) => u.role === "mahasiswa");
    for (const student of students) {
      await notificationModel.create({
        user_id: student.id,
        event_id: event.id,
        message: `Event baru ditambahkan: "${event.title}". Yuk daftar!`,
        is_read: 0
      });
    }
  } catch (err) {
    console.error("Gagal membuat notifikasi otomatis:", err);
  }

  return event;
}

async function update(id, payload) {
  const existingEvent = await eventModel.findById(id);
  if (!existingEvent) {
    return null;
  }

  return eventModel.update(id, payload);
}

async function remove(id) {
  const existingEvent = await eventModel.findById(id);
  if (!existingEvent) {
    return false;
  }

  await eventModel.remove(id);
  return true;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove
};
