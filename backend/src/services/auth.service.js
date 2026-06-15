const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const config = require("../config");
const ApiError = require("../utils/api-error");
const userModel = require("../models/user.model");

function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
}

async function register(payload) {
  const { name, email, password, student_id } = payload;

  if (!name || !email || !password) {
    throw new ApiError(400, "Nama, email, dan password wajib diisi");
  }

  const existingUser = await userModel.findByEmail(email);
  if (existingUser) {
    throw new ApiError(409, "Email sudah digunakan");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await userModel.create({
    name,
    email,
    password_hash: passwordHash,
    role: "mahasiswa",
    student_id: student_id || null
  });

  return {
    message: "Registrasi berhasil",
    token: createToken(user),
    data: user
  };
}

async function login(payload) {
  const { email, password } = payload;

  if (!email || !password) {
    throw new ApiError(400, "Email dan password wajib diisi");
  }

  const userWithPassword = await userModel.findByEmail(email, true);
  if (!userWithPassword) {
    throw new ApiError(401, "Email atau password salah");
  }

  const passwordMatches = await bcrypt.compare(password, userWithPassword.password_hash);
  if (!passwordMatches) {
    throw new ApiError(401, "Email atau password salah");
  }

  const { password_hash, ...user } = userWithPassword;

  return {
    message: "Login berhasil",
    token: createToken(user),
    data: user
  };
}

module.exports = {
  register,
  login
};
