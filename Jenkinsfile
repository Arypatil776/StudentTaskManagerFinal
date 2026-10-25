pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                // This project uses Node.js built-ins and has no external npm dependencies.
                bat 'npm install'
            }
        }

        stage('Build') {
            steps {
                bat 'npm run build'
            }
        }

        stage('Automated Testing') {
            steps {
                bat 'npm test'
            }
        }
    }

    post {
        success {
            echo 'Student Task Manager: build and tests succeeded.'
        }
        failure {
            echo 'Student Task Manager: pipeline failed. Review the stage logs.'
        }
    }
}
