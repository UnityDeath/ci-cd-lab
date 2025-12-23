pipeline {
    agent any

    tools {
        nodejs "NodeJS"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install') {
            steps {
                bat 'npm install'
            }
        }

        stage('Test') {
            steps {
                bat 'npm test -- --coverage'
            }
        }

        stage('Deploy') {
  steps {
    echo 'Deploying to local server...'
    bat '''
    @echo off
    setlocal

    REM --- Попытка найти и убить процессы, слушающие порт 3000 ---
    set KILLED=0
    for /F "tokens=5" %%p in ('netstat -ano ^| findstr :3000') do (
      echo Found PID %%p on port 3000, attempting to kill...
      taskkill /PID %%p /F
      if %ERRORLEVEL%==0 ( set KILLED=1 ) else ( echo Failed to kill PID %%p or it was already gone )
    )
    if "%KILLED%"=="0" echo No process found on port 3000

    REM --- Копируем файлы в папку деплоя (создаём, если нужно) ---
    if not exist "C:\\deploy\\ci-cd-lab" mkdir "C:\\deploy\\ci-cd-lab"
    xcopy /E /I /Y "%WORKSPACE%\\*" "C:\\deploy\\ci-cd-lab\\"

    REM --- Устанавливаем зависимости в папке деплоя ---
    cd /d C:\\deploy\\ci-cd-lab
    npm install

    REM --- Запускаем приложение в отдельной консоли (чтобы процесс не убивался Jenkins'ом) ---
    start "" cmd /c "cd /d C:\\deploy\\ci-cd-lab && npm start"

    endlocal
    exit /b 0
    '''
  }
}
    }
}
