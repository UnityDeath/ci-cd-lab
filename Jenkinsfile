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
          
          REM Stop any running process on port 8081 (где работает бэкенд)
          echo Stopping any process on port 8081...
          for /F "tokens=5" %%p in ('netstat -ano ^| findstr :8081') do (
            echo Killing process with PID %%p
            taskkill /PID %%p /F >NUL 2>&1
          )
          
          timeout /t 2 /nobreak >nul
          
          REM Start backend server
          echo Starting backend server on port 8081...
          cd /d C:\\deploy\\ci-cd-lab\\backend
          
          if exist package.json (
            REM Start with npm
            start "" /B cmd /c "npm.cmd start > C:\\deploy\\ci-cd-lab\\backend\\app.log 2>&1"
          ) else if exist app.js (
            REM Start with node directly
            start "" /B cmd /c "node app.js > C:\\deploy\\ci-cd-lab\\backend\\app.log 2>&1"
          ) else if exist server.js (
            start "" /B cmd /c "node server.js > C:\\deploy\\ci-cd-lab\\backend\\app.log 2>&1"
          ) else (
            echo ERROR: No start file found!
            exit /b 1
          )
          
          echo Waiting for server to start...
          timeout /t 5 /nobreak >nul
          
          REM Check if backend is running on port 8081
          echo Checking backend server on port 8081...
          powershell -Command "(New-Object Net.WebClient).DownloadString('http://localhost:8081')" >nul 2>&1
          if %errorlevel% equ 0 (
              echo SUCCESS: Backend server is running on http://localhost:8081
          ) else (
              echo WARNING: Backend server check failed on port 8081
              echo Check C:\\deploy\\ci-cd-lab\\backend\\app.log for details
          )
          
          REM Start frontend server on different port (например 8082)
          echo Starting frontend server on port 8082...
          cd /d C:\\deploy\\ci-cd-lab\\frontend
          
          REM Install http-server globally or use npx
          start "" /B cmd /c "npx http-server -p 8082 > C:\\deploy\\ci-cd-lab\\frontend\\app.log 2>&1"
          
          timeout /t 3 /nobreak >nul
          
          REM Check if frontend is running
          echo Checking frontend server on port 8082...
          powershell -Command "(New-Object Net.WebClient).DownloadString('http://localhost:8082')" >nul 2>&1
          if %errorlevel% equ 0 (
              echo SUCCESS: Frontend is running on http://localhost:8082
          ) else (
              echo WARNING: Frontend server check failed on port 8082
          )
          
          echo Deployment completed!
          echo Backend: http://localhost:8081
          echo Frontend: http://localhost:8082
          echo Backend log: C:\\deploy\\ci-cd-lab\\backend\\app.log
          echo Frontend log: C:\\deploy\\ci-cd-lab\\frontend\\app.log
        """
      }
    }
  }

  post {
    success { 
      echo 'Pipeline finished successfully.' 
      echo 'Backend доступен по адресу: http://localhost:8081'
      echo 'Frontend доступен по адресу: http://localhost:8082'
    }
    failure { 
      echo 'Pipeline failed - see console output.' 
      bat '''
        echo === Checking backend log ===
        type C:\\deploy\\ci-cd-lab\\backend\\app.log 2>nul || echo Backend log not found
        echo === Checking frontend log ===
        type C:\\deploy\\ci-cd-lab\\frontend\\app.log 2>nul || echo Frontend log not found
      '''
    }
  }
}