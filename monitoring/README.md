# Monitoring stack

From the project root, run:

```powershell
docker compose -f monitoring/docker-compose.monitoring.yml up -d --build
```

- Application: http://localhost:3000
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001 (default local lab login: `admin` / `admin`)

Prometheus scrapes the app's `/metrics` endpoint every 5 seconds. Grafana is provisioned with Prometheus as its default data source and the Student Task Manager dashboard.

Try these PromQL queries:
- `task_manager_http_requests_total`
- `rate(task_manager_http_requests_total[1m])`
- `task_manager_http_errors_total`
- `task_manager_uptime_seconds`

Generate traffic by refreshing the app and visiting `/health`. Shut down with:

```powershell
docker compose -f monitoring/docker-compose.monitoring.yml down
```
