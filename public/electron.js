const { app, BrowserWindow, ipcMain, autoUpdater, dialog } = require("electron");
require("update-electron-app")();
const path = require("path");
const isDev = require("electron-is-dev");
require("@electron/remote/main").initialize();

const UPDATE_CHECK_INTERVAL = 10000;

function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        },
    });

    ipcMain.on("app:get-app-path", (event) => {
        event.returnValue = app.getAppPath();
    });

    win.loadURL(isDev ? "http://localhost:3000" : `file://${path.join(__dirname, "../build/index.html")}`);

    const url = `https://github.com/dhaval-galitein/electrone-demo/releases/tag/v${app.getVersion()}`;
    autoUpdater.setFeedURL({ url });
    setInterval(() => {
        autoUpdater.checkForUpdates();
    }, UPDATE_CHECK_INTERVAL);

    autoUpdater.on("update-downloaded", (event, releaseNotes, releaseName) => {
        const dialogOpts = {
            type: "info",
            buttons: ["Restart", "Later"],
            title: "Application Update",
            message: process.platform === "win32" ? releaseNotes : releaseName,
            detail: "A new version has been downloaded. Restart the application to apply the updates.",
        };
        dialog.showMessageBox(dialogOpts).then((returnValue) => {
            if (returnValue.response === 0) autoUpdater.quitAndInstall();
        });
    });
}

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("ready", createWindow);

autoUpdater.on("update-not-available", (message) => {
    console.error("There was a problem updating the application");
    console.error(message);
    const dialogOpts = {
        type: "info",
        buttons: ["Restart", "Later"],
        title: "Application Update",
        message: message,
        detail: message,
    };
    dialog.showMessageBox(dialogOpts);
});
autoUpdater.on("checking-for-update", (message) => {
    console.error("There was a problem updating the application");
    console.error(message);
    const dialogOpts = {
        type: "info",
        buttons: ["Restart", "Later"],
        title: "Application Update",
        message: "checking-for-update",
        detail: "A new version has been downloaded. Restart the application to apply the updates.",
    };
    dialog.showMessageBox(dialogOpts);
});
autoUpdater.on("error", (message) => {
    console.error("There was a problem updating the application");
    console.error(message);
    const dialogOpts = {
        type: "error",
        buttons: ["Ok"],
        title:  "Error",
        message: "Can not update",
        detail: JSON.stringify(message.message),
    };
    dialog.showMessageBox(dialogOpts);
});

ipcMain.on("send-data-event-name", (event, data) => {
    console.log("abc");
    dialog.showMessageBox(data);
    event.reply("send-data-event-name-reply", "Hey react app processed your event");
});

