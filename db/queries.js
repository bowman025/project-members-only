const pool = require('./pool');

const getAllMessages = async () => {
  try {
    const { rows } = await pool.query(`
      SELECT messages.*, users.username
      FROM messages
      JOIN users ON messages.user_id = users.id
      ORDER BY timestamp DESC
    `);
    return rows;
  } catch (error) {
    console.error('Query failed', error);
  }
}

const createMessage = async (title, text, userId) => {
  try {
    await pool.query(`
      INSERT INTO messages (title, text, user_id)
      VALUES ($1, $2, $3)
    `, [title, text, userId]);
  } catch (error) {
    console.error('Create failed', error);
  }
}

const createUser = async (firstName, lastName, username, password) => {
  try {
    const { rows } = await pool.query(`
      INSERT INTO users (first_name, last_name, username, password)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `, [firstName, lastName, username, password]);
    return rows[0];
  } catch (error) {
    console.error('Create failed', error);
  }
}

const updateMemberStatus = async (userId) => {
  try {
    await pool.query(`
      UPDATE users SET membership_status = true
      WHERE id = $1
      `, [userId]);
  } catch (error) {
    console.error('Update failed', error);
  }
}

module.exports = { 
  getAllMessages, 
  createMessage, 
  createUser, 
  updateMemberStatus 
}