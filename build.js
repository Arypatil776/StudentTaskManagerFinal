const fs = require("fs");
const path = require("path");

const requiredFiles = [
    "app.js",
    "package.json",
    "public/index.html",
    "public/style.css",
    "public/script.js",
    "test.js",
    "Dockerfile",
    "Jenkinsfile",
    "deployment.yaml",
    "service.yaml",
    "monitoring/prometheus.yml",
    "monitoring/docker-compose.monitoring.yml"
];

console.log("Starting Student Task Manager build validation...");
const missing = requiredFiles.filter(file => !fs.existsSync(path.join(__dirname, file)));

if (missing.length) {
    console.error("Build validation failed. Missing files:");
    missing.forEach(file => console.error(` - ${file}`));
    process.exit(1);
}

console.log("All required application and DevOps files are present.");
console.log("Build completed successfully.");
