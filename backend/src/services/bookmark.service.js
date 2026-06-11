const bookmarkModel = require("../models/bookmark.model");
const eventModel = require("../models/event.model");
const ApiError = require("../utils/api-error");

async function findAll(authUser) {
  // Always filter by current user's ID to enforce personal isolation (admins only see their own bookmarks)
  const bookmarks = await bookmarkModel.findAllByUserId(authUser.id);

  const enriched = [];
  for (const b of bookmarks) {
    const event = await eventModel.findById(b.event_id);
    if (event) {
      enriched.push({
        ...b,
        event
      });
    }
  }
  return enriched;
}

async function findById(id, authUser) {
  const bookmark = await bookmarkModel.findById(id);
  if (!bookmark) {
    return null;
  }

  if (authUser.role !== "admin" && Number(bookmark.user_id) !== Number(authUser.id)) {
    throw new ApiError(403, "Akses ditolak");
  }

  const event = await eventModel.findById(bookmark.event_id);
  return {
    ...bookmark,
    event
  };
}

async function create(payload, authUser) {
  if (!payload.event_id) {
    throw new ApiError(400, "event_id wajib diisi");
  }

  const userId = authUser.role === "admin" ? payload.user_id || authUser.id : authUser.id;
  const eventId = payload.event_id;

  // Cek apakah bookmark sudah ada
  const existing = await bookmarkModel.findAllByUserId(userId);
  const alreadyBookmarked = existing.some((b) => Number(b.event_id) === Number(eventId));
  if (alreadyBookmarked) {
    throw new ApiError(400, "Event sudah ditambahkan ke bookmark");
  }

  const bookmark = await bookmarkModel.create({
    user_id: userId,
    event_id: eventId
  });

  return bookmark;
}

async function remove(id, authUser) {
  const bookmark = await bookmarkModel.findById(id);
  if (!bookmark) {
    return false;
  }

  if (authUser.role !== "admin" && Number(bookmark.user_id) !== Number(authUser.id)) {
    throw new ApiError(403, "Akses ditolak");
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
