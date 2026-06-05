const categoryService = require("../services/category.service");

async function getCategories(req, res, next) {
  try {
    const categories = await categoryService.findAll();
    res.json({ data: categories });
  } catch (error) {
    next(error);
  }
}

async function getCategoryById(req, res, next) {
  try {
    const category = await categoryService.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" });
    }

    return res.json({ data: category });
  } catch (error) {
    return next(error);
  }
}

async function createCategory(req, res, next) {
  try {
    const category = await categoryService.create(req.body);
    res.status(201).json({ data: category });
  } catch (error) {
    next(error);
  }
}

async function updateCategory(req, res, next) {
  try {
    const category = await categoryService.update(req.params.id, req.body);

    if (!category) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" });
    }

    return res.json({ data: category });
  } catch (error) {
    return next(error);
  }
}

async function deleteCategory(req, res, next) {
  try {
    const deleted = await categoryService.remove(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" });
    }

    return res.json({ message: "Kategori berhasil dihapus" });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
