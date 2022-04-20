import logo from "./logo.svg";
import "./App.css";
import { useEffect } from "react";
const { ipcRenderer, dialog } = window.require("electron");

function App() {
    //    setInterval(() => {
    //     ipcRenderer.send("send-data-event-name", {
    //         type: "info",
    //         buttons: ["Restart", "Later"],
    //         title: "Application Update",
    //         message: "win32",
    //         detail: "A new version has been downloaded. Restart the application to apply the updates.",
    //     });
    //     ipcRenderer.on("send-data-event-name-reply", (event, arg) => {
    //         console.log("Abc");
    //     });
    //    }, 1000);

    // setInterval(() => {
    //     console.log("calll")
    //     dialog.showMessageBox({
    //         type: "info",
    //         buttons: ["Restart", "Later"],
    //         title: "Application Update",
    //         message: "win32",
    //         detail: "A new version has been downloaded. Restart the application to apply the updates.",
    //     });
    // }, 1000);

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    release <code>src/App.js</code> and save to reload.
                </p>
            </header>
            New update available
        </div>
    );
}

export default App;
