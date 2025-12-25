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
        
        stage('Start Servers') {
            steps {
                script {
                    // Создаем бат-файл для запуска серверов
                    writeFile file: 'start-servers.bat', text: '''
@echo off
echo ===== STARTING SERVERS =====
echo Backend starting on port 8081...
cd backend
npm start
'''
                    
                    writeFile file: 'start-frontend.bat', text: '''
@echo off
echo Frontend starting on port 8082...
cd frontend
http-server -p 8082
'''
                    
                    // Запускаем серверы через PowerShell как отдельные процессы
                    powershell '''
                    # Запускаем backend
                    $backendJob = Start-Process -FilePath "cmd.exe" -ArgumentList "/c start-servers.bat" -WindowStyle Hidden -PassThru
                    Write-Host "Backend started with PID: $($backendJob.Id)"
                    
                    # Ждем 10 секунд
                    Start-Sleep -Seconds 10
                    
                    # Запускаем frontend
                    $frontendJob = Start-Process -FilePath "cmd.exe" -ArgumentList "/c start-frontend.bat" -WindowStyle Hidden -PassThru
                    Write-Host "Frontend started with PID: $($frontendJob.Id)"
                    
                    # Сохраняем PIDs в файл
                    "$($backendJob.Id)" | Out-File -FilePath "backend-pid.txt"
                    "$($frontendJob.Id)" | Out-File -FilePath "frontend-pid.txt"
                    '''
                    
                    // Ждем чтобы убедиться что серверы запустились
                    sleep(time: 20, unit: 'SECONDS')
                    
                    // Проверяем процессы
                    bat '''
                    @echo off
                    echo === Running Node processes ===
                    tasklist | findstr node
                    echo.
                    echo === Running server processes ===
                    tasklist | findstr http-server
                    echo.
                    echo === Servers should be available at ===
                    echo Backend:  http://localhost:8081
                    echo Frontend: http://localhost:8082
                    '''
                }
            }
        }
        
        stage('Wait for Testing') {
            steps {
                script {
                    echo '===== MANUAL TESTING PERIOD ====='
                    echo 'Servers are running. You can now:'
                    echo '1. Open browser'
                    echo '2. Go to http://localhost:8082'
                    echo '3. Test the application'
                    echo ''
                    echo 'Jenkins will wait for 30 minutes...'
                    echo '==================================='
                    
                    // Ждем 30 минут для тестирования
                    sleep(time: 1800, unit: 'SECONDS')
                    
                    echo 'Test period finished.'
                }
            }
        }
    }
    
    post {
        always {
            echo '===== IMPORTANT ====='
            echo 'Servers may still be running!'
            echo ''
            echo 'To check if servers are running:'
            echo 'tasklist | findstr node'
            echo 'tasklist | findstr http-server'
            echo ''
            echo 'To stop servers:'
            echo 'taskkill /F /IM node.exe'
            echo 'taskkill /F /IM http-server.exe'
            echo '====================='
        }
    }
}