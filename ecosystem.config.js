module.exports = {
    apps: [
        {
            name: 'quan-ly-nha-thuoc',
            script: 'npm run start',
            out_file: "./front-end-out.log",
            error_file: "./front-end-error.log",
            log_date_format: "DD-MM HH:mm:ss Z",
            env: {
                NODE_ENV: 'development',
                PORT: 4300
            },
            env_production: {
                NODE_ENV: 'production',
                PORT: 4300
            },
        },
    ],
}