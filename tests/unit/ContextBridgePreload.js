const assert = require("assert");
const sinon = require("sinon");
const Sample = require("../../src/ContextBridgePreload.js");

suite("ContextBridgePreload.js");

const backups = {};

beforeEach(()=>{
	backups["_getIpc"] = Sample._getIpc;
});

afterEach(()=>{
	Sample._getIpc = backups["_getIpc"];
});

test("request() calls invoke with its parameters", ()=>{
	const invoke = new sinon.fake();	
	Sample._getIpc = ()=>({invoke});
	
	Sample.request("command", "data");
	
	assert.equal(invoke.callCount, 1);
	assert.deepEqual(invoke.lastCall.args, ["command", "data"]);
});

test("request() returns rejected promise for illegal command names", async ()=>{
	await assert.rejects(async ()=>{ await Sample.request("ELECTRON_EVIL_CALL"); }, {message: /Illegal Electron channel/});
});


test("on() calls callback with event data", ()=>{
	const on = new sinon.fake();	
	Sample._getIpc = ()=>({on});	
	
	const userCallback = new sinon.fake();
	
	Sample.on("eventName", userCallback);
	
	assert.equal(on.callCount, 1);
	
	const sysCallback = on.lastCall.args[1];
	sysCallback("sysEvent", "data");
	
	assert.equal(userCallback.callCount, 1);
	assert.deepEqual(userCallback.lastCall.args, [{detail: "data", name: "eventName"}]);
});

test("on() returns rejected promise for illegal command names", async ()=>{
	await assert.rejects(async ()=>{ await Sample.on("ELECTRON_EVIL_CALL"); }, {message: /Illegal Electron channel/});
});