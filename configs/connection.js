const Sequelize = require('sequelize');
require('dotenv').config();

let db;

if (process.env.JAWSDB_URL) {
  db = new Sequelize(
    process.env.DNAME,
    process.env.DUSER,
    process.env.DPASS,
    {
      host: process.env.DHOST,
      dialect: 'mysql',
      port: 3306
    });
} else {
  db = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: 'localhost',
      dialect: 'mysql',
      port: 3306
    }
  );
}

module.exports = db;

//mysql://b201dbd916d8a4:f4020255@us-cdbr-east-04.cleardb.com/heroku_6601dea04441daf?reconnect=true