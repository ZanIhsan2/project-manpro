const pool = require("../db/pool");

async function findAll() {
  const [rows] = await pool.query(`
    SELECT
      bookmark.*,
      user.name AS user_name,
      event.title AS event_title
    FROM bookmark
    LEFT JOIN user ON user.id = bookmark.user_id
    LEFT JOIN event ON event.id = bookmark.event_id
    ORDER BY bookmark.saved_at DESC
  `);
  return rows;
}

async function findAllByUserId(userId) {
  const [rows] = await pool.query(
    `
      SELECT
        bookmark.*,
        user.name AS user_name,
        event.title AS event_title
      FROM bookmark
      LEFT JOIN user ON user.id = bookmark.user_id
      LEFT JOIN event ON event.id = bookmark.event_id
      WHERE bookmark.user_id = ?
      ORDER BY bookmark.saved_at DESC
    `,
    [userId]
  );
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query(
    `
      SELECT
        bookmark.*,
        user.name AS user_name,
        event.title AS event_title
      FROM bookmark
      LEFT JOIN user ON user.id = bookmark.user_id
      LEFT JOIN event ON event.id = bookmark.event_id
      WHERE bookmark.id = ?
      LIMIT 1
    `,
    [id]
  );
  return rows[0] || null;
}

async function create(payload) {
  const [result] = await pool.query(
    "INSERT INTO bookmark (user_id, event_id) VALUES (?, ?)",
    [payload.user_id, payload.event_id]
  );

  return findById(result.insertId);
}

function remove(id) {
  return pool.query("DELETE FROM bookmark WHERE id = ?", [id]);
}

module.exports = {
  findAll,
  findAllByUserId,
  findById,
  create,
  remove
};
