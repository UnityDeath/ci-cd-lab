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
          
          if not exist "C:\\deploy\\ci-cd-lab" mkdir "C:\\deploy\\ci-cd-lab"
          if not exist "C:\\deploy\\ci-cd-lab\\backend" mkdir "C:\\deploy\\ci-cd-lab\\backend"
          if not exist "C:\\deploy\\ci-cd-lab\\frontend" mkdir "C:\\deploy\\ci-cd-lab\\frontend"
          
          echo Copying backend files...
          xcopy /E /I /Y "backend\\*" "C:\\deploy\\ci-cd-lab\\backend\\"
          
          echo Copying frontend files...
          xcopy /E /I /Y "frontend\\*" "C:\\deploy\\ci-cd-lab\\frontend\\"
          
          cd /d C:\\deploy\\ci-cd-lab\\backend
          if exist package.json (
            echo Installing backend dependencies...
            npm.cmd install --production
          ) else (
            echo No package.json found
          )
          
          echo Stopping any process on port 8081...
          for /F "tokens=5" %%p in ('netstat -ano ^| findstr :8081') do (
            echo Killing process with PID %%p
            taskkill /PID %%p /F >NUL 2>&1
          )
          
          timeout /t 2 /nobreak >nul
          
          echo Starting backend server on port 8081...
          cd /d C:\\deploy\\ci-cd-lab\\backend
          
          if exist package.json (
            start "BackendServer" cmd /c "npm.cmd start"
          ) else if exist app.js (
            start "BackendServer" cmd /c "node app.js"
          ) else if exist server.js (
            start "BackendServer" cmd /c "node server.js"
          ) else (
            echo ERROR: No start file found!
            exit /b 1
          )
          
          echo Waiting for backend to start (10 seconds)...
          timeout /t 10 /nobreak >nul
          
          echo Checking backend server on port 8081...
          powershell -Command "(New-Object Net.WebClient).DownloadString('http://localhost:8081')" >nul 2>&1
          if %errorlevel% equ 0 (
              echo SUCCESS: Backend server is running on http://localhost:8081
          ) else (
              echo WARNING: Backend server check failed on port 8081
          )
          
          echo Deployment completed!
          echo Backend: http://localhost:8081
          echo Files: C:\\deploy\\ci-cd-lab
        """
      }
    }
  }

  post {
    success { 
      echo 'Pipeline finished successfully.' 
      echo 'Backend: http://localhost:8081'
    }
    failure { 
      echo 'Pipeline failed.' 
    }
  }
}