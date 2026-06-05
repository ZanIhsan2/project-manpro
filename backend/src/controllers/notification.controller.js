const notificationService = require("../services/notification.service");

async function getNotifications(req, res, next) {
  try {
    const notifications = await notificationService.findAll(req.user);
    res.json({ data: notifications });
  } catch (error) {
    next(error);
  }
}

async function getNotificationById(req, res, next) {
  try {
    const notification = await notificationService.findById(req.params.id, req.user);

    if (!notification) {
      return res.status(404).json({ message: "Notifikasi tidak ditemukan" });
    }

    return res.json({ data: notification });
  } catch (error) {
    return next(error);
  }
}

async function createNotification(req, res, next) {
  try {
    const notification = await notificationService.create(req.body);
    res.status(201).json({ data: notification });
  } catch (error) {
    next(error);
  }
}

async function updateNotification(req, res, next) {
  try {
    const notification = await notificationService.update(req.params.id, req.body, req.user);

    if (!notification) {
      return res.status(404).json({ message: "Notifikasi tidak ditemukan" });
    }

    return res.json({ data: notification });
  } catch (error) {
    return next(error);
  }
}

async function deleteNotification(req, res, next) {
  try {
    const deleted = await notificationService.remove(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Notifikasi tidak ditemukan" });
    }

    return res.json({ message: "Notifikasi berhasil dihapus" });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification
};
