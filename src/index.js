const { app, BrowserWindow} = require('electron');
const path = require('path');
const HTMLParser = require('node-html-parser');


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 580,
    height: 700,
    titleBarStyle: 'hidden',
    icon: "./src/media/icon.icns",
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
const {Tray, Menu, MenuItem, nativeImage } = require('electron');
const { EventEmitter } = require('stream');

const {ipcMain} = require('electron')

let tray

app.whenReady().then(() => { 
  // const icon = nativeImage.createFromPath('/my-app/src/media/list.clipboard.fill@2x.png')
  const icon = nativeImage.createFromPath(path.join(__dirname,'media','listclipboardfill@2x.png'))
  tray = new Tray(icon)    
  // tray = new Tray(require('path').resolve(__statics, 'list.clipboard.fill@2x.png'))  
  let contextMenu = Menu.buildFromTemplate([{label: 'No tasks', role: 'unhide'}])
  tray.setContextMenu(contextMenu)   
})

ipcMain.on('set-menu', (evet, incompleteTasks, completeTasks) => {
  let contextMenu = Menu()
  if (incompleteTasks[0]==='None' && completeTasks[0]==='None') {
    contextMenu.append(new MenuItem({label: 'No tasks', role: 'unhide'}))
    tray.setContextMenu(contextMenu)
    return
  }
  // const dotIcon = nativeImage.createFromPath('src/media/circle.fill@2x.png')
  contextMenu.append(new MenuItem({label: 'To-do:', role: 'unhide'}))
  if (incompleteTasks[0]!=='None') {
    for (let i=0; i < incompleteTasks.length; i++) {
      contextMenu.append(new MenuItem({label: incompleteTasks[i]}))
    }
  }

  contextMenu.append(new MenuItem({type: 'separator'}))

  contextMenu.append(new MenuItem({label: 'Completed:', role: 'unhide'}))
  if (completeTasks[0]!=='None') {
    for (let i=0; i < completeTasks.length; i++) {
      contextMenu.append(new MenuItem({label: completeTasks[i], role: 'window'}))
    }
  }

  tray.setContextMenu(contextMenu)
})

// BrowserWindow.getFocusedWindow().on('close', () => {
//   BrowserWindow.getFocusedWindow().webContents.savePage(path.join(__dirname, 'index.html'), 'HTMLComplete').then(() => {
//     console.log('Page was saved successfully.')
//   }).catch(err => {
//       console.log(err);
//   });
// })

// app.on('before-quit', (e) => {
//   // e.preventDefault()
//   // win.webContents.savePage(filepathlocal, 'HTMLComplete')
//   // window.webContents.savePage('')
//   BrowserWindow.getFocusedWindow().emit('false')
//   BrowserWindow.getFocusedWindow().webContents.savePage(path.join(__dirname, 'bruh.html'), 'HTMLComplete').then(() => {
//       console.log('Page was saved successfully.')
//   }).catch(err => {
//       console.log(err);
//   });
//   // app.quit()
//   // /Users/lucas/Documents/codingProjects/TaskListApp/TaskList/src/index.html
// })