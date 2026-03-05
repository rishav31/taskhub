"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electron', {
    ipcRenderer: {
        send: (channel, data) => electron_1.ipcRenderer.send(channel, data),
        on: (channel, handler) => electron_1.ipcRenderer.on(channel, (event, data) => handler(data)),
        invoke: (channel, data) => electron_1.ipcRenderer.invoke(channel, data),
    },
});
