const db = require("../config/db");
const { DataTypes } = require("sequelize");

module.exports = db.define("user", {
  UserID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  role: {
    type: DataTypes.ENUM("basic", "premium", "admin"),
    defaultValue: "basic",
    allowNull: false,
  },
});
