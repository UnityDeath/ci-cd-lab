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
          // esli nuzhen build, raskommentiruy:
          // bat 'npm.cmd install'
          // bat 'npm.cmd run build'
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
        script {
          def workspacePath = pwd()
          
          bat """
            @echo off
            set WORKSPACE=${workspacePath}
            
            echo Working directory: %WORKSPACE%
            
            if not exist "C:\\deploy\\ci-cd-lab" mkdir "C:\\deploy\\ci-cd-lab"
            if not exist "C:\\deploy\\ci-cd-lab\\backend" mkdir "C:\\deploy\\ci-cd-lab\\backend"
            if not exist "C:\\deploy\\ci-cd-lab\\frontend" mkdir "C:\\deploy\\ci-cd-lab\\frontend"
            
            echo Copying backend...
            xcopy /E /I /Y "%WORKSPACE%\\backend\\*" "C:\\deploy\\ci-cd-lab\\backend\\"
            
            echo Copying frontend...
            xcopy /E /I /Y "%WORKSPACE%\\frontend\\*" "C:\\deploy\\ci-cd-lab\\frontend\\"
            
            cd /d C:\\deploy\\ci-cd-lab\\backend
            if exist package.json (
              echo Installing backend dependencies...
              if exist package-lock.json (
                npm.cmd ci --production
              ) else (
                npm.cmd install --production
              )
              echo Dependencies installed
            ) else (
              echo No package.json - skipping install
            )
            
            echo Stopping old process on port 3000...
            for /F "tokens=5" %%p in ('netstat -ano ^| findstr :3000') do (
              echo Found process with PID %%p, stopping...
              taskkill /PID %%p /F >NUL 2>&1
            )
            
            timeout /t 2 /nobreak >nul
            
            echo Starting backend...
            cd /d C:\\deploy\\ci-cd-lab\\backend
            
            if exist package.json (
              echo Running npm start...
              start "" /B cmd /c "npm.cmd start > C:\\deploy\\ci-cd-lab\\backend\\app.log 2>&1"
            ) else (
              echo Looking for app.js or server.js...
              if exist app.js (
                start "" /B cmd /c "node app.js > C:\\deploy\\ci-cd-lab\\backend\\app.log 2>&1"
              ) else if exist server.js (
                start "" /B cmd /c "node server.js > C:\\deploy\\ci-cd-lab\\backend\\app.log 2>&1"
              ) else (
                echo No file to start found!
                exit /b 1
              )
            )
            
            echo Waiting for server start...
            timeout /t 5 /nobreak >nul
            
            echo Checking server availability...
            powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3000' -TimeoutSec 5; if ($response.StatusCode -eq 200) { Write-Host 'OK - Server is running' } else { Write-Error 'Server responded with non-200'; exit 1 } } catch { Write-Error 'Server is not reachable'; exit 1 }"
            
            echo Deploy completed successfully!
            echo Files are in: C:\\deploy\\ci-cd-lab
            echo Application logs: C:\\deploy\\ci-cd-lab\\backend\\app.log
          """
        }
      }
    }
  }

  post {
    success { 
      echo 'Pipeline finished successfully.' 
      echo 'Backend is available at: http://localhost:3000'
    }
    failure { 
      echo 'Pipeline failed - see console output.' 
      echo 'Check logs at: C:\\deploy\\ci-cd-lab\\backend\\app.log'
    }
  }
}