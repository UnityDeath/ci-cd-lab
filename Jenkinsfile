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
          bat 'echo Frontend: static — skipped'
          // если нужен build, раскомментируй:
          // bat 'npm.cmd install'
          // bat 'npm.cmd run build'
        }
      }
    }

    stage('Test Backend') {
      steps {
        dir('backend') {
          bat 'if exist package.json (npm.cmd test) else (echo No package.json — skipping tests)'
        }
      }
    }

    stage('Deploy') {
      steps {
        script {
          // Получаем абсолютный путь к workspace
          def workspacePath = pwd()
          
          bat """
            @echo off
            set WORKSPACE=${workspacePath}
            
            echo Рабочая директория: %WORKSPACE%
            
            REM Создаем директорию для деплоя
            if not exist "C:\\deploy\\ci-cd-lab" mkdir "C:\\deploy\\ci-cd-lab"
            if not exist "C:\\deploy\\ci-cd-lab\\backend" mkdir "C:\\deploy\\ci-cd-lab\\backend"
            if not exist "C:\\deploy\\ci-cd-lab\\frontend" mkdir "C:\\deploy\\ci-cd-lab\\frontend"
            
            REM Копируем файлы из workspace
            echo Копируем backend...
            xcopy /E /I /Y "%WORKSPACE%\\backend\\*" "C:\\deploy\\ci-cd-lab\\backend\\"
            
            echo Копируем frontend...
            xcopy /E /I /Y "%WORKSPACE%\\frontend\\*" "C:\\deploy\\ci-cd-lab\\frontend\\"
            
            REM Устанавливаем зависимости бэкенда
            cd /d C:\\deploy\\ci-cd-lab\\backend
            if exist package.json (
              echo Устанавливаем зависимости бэкенда...
              if exist package-lock.json (
                npm.cmd ci --production
              ) else (
                npm.cmd install --production
              )
              echo Зависимости установлены
            ) else (
              echo No package.json — skipping install
            )
            
            REM Останавливаем старый процесс на порту 3000
            echo Останавливаем старый процесс на порту 3000...
            for /F "tokens=5" %%p in ('netstat -ano ^| findstr :3000') do (
              echo Найден процесс с PID %%p, останавливаем...
              taskkill /PID %%p /F >NUL 2>&1
            )
            
            REM Даем время на завершение
            timeout /t 2 /nobreak >nul
            
            REM Запускаем бэкенд
            echo Запускаем бэкенд...
            cd /d C:\\deploy\\ci-cd-lab\\backend
            
            REM Проверяем есть ли скрипт start в package.json
            if exist package.json (
              echo Запускаем npm start...
              start "" /B cmd /c "npm.cmd start > C:\\deploy\\ci-cd-lab\\backend\\app.log 2>&1"
            ) else (
              echo Ищем app.js или server.js...
              if exist app.js (
                start "" /B cmd /c "node app.js > C:\\deploy\\ci-cd-lab\\backend\\app.log 2>&1"
              ) else if exist server.js (
                start "" /B cmd /c "node server.js > C:\\deploy\\ci-cd-lab\\backend\\app.log 2>&1"
              ) else (
                echo Не найден файл для запуска!
                exit /b 1
              )
            )
            
            echo Ждем запуска сервера...
            timeout /t 5 /nobreak >nul
            
            REM Проверяем, что сервер запустился
            echo Проверяем доступность сервера...
            curl -f http://localhost:3000
            if %errorlevel% equ 0 (
              echo ✓ Сервер успешно запущен на http://localhost:3000
            ) else (
              echo ✗ Сервер не отвечает на порту 3000
              echo Последние строки лога:
              type C:\\deploy\\ci-cd-lab\\backend\\app.log | tail -5
              exit /b 1
            )
            
            echo Деплой завершен успешно!
            echo Файлы расположены в: C:\\deploy\\ci-cd-lab
            echo Логи приложения: C:\\deploy\\ci-cd-lab\\backend\\app.log
          """
        }
      }
    }
  }

  post {
    success { 
      echo 'Pipeline finished successfully.' 
      echo 'Backend доступен по адресу: http://localhost:3000'
    }
    failure { 
      echo 'Pipeline failed — см. console output.' 
      echo 'Для диагностики проверьте: C:\\deploy\\ci-cd-lab\\backend\\app.log'
    }
  }
}