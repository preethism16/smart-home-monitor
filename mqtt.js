const mqtt = require('mqtt');
const { insertSensorData, User } = require('./database');

async function setupMQTTClient() {
  const users = await User.findAll();

  users.forEach(user => {
    const client = mqtt.connect(`mqtt://${user.mqttBroker}`);

    client.on('connect', () => {
      console.log(`Connected to MQTT broker for user: ${user.username}`);
      client.subscribe('sensor/data');
    });

    client.on('message', async (topic, message) => {
      if (topic === 'sensor/data') {
        const data = JSON.parse(message.toString());
        await insertSensorData(user.id, data.temperature, data.humidity, data.lightIntensity);
      }
    });
  });
}

module.exports = { setupMQTTClient };
