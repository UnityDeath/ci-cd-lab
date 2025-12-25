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

          bat 'if exist package-lock.json (npm.cmd ci) else (npm.cmd install)'
        }
      }
    }

    stage('Build Frontend') {
      steps {
          bat 'echo Frontend: static (skipped). If you need build: npm.cmd install && npm.cmd run build'
        }
      }
    }

    stage('Test Backend') {
      steps {
        dir('backend') {
          bat 'echo Run backend tests (if configured)...'
          bat 'if exist package.json (npm.cmd test) else (echo No package.json — skipping tests)'
        }
      }
    }

    stage('Deploy') {
      steps {
        echo 'Deploy: copy backend+frontend to C:\\deploy\\ci-cd-lab and start backend'
        bat '''
          @echo off
          REM --- Создаём папки (если нет)
          if not exist "C:\deploy\ci-cd-lab" mkdir "C:\deploy\ci-cd-lab"
          if not exist "C:\deploy\ci-cd-lab\backend" mkdir "C:\deploy\ci-cd-lab\backend"
          if not exist "C:\deploy\ci-cd-lab\frontend" mkdir "C:\deploy\ci-cd-lab\frontend"

          REM --- Копируем файлы (простая перезапись)
          xcopy /E /I /Y "%WORKSPACE%\\backend\\*" "C:\\deploy\\ci-cd-lab\\backend\\"
          xcopy /E /I /Y "%WORKSPACE%\\frontend\\*" "C:\\deploy\\ci-cd-lab\\frontend\\"

          REM --- Устанавливаем зависимости в папке deploy/backend (если package.json есть) ---
          cd /d C:\deploy\ci-cd-lab\backend
          if exist package.json (
            echo Installing production deps in deploy/backend...
            if exist package-lock.json ( npm.cmd ci --production ) else ( npm.cmd install --production )
          ) else (
            echo No package.json in deploy/backend — skipping install.
          )

          REM --- Перезапускаем backend (в фоне) и пишем логи в app.log ---
          REM Сначала пытаемся убить процесс на порту 3000 (если есть)
          for /F "tokens=5" %%p in ('netstat -ano ^| findstr :3000') do (
            echo Killing PID %%p
            taskkill /PID %%p /F >NUL 2>&1
          )

          REM Запуск в отдельном окне, чтобы Jenkins не убивал процесс после завершения job
          start "" cmd /c "cd /d C:\deploy\ci-cd-lab\backend && npm.cmd start > C:\deploy\ci-cd-lab\backend\app.log 2>&1"

          echo Deploy finished. Backend logs: C:\deploy\ci-cd-lab\backend\app.log
          '''
      }
    }
  }

  post {
    success { echo 'Pipeline finished successfully.' }
    failure { echo 'Pipeline failed — check console output.' }
  }
}