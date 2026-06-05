const eventModel = require("../models/event.model");
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

function create(payload, adminId) {
  validatePayload(payload);
  return eventModel.create({
    ...payload,
    admin_id: payload.admin_id || adminId
  });
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
