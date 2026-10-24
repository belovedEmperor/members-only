const { Pool } = require("pg");

module.exports = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgres://user:password@localhost:5432/members",
});
