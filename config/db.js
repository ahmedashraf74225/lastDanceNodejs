const { Sequelize } = require("sequelize");

const conn = new Sequelize({
host:"localhost",
dialect:"mysql",
username: "root",
password:"",
database: "lastdance",
logging: console.log
})

module.exports = conn;

