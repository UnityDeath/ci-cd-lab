pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS'
    }
    
    stages {
        stage('Start Servers') {
            steps {
                script {
                    // Запускаем backend как фоновый процесс
                    bat '''
                    @echo off
                    cd backend
                    echo Starting backend on port 8081...
                    start /B npm start
                    '''
                    
                    // Даем backend время на запуск
                    sleep(time: 5, unit: 'SECONDS')
                    
                    // Запускаем frontend как фоновый процесс
                    bat '''
                    @echo off
                    cd frontend
                    echo Starting frontend on port 8082...
                    start /B npx http-server -p 8082
                    '''
                    
                    // Даем frontend время на запуск
                    sleep(time: 5, unit: 'SECONDS')
                }
            }
        }
        
        stage('Check Servers') {
            steps {
                script {
                    // Проверяем, что процессы запущены
                    bat 'tasklist | findstr node'
                    bat 'tasklist | findstr http-server'
                    
                    echo '=== SERVERS INFORMATION ==='
                    echo 'Backend should be on: http://localhost:8081'
                    echo 'Frontend should be on: http://localhost:8082'
                    echo '==========================='
                }
            }
        }
        
        stage('Wait for Test') {
            steps {
                echo 'Waiting 300 seconds for manual testing...'
                echo 'Open browser and go to: http://localhost:8082'
                echo 'If servers are running, you should see the frontend.'
                script {
                    sleep(time: 300, unit: 'SECONDS')
                }
            }
        }
    }
    
    post {
        always {
            echo '=== TO STOP SERVERS MANUALLY ==='
            echo 'Open Command Prompt as Administrator and run:'
            echo 'taskkill /F /IM node.exe'
            echo 'taskkill /F /IM http-server.exe'
            echo '==============================='
        }
    }
}