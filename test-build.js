const assert = require("assert");
const fs = require("fs");
const { Lisenser } = require("./dist/main");

assert.equal(typeof Lisenser, "function");
assert.equal(fs.existsSync("./dist/renderer/activate.html"), true);
assert.equal(fs.existsSync("./dist/renderer/activate.js"), true);
assert.equal(fs.existsSync("./dist/renderer/style.css"), true);
assert.equal(fs.existsSync("./dist/preloads/foractivate.js"), true);

assert.equal(fs.existsSync("./dist/renderer/otp.html"), true);
assert.equal(fs.existsSync("./dist/renderer/otp.js"), true);
assert.equal(fs.existsSync("./dist/preloads/forotp.js"), true);

console.log("OK!");
