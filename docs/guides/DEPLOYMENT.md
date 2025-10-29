# 🚀 Deployment Guide

Complete guide for deploying the IPL Auction Portal to production.

## 📋 Pre-Deployment Checklist

### Security
- [ ] Change all default passwords
- [ ] Update JWT_SECRET to strong random value
- [ ] Configure CORS for production domain
- [ ] Enable HTTPS/SSL certificates
- [ ] Set NODE_ENV to 'production'
- [ ] Review and update rate limits
- [ ] Enable additional security headers

### Database
- [ ] Backup SQLite database
- [ ] Consider migrating to PostgreSQL for production
- [ ] Set up automated backups
- [ ] Configure database access restrictions

### Configuration
- [ ] Update environment variables
- [ ] Configure production API URL in frontend
- [ ] Set up monitoring and logging
- [ ] Configure error reporting (e.g., Sentry)

---

## 🔧 Environment Configuration

### Backend (.env)

```bash
# Server Configuration
NODE_ENV=production
PORT=5000

# Database (SQLite)
DATABASE_PATH=./database.sqlite

# JWT Configuration
JWT_SECRET=<generate-strong-random-secret>  # Use: openssl rand -base64 64
JWT_EXPIRY=7d

# CORS Configuration
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Rate Limiting
AUTH_RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
AUTH_RATE_LIMIT_MAX_REQUESTS=5

# Logging
LOG_LEVEL=info
LOG_FILE_PATH=./logs/app.log
```

### Frontend (.env)

```bash
# API Configuration
VITE_API_URL=https://api.yourdomain.com
VITE_WS_URL=wss://api.yourdomain.com

# Environment
VITE_ENV=production
```

---

## 🐳 Docker Deployment

### Create Dockerfile (Backend)

```dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node healthcheck.js || exit 1

# Start server
CMD ["node", "server.postgres.js"]
```

### Create Dockerfile (Frontend)

```dockerfile
# frontend/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build for production
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - JWT_SECRET=${JWT_SECRET}
    volumes:
      - ./backend/database.sqlite:/app/database.sqlite
      - ./backend/logs:/app/logs
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "node", "healthcheck.js"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped
```

### Deploy with Docker

```bash
# Build and start
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop
docker-compose down

# Restart
docker-compose restart
```

---

## ☁️ Cloud Platform Deployment

### Heroku Deployment

#### 1. Install Heroku CLI
```bash
npm install -g heroku
heroku login
```

#### 2. Prepare Backend
```bash
cd backend

# Create Heroku app
heroku create ipl-auction-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=$(openssl rand -base64 64)
heroku config:set ALLOWED_ORIGINS=https://ipl-auction-frontend.herokuapp.com

# Create Procfile
echo "web: node server.postgres.js" > Procfile

# Deploy
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

#### 3. Prepare Frontend
```bash
cd frontend

# Create Heroku app
heroku create ipl-auction-frontend

# Set build pack
heroku buildpacks:set heroku/nodejs

# Add static buildpack
heroku buildpacks:add https://github.com/heroku/heroku-buildpack-static

# Create static.json
cat > static.json << EOF
{
  "root": "dist/",
  "clean_urls": true,
  "routes": {
    "/**": "index.html"
  }
}
EOF

# Deploy
git add .
git commit -m "Deploy frontend"
git push heroku main
```

---

### AWS Deployment (EC2)

#### 1. Launch EC2 Instance
- Choose Ubuntu Server 22.04 LTS
- Instance type: t2.medium or higher
- Configure security group:
  - SSH (22) - Your IP
  - HTTP (80) - 0.0.0.0/0
  - HTTPS (443) - 0.0.0.0/0
  - Custom TCP (5000) - 0.0.0.0/0

#### 2. Connect and Setup
```bash
# SSH into instance
ssh -i your-key.pem ubuntu@your-instance-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx
```

#### 3. Deploy Backend
```bash
# Clone repository
git clone https://github.com/sanjaynesan-05/AUCTION-PORTAL.git
cd AUCTION-PORTAL/backend

# Install dependencies
npm ci --only=production

# Create .env file
nano .env
# (Add production environment variables)

# Initialize database
npm run init-db

# Start with PM2
pm2 start server.postgres.js --name ipl-auction-api
pm2 startup
pm2 save
```

#### 4. Deploy Frontend
```bash
cd ../frontend

# Install dependencies
npm ci

# Build
npm run build

# Copy to Nginx
sudo cp -r dist/* /var/www/html/
```

#### 5. Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/default
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket
    location /socket.io {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

```bash
# Test and reload Nginx
sudo nginx -t
sudo systemctl reload nginx
```

#### 6. Setup SSL with Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

### Digital Ocean Deployment

#### 1. Create Droplet
- Choose Ubuntu 22.04
- Plan: Basic ($12/month minimum)
- Add SSH key

#### 2. Follow AWS EC2 steps 2-6

---

## 🔐 Production Security Hardening

### 1. Change Default Passwords

```bash
cd backend

# Update init-database.js
# Change default passwords before initializing
```

### 2. Generate Strong JWT Secret

```bash
# Linux/Mac
openssl rand -base64 64

# Windows (PowerShell)
[Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Maximum 256 }))
```

### 3. Configure Firewall

```bash
# Ubuntu UFW
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw allow 5000/tcp  # Backend (if needed externally)
```

### 4. Setup Fail2Ban

```bash
sudo apt install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 5. Enable HTTPS Only

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$host$request_uri;
}
```

---

## 📊 Monitoring & Logging

### Setup PM2 Monitoring

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7

# Monitor
pm2 monit
```

### Winston Logging

Backend already has Winston configured. Logs are in `backend/logs/`:
- `error.log` - Error logs
- `combined.log` - All logs

### Setup Error Tracking (Sentry)

```bash
npm install @sentry/node

# In server.postgres.js
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});
```

---

## 💾 Backup Strategy

### Automated Database Backup

```bash
# Create backup script
cat > backup-db.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_PATH="./backend/database.sqlite"

# Create backup
cp $DB_PATH $BACKUP_DIR/database_$DATE.sqlite

# Keep only last 7 days
find $BACKUP_DIR -name "database_*.sqlite" -mtime +7 -delete
EOF

chmod +x backup-db.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add: 0 2 * * * /path/to/backup-db.sh
```

---

## 🔄 CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install Backend Dependencies
        run: cd backend && npm ci
      
      - name: Install Frontend Dependencies
        run: cd frontend && npm ci
      
      - name: Build Frontend
        run: cd frontend && npm run build
      
      - name: Deploy to Server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/auction-portal
            git pull
            cd backend && npm ci --only=production
            cd ../frontend && npm run build
            pm2 restart ipl-auction-api
            sudo cp -r frontend/dist/* /var/www/html/
```

---

## 🧪 Post-Deployment Testing

```bash
# Test API
curl https://api.yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"new-admin-password"}'

# Test WebSocket
wscat -c wss://api.yourdomain.com

# Check SSL
curl -I https://yourdomain.com
```

---

## 📞 Troubleshooting

### Backend Won't Start
```bash
# Check logs
pm2 logs ipl-auction-api

# Check port availability
netstat -tulpn | grep 5000

# Restart
pm2 restart ipl-auction-api
```

### Database Issues
```bash
# Check database file
ls -lh backend/database.sqlite

# Reinitialize (CAUTION: Deletes data)
cd backend && npm run init-db
```

### SSL Certificate Issues
```bash
# Renew certificate
sudo certbot renew

# Check expiry
sudo certbot certificates
```

---

## 🔗 Related Documentation

- [Backend Setup](../setup/BACKEND-SETUP.md) - Backend configuration
- [Frontend Setup](../setup/FRONTEND-SETUP.md) - Frontend configuration
- [Testing Guide](TESTING.md) - Testing before deployment
- [Quick Start](../setup/QUICK-START.md) - Local development

---

**Last Updated**: January 30, 2025  
**Target Platforms**: AWS EC2, Heroku, Digital Ocean  
**Status**: ✅ Production Ready
