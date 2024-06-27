const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite')
});

const User = sequelize.define('User', {
  username: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  mqttBroker: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isIP: true
    }
  }
});

const SensorData = sequelize.define('SensorData', {
  userId: Sequelize.INTEGER,
  temperature: Sequelize.FLOAT,
  humidity: Sequelize.FLOAT,
  lightIntensity: Sequelize.FLOAT,
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  }
});

async function setupDatabase() {
  await sequelize.sync();
}

async function insertSensorData(userId, temperature, humidity, lightIntensity) {
  await SensorData.create({ userId, temperature, humidity, lightIntensity });
}

async function fetchSensorData(userId) {
  return await SensorData.findAll({
    where: { userId },
    order: [['createdAt', 'ASC']]
  });
}

async function createUser(username, password, mqttBroker) {
  const existingUser = await User.findOne({ where: { username } });
  if (existingUser) {
    throw new Error('Username already exists');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({ username, password: hashedPassword, mqttBroker });
}

async function authenticateUser(username, password) {
  const user = await User.findOne({ where: { username } });
  if (user && await bcrypt.compare(password, user.password)) {
    return user;
  } else {
    throw new Error('Authentication failed');
  }
}

module.exports = {
  setupDatabase,
  insertSensorData,
  fetchSensorData,
  createUser,
  authenticateUser
};
