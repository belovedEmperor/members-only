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

module.exports = { insertUser, updateUserToMember, updateUserToAdmin };
