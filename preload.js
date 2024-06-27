const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  fetchData: (userId) => ipcRenderer.invoke('fetch-data', userId),
  authenticate: (username, password) => ipcRenderer.invoke('authenticate', username, password),
  register: (username, password, mqttBroker) => ipcRenderer.invoke('register', username, password, mqttBroker).then(response => {
    if (!response.success) {
      throw new Error(response.message);
    }
  })
});
