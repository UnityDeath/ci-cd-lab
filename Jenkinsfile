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
          bat 'if exist package-lock.json (npm ci) else (npm install)'
        }
      }
    }

    stage('Build Frontend (static)') {
      steps {
        dir('frontend') {
          bat 'echo Frontend is static — no npm install required (skipped)'
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
    echo 'Deploying to local server (copy backend & start) — verbose mode...'
    bat '''
@echo off
REM Make console more readable in Jenkins logs and show commands
chcp 65001 >NUL 2>&1
setlocal ENABLEDELAYEDEXPANSION
echo ===== DEPLOY START: %DATE% %TIME% =====
echo WORKSPACE=%WORKSPACE%

REM helper: check errorlevel and print message then exit
:check
if NOT "%~1"=="" (
  set ERR=%ERRORLEVEL%
  if NOT "%ERR%"=="0" (
    echo ERROR: Step failed: %~1  (ERRORLEVEL=%ERR%)
    echo ===== DEPLOY ABORT =====
    exit /b %ERR%
  )
)
goto :eof

REM --- Kill any process currently listening on port 3000 ---
echo --- Step: kill processes on port 3000 (if any)
for /F "tokens=5" %%p in ('netstat -ano ^| findstr /R /C:":3000 " ^| findstr LISTENING') do (
  echo Found PID %%p on port 3000, attempting to kill...
  taskkill /PID %%p /F >NUL 2>&1
  echo taskkill returned ERRORLEVEL=%ERRORLEVEL%
)
call :check "kill-port-3000"

REM --- Prepare deploy directories ---
echo --- Step: prepare deploy folders
if not exist "C:\\deploy\\ci-cd-lab" mkdir "C:\\deploy\\ci-cd-lab"
if not exist "C:\\deploy\\ci-cd-lab\\backend" mkdir "C:\\deploy\\ci-cd-lab\\backend"
if not exist "C:\\deploy\\ci-cd-lab\\frontend" mkdir "C:\\deploy\\ci-cd-lab\\frontend"
call :check "mkdir-deploy-dirs"

REM --- Copy only backend and frontend contents from WORKSPACE using robocopy (delta copy) ---
echo --- Step: robocopy backend
robocopy "%WORKSPACE%\\backend" "C:\\deploy\\ci-cd-lab\\backend" /E /Z /R:3 /W:2 /XD node_modules .git .github
echo robocopy returned ERRORLEVEL=%ERRORLEVEL%
if %ERRORLEVEL% GEQ 8 (
  echo robocopy failed with code %ERRORLEVEL% (>=8 means failure)
  exit /b %ERRORLEVEL%
)
call :check "robocopy-backend"

echo --- Step: robocopy frontend
robocopy "%WORKSPACE%\\frontend" "C:\\deploy\\ci-cd-lab\\frontend" /E /Z /R:3 /W:2 /XD node_modules .git .github
echo robocopy returned ERRORLEVEL=%ERRORLEVEL%
if %ERRORLEVEL% GEQ 8 (
  echo robocopy failed with code %ERRORLEVEL%
  exit /b %ERRORLEVEL%
)
call :check "robocopy-frontend"

REM --- Git pull or clone in deploy dir (robust) ---
echo --- Step: update git in deploy dir
if exist "C:\\deploy\\ci-cd-lab\\.git" (
  echo Repo exists — fetching & resetting to origin/main
  git -C "C:\\deploy\\ci-cd-lab" fetch --all
  call :check "git-fetch"
  git -C "C:\\deploy\\ci-cd-lab" reset --hard refs/remotes/origin/main
  call :check "git-reset"
) else (
  echo Cloning repo to deploy dir
  rmdir /S /Q "C:\\deploy\\ci-cd-lab" 2>nul
  git clone https://github.com/UnityDeath/ci-cd-lab.git "C:\\deploy\\ci-cd-lab"
  call :check "git-clone"
)

REM --- Install backend deps only if package.json exists and changed ---
echo --- Step: check package.json and install deps if changed
cd /d C:\\deploy\\ci-cd-lab\\backend
if exist package.json (
  echo package.json found
  certutil -hashfile package.json SHA256 | findstr /v "hash" > C:\\deploy\\ci-cd-lab\\.cur_pkg_hash.txt
  if exist C:\\deploy\\ci-cd-lab\\.last_pkg_hash.txt (
    fc C:\\deploy\\ci-cd-lab\\.last_pkg_hash.txt C:\\deploy\\ci-cd-lab\\.cur_pkg_hash.txt >NUL
    if errorlevel 1 (
      echo package.json changed — installing dependencies...
      npm ci --production
      call :check "npm-ci"
      move /Y C:\\deploy\\ci-cd-lab\\.cur_pkg_hash.txt C:\\deploy\\ci-cd-lab\\.last_pkg_hash.txt
    ) else (
      echo package.json not changed — skipping npm install
      del C:\\deploy\\ci-cd-lab\\.cur_pkg_hash.txt >NUL 2>&1
    )
  ) else (
    echo first deploy: installing dependencies...
    npm ci --production
    call :check "npm-ci-first-deploy"
    move /Y C:\\deploy\\ci-cd-lab\\.cur_pkg_hash.txt C:\\deploy\\ci-cd-lab\\.last_pkg_hash.txt
  )
) else (
  echo package.json NOT found in deploy/backend — skipping npm install
)

REM --- Start backend in detached console and redirect logs to file ---
echo --- Step: start backend (detached), logs -> app.log
cd /d C:\\deploy\\ci-cd-lab\\backend
if exist package.json (
  echo Starting backend using npm start...
  start "" cmd /c "cd /d C:\\deploy\\ci-cd-lab\\backend && npm start > C:\\deploy\\ci-cd-lab\\backend\\app.log 2>&1"
  timeout /t 2 >NUL
  echo start returned
) else (
  echo Cannot start backend: package.json missing in deploy/backend
  exit /b 2
)

REM --- Quick check: did port appear? ---
echo --- Step: check if port 3000 opened
for /F "tokens=5" %%q in ('netstat -ano ^| findstr /R /C:":3000 " ^| findstr LISTENING') do set PORTPID=%%q
if defined PORTPID (
  echo Port 3000 is listening (PID=%PORTPID%)
) else (
  echo WARNING: port 3000 is not listening yet. Check app.log
  echo ===== Dump tail of app.log (if present) =====
  if exist C:\\deploy\\ci-cd-lab\\backend\\app.log (
    powershell -Command "Get-Content -Path 'C:\\deploy\\ci-cd-lab\\backend\\app.log' -Tail 200"
  ) else (
    echo app.log not found
  )
  exit /b 3
)

echo ===== DEPLOY SUCCESS =====
endlocal
exit /b 0
'''
  }
}
  }

  post {
    success { echo 'Deployment pipeline finished.' }
    failure { echo 'Pipeline failed — check console output.' }
  }
}