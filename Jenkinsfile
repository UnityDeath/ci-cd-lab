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
        script {
          // Просто копируем файлы и даем инструкции для запуска
          bat '''
            @echo off
            echo ===== DEPLOYMENT =====
            echo 1. Creating deployment directory...
            
            if not exist "C:\\deploy\\ci-cd-lab" mkdir "C:\\deploy\\ci-cd-lab"
            if not exist "C:\\deploy\\ci-cd-lab\\backend" mkdir "C:\\deploy\\ci-cd-lab\\backend"
            if not exist "C:\\deploy\\ci-cd-lab\\frontend" mkdir "C:\\deploy\\ci-cd-lab\\frontend"
            
            echo 2. Copying backend files...
            xcopy /E /I /Y "backend\\*" "C:\\deploy\\ci-cd-lab\\backend\\"
            
            echo 3. Copying frontend files...
            xcopy /E /I /Y "frontend\\public\\*" "C:\\deploy\\ci-cd-lab\\frontend\\" 2>nul || xcopy /E /I /Y "frontend\\*" "C:\\deploy\\ci-cd-lab\\frontend\\"
            
            echo 4. Installing backend dependencies...
            cd /d C:\\deploy\\ci-cd-lab\\backend
            if exist package.json (
              npm.cmd install
            )
            
            echo ===== DEPLOYMENT COMPLETE =====
            echo 
            echo To start the backend server manually:
            echo 1. Open Command Prompt as Administrator
            echo 2. Run: cd /d C:\\deploy\\ci-cd-lab\\backend
            echo 3. Run: npm start
            echo 
            echo To start the frontend server:
            echo 1. Open another Command Prompt
            echo 2. Run: cd /d C:\\deploy\\ci-cd-lab\\frontend
            echo 3. Run: npx http-server -p 8082
            echo 
            echo Backend will run on: http://localhost:8081
            echo Frontend will run on: http://localhost:8082
            echo 
            echo Files are ready at: C:\\deploy\\ci-cd-lab
          '''
        }
      }
    }
    
    stage('Start Servers (Optional)') {
      steps {
        script {
          // Просто сообщение, не запускаем серверы автоматически
          echo 'NOTE: Jenkins cannot keep servers running after pipeline completes.'
          echo 'To test your application:'
          echo '1. Open Command Prompt'
          echo '2. Navigate to C:\\deploy\\ci-cd-lab\\backend'
          echo '3. Run: npm start'
          echo '4. Open another Command Prompt'
          echo '5. Navigate to C:\\deploy\\ci-cd-lab\\frontend'
          echo '6. Run: npx http-server -p 8082'
        }
      }
    }
    
    stage('Wait for Manual Test') {
      steps {
        echo 'Waiting 120 seconds... You can manually start servers to test.'
        echo 'After pipeline finishes, servers must be started manually.'
        script {
          sleep(time: 120, unit: 'SECONDS')
        }
        echo 'Waiting period ended.'
      }
    }
  }

  post {
    success { 
      echo 'Pipeline finished successfully.' 
      echo 'Files are deployed to: C:\\deploy\\ci-cd-lab'
      echo ''
      echo 'To start servers manually:'
      echo 'Backend: cd /d C:\\deploy\\ci-cd-lab\\backend && npm start'
      echo 'Frontend: cd /d C:\\deploy\\ci-cd-lab\\frontend && npx http-server -p 8082'
    }
    failure { 
      echo 'Pipeline failed - see errors above.' 
    }
  }
}