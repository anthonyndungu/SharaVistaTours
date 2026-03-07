#!/bin/bash

echo "Building sharavista toursfrontend..."

npm run build

echo "Creating remote directory (if missing)..."

ssh anto@158.220.127.231 'sudo mkdir -p /var/www/tours-frontend && sudo chown -R anto:anto /var/www/tours-frontend'

echo "Uploading to server..."

scp -r dist/. anto@158.220.127.231:/var/www/tours-frontend/

echo "Reloading Nginx..."

ssh anto@158.220.127.231 'sudo nginx -t && sudo systemctl reload nginx'

echo "✅ Frontend deployed!"