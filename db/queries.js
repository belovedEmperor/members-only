const pool = require("./pool");

async function insertUser(firstName, lastName, email, password) {
  await pool.query(
    "INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)",
    [firstName, lastName, email, password],
  );
}

async function updateUserToMember(id) {
  await pool.query(
    "UPDATE users SET membership_status = 'member' WHERE id = $1",
    [id],
  );
}

async function updateUserToAdmin(id) {
  await pool.query(
    "UPDATE users SET membership_status = 'admin' WHERE id = $1",
    [id],
  );
}

async function getAllMessages() {
  return (await pool.query("SELECT * FROM messages")).rows;
}

async function getUser(id) {
  return (await pool.query("SELECT * FROM users WHERE id = $1", [id])).rows[0];
}

async function insertMessage(title, text, id) {
  await pool.query(
    "INSERT INTO messages (title, text, user_id) VALUES ($1, $2, $3)",
    [title, text, id],
  );
}

async function deleteMessage(id) {
  await pool.query("DELETE FROM messages WHERE id = $1", [id]);
}

module.exports = {
  insertUser,
  updateUserToMember,
  updateUserToAdmin,
  getAllMessages,
  getUser,
  insertMessage,
  deleteMessage,
};
