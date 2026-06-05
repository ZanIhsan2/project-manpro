const bookmarkModel = require("../models/bookmark.model");
const ApiError = require("../utils/api-error");

function findAll(authUser) {
  if (authUser.role === "admin") {
    return bookmarkModel.findAll();
  }

  return bookmarkModel.findAllByUserId(authUser.id);
}

async function findById(id, authUser) {
  const bookmark = await bookmarkModel.findById(id);
  if (!bookmark) {
    return null;
  }

  if (authUser.role !== "admin" && Number(bookmark.user_id) !== Number(authUser.id)) {
    throw new ApiError(403, "Akses ditolak");
  }

  return bookmark;
}

function create(payload, authUser) {
  if (!payload.event_id) {
    throw new ApiError(400, "event_id wajib diisi");
  }

  return bookmarkModel.create({
    user_id: authUser.role === "admin" ? payload.user_id || authUser.id : authUser.id,
    event_id: payload.event_id
  });
}

async function remove(id, authUser) {
  const bookmark = await findById(id, authUser);
  if (!bookmark) {
    return false;
  }

  await bookmarkModel.remove(id);
  return true;
}

module.exports = {
  findAll,
  findById,
  create,
  remove
};
