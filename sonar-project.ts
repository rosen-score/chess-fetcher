const sonarqubeScanner = require('sonarqube-scanner')

sonarqubeScanner(
    {
        serverUrl: process.env.SONAR_SERVER || 'http://localhost:9000',
        token: process.env.SONAR_TOKEN || '',
        options: {},
    }
)
