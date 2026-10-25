# Student Task Manager — DOSSL Assignments 3–8

This folder keeps the original mini web project and adds the DevOps files for Jenkins, Docker, Kubernetes/Minikube, Prometheus, and Grafana.

## Project layout

```text
StudentTaskManager/
├── public/
│   ├── index.html                 # Original HTML page
│   ├── style.css                  # Original styling
│   └── script.js                  # Task add/delete behaviour
├── monitoring/
│   ├── prometheus.yml
│   ├── docker-compose.monitoring.yml
│   └── grafana/
│       ├── dashboards/student-task-manager.json
│       └── provisioning/
│           ├── datasources/prometheus.yml
│           └── dashboards/dashboards.yml
├── app.js                         # Node server, /health, /metrics
├── build.js                       # Build validation
├── test.js                        # Automated checks
├── package.json
├── Jenkinsfile
├── Dockerfile
├── deployment.yaml
├── service.yaml
└── .dockerignore
```

## 1. Run the web project locally (Windows PowerShell)

Install Node.js LTS if it is not already installed. In this folder run:

```powershell
npm install
npm run build
npm test
npm start
```

Open `http://localhost:3000`. The task interface is in `public/index.html`, `public/style.css`, and `public/script.js`.

Health check: `http://localhost:3000/health`
Metrics: `http://localhost:3000/metrics`

## 2. Assignment 3 — Jenkins build

Create a Jenkins Pipeline job pointing to this Git repository and branch. This `Jenkinsfile` uses Windows `bat` steps, matching a Windows Jenkins agent. If your Jenkins agent runs Linux, replace each `bat` with `sh`.

The agent needs Node.js/npm on its PATH. The pipeline checks out the repository, installs npm dependencies, runs build validation, and runs tests.

## 3. Assignment 4 — Docker

Make sure Docker Desktop is running. From the project root:

```powershell
docker build -t task-manager:1.0 .
docker run --rm -p 3000:3000 task-manager:1.0
```

Visit `http://localhost:3000`. Stop the container with Ctrl+C.

## 4. Assignment 5 — Kubernetes with Minikube

Start Minikube and point Docker CLI to Minikube's image environment before building, so Kubernetes can use the image:

```powershell
minikube start
minikube docker-env --shell powershell | Invoke-Expression
docker build -t task-manager:1.0 .
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl get deployments,pods,services
kubectl rollout status deployment/task-manager-deployment
minikube service task-manager-service
```

The manifests run two replicas, use health probes, and expose a NodePort service on port 30080. If the image was built in Docker Desktop rather than Minikube's image environment, Minikube may not be able to find it.

Useful scaling/self-healing demo commands:

```powershell
kubectl scale deployment/task-manager-deployment --replicas=4
kubectl get pods -w
kubectl delete pod <one-pod-name>
kubectl get pods -w
```

Use Ctrl+C to stop watching. To clean up:

```powershell
kubectl delete -f service.yaml
kubectl delete -f deployment.yaml
```

## 5–6. Assignments 7–8 — Prometheus and Grafana

Ensure Docker Desktop is running. From the project root:

```powershell
docker compose -f monitoring/docker-compose.monitoring.yml up -d --build
```

Open:
- App: `http://localhost:3000`
- Prometheus: `http://localhost:9090`
- Grafana: `http://localhost:3001` (login `admin`, password `admin`)

The dashboard is provisioned automatically. In Prometheus, try:
- `task_manager_http_requests_total`
- `rate(task_manager_http_requests_total[1m])`
- `task_manager_http_errors_total`
- `task_manager_uptime_seconds`

Generate activity by refreshing the app and visiting `/health` a few times, then refresh the dashboard. The rate graph may need a little time to populate. Change the default Grafana password if using this beyond a local lab.

Stop the monitoring stack:

```powershell
docker compose -f monitoring/docker-compose.monitoring.yml down
```

## Notes

- The app uses Node.js built-in modules and does not require third-party npm packages.
- `kubectl.exe` is intentionally not included in this project folder; install `kubectl` separately and keep downloaded binaries out of Git.
- These files are prepared for the lab workflow, but run the commands on your machine and confirm the results in your own Docker/Jenkins/Minikube environment.
