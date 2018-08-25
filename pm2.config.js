// http://pm2.keymetrics.io/docs/usage/cluster-mode/

module.exports = {
    apps: [{
        name: 'unison-api',
        script: 'index.js',
        instances: '-1',
        exec_mode: 'cluster',
        max_memory_restart: '300M',
        env: {
            NODE_ENV: 'development',
        },
        env_production: {
            NODE_ENV: 'production',
        },
    }],
};
