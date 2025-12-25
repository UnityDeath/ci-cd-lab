pipeline {
  agent any

  tools {
    nodejs 'NodeJS'
  }

  stages {
    stage('Install Backend') {
      steps {
        dir('backend') {
          bat 'if exist package-lock.json (npm.cmd ci) else (npm.cmd install)'
        }
      }
    }

    stage('Build Frontend') {
      steps {
        dir('frontend') {
          bat 'echo Frontend: static - skipped'
        }
      }
    }

    stage('Test Backend') {
      steps {
        dir('backend') {
          bat 'if exist package.json (npm.cmd test) else (echo No package.json - skipping tests)'
        }
      }
    }

    stage('Deploy') {
      steps {
        bat """
          @echo off
          echo Starting deployment...
          
          REM Create deployment directory
          if not exist "C:\\deploy\\ci-cd-lab" mkdir "C:\\deploy\\ci-cd-lab"
          if not exist "C:\\deploy\\ci-cd-lab\\backend" mkdir "C:\\deploy\\ci-cd-lab\\backend"
          if not exist "C:\\deploy\\ci-cd-lab\\frontend" mkdir "C:\\deploy\\ci-cd-lab\\frontend"
          
          REM Copy backend files
          echo Copying backend files...
          xcopy /E /I /Y "backend\\*" "C:\\deploy\\ci-cd-lab\\backend\\"
          
          REM Copy frontend files
          echo Copying frontend files...
          xcopy /E /I /Y "frontend\\*" "C:\\deploy\\ci-cd-lab\\frontend\\"
          
          REM Install backend dependencies
          cd /d C:\\deploy\\ci-cd-lab\\backend
          if exist package.json (
            echo Installing backend dependencies...
            npm.cmd install --production
          ) else (
            echo No package.json found
          )
          
          REM Stop any running process on port 8081 (бэкенд)
          echo Stopping any process on port 8081...
          for /F "tokens=5" %%p in ('netstat -ano ^| findstr :8081') do (
            echo Killing process with PID %%p
            taskkill /PID %%p /F >NUL 2>&1
          )
          
          REM Stop any running process on port 8082 (фронтенд)
          echo Stopping any process on port 8082...
          for /F "tokens=5" %%p in ('netstat -ano ^| findstr :8082') do (
            echo Killing process with PID %%p
            taskkill /PID %%p /F >NUL 2>&1
          )
          
          timeout /t 2 /nobreak >nul
          
          REM Start backend server как отдельный независимый процесс
          echo Starting backend server on port 8081...
          cd /d C:\\deploy\\ci-cd-lab\\backend
          
          REM Создаем bat-файл для запуска бэкенда и запускаем его
          echo Starting backend process...
          if exist package.json (
            REM Используем start с отдельным окном
            start "BackendServer" cmd /c "npm.cmd start 2>&1 ^& type C:\\deploy\\ci-cd-lab\\backend\\app.log"
          ) else if exist app.js (
            start "BackendServer" cmd /c "node app.js 2>&1 ^& type C:\\deploy\\ci-cd-lab\\backend\\app.log"
          ) else if exist server.js (
            start "BackendServer" cmd /c "node server.js 2>&1 ^& type C:\\deploy\\ci-cd-lab\\backend\\app.log"
          ) else (
            echo ERROR: No start file found!
            exit /b 1
          )
          
          REM Ждем больше для запуска бэкенда
          echo Waiting for backend to start (15 seconds)...
          timeout /t 15 /nobreak >nul
          
          REM Check if backend is running on port 8081
          echo Checking backend server on port 8081...
          powershell -Command "(New-Object Net.WebClient).DownloadString('http://localhost:8081/api/health')" >nul 2>&1
          if %errorlevel% equ 0 (
              echo SUCCESS: Backend server is running on http://localhost:8081
          ) else (
              echo WARNING: Backend server check failed on port 8081
              echo Checking logs...
              type C:\\deploy\\ci-cd-lab\\backend\\app.log 2>nul || echo Log file not found
          )
          
          REM Start frontend server как отдельный независимый процесс
          echo Starting frontend server on port 8082...
          cd /d C:\\deploy\\ci-cd-lab\\frontend
          
          REM Проверяем, есть ли public папка для http-server
          if exist public (
            REM Используем start с отдельным окном
            start "FrontendServer" cmd /c "npx http-server ./public -p 8082 --cors 2>&1 ^& type C:\\deploy\\ci-cd-lab\\frontend\\app.log"
          ) else (
            start "FrontendServer" cmd /c "npx http-server -p 8082 --cors 2>&1 ^& type C:\\deploy\\ci-cd-lab\\frontend\\app.log"
          )
          
          REM Ждем для запуска фронтенда
          echo Waiting for frontend to start (10 seconds)...
          timeout /t 10 /nobreak >nul
          
          REM Check if frontend is running
          echo Checking frontend server on port 8082...
          powershell -Command "(New-Object Net.WebClient).DownloadString('http://localhost:8082')" >nul 2>&1
          if %errorlevel% equ 0 (
              echo SUCCESS: Frontend is running on http://localhost:8082
          ) else (
              echo WARNING: Frontend server check failed on port 8082
          )
          
          echo Deployment completed!
          echo Note: Servers are running in separate windows
          echo Backend API: http://localhost:8081
          echo Frontend UI: http://localhost:8082
          echo 
          echo To stop servers, open Task Manager and kill node.exe processes
          echo or run: taskkill /F /IM node.exe
        """
      }
    }
    
    stage('Verify') {
      steps {
        echo 'Verifying servers are running...'
        bat """
          @echo off
          echo === Checking running servers ===
          echo Backend processes:
          tasklist | findstr node.exe
          echo.
          echo Frontend processes:
          tasklist | findstr http-server
          echo.
          echo === Port usage ===
          netstat -ano | findstr ":8081"
          netstat -ano | findstr ":8082"
          echo.
          echo === Quick API test ===
          curl -s http://localhost:8081/api/health || echo Backend not responding
          echo.
          echo === Frontend test ===
          curl -s http://localhost:8082 || echo Frontend not responding
        """
        echo 'Servers should now be running. Check:'
        echo 'Backend: http://localhost:8081/api/health'
        echo 'Frontend: http://localhost:8082'
      }
    }
  }

  post {
    success { 
      echo 'Pipeline finished successfully.' 
      echo 'Note: The deployment servers continue running after pipeline completion.'
      echo 'Backend доступен по адресу: http://localhost:8081'
      echo 'Frontend доступен по адресу: http://localhost:8082'
      echo ''
      echo 'To stop servers:'
      echo '1. Open Task Manager'
      echo '2. Find and kill node.exe processes'
      echo '3. Or run: taskkill /F /IM node.exe'
    }
    failure { 
      echo 'Pipeline failed - see console output.' 
      bat '''
        echo === Checking backend log ===
        type C:\\deploy\\ci-cd-lab\\backend\\app.log 2>nul || echo Backend log not found
        echo === Checking frontend log ===
        type C:\\deploy\\ci-cd-lab\\frontend\\app.log 2>nul || echo Frontend log not found
        echo === Checking running processes ===
        tasklist | findstr node
      '''
    }
  }
}