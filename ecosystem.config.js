module.exports = {
    apps: [
        {
            name: 'strapi',
            cwd: './apps/backend',
            script: 'npm',
            args: 'start',
            env: {
                NODE_ENV: 'production',
            },
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
        },
        {
            name: 'frontend',
            cwd: './apps/frontend',
            script: 'npm',
            args: 'start',
            env: {
                NODE_ENV: 'production',
                PORT: 3000,
            },
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
        },
        {
            name: 'ai-api',
            cwd: './apps/ai-api',
            script: 'node',
            args: 'index.js',
            env: {
                NODE_ENV: 'production',
                PORT: 3001,
            },
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '500M',
        },
        {
            name: 'ai-studio',
            cwd: './apps/ai-studio',
            script: 'npm',
            args: 'run preview',
            env: {
                NODE_ENV: 'production',
                PORT: 3002,
            },
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '300M',
        },
    ],
};
