const { app, BrowserWindow} = require('electron');
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 550,
    height: 700,
    titleBarStyle: 'hidden',
    titleBarOverlay: true,
    icon: "src/media/listclipboard@2x.png",
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// create tray icon
const {Tray, Menu, nativeImage } = require('electron');

let tray

let maxIconSize = {
  width: 10,
  height: 10
}

app.whenReady().then(() => {
  const icon = nativeImage.createFromPath('src/media/list.clipboard.fill@2x.png')
  tray = new Tray(icon)       



  const contextMenu = Menu.buildFromTemplate([
    { label: 'bruh', type: 'radio' },
    { label: 'i am done', type: 'radio' },
    { label: 'gg', type: 'radio', checked: true },
  ])
  
  tray.setContextMenu(contextMenu)

  tray.setToolTip('This is my application')
  // tray.setTitle('This is my title')
})

// create list
