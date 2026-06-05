const pool = require("../db/pool");

async function findAll() {
  const [rows] = await pool.query("SELECT * FROM category ORDER BY name ASC");
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query("SELECT * FROM category WHERE id = ? LIMIT 1", [id]);
  return rows[0] || null;
}

async function create(payload) {
  const [result] = await pool.query(
    "INSERT INTO category (name, description) VALUES (?, ?)",
    [payload.name, payload.description || null]
  );

  return findById(result.insertId);
}

async function update(id, payload) {
  await pool.query(
    "UPDATE category SET name = ?, description = ? WHERE id = ?",
    [payload.name, payload.description || null, id]
  );

  return findById(id);
}

function remove(id) {
  return pool.query("DELETE FROM category WHERE id = ?", [id]);
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove
};
