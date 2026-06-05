const pool = require("../db/pool");

const TABLE_NAME = "event";

async function findAll() {
  const [rows] = await pool.query(`
    SELECT
      event.*,
      category.name AS category_name,
      user.name AS admin_name
    FROM ${TABLE_NAME}
    LEFT JOIN category ON category.id = event.category_id
    LEFT JOIN user ON user.id = event.admin_id
    ORDER BY event.start_time ASC
  `);
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query(
    `
      SELECT
        event.*,
        category.name AS category_name,
        user.name AS admin_name
      FROM ${TABLE_NAME}
      LEFT JOIN category ON category.id = event.category_id
      LEFT JOIN user ON user.id = event.admin_id
      WHERE event.id = ?
      LIMIT 1
    `,
    [id]
  );
  return rows[0] || null;
}

async function create(payload) {
  const [result] = await pool.query(
    `
      INSERT INTO ${TABLE_NAME}
        (admin_id, category_id, title, description, location, start_time, end_time, organizer, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      payload.admin_id,
      payload.category_id || null,
      payload.title,
      payload.description || null,
      payload.location || null,
      payload.start_time,
      payload.end_time,
      payload.organizer || null,
      payload.status || "upcoming"
    ]
  );

  return findById(result.insertId);
}

async function update(id, payload) {
  await pool.query(
    `
      UPDATE ${TABLE_NAME}
      SET
        category_id = ?,
        title = ?,
        description = ?,
        location = ?,
        start_time = ?,
        end_time = ?,
        organizer = ?,
        status = ?
      WHERE id = ?
    `,
    [
      payload.category_id || null,
      payload.title,
      payload.description || null,
      payload.location || null,
      payload.start_time,
      payload.end_time,
      payload.organizer || null,
      payload.status || "upcoming",
      id
    ]
  );

  return findById(id);
}

function remove(id) {
  return pool.query(`DELETE FROM ${TABLE_NAME} WHERE id = ?`, [id]);
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove
};
