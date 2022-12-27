const assert = require("assert");
const fs = require("fs");
const { getLicenseStatus, getTrialStatus, startTrial, activateLicenseKey, Lisenser } = require("./dist/main");

assert.equal(typeof getLicenseStatus, "function");
assert.equal(typeof getTrialStatus, "function");
assert.equal(typeof startTrial, "function");
assert.equal(typeof activateLicenseKey, "function");
assert.equal(typeof Lisenser, "function");
assert.equal(fs.existsSync("./dist/renderer/activate.html"), true);
assert.equal(fs.existsSync("./dist/renderer/activate.js"), true);
assert.equal(fs.existsSync("./dist/renderer/style.css"), true);
assert.equal(fs.existsSync("./dist/preloads/foractivate.js"), true);

console.log("OK!");
