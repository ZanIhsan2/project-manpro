const eventService = require("../services/event.service");

async function getEvents(req, res, next) {
  try {
    const events = await eventService.findAll();
    res.json({ data: events });
  } catch (error) {
    next(error);
  }
}

async function getEventById(req, res, next) {
  try {
    const event = await eventService.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event tidak ditemukan" });
    }

    return res.json({ data: event });
  } catch (error) {
    return next(error);
  }
}

async function createEvent(req, res, next) {
  try {
    const event = await eventService.create(req.body, req.user.id);
    res.status(201).json({ data: event });
  } catch (error) {
    next(error);
  }
}

async function updateEvent(req, res, next) {
  try {
    const event = await eventService.update(req.params.id, req.body);

    if (!event) {
      return res.status(404).json({ message: "Event tidak ditemukan" });
    }

    return res.json({ data: event });
  } catch (error) {
    return next(error);
  }
}

async function deleteEvent(req, res, next) {
  try {
    const deleted = await eventService.remove(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Event tidak ditemukan" });
    }

    return res.json({ message: "Event berhasil dihapus" });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
};
