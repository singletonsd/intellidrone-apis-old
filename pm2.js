module.exports = {
  apps : [{
    name: 'API',
    script: 'index.js',
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
      key : 'keys/gitlab-deploy.pub',
      user : 'root',
      host : '66.97.36.28',
      ref  : 'origin/master',
      repo : 'git@gitlab.com:intelliDrone/api.git',
      path : '/root/NodeApps/api',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
