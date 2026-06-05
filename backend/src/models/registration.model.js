const pool = require("../db/pool");

async function findAll() {
  const [rows] = await pool.query(`
    SELECT
      registration.*,
      user.name AS user_name,
      event.title AS event_title
    FROM registration
    LEFT JOIN user ON user.id = registration.user_id
    LEFT JOIN event ON event.id = registration.event_id
    ORDER BY registration.registered_at DESC
  `);
  return rows;
}

async function findAllByUserId(userId) {
  const [rows] = await pool.query(
    `
      SELECT
        registration.*,
        user.name AS user_name,
        event.title AS event_title
      FROM registration
      LEFT JOIN user ON user.id = registration.user_id
      LEFT JOIN event ON event.id = registration.event_id
      WHERE registration.user_id = ?
      ORDER BY registration.registered_at DESC
    `,
    [userId]
  );
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query(
    `
      SELECT
        registration.*,
        user.name AS user_name,
        event.title AS event_title
      FROM registration
      LEFT JOIN user ON user.id = registration.user_id
      LEFT JOIN event ON event.id = registration.event_id
      WHERE registration.id = ?
      LIMIT 1
    `,
    [id]
  );
  return rows[0] || null;
}

async function create(payload) {
  const [result] = await pool.query(
    "INSERT INTO registration (user_id, event_id, status) VALUES (?, ?, ?)",
    [payload.user_id, payload.event_id, payload.status]
  );

  return findById(result.insertId);
}

async function update(id, payload) {
  await pool.query("UPDATE registration SET status = ? WHERE id = ?", [payload.status, id]);
  return findById(id);
}

function remove(id) {
  return pool.query("DELETE FROM registration WHERE id = ?", [id]);
}

module.exports = {
  findAll,
  findAllByUserId,
  findById,
  create,
  update,
  remove
};
