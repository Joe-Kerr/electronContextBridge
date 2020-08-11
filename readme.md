# electronContextBridge - Electron plugin for an isolated preload script

Run code in Electron's Main World (renderer) that is isolated, as much as possible, from the Preload Isolated World. This is achieved by using a context bridge. An Electron [context bridge](https://www.electronjs.org/docs/api/context-bridge) is required for **security purposes**.

The current version has some open points on the todo list. Interfaces may change.


# Install

```
npm install @joe_kerr/electron-context-bridge
```


# Usage

```javascript
const {ContextBridgeMain} = require("@joe_kerr/electronContextBridge");
const contextBridge = new ContextBridgeMain(BrowserWindow);
```

```javascript
//  (...)
const win = new BrowserWindow({
   webPreferences: {
    preload: contextBridge.getPreloadFilePath(),
    nodeIntegration: false,			
    contextIsolation: true //*required!
  }
});
```

Two types of communication are implemented:

- Renderer-Main request-response model
- Main broadcast


**Request-response**

```javascript
//Main: Setup message channel
contextBridge.createIpcChannel("getPrinters", "schema-todo", async (filterList)=>{
  const printers = browserWindow.webContents.getPrinters();	
  return filter(printers, filterList);
});	
```

```javascript
//Renderer: send request to main and get response
async function doSth() {
  const result = await window.$electron.request("getPrinters", optionalEgAFilterList);
}
```


**Broadcast**

```javascript
//Renderer: listen for message event
window.$electron.on("broadcast-event", function(event) {
  console.log(event.detail); //"broadcast-message"
  document.getElementById("response").textContent = event.detail;
});
```

```javascript
//Main: send message event
contextBridge.broadcastMessage("broadcast-event", {data: "broadcast-message"});
```


# Versions

## 0.0.1
- Public beta release.


# Copyright

MIT (c) Joe Kerr since 2020