const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { setupDatabase, insertSensorData, fetchSensorData, createUser, authenticateUser } = require('./database');
const { setupMQTTClient } = require('./mqtt');

function createWindow(file) {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile(file);
}

app.on('ready', () => {
  setupDatabase();
  setupMQTTClient();
  createWindow('index.html');
});

ipcMain.handle('fetch-data', async (event, userId) => {
  return await fetchSensorData(userId);
});

ipcMain.handle('authenticate', async (event, username, password) => {
  return await authenticateUser(username, password);
});

ipcMain.handle('register', async (event, username, password, mqttBroker) => {
  try {
    await createUser(username, password, mqttBroker);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
});
