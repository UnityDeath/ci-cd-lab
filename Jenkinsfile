pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS'
    }
    
    stages {
        stage('Prepare') {
            steps {
                script {
                    dir('backend') {
                        bat 'npm install'
                    }
                    bat 'npm install -g http-server'
                }
            }
        }
        
        stage('Run Servers') {
            steps {
                script {
                    // Запускаем оба сервера в одном бат-файле
                    bat '''
                    @echo off
                    
                    echo ===== STARTING SERVERS =====
                    
                    REM Запускаем backend
                    echo 1. Starting backend on port 8081...
                    cd backend
                    start "BackendServer" /B cmd /c "npm start"
                    cd..
                    
                    REM Ждем пока backend запустится
                    timeout /t 15 /nobreak > nul
                    
                    REM Запускаем frontend  
                    echo 2. Starting frontend on port 8082...
                    cd frontend
                    start "FrontendServer" /B cmd /c "http-server -p 8082"
                    cd..
                    
                    REM Ждем немного
                    timeout /t 10 /nobreak > nul
                    
                    echo ===== SERVERS STARTED =====
                    echo Backend: http://localhost:8081
                    echo Frontend: http://localhost:8082
                    echo ============================
                    echo.
                    echo Now waiting for 10 minutes...
                    '''
                    
                    // Ждем 10 минут для ручного тестирования
                    sleep(time: 600, unit: 'SECONDS')
                    
                    echo 'Test period finished. Servers are still running.'
                }
            }
        }
        
        stage('Show Status') {
            steps {
                script {
                    // Эта стадия всегда выполняется, даже если есть ошибки
                    echo '=== CURRENT STATUS ==='
                    bat '''
                    @echo off
                    echo Node.js processes:
                    tasklist /FI "IMAGENAME eq node.exe" 2>nul
                    echo.
                    echo Server check (may fail if servers not ready):
                    curl http://localhost:8081/api/health -s -o nul && echo Backend is responding || echo Backend not responding
                    curl http://localhost:8082 -s -o nul && echo Frontend is responding || echo Frontend not responding
                    '''
                }
            }
        }
    }
    
    post {
        always {
            echo '=== INSTRUCTIONS ==='
            echo 'To stop servers: taskkill /F /IM node.exe'
            echo 'To test: http://localhost:8082'
            echo '===================='
        }
    }
}