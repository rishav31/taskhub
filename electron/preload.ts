import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    send: (channel: string, data: any) => ipcRenderer.send(channel, data),
    on: (channel: string, handler: Function) =>
      ipcRenderer.on(channel, (event, data) => handler(data)),
    invoke: (channel: string, data: any) => ipcRenderer.invoke(channel, data),
  },
});
