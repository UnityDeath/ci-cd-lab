pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS'
    }
    
    stages {
        stage('Install Dependencies') {
            steps {
                script {
                    // Устанавливаем зависимости для backend
                    dir('backend') {
                        bat 'npm install'
                    }
                    
                    // Устанавливаем http-server глобально для frontend
                    bat 'npm install -g http-server'
                }
            }
        }
        
        stage('Start Servers') {
            steps {
                script {
                    // Запускаем backend как фоновый процесс
                    bat '''
                    @echo off
                    cd backend
                    echo Starting backend on port 8081...
                    start "Backend" /B npm start
                    '''
                    
                    // Даем backend время на запуск
                    sleep(time: 10, unit: 'SECONDS')
                    
                    // Запускаем frontend как фоновый процесс
                    bat '''
                    @echo off
                    cd frontend
                    echo Starting frontend on port 8082...
                    start "Frontend" /B npx http-server -p 8082
                    '''
                    
                    // Даем frontend время на запуск
                    sleep(time: 10, unit: 'SECONDS')
                }
            }
        }
        
        stage('Check Servers') {
            steps {
                script {
                    // Проверяем, что процессы запущены
                    echo 'Checking running processes...'
                    
                    bat '''
                    @echo off
                    echo === Node processes ===
                    tasklist | findstr node
                    echo.
                    echo === Java processes ===
                    tasklist | findstr java
                    echo.
                    echo === All processes with "http" ===
                    tasklist | findstr http
                    '''
                }
            }
        }
        
        stage('Test Connection') {
            steps {
                script {
                    echo 'Testing if servers are responding...'
                    
                    // Пытаемся проверить подключение
                    bat '''
                    @echo off
                    echo Testing backend (timeout 10 seconds)...
                    timeout /t 10 /nobreak > nul
                    curl -s -o nul -w "Backend HTTP code: %%{http_code}\\n" http://localhost:8081/api/health || echo Backend check failed
                    
                    echo Testing frontend (timeout 10 seconds)...
                    timeout /t 10 /nobreak > nul
                    curl -s -o nul -w "Frontend HTTP code: %%{http_code}\\n" http://localhost:8082 || echo Frontend check failed
                    '''
                }
            }
        }
        
        stage('Manual Test Period') {
            steps {
                script {
                    echo '==========================================='
                    echo 'MANUAL TESTING PERIOD: 10 MINUTES'
                    echo 'Frontend URL: http://localhost:8082'
                    echo 'Backend URL: http://localhost:8081'
                    echo ''
                    echo 'Servers are running. You can now:'
                    echo '1. Open browser'
                    echo '2. Go to http://localhost:8082'
                    echo '3. Test the application'
                    echo '==========================================='
                    
                    // Увеличиваем время ожидания до 10 минут
                    sleep(time: 600, unit: 'SECONDS')
                    
                    echo 'Manual test period ended.'
                }
            }
        }
    }
    
    post {
        always {
            echo '==========================================='
            echo 'PIPELINE COMPLETED'
            echo ''
            echo 'IMPORTANT: Servers might still be running!'
            echo ''
            echo 'To stop all servers manually:'
            echo '1. Open Command Prompt as Administrator'
            echo '2. Run: taskkill /F /IM node.exe'
            echo '3. Run: taskkill /F /IM http-server.exe'
            echo '==========================================='
        }
        
        failure {
            echo 'Pipeline failed but servers might still be running!'
            echo 'Check logs above for errors.'
        }
    }
}