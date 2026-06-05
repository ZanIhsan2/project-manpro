const bookmarkService = require("../services/bookmark.service");

async function getBookmarks(req, res, next) {
  try {
    const bookmarks = await bookmarkService.findAll(req.user);
    res.json({ data: bookmarks });
  } catch (error) {
    next(error);
  }
}

async function getBookmarkById(req, res, next) {
  try {
    const bookmark = await bookmarkService.findById(req.params.id, req.user);

    if (!bookmark) {
      return res.status(404).json({ message: "Bookmark tidak ditemukan" });
    }

    return res.json({ data: bookmark });
  } catch (error) {
    return next(error);
  }
}

async function createBookmark(req, res, next) {
  try {
    const bookmark = await bookmarkService.create(req.body, req.user);
    res.status(201).json({ data: bookmark });
  } catch (error) {
    next(error);
  }
}

async function deleteBookmark(req, res, next) {
  try {
    const deleted = await bookmarkService.remove(req.params.id, req.user);

    if (!deleted) {
      return res.status(404).json({ message: "Bookmark tidak ditemukan" });
    }

    return res.json({ message: "Bookmark berhasil dihapus" });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getBookmarks,
  getBookmarkById,
  createBookmark,
  deleteBookmark
};
