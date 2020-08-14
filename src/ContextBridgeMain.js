class ContextBridgeMain {
	constructor(BrowserWindow) {
		this.BrowserWindow = BrowserWindow;
		this.ipc = require("electron").ipcMain;
		this.pathJoin = require("path").join;
		this.fileExists = require("fs").existsSync;
	}
	
	createIpcChannel(name, callback) {				
		this.ipc.handle(name, async (event, data)=>{ 			
			return await callback(data);
		});
	}
	
	broadcastMessage(name, params) {
		this.BrowserWindow.getAllWindows().forEach((win)=>{
			win.webContents.send(name, params);
		});
	}
		
	getPreloadFilePath() {
		const path = this.pathJoin(__dirname, "ContextBridgePreload.js");
		if(!this.fileExists(path)) {
			throw new Error("getPreloadFilePath() return an invalid path to ContextBridgePreload.js");
		}		
		return path;
	}	
}

module.exports = ContextBridgeMain;