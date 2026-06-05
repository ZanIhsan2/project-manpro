const notificationModel = require("../models/notification.model");
const ApiError = require("../utils/api-error");

function findAll(authUser) {
  if (authUser.role === "admin") {
    return notificationModel.findAll();
  }

  return notificationModel.findAllByUserId(authUser.id);
}

async function findById(id, authUser) {
  const notification = await notificationModel.findById(id);
  if (!notification) {
    return null;
  }

  if (authUser.role !== "admin" && Number(notification.user_id) !== Number(authUser.id)) {
    throw new ApiError(403, "Akses ditolak");
  }

  return notification;
}

function create(payload) {
  if (!payload.user_id || !payload.event_id || !payload.message) {
    throw new ApiError(400, "user_id, event_id, dan message wajib diisi");
  }

  return notificationModel.create(payload);
}

async function update(id, payload, authUser) {
  const notification = await findById(id, authUser);
  if (!notification) {
    return null;
  }

  if (authUser.role === "admin") {
    return notificationModel.update(id, {
      message: payload.message || notification.message,
      is_read: payload.is_read ?? notification.is_read
    });
  }

  return notificationModel.updateReadStatus(id, payload.is_read ?? 1);
}

async function remove(id) {
  const notification = await notificationModel.findById(id);
  if (!notification) {
    return false;
  }

  await notificationModel.remove(id);
  return true;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove
};
