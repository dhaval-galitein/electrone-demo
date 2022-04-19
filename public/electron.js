const { app, BrowserWindow, ipcMain, autoUpdater, dialog } = require("electron");
require("update-electron-app")();
const path = require("path");
const isDev = require("electron-is-dev");

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
    const server = "https://your-deployment-url.com";
    const url = `${server}/update/${process.platform}/${app.getVersion()}`;

    autoUpdater.setFeedURL({ url });

    setInterval(() => {
        autoUpdater.checkForUpdates();
    }, 6000);

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

    autoUpdater.on("error", (message) => {
        console.error("There was a problem updating the application");
        console.error(message);
    });
}

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("ready", createWindow);
