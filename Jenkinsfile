pipeline {
  agent any
  environment {
    DOCKERHUB_CREDENTIALS = credentials('dockerhub-login-pocable')
  }

  stages {

    stage('build') {
      steps {
        script {
          if(env.BRANCH_NAME == 'master'){
            sh 'docker build -t pocable/jdrd-web-application:latest .'
          } else if(env.BRANCH_NAME == 'beta'){
            sh 'docker build -t pocable/jdrd-web-application:edge .'
          } else {
            sh 'docker build -t pocable/jdrd-web-application .'
          }
        }
      }
    }

    stage('login') {
      steps {
        sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
      }
    }
    
    stage('deploy') {
      steps {
        script {
          if(env.BRANCH_NAME == 'master'){
            sh 'docker push pocable/jdrd-web-application:latest'
          } else if(env.BRANCH_NAME == 'beta'){
            sh 'docker push pocable/jdrd-web-application:edge'
          } else {
            echo 'Branch is not master/beta. Skipping deploy.'
          }
        }
      }
    }
  }

  post {
    always {
      sh 'docker logout'
    }
  }
}