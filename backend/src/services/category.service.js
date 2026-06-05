const categoryModel = require("../models/category.model");
const ApiError = require("../utils/api-error");

function findAll() {
  return categoryModel.findAll();
}

function findById(id) {
  return categoryModel.findById(id);
}

function validatePayload(payload) {
  if (!payload.name) {
    throw new ApiError(400, "Nama kategori wajib diisi");
  }
}

function create(payload) {
  validatePayload(payload);
  return categoryModel.create(payload);
}

async function update(id, payload) {
  validatePayload(payload);

  const category = await categoryModel.findById(id);
  if (!category) {
    return null;
  }

  return categoryModel.update(id, payload);
}

async function remove(id) {
  const category = await categoryModel.findById(id);
  if (!category) {
    return false;
  }

  await categoryModel.remove(id);
  return true;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove
};
