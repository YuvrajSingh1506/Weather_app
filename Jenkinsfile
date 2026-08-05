pipeline{
    agent {label 'agent-1'}
    stages{
        stage("Code"){
            steps{
                 echo "Cloning github repo"
                 git url :'https://github.com/YuvrajSingh1506/Weather_app.git', branch : 'main'
            }
        }
        stage("Build"){
            steps{
                echo "Building repo"
                sh "docker build . -t yuvi7976/weather-app-test:latest"
            }
        }
        stage("Push"){
            steps{
                withCredentials([usernamePassword(credentialsId : 'dockerHb',passwordVariable : 'dockerHbPassword', usernameVariable:'dockerHbUser')]){
                    sh "docker login -u ${env.dockerHbUser} -p ${env.dockerHbPassword}"
                    sh 'docker push yuvi7976/weather-app-test:latest'
                }
            }
        }
        stage("Test"){
            steps{
                echo "Testing new Build "
            }
        }
        stage("Deploy"){
            steps{
                 echo "Deploying new build"
                sh "docker compose down && docker compose up -d --no-deps --build frontend" 
                
            }
        }
    }
}
