const pool = require('./pool');

const createUser = async (firstName, lastName, username, password) => {
  const { rows } = await pool.query(`
    INSERT INTO users (first_name, last_name, username, password)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `, [firstName, lastName, username, password]
  );
  return rows[0];
}

const getUserByUsername = async (username) => {
  const { rows } = await pool.query(`
    SELECT * FROM users WHERE username = $1
    `, [username]
  );
  return rows[0];
}

const createMessage = async (title, text, userId) => {
  const { rows } = await pool.query(`
    INSERT INTO messages (title, text, user_id)
    VALUES ($1, $2, $3)
    RETURNING *
    `, [title, text, userId]
  );
  return rows[0];
}

const getMessagesByUser = async (userId) => {
  const { rows } = await pool.query(`
    SELECT * FROM messages WHERE user_id = $1
    ORDER BY timestamp DESC
  `, [userId]);
  return rows;
}

const getAllMessages = async () => {
  const { rows } = await pool.query(`
    SELECT messages.*, users.username
    FROM messages
    JOIN users ON messages.user_id = users.id
    ORDER BY timestamp DESC
  `);
  return rows;
}

const deleteMessage = async (messageId) => {
  await pool.query(`
    DELETE FROM messages WHERE id = $1
  `, [messageId]);
}

const updateMemberStatus = async (userId) => {
  const { rows } = await pool.query(`
    UPDATE users SET membership_status = true
    WHERE id = $1
    RETURNING *
    `, [userId]
  );
  return rows[0];
}

const promoteToAdmin = async (userId) => {
  await pool.query(`
    UPDATE users SET is_admin = true WHERE id = $1
  `, [userId]);
}

module.exports = { 
  createUser,
  getUserByUsername,
  createMessage,
  getMessagesByUser,
  getAllMessages,
  deleteMessage,
  updateMemberStatus,
  promoteToAdmin
}