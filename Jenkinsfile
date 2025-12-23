pipeline {
    agent any

    tools {
        nodejs "NodeJS"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install') {
            steps {
                bat 'npm install'
            }
        }

        stage('Test') {
            steps {
                bat 'npm test -- --coverage'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying to local server...'

                // Stop old server if running
                bat '''
                for /f "tokens=5" %%p in ('netstat -ano ^| findstr :3000') do taskkill /PID %%p /F
                '''
                
                // Copy files to deploy folder
                bat '''
                xcopy /E /Y "%WORKSPACE%\\*" "C:\\deploy\\ci-cd-lab\\"
                '''

                // Install dependencies in deploy folder
                bat '''
                cd C:\\deploy\\ci-cd-lab
                npm install
                '''

                // Start server
                bat '''
                start cmd /c "cd C:\\deploy\\ci-cd-lab && npm start"
                '''
            }
        }
    }
}
