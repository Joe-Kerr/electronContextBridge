const {BrowserWindow, app} = require("electron");
const ContextBridgeMain = require("../../src/ContextBridgeMain.js");

let win;

async function createWindow () {	
	const {join} = require("path");
	const contextBridge = new ContextBridgeMain(BrowserWindow);
		
	win = new BrowserWindow({
		width: 800,
		height: 600,
		backgroundColor: "#ffffff",
		webPreferences: {
			nodeIntegration: true,
			webSecurity: false,
			preload: contextBridge.getPreloadFilePath(),
			contextIsolation: true
		}
	});
	
	contextBridge.createIpcChannel("unitTest", async (data)=>{
		console.log(data)
		return data;
	});	

	await win.loadFile(join(__dirname, "./index.html"));
	
	contextBridge.broadcastMessage("broadcast", "broadCastFromMain");
	
	//win.webContents.send("broadcast", "broadCastFromMain");
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    app.quit();
	win = null;
});