const { app, BrowserWindow, ipcMain, dialog, Tray, Menu, globalShortcut } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const fs = require('fs');

let mainWindow;
let tray;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    title: "Smart Designer Rundown Desktop"
  });

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../dist/index.html')}`
  );

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => (mainWindow = null));
}

// Platform Specific: System Tray
function createTray() {
  const iconPath = path.join(__dirname, 'public/favicon.ico');
  // If icon doesn't exist, this might fail, so we wrap it
  try {
    tray = new Tray(iconPath);
    const contextMenu = Menu.buildFromTemplate([
      { label: 'Buka SmartRundown', click: () => mainWindow.show() },
      { label: 'Quit', click: () => app.quit() }
    ]);
    tray.setToolTip('Smart Designer Rundown');
    tray.setContextMenu(contextMenu);
  } catch (e) {
    console.log('Tray icon not found, skipping tray creation');
  }
}

// Platform Specific: Global Keyboard Shortcuts
function registerShortcuts() {
  globalShortcut.register('CommandOrControl+Shift+S', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

app.on('ready', () => {
  createWindow();
  createTray();
  registerShortcuts();
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Platform Specific: Save to Local File System
ipcMain.on('save-rundown', (event, rundownData) => {
  dialog.showSaveDialog(mainWindow, {
    title: 'Simpan Rundown ke Komputer',
    defaultPath: 'rundown-saya.json',
    filters: [{ name: 'JSON Files', extensions: ['json'] }]
  }).then(result => {
    if (!result.canceled && result.filePath) {
      fs.writeFileSync(result.filePath, JSON.stringify(rundownData, null, 2));
      event.reply('save-success', result.filePath);
    }
  }).catch(err => {
    console.error(err);
  });
});
