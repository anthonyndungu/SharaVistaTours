# ============================================
# HTTP → HTTPS Redirect (Port 80)
# ============================================
server {
    listen 80;
    server_name tours.mogulafric.com;

    # Redirect ALL HTTP traffic to HTTPS
    return 301 https://tours.mogulafric.com$request_uri;
}

# ============================================
# HTTPS Server (Port 443) - Production Ready
# ============================================
server {
    listen 443 ssl;
    server_name tours.mogulafric.com;

    # 🔐 SSL Certificate (NEW PATHS FROM CERTBOT)
    ssl_certificate /etc/letsencrypt/live/tours.mogulafric.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tours.mogulafric.com/privkey.pem;
    
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # 🔒 Security Headers (Applied to all responses)
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # 📦 Gzip Compression for Faster Loads
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml+rss image/svg+xml;
    gzip_comp_level 6;

    # 🌐 Frontend SPA (React/Vite)
    location / {
        root /var/www/tours-frontend;
        try_files $uri $uri/ /index.html;
        index index.html;

        # Re-apply headers here to ensure they stick during internal redirects (try_files)
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;

        # Cache static assets (images, css, js) for 1 year
        location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot|map)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
            add_header X-Content-Type-Options "nosniff" always;
            access_log off;
        }

        # No cache for HTML files (ensure users always get the latest app version)
        location ~* \.html$ {
            add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0";
            add_header X-Frame-Options "SAMEORIGIN" always;
        }
    }

    # 🔗 Backend API Proxy (/api/* → Node/Express on port 5000)
    location /api/ {
        proxy_pass http://127.0.0.1:5000;

        # Essential proxy headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket support (if needed later)
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 120s;
        proxy_read_timeout 120s;

        # Disable buffering for real-time responses (important for SSE/WebSockets)
        proxy_buffering off;
    }

    # 📁 Static Uploads (Secure Serving)
    location /uploads/ {
        alias /opt/tours/backend/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header X-Content-Type-Options "nosniff" always;

        # 🔒 Block script execution in uploads folder (Security Critical)
        location ~* \.(php|py|pl|rb|cgi|asp|jsp|exe|bat|sh|phtml)$ {
            deny all;
            return 403;
        }

        # Block direct access to sensitive file types
        location ~* \.(env|log|sql|db|sqlite)$ {
            deny all;
            return 403;
        }
    }

    # 🔐 Deny access to hidden files (.git, .env, .htaccess, etc.)
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }

    # 🚫 Deny access to sensitive backend paths if accidentally exposed
    location ~* /(config|\.git|\.env|node_modules|vendor|storage|logs) {
        deny all;
        return 403;
    }

    # 📊 Custom error pages (Optional)
    error_page 404 /index.html;
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
        internal;
    }
}
