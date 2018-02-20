const path = require('path');
const url = require('url');
const electron = require('electron');
const {machineId} = require('node-machine-id');
require('./config').init(electron.app.getPath('appData'));
const {configStore} = require('./db');
const {saveRating, getRating, getReviews} = require('./ratings');

machineId().then((id) => {
  configStore.set('deviceId', id);
});

const {app, BrowserWindow, ipcMain} = electron;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1090, height: 625});

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'public', 'index.html'),
    protocol: 'file:',
    slashes: true,
  }));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('get-rating', (event, placeId) => {
  getRating(placeId).then((rating) => {
    const {newRating, ratingCount} = rating;
    event.sender.send('rating-updated', {placeId, newRating, ratingCount});
  });
});

ipcMain.on('save-rating', (event, data) => {
  const {placeId, ratingValue, ratingText} = data;
  saveRating(placeId, ratingValue, ratingText).then((rating) => {
    const {newRating, ratingCount} = rating;
    event.sender.send('rating-updated', {placeId, newRating, ratingCount});
  });
});

ipcMain.on('get-reviews', (event, placeId) => {
  const reviews = getReviews(placeId);
  event.sender.send('reviews-fetched', reviews);
});
