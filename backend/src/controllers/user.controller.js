const userService = require("../services/user.service");

async function getMe(req, res, next) {
  try {
    const user = await userService.findById(req.user.id);
    res.json({ data: user });
  } catch (error) {
    next(error);
  }
}

async function getUsers(req, res, next) {
  try {
    const users = await userService.findAll();
    res.json({ data: users });
  } catch (error) {
    next(error);
  }
}

async function getUserById(req, res, next) {
  try {
    const user = await userService.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    return res.json({ data: user });
  } catch (error) {
    return next(error);
  }
}

async function createUser(req, res, next) {
  try {
    const user = await userService.create(req.body);
    res.status(201).json({ data: user });
  } catch (error) {
    next(error);
  }
}

async function updateUser(req, res, next) {
  try {
    const user = await userService.update(req.params.id, req.body);

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    return res.json({ data: user });
  } catch (error) {
    return next(error);
  }
}

async function deleteUser(req, res, next) {
  try {
    const deleted = await userService.remove(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    return res.json({ message: "User berhasil dihapus" });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getMe,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
