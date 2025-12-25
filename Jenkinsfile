pipeline {
  agent any

  // если в Jenkins не настроен NodeJS — закомментируй/удали этот блок
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
        // вызываем внешний .bat — никаких длинных блоков с \ внутри Jenkinsfile
        bat 'call "%WORKSPACE%\\scripts\\deploy.bat"'
      }
    }
  }

  post {
    success { echo 'Pipeline finished successfully.' }
    failure { echo 'Pipeline failed — см. console output.' }
  }
}
