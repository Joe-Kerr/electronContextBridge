const assert = require("assert");
const sinon = require("sinon");
const Sample = require("../../src/ContextBridgeMain.js");
const sample = new Sample({});

suite("ContextBridgeMain.js");

test("createIpcChannel() calls callback on request", async ()=>{
	const localSample = new Sample({});
	localSample.ipc = {handle: new sinon.fake()};
	
	const name = "test";
	const userCallback = new sinon.fake();
	
	localSample.createIpcChannel(name, userCallback);
	
	assert.equal(localSample.ipc.handle.callCount, 1);
	
	
	const sysCallback = localSample.ipc.handle.lastCall.args[1];	
	await sysCallback("event", "data");
	
	assert.equal(userCallback.callCount, 1);
	assert.deepEqual(userCallback.lastCall.args, ["data"]);
});


test("broadcastMessage() sends parameters to webContents", ()=>{
	const win1 = new sinon.fake();
	const win2 = new sinon.fake();
	const BrowserWindow = {
		getAllWindows: ()=>([
			{webContents: {send: win1}},
			{webContents: {send: win2}}
		])
	};
	const localSample = new Sample(BrowserWindow);
	
	localSample.broadcastMessage("name", "params");
	
	assert.equal(win1.callCount, 1);
	assert.equal(win2.callCount, 1);
	assert.deepEqual(win1.lastCall.args, ["name", "params"]);
	assert.deepEqual(win2.lastCall.args, ["name", "params"]);
});

test("getPreloadFilePath() returns path to preload file", ()=>{
	const path = sample.getPreloadFilePath();
	const preload = require(path);
	
	assert.ok("request" in preload.IpcMessaging);
	assert.ok("on" in preload.IpcMessaging);
});

test("getPreloadFilePath() throws if preload file does not exist", ()=>{
	const localSample = new Sample({});
	localSample.fileExists = ()=>false;
	
	assert.throws(()=>{localSample.getPreloadFilePath()}, {message: /invalid path/});
});