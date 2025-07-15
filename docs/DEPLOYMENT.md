# Deployment Guide

This guide covers various deployment options for the To-Do application.

## 🐳 Docker Deployment (Recommended)

### Development Environment

Use the development docker-compose for local development with hot reload:

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up --build

# Access the application
# Frontend: http://localhost:5173
# Backend: http://localhost:8000
# API Docs: http://localhost:8000/swagger/
```

### Production Environment

Use the production docker-compose for deployment:

```bash
# Start production environment
docker-compose up --build -d

# Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:8000 (proxied through nginx)
```

## ☁️ Cloud Deployment

### 1. Heroku Deployment

#### Backend (Django)

1. **Install Heroku CLI and login:**
   ```bash
   heroku login
   ```

2. **Create Heroku app:**
   ```bash
   cd backend
   heroku create your-todo-backend
   ```

3. **Add buildpack:**
   ```bash
   heroku buildpacks:set heroku/python
   ```

4. **Set environment variables:**
   ```bash
   heroku config:set DEBUG=False
   heroku config:set SECRET_KEY=$(python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')
   heroku config:set ALLOWED_HOSTS=your-todo-backend.herokuapp.com
   heroku config:set CORS_ALLOWED_ORIGINS=https://your-todo-frontend.vercel.app
   ```

5. **Create Procfile in backend directory:**
   ```
   web: gunicorn core.wsgi:application
   release: python manage.py migrate
   ```

6. **Deploy:**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

#### Frontend (React)

1. **Deploy to Vercel:**
   ```bash
   cd frontend
   npm install -g vercel
   vercel --prod
   ```

2. **Set environment variables in Vercel dashboard:**
   ```
   VITE_API_BASE_URL=https://your-todo-backend.herokuapp.com/api
   ```

### 2. AWS Deployment

#### Backend (Django on EC2)

1. **Launch EC2 instance** (Ubuntu 20.04 LTS)

2. **Connect and install dependencies:**
   ```bash
   sudo apt update
   sudo apt install python3-pip python3-venv nginx
   ```

3. **Clone repository:**
   ```bash
   git clone https://github.com/yourusername/to-do-app-django.git
   cd to-do-app-django/backend
   ```

4. **Set up virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   pip install gunicorn
   ```

5. **Configure nginx:**
   ```bash
   sudo nano /etc/nginx/sites-available/todo-backend
   ```
   
   Add configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://127.0.0.1:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }

       location /static/ {
           alias /path/to/your/project/static/;
       }
   }
   ```

6. **Enable site:**
   ```bash
   sudo ln -s /etc/nginx/sites-available/todo-backend /etc/nginx/sites-enabled/
   sudo systemctl restart nginx
   ```

7. **Create systemd service:**
   ```bash
   sudo nano /etc/systemd/system/todo-backend.service
   ```
   
   Add configuration:
   ```ini
   [Unit]
   Description=Todo Backend
   After=network.target

   [Service]
   User=ubuntu
   Group=ubuntu
   WorkingDirectory=/home/ubuntu/to-do-app-django/backend
   Environment="PATH=/home/ubuntu/to-do-app-django/backend/venv/bin"
   ExecStart=/home/ubuntu/to-do-app-django/backend/venv/bin/gunicorn core.wsgi:application
   Restart=always

   [Install]
   WantedBy=multi-user.target
   ```

8. **Start service:**
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl start todo-backend
   sudo systemctl enable todo-backend
   ```

#### Frontend (React on S3 + CloudFront)

1. **Build the application:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Upload to S3:**
   ```bash
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

3. **Configure CloudFront distribution** for your S3 bucket

### 3. DigitalOcean Deployment

#### Using DigitalOcean App Platform

1. **Create app.yaml:**
   ```yaml
   name: todo-app
   services:
   - name: backend
     source_dir: backend/
     github:
       repo: yourusername/to-do-app-django
       branch: main
     run_command: gunicorn core.wsgi:application
     environment_slug: python
     instance_count: 1
     instance_size_slug: basic-xxs
     envs:
     - key: DEBUG
       value: "False"
     - key: SECRET_KEY
       value: "your-secret-key"
   
   - name: frontend
     source_dir: frontend/
     github:
       repo: yourusername/to-do-app-django
       branch: main
     build_command: npm run build
     run_command: npm run preview
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
   ```

2. **Deploy using doctl:**
   ```bash
   doctl apps create --spec app.yaml
   ```

## 🔧 Environment Configuration

### Production Environment Variables

#### Backend (.env.prod)
```env
DEBUG=False
SECRET_KEY=your-super-secret-production-key
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com,your-backend-url.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Database (PostgreSQL for production)
DATABASE_URL=postgresql://username:password@host:port/database

# JWT Settings
JWT_ACCESS_TOKEN_LIFETIME=60
JWT_REFRESH_TOKEN_LIFETIME=1440
```

#### Frontend (.env.production)
```env
VITE_API_BASE_URL=https://your-backend-url.com/api
```

## 📊 Monitoring and Maintenance

### Health Checks

Add health check endpoints to your Django backend:

```python
# backend/core/urls.py
from django.http import JsonResponse

def health_check(request):
    return JsonResponse({"status": "healthy"})

urlpatterns = [
    # ... other patterns
    path('health/', health_check, name='health-check'),
]
```

### Logging

Configure proper logging for production:

```python
# backend/core/settings.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': 'django.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'INFO',
            'propagate': True,
        },
    },
}
```

### Database Backups

For PostgreSQL:
```bash
# Create backup
pg_dump -h hostname -U username database_name > backup.sql

# Restore backup
psql -h hostname -U username database_name < backup.sql
```

## 🔒 Security Checklist

- [ ] Set `DEBUG=False` in production
- [ ] Use strong `SECRET_KEY`
- [ ] Configure proper `ALLOWED_HOSTS`
- [ ] Set up HTTPS/SSL certificates
- [ ] Configure CORS properly
- [ ] Use environment variables for sensitive data
- [ ] Set up database backups
- [ ] Configure proper logging
- [ ] Use a reverse proxy (nginx)
- [ ] Keep dependencies updated

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors:**
   - Check `CORS_ALLOWED_ORIGINS` setting
   - Ensure frontend URL is included

2. **JWT Token Issues:**
   - Check token expiration times
   - Verify JWT secret key consistency

3. **Database Connection Issues:**
   - Verify `DATABASE_URL` format
   - Check database server status

4. **Static Files Not Loading:**
   - Run `python manage.py collectstatic`
   - Configure nginx for static file serving

### Logs Location

- **Django:** Check `django.log` file
- **Nginx:** `/var/log/nginx/error.log`
- **Systemd service:** `journalctl -u todo-backend`

---

For additional help, check the main README.md or open an issue on GitHub.
