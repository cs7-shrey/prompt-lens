module.exports = {
    apps: [{
        name: 'prompt-lens-server',
        script: './dist/index.mjs',
        interpreter: 'bun',
        instances: 1,
        env: {
            NODE_ENV: 'production',
            DISPLAY: ':1'
        },
        restart_delay: 3000,
        max_restarts: 10
    }]
};