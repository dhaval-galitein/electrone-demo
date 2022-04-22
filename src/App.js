import { useState } from "react";
import "./App.css";
const { ipcRenderer } = window.require("electron");


function App() {
    const [version, setVersion] = useState("")
    console.log("This is log")
    ipcRenderer.send("app_version");
    ipcRenderer.on("app_version", (event, arg) => {
        ipcRenderer.removeAllListeners("app_version");
        setVersion(arg.version)
    });

    const notification = document.getElementById("notification");
    const message = document.getElementById("message");
    const restartButton = document.getElementById("restart-button");

    ipcRenderer.on("update_available", () => {
        console.log("Update available")
        ipcRenderer.removeAllListeners("update_available");
        message.innerText = "A new update is available. Downloading now...";
        notification.classList.remove("hidden");
    });

    ipcRenderer.on("update_downloaded", () => {
        console.log("update_downloaded")
        ipcRenderer.removeAllListeners("update_downloaded");
        message.innerText = "Update Downloaded. It will be installed on restart. Restart now?";
        restartButton.classList.remove("hidden");
        notification.classList.remove("hidden");
    });

    function closeNotification() {
        notification.classList.add("hidden");
    }
    function restartApp() {
        ipcRenderer.send("restart_app");
    }

    return (
        <div className="App">
            <h1>Electron Auto Update Example</h1>
            <p id="version">version {version}</p>

            <div id="notification" className="hidden">
                <p id="message"></p>
                <button id="close-button" onClick={() => closeNotification()}>
                    Close
                </button>
                <button id="restart-button" onClick={() => restartApp()} className="hidden">
                    Restart
                </button>
            </div>
        </div>
    );
}

export default App;
