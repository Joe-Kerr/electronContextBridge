const {contextBridge} = require("electron");
const windowKey = "$electron";

const IpcMessaging = {
	_getIpc() {
		return require("electron").ipcRenderer;
	},
	
	_checkIsValidChannelName(channelName) {
		const name = String(channelName);
		
		if(name.startsWith("ELECTRON_")) {
			return false;
		}
		
		return true;
	}, 
	
	request(command, data) {
		if(IpcMessaging._checkIsValidChannelName(command) === false) {
			return Promise.reject(new Error("Illegal Electron channel name: must not start with 'ELECTRON_'"));
		}
		
		const ipc = IpcMessaging._getIpc();				
		return ipc.invoke(command, data);

		/*
		//DIY:
		_getNextId() {return IpcMessaging.id++;},			
		
		const uniqueChannelId = String(IpcMessaging._getNextId());
		ipcRenderer.send(command, {id: uniqueChannelId, data});
		return new Promise((resolve, reject)=>{
			ipcRenderer.once(uniqueChannelId, (event, responseData)=>{
				resolve(responseData);
			});
		});			
		*/
	},
	
	on(eventName, callback) {
		if(IpcMessaging._checkIsValidChannelName(eventName) === false) {
			return Promise.reject(new Error("Illegal Electron channel name: must not start with 'ELECTRON_'"));
		}		
		
		const ipc = IpcMessaging._getIpc();	
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
	module.exports = IpcMessaging;
}

else {
	throw new Error("Unexpected global environment in ContextBridgePreload.js. Has the BrowserWindow webPreferences.contextIsolation=true?");
}