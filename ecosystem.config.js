module.exports = {
  apps : [{
    name: 'API-${TARGET_SERVER}',
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
      key  : 'keys/server.pub',
      user : 'root',
      host : '66.97.36.28',
      port: "5822",
      ref  : 'origin/${BRANCH}',
      repo : 'https://${GITLAB_USER}:${GITLAB_PASS}@gitlab.com/intelliDrone/api.git',
      path : '/root/NodeApps/api-${TARGET_SERVER}',
      ssh_options : ["StrictHostKeyChecking=no", "PasswordAuthentication=no"],
      'post-deploy' : 'npm install && pm2 reload ecosystem.local.config.js --env production'
    }
  }
};
