pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS'
    }
    
    stages {
        stage('Deploy and Start') {
            steps {
                script {
                    bat '''
                    @echo off
                    
                    echo 1. Installing backend dependencies...
                    cd backend
                    npm install
                    
                    echo 2. Starting backend server on port 8081...
                    start "Backend Server" cmd /k "cd /d %CD%\\backend && npm start"
                    
                    echo 3. Starting frontend server on port 8082...
                    cd ..
                    start "Frontend Server" cmd /k "cd /d %CD%\\frontend && npx http-server -p 8082"
                    
                    echo =========================================
                    echo SERVERS ARE RUNNING!
                    echo Backend: http://localhost:8081
                    echo Frontend: http://localhost:8082
                    echo =========================================
                    '''
                }
            }
        }
        
        stage('Test Period') {
            steps {
                echo 'Waiting 300 seconds for manual testing...'
                echo 'Open browser and go to: http://localhost:8082'
                script {
                    sleep(time: 300, unit: 'SECONDS')
                }
                echo 'Test period ended. Servers remain running.'
            }
        }
    }
}