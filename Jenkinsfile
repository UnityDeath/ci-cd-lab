pipeline {
  agent any

  tools {
    nodejs 'NodeJS'
  }

  stages {
    stage('Install Backend') {
      steps {
        dir('backend') {
          bat 'echo Installing backend dependencies...'
          // используем npm ci если есть package-lock, иначе npm install
          bat 'if exist package-lock.json (npm ci) else (npm install)'
        }
      }
    }

    stage('Build Frontend (static)') {
      steps {
        dir('frontend') {
          bat 'echo Frontend is static — no npm install required (skipped)'
          // Если у вас SPA с билдом, замените/раскомментируйте соответствующие команды
          // bat 'npm install'
          // bat 'npm run build'
        }
      }
    }

    stage('Test Backend') {
      steps {
        dir('backend') {
          bat 'echo Running backend tests (if any)...'
          bat 'if exist package.json (if exist node_modules (echo deps present) else (npm ci))'
          bat 'if exist package.json (if exist package.json (npm test) else (echo No tests configured))'
        }
      }
    }

    stage('Deploy') {
      steps {
        echo 'Deploying to local server (copy backend & start)...'
        bat """
@echo off
setlocal enableextensions enabledelayedexpansion

REM --- Kill any process currently listening on port 3000 ---
set KILLED=0
for /F "tokens=5" %%p in ('netstat -ano ^| findstr /R /C:":3000 " ^| findstr LISTENING') do (
  echo Found PID %%p on port 3000, attempting to kill...
  taskkill /PID %%p /F >NUL 2>&1
  if NOT errorlevel 1 ( set KILLED=1 )
)
if "%KILLED%"=="0" echo No process found on port 3000

REM --- Prepare deploy directories ---
if not exist "C:\\deploy\\ci-cd-lab" mkdir "C:\\deploy\\ci-cd-lab"
if not exist "C:\\deploy\\ci-cd-lab\\backend" mkdir "C:\\deploy\\ci-cd-lab\\backend"
if not exist "C:\\deploy\\ci-cd-lab\\frontend" mkdir "C:\\deploy\\ci-cd-lab\\frontend"

REM --- Copy only backend and frontend contents from WORKSPACE ---
xcopy /E /I /Y "%WORKSPACE%\\backend\\*" "C:\\deploy\\ci-cd-lab\\backend\\"
xcopy /E /I /Y "%WORKSPACE%\\frontend\\*" "C:\\deploy\\ci-cd-lab\\frontend\\"

REM 1) если репозиторий уже есть — делаем git pull, иначе клонируем
if exist "C:\deploy\ci-cd-lab\.git" (
  echo Repo exists — pulling
  cd /d C:\deploy\ci-cd-lab
  git fetch --all
  git reset --hard origin\main
) else (
  echo Cloning repo to deploy dir
  rmdir /S /Q "C:\deploy\ci-cd-lab" 2>nul
  git clone https://github.com/UnityDeath/ci-cd-lab.git "C:\deploy\ci-cd-lab"
)

REM 2) Устанавливаем зависимости в backend, если package.json изменился (см ниже)
cd /d C:\deploy\ci-cd-lab\backend
if exist package.json (
  if not exist C:\deploy\ci-cd-lab\.last_package_hash.txt (
    certutil -hashfile package.json SHA256 | findstr /v "hash" > C:\deploy\ci-cd-lab\.last_package_hash.txt
    npm ci --production
  ) else (
    certutil -hashfile package.json SHA256 | findstr /v "hash" > C:\deploy\ci-cd-lab\.cur_package_hash.txt
    fc C:\deploy\ci-cd-lab\.last_package_hash.txt C:\deploy\ci-cd-lab\.cur_package_hash.txt >nul
    if errorlevel 1 (
      echo package.json changed — reinstalling deps
      npm ci --production
      move /Y C:\deploy\ci-cd-lab\.cur_package_hash.txt C:\deploy\ci-cd-lab\.last_package_hash.txt >nul
    ) else (
      echo package.json not changed — skipping npm install
      del C:\deploy\ci-cd-lab\.cur_package_hash.txt >nul 2>&1
    )
  )
)

REM --- Start backend in detached console and redirect logs to file ---
REM Use npm start (expects package.json script) and write logs to backend\\app.log
if exist package.json (
  echo Starting backend (detached)...
  start "" cmd /c "cd /d C:\\deploy\\ci-cd-lab\\backend && npm start > C:\\deploy\\ci-cd-lab\\backend\\app.log 2>&1"
) else (
  echo Cannot start backend: package.json missing in deploy/backend
)

endlocal
exit /b 0
"""
      }
    }
  }

  post {
    success { echo 'Deployment pipeline finished.' }
    failure { echo 'Pipeline failed — check console output.' }
  }
}
