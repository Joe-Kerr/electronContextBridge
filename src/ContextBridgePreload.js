const {contextBridge} = require("electron");
const windowKey = "$electron";

const PrivateIpcMessaging = {
	_getIpc() {
		return require("electron").ipcRenderer;
	}	
}

const IpcMessaging = {	
	_assertValidChannelName(channelName) {
		const name = String(channelName);
		
		if(name.startsWith("ELECTRON_")) {
			throw new Error("Illegal Electron channel name: must not start with 'ELECTRON_'");
		}
	}, 
	
	request(command, data) {
		IpcMessaging._assertValidChannelName(command);
		
		const ipc = PrivateIpcMessaging._getIpc();				
		return ipc.invoke(command, data);
	},
	
	on(eventName, callback) {
		IpcMessaging._assertValidChannelName(eventName);
		
		const ipc = PrivateIpcMessaging._getIpc();	
		ipc.on(eventName, (event, data)=>{
			callback({detail: data, name: eventName});
		});		
	}	
};

//production
if(contextBridge && contextBridge.exposeInMainWorld) {
	contextBridge.exposeInMainWorld(windowKey, IpcMessaging);
}

//unit testing
else if(module && module.exports) {
	module.exports = {IpcMessaging, PrivateIpcMessaging};
}

else {
	throw new Error("Unexpected global environment in ContextBridgePreload.js. Has the BrowserWindow webPreferences.contextIsolation=true?");
}