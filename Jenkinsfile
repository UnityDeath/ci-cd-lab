pipeline {
  agent any

  // Если у тебя не настроен NodeJS в Global Tool Config, убери блок tools
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
          bat 'echo Frontend is static — skipping build (if you need build, run npm.cmd install && npm.cmd run build)'
          // если нужна сборка, раскомментируй:
          // bat 'npm.cmd install'
          // bat 'npm.cmd run build'
        }
      }
    }

    stage('Test Backend') {
      steps {
        dir('backend') {
          bat 'echo Running backend tests (if configured)...'
          // если нет тестов — заменяй на команду которая не падает, либо оставь.
          bat 'if exist package.json (npm.cmd test) else (echo No package.json — skipping tests)'
        }
      }
    }

    stage('Deploy') {
      steps {
        echo 'Deploy: copy backend+frontend to C:\\deploy\\ci-cd-lab and start backend (simple)'
        bat '''
@echo off
REM Простая копировка (перезапись)
if not exist "C:\deploy\ci-cd-lab" mkdir "C:\deploy\ci-cd-lab"
if not exist "C:\deploy\ci-cd-lab\backend" mkdir "C:\deploy\ci-cd-lab\backend"
if not exist "C:\deploy\ci-cd-lab\frontend" mkdir "C:\deploy\ci-cd-lab\frontend"

xcopy /E /I /Y "%WORKSPACE%\\backend\\*" "C:\\deploy\\ci-cd-lab\\backend\\"
xcopy /E /I /Y "%WORKSPACE%\\frontend\\*" "C:\\deploy\\ci-cd-lab\\frontend\\"

REM Установить production-зависимости (если есть package.json)
cd /d C:\deploy\ci-cd-lab\backend
if exist package.json (
  echo Installing production deps...
  if exist package-lock.json ( npm.cmd ci --production ) else ( npm.cmd install --production )
) else (
  echo No package.json in deploy/backend — skipping install.
)

REM Попытка остановить старый процесс на 3000 (если был)
for /F "tokens=5" %%p in ('netstat -ano ^| findstr :3000') do (
  echo Killing PID %%p
  taskkill /PID %%p /F >NUL 2>&1
)

REM Запуск в отдельном окне (чтобы Jenkins не убивал процесс), логи в app.log
start "" cmd /c "cd /d C:\deploy\ci-cd-lab\backend && npm.cmd start > C:\deploy\ci-cd-lab\backend\app.log 2>&1"

echo Deploy finished. Check C:\deploy\ci-cd-lab\backend\app.log
'''
      }
    }
  }

  post {
    success { echo 'Pipeline finished successfully.' }
    failure { echo 'Pipeline failed — смотри console output.' }
  }
}