#!/usr/bin/env bash
# Deploy script for Arthomoro Jaya Sentosa on VPS yourmoonkey.com/arthomoro-demo
# Usage (from local): bash scripts/deploy.sh
set -euo pipefail

VPS="root@46.250.230.62"
REMOTE="/var/www/arthomoro-demo"
REPO="https://github.com/monkey-one/arthomoro-jaya-sentosa-web.git"
BRANCH="${1:-main}"

ssh "$VPS" bash -s <<EOF
set -euo pipefail

mkdir -p "$REMOTE"
cd "$REMOTE"

if [ ! -d .git ]; then
  git clone "$REPO" .
else
  git fetch origin
  git checkout "$BRANCH"
  git reset --hard "origin/$BRANCH"
fi

# Write .env
cat > .env <<ENVEOF
DATABASE_URL="file:./prisma/prod.db"
NEXTAUTH_URL="https://yourmoonkey.com/arthomoro-demo"
NEXTAUTH_SECRET="arthomoro-prod-secret-please-rotate-c8a96e-2025"
NEXT_PUBLIC_BASE_PATH="/arthomoro-demo"
NEXT_PUBLIC_WA_NUMBER="6281234567890"
NEXT_PUBLIC_SITE_NAME="Arthomoro Jaya Sentosa"
ENVEOF

npm ci --no-audit --no-fund

# Seed if DB doesn't exist yet
if [ ! -f prisma/prod.db ]; then
  npx prisma db push --skip-generate
  npm run db:seed
fi

npm run build

# Copy standalone deps
cp -r .next/static .next/standalone/.next/static 2>/dev/null || true
cp -r public .next/standalone/public 2>/dev/null || true
cp prisma/prod.db .next/standalone/prisma/prod.db 2>/dev/null || true
mkdir -p .next/standalone/prisma
cp -f prisma/prod.db .next/standalone/prisma/prod.db 2>/dev/null || true

# Restart PM2
pm2 reload arthomoro-demo --update-env 2>/dev/null || pm2 start ecosystem.config.js
pm2 save

EOF

echo "✔ Deploy selesai."
