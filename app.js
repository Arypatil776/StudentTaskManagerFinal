const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PORT || 3000);
const publicDir = path.resolve(__dirname, "public");
const startedAt = Date.now();
let totalRequests = 0;
let errorRequests = 0;

const contentTypes = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".ico": "image/x-icon"
};

const server = http.createServer((req, res) => {
    totalRequests++;
    const urlPath = new URL(req.url, `http://${req.headers.host || "localhost"}`).pathname;

    if (urlPath === "/health") {
        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ service: "StudentTaskManager", status: "healthy" }));
        return;
    }

    if (urlPath === "/metrics") {
        const uptime = (Date.now() - startedAt) / 1000;
        const metrics = [
            "# HELP task_manager_http_requests_total Total HTTP requests handled.",
            "# TYPE task_manager_http_requests_total counter",
            `task_manager_http_requests_total ${totalRequests}`,
            "# HELP task_manager_http_errors_total HTTP requests that returned an error status.",
            "# TYPE task_manager_http_errors_total counter",
            `task_manager_http_errors_total ${errorRequests}`,
            "# HELP task_manager_uptime_seconds Application uptime in seconds.",
            "# TYPE task_manager_uptime_seconds gauge",
            `task_manager_uptime_seconds ${uptime.toFixed(2)}`
        ].join("\n") + "\n";
        res.writeHead(200, { "Content-Type": "text/plain; version=0.0.4; charset=utf-8" });
        res.end(metrics);
        return;
    }

    const requestedPath = urlPath === "/" ? "index.html" : urlPath.replace(/^\/+/, "");
    const filePath = path.resolve(publicDir, requestedPath);

    // Only serve files inside the public directory.
    if (filePath !== publicDir && !filePath.startsWith(publicDir + path.sep)) {
        errorRequests++;
        res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Forbidden");
        return;
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            errorRequests++;
            res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("File not found");
            return;
        }
        res.writeHead(200, {
            "Content-Type": contentTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream",
            "X-Content-Type-Options": "nosniff"
        });
        res.end(data);
    });
});

server.listen(PORT, "0.0.0.0", () => {
    console.log(`Student Task Manager running at http://localhost:${PORT}`);
    console.log(`Health endpoint: http://localhost:${PORT}/health`);
    console.log(`Metrics endpoint: http://localhost:${PORT}/metrics`);
});
