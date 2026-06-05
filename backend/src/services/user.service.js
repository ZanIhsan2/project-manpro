const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const ApiError = require("../utils/api-error");

function findAll() {
  return userModel.findAll();
}

function findById(id) {
  return userModel.findById(id);
}

async function create(payload) {
  const { name, email, password, role = "mahasiswa" } = payload;

  if (!name || !email || !password) {
    throw new ApiError(400, "Nama, email, dan password wajib diisi");
  }

  if (!["mahasiswa", "admin"].includes(role)) {
    throw new ApiError(400, "Role tidak valid");
  }

  const existingUser = await userModel.findByEmail(email);
  if (existingUser) {
    throw new ApiError(409, "Email sudah digunakan");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  return userModel.create({
    name,
    email,
    password_hash: passwordHash,
    role
  });
}

async function update(id, payload) {
  const user = await userModel.findById(id);
  if (!user) {
    return null;
  }

  if (!payload.name || !payload.email || !payload.role) {
    throw new ApiError(400, "Nama, email, dan role wajib diisi");
  }

  if (!["mahasiswa", "admin"].includes(payload.role)) {
    throw new ApiError(400, "Role tidak valid");
  }

  const existingUser = await userModel.findByEmail(payload.email);
  if (existingUser && Number(existingUser.id) !== Number(id)) {
    throw new ApiError(409, "Email sudah digunakan");
  }

  const passwordHash = payload.password ? await bcrypt.hash(payload.password, 10) : null;
  return userModel.update(id, {
    name: payload.name,
    email: payload.email,
    password_hash: passwordHash,
    role: payload.role
  });
}

async function remove(id) {
  const user = await userModel.findById(id);
  if (!user) {
    return false;
  }

  await userModel.remove(id);
  return true;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove
};
