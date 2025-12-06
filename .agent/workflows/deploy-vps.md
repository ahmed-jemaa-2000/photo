---
description: Complete VPS deployment guide for Brandini platform on Ubuntu 24.04 LTS
---

# Brandini VPS Deployment Guide

## Prerequisites
- VPS with Ubuntu 24.04 LTS
- SSH access (root or sudo user)
- Domain name pointed to VPS IP
- MongoDB Atlas connection string ready


---

## Phase 0: DNS Configuration (Do this first!)

Log in to your domain registrar (e.g., Hostinger) and update your DNS records.
Replace `YOUR_VPS_IP` with the actual IP address of your OVH VPS (e.g., `51.x.x.x`).

| Type | Name | Content/Target | TTL | Note |
|------|------|----------------|-----|------|
| A    | @    | `YOUR_VPS_IP`  | 300 | Points main domain to VPS |
| A    | *    | `YOUR_VPS_IP`  | 300 | **Critical**: Points ALL subdomains (api, studio, customer shops) to VPS |

> **Important**: Delete any existing `A` records that point to "parking" IPs (like `84.32.84.32`).
> Delete the existing `CNAME` for `www` if you want, or leave it. The `*` record covers everything else.

---

## Phase 1: Initial Server Setup

### 1.1 Connect to VPS
```bash
ssh root@YOUR_VPS_IP
```

### 1.2 Update System
// turbo
```bash
apt update && apt upgrade -y
```

### 1.3 Create Deploy User (Security)
```bash
adduser brandini
usermod -aG sudo brandini
```

### 1.4 Setup SSH for deploy user
```bash
mkdir -p /home/brandini/.ssh
cp ~/.ssh/authorized_keys /home/brandini/.ssh/
chown -R brandini:brandini /home/brandini/.ssh
chmod 700 /home/brandini/.ssh
chmod 600 /home/brandini/.ssh/authorized_keys
```

### 1.5 Install Essential Tools
// turbo
```bash
apt install -y curl git build-essential unzip htop
```

---

## Phase 2: Install Node.js 20 LTS

// turbo
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs
```

Verify:
// turbo
```bash
node --version  # Should show v20.x.x
npm --version
```

Install PM2 globally:
// turbo
```bash
npm install -g pm2
```

---

## Phase 3: Install PostgreSQL 16

// turbo
```bash
apt install -y postgresql postgresql-contrib
```

### 3.1 Create Database & User
```bash
sudo -u postgres psql
```

Inside PostgreSQL:
```sql
CREATE USER brandini_user WITH PASSWORD 'YOUR_SECURE_PASSWORD';
CREATE DATABASE brandini OWNER brandini_user;
GRANT ALL PRIVILEGES ON DATABASE brandini TO brandini_user;
\q
```

---

## Phase 4: Install Nginx

// turbo
```bash
apt install -y nginx
systemctl enable nginx
systemctl start nginx
```

---

## Phase 5: Install Certbot (SSL)

// turbo
```bash
apt install -y certbot python3-certbot-nginx
```

---

## Phase 6: Clone & Setup Application

### 6.1 Switch to deploy user
```bash
su - brandini
```

### 6.2 Clone Repository
```bash
cd ~
git clone https://github.com/YOUR_USERNAME/photo.git brandini
cd brandini
```

### 6.3 Install Dependencies
// turbo
```bash
npm install
cd apps/backend && npm install && cd ../..
cd apps/frontend && npm install && cd ../..
cd apps/ai-api && npm install && cd ../..
cd apps/ai-studio && npm install && cd ../..
```

---

## Phase 7: Configure Environment Files

### 7.1 Strapi Backend (.env)
```bash
nano apps/backend/.env
```

```env
HOST=0.0.0.0
PORT=1337
APP_KEYS=generate-random-keys-here
API_TOKEN_SALT=generate-random-salt
ADMIN_JWT_SECRET=generate-random-secret
TRANSFER_TOKEN_SALT=generate-random-salt
JWT_SECRET=generate-random-secret

# Database
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=brandini
DATABASE_USERNAME=brandini_user
DATABASE_PASSWORD=YOUR_SECURE_PASSWORD
DATABASE_SSL=false

# URLs
PUBLIC_URL=https://api.brandili.shop

### 7.2 Frontend (.env.local)
```bash
nano apps/frontend/.env.local
```

```env
NEXT_PUBLIC_STRAPI_URL=https://api.brandili.shop
NEXT_PUBLIC_SITE_URL=https://brandili.shop
NODE_ENV=production
```

### 7.3 AI API (.env)
```bash
nano apps/ai-api/.env
```

```env
PORT=3001
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
STRAPI_URL=https://api.brandili.shop
giminigen_API_KEY=your-api-key
CORS_ORIGINS=https://brandili.shop,https://studio.brandili.shop
```

### 7.4 AI Studio (.env)
```bash
nano apps/ai-studio/.env
```

```env
VITE_API_URL=https://ai-api.brandili.shop
VITE_DASHBOARD_URL=https://brandili.shop
```

## Phase 10: Configure Nginx

### 10.1 Create Nginx Config
sudo nano /etc/nginx/sites-available/brandili

# Main Dashboard/Frontend
server {
    listen 80;
    server_name brandili.shop *.brandili.shop;

    location / {
        proxy_pass http://127.0.0.1:3000;
        # ...
    }
}

# Strapi API
server {
    listen 80;
    server_name api.brandili.shop;

    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:1337;
        # ...
    }
}

# AI API
server {
    listen 80;
    server_name ai-api.brandili.shop;

    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:3001;
        # ...
    }
}

# AI Studio
server {
    listen 80;
    server_name studio.brandili.shop;

    location / {
        proxy_pass http://127.0.0.1:3002;
        # ...
    }
}

### 10.2 Enable Site
sudo ln -s /etc/nginx/sites-available/brandili /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

## Phase 11: Setup SSL with Let's Encrypt

sudo certbot --nginx -d brandili.shop -d api.brandili.shop -d ai-api.brandili.shop -d studio.brandili.shop

## Verification Checklist

- [ ] `pm2 status` shows all 4 apps running
- [ ] https://brandili.shop loads frontend
- [ ] https://api.brandili.shop/admin loads Strapi admin
- [ ] https://studio.brandili.shop loads AI Studio
- [ ] SSL certificates are active (green padlock)

---

## Useful Commands

```bash
# View logs
pm2 logs

# Restart all
pm2 restart all

# View status
pm2 status

# Monitor resources
pm2 monit
htop
```
