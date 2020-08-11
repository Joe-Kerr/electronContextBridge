const assert = require("assert");
const electron = require("electron");
const Spectron = require("spectron").Application;
const path = require("path");

const app = new Spectron({
	path: electron,
	args: [path.join(__dirname, "../fix/")]
});

suite("System tests");

before(async function() {
	this.timeout(20000);

	await app.start();

	//await app.client.waitUntilWindowLoaded();
});

after(async function () {
	this.timeout(20000);
	
	try {
		await app.stop();
	}
	catch(e) {
		assert.ok("un-fucking catchable????");
	}
	
});

test("IPC message from main can be captured by renderer", async function() {
	this.timeout(20000);
	
	await app.client.waitUntilTextExists("#response", "broadCastFromMain", 10000);
	
	assert.ok(true);	
});

test("Ping/pong from renderer to main to renderer", async function() {
	this.timeout(20000);
	
	const button = await app.client.$("#ping");
	await button.click();
	
	await app.client.waitUntilTextExists("#response", "pong", 10000);
	
	assert.ok(true);
	
	//assert.strictEqual(await app.client.getWindowCount(), 1);
});