module.exports = {
  apps : [{
    name: 'API-production',
    script: 'src/index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],
  deploy : {
    production : {
      key  : '~/.ssh/robotagro',
      user : 'root',
      host : '66.97.36.28',
      port: "5822",
      ref  : 'origin/master',
      repo : 'https://gitlab+deploy-token-35582:8HFxUNbMNvqczJhvGPq3@gitlab.com/intelliDrone/api.git',
      path : '/root/NodeApps/api-production',
      ssh_options : ["StrictHostKeyChecking=no", "PasswordAuthentication=no"],
      'post-deploy' : 'npm install && pm2 reload ecosystem.local.config.js --env production'
    }
  }
};
