pipeline {
    agent any

    tools {
        nodejs "NodeJS"
    }

    stages {

        stage('Install Backend') {
            steps {
                dir('backend') { // заходим в папку backend
                    bat 'npm install'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') { // заходим в папку frontend
                    bat 'npm install'
                    // bat 'npm run build' если есть сборка
                }
            }
        }

        stage('Test Backend') {
            steps {
                dir('backend') {
                    bat 'npm test'
                }
            }
        }

        
    }
}
