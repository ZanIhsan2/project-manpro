const pool = require("../db/pool");

async function findAll() {
  const [rows] = await pool.query(`
    SELECT
      notification.*,
      user.name AS user_name,
      event.title AS event_title
    FROM notification
    LEFT JOIN user ON user.id = notification.user_id
    LEFT JOIN event ON event.id = notification.event_id
    ORDER BY notification.sent_at DESC
  `);
  return rows;
}

async function findAllByUserId(userId) {
  const [rows] = await pool.query(
    `
      SELECT
        notification.*,
        user.name AS user_name,
        event.title AS event_title
      FROM notification
      LEFT JOIN user ON user.id = notification.user_id
      LEFT JOIN event ON event.id = notification.event_id
      WHERE notification.user_id = ?
      ORDER BY notification.sent_at DESC
    `,
    [userId]
  );
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query(
    `
      SELECT
        notification.*,
        user.name AS user_name,
        event.title AS event_title
      FROM notification
      LEFT JOIN user ON user.id = notification.user_id
      LEFT JOIN event ON event.id = notification.event_id
      WHERE notification.id = ?
      LIMIT 1
    `,
    [id]
  );
  return rows[0] || null;
}

async function create(payload) {
  const [result] = await pool.query(
    "INSERT INTO notification (user_id, event_id, message, is_read) VALUES (?, ?, ?, ?)",
    [payload.user_id, payload.event_id, payload.message, payload.is_read || 0]
  );

  return findById(result.insertId);
}

async function update(id, payload) {
  await pool.query(
    "UPDATE notification SET message = ?, is_read = ? WHERE id = ?",
    [payload.message, payload.is_read, id]
  );

  return findById(id);
}

async function updateReadStatus(id, isRead) {
  await pool.query("UPDATE notification SET is_read = ? WHERE id = ?", [isRead, id]);
  return findById(id);
}

function remove(id) {
  return pool.query("DELETE FROM notification WHERE id = ?", [id]);
}

module.exports = {
  findAll,
  findAllByUserId,
  findById,
  create,
  update,
  updateReadStatus,
  remove
};
