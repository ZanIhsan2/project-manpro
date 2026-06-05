const pool = require("../db/pool");

const SAFE_COLUMNS = "id, name, email, role, created_at";

async function findAll() {
  const [rows] = await pool.query(`SELECT ${SAFE_COLUMNS} FROM user ORDER BY id DESC`);
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query(`SELECT ${SAFE_COLUMNS} FROM user WHERE id = ? LIMIT 1`, [id]);
  return rows[0] || null;
}

async function findByEmail(email, includePassword = false) {
  const columns = includePassword ? `${SAFE_COLUMNS}, password_hash` : SAFE_COLUMNS;
  const [rows] = await pool.query(`SELECT ${columns} FROM user WHERE email = ? LIMIT 1`, [email]);
  return rows[0] || null;
}

async function create(payload) {
  const [result] = await pool.query(
    "INSERT INTO user (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
    [payload.name, payload.email, payload.password_hash, payload.role]
  );

  return findById(result.insertId);
}

async function update(id, payload) {
  if (payload.password_hash) {
    await pool.query(
      "UPDATE user SET name = ?, email = ?, password_hash = ?, role = ? WHERE id = ?",
      [payload.name, payload.email, payload.password_hash, payload.role, id]
    );
  } else {
    await pool.query(
      "UPDATE user SET name = ?, email = ?, role = ? WHERE id = ?",
      [payload.name, payload.email, payload.role, id]
    );
  }

  return findById(id);
}

function remove(id) {
  return pool.query("DELETE FROM user WHERE id = ?", [id]);
}

module.exports = {
  findAll,
  findById,
  findByEmail,
  create,
  update,
  remove
};
