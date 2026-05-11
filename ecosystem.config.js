module.exports = {
  apps: [{
    name: 'arthomoro-demo',
    cwd: '/var/www/arthomoro-demo',
    script: '.next/standalone/server.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: '3110',
      HOSTNAME: '127.0.0.1',
      DATABASE_URL: 'file:/var/www/arthomoro-demo/data/prod.db',
      NEXTAUTH_URL: 'https://yourmoonkey.com/arthomoro-demo',
      NEXTAUTH_SECRET: 'arthomoro-prod-secret-please-rotate-c8a96e-2025',
      NEXT_PUBLIC_BASE_PATH: '/arthomoro-demo',
      NEXT_PUBLIC_WA_NUMBER: '6281234567890',
      NEXT_PUBLIC_SITE_NAME: 'Arthomoro Jaya Sentosa',
    },
    max_memory_restart: '512M',
    autorestart: true,
    watch: false,
  }],
}
