const fs = require("fs");
const path = require("path");
const assert = require("assert");

const read = file => fs.readFileSync(path.join(__dirname, file), "utf8");

console.log("Running Student Task Manager tests...");

for (const file of [
    "app.js", "package.json", "public/index.html", "public/style.css",
    "public/script.js", "Dockerfile", "Jenkinsfile", "deployment.yaml",
    "service.yaml", "monitoring/prometheus.yml"
]) {
    assert.ok(fs.existsSync(path.join(__dirname, file)), `Required file missing: ${file}`);
}

const pkg = JSON.parse(read("package.json"));
assert.ok(pkg.scripts && pkg.scripts.start, "npm start script must exist");
assert.ok(pkg.scripts && pkg.scripts.build, "npm run build script must exist");
assert.ok(pkg.scripts && pkg.scripts.test, "npm test script must exist");

const app = read("app.js");
assert.ok(app.includes('urlPath === "/health"'), "Health endpoint must be implemented");
assert.ok(app.includes('urlPath === "/metrics"'), "Prometheus metrics endpoint must be implemented");

const html = read("public/index.html");
assert.ok(html.includes("style.css"), "HTML should load CSS");
assert.ok(html.includes("script.js"), "HTML should load JavaScript");
assert.ok(html.includes('id="taskInput"'), "Task input should exist");
assert.ok(html.includes('id="taskList"'), "Task list should exist");

const js = read("public/script.js");
assert.ok(js.includes("function addTask()"), "addTask function should exist");
assert.ok(js.includes("textContent"), "Task text should be inserted safely");

console.log("All tests passed.");
