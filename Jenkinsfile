pipeline {
  agent any

  // Убери блок tools если у тебя не настроен NodeJS в Jenkins
  tools {
    nodejs 'NodeJS'
  }

  stages {
    stage('Install Backend') {
      steps {
        dir('backend') {
          bat 'echo Installing backend dependencies...'
          bat 'if exist package-lock.json (npm.cmd ci) else (npm.cmd install)'
        }
      }
    }

    stage('Build Frontend') {
      steps {
        dir('frontend') {
          bat 'echo Frontend is static — skipping build'
          // если нужен билд — раскомментируй:
          // bat 'npm.cmd install'
          // bat 'npm.cmd run build'
        }
      }
    }

    stage('Test Backend') {
      steps {
        dir('backend') {
          bat 'echo Running backend tests (if any)...'
          bat 'if exist package.json (npm.cmd test) else (echo No package.json — skipping tests)'
        }
      }
    }

    stage('Deploy') {
      steps {
        echo 'Deploy: copy backend+frontend to C:\\deploy\\ci-cd-lab and start backend'
        bat '''
@echo off
REM --- create folders if missing
if not exist "C:\deploy\ci-cd-lab" mkdir "C:\deploy\ci-cd-lab"
if not exist "C:\deploy\ci-cd-lab\backend" mkdir "C:\deploy\ci-cd-lab\backend"
if not exist "C:\deploy\ci-cd-lab\frontend" mkdir "C:\deploy\ci-cd-lab\frontend"

REM --- copy files (simple overwrite)
xcopy /E /I /Y "%WORKSPACE%\\backend\\*" "C:\\deploy\\ci-cd-lab\\backend\\"
xcopy /E /I /Y "%WORKSPACE%\\frontend\\*" "C:\\deploy\\ci-cd-lab\\frontend\\"

REM --- install production deps if needed
cd /d C:\deploy\ci-cd-lab\backend
if exist package.json (
  echo Installing production deps...
  if exist package-lock.json ( npm.cmd ci --production ) else ( npm.cmd install --production )
) else (
  echo No package.json in deploy/backend — skipping install.
)

REM --- kill old backend on 3000 (if any) and start new (detached) ---
for /F "tokens=5" %%p in ('netstat -ano ^| findstr :3000') do (
  echo Killing PID %%p
  taskkill /PID %%p /F >NUL 2>&1
)

start "" cmd /c "cd /d C:\deploy\ci-cd-lab\backend && npm.cmd start > C:\deploy\ci-cd-lab\backend\app.log 2>&1"
echo Deploy finished. Logs: C:\deploy\ci-cd-lab\backend\app.log
'''
      }
    }
  }

  post {
    success { echo 'Pipeline finished successfully.' }
    failure { echo 'Pipeline failed — см. console output.' }
  }
}
