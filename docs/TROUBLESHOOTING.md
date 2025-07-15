# 🔧 Troubleshooting Guide

This document covers common issues and their solutions for the To-Do application.

## 📋 Table of Contents
- [Node.js Version Issues](#nodejs-version-issues)
- [Package Installation Problems](#package-installation-problems)
- [GitHub Actions CI/CD Issues](#github-actions-cicd-issues)
- [Docker Issues](#docker-issues)
- [Database Connection Problems](#database-connection-problems)
- [Frontend Build Issues](#frontend-build-issues)
- [Backend API Issues](#backend-api-issues)

## 🟨 Node.js Version Issues

### Problem: Unsupported Engine Warnings
```
npm warn EBADENGINE Unsupported engine {
npm warn EBADENGINE   package: 'react-router@7.6.3',
npm warn EBADENGINE   required: { node: '>=20.0.0' },
npm warn EBADENGINE   current: { node: 'v18.20.8', npm: '10.8.2' }
}
```

### Solution:
1. **Option A: Upgrade Node.js (Recommended)**
   ```bash
   # Using nvm (Linux/Mac)
   nvm install 20
   nvm use 20
   
   # Using nvm-windows (Windows)
   nvm install 20.0.0
   nvm use 20.0.0
   
   # Direct installation
   # Download from https://nodejs.org/
   ```

2. **Option B: Use Compatible Package Versions**
   The project has been configured with Node.js 18 compatible versions:
   ```bash
   cd frontend
   rm -rf node_modules package-lock.json
   npm install --legacy-peer-deps
   ```

### Current Configuration:
- **Node.js**: >=18.0.0 (compatible with most environments)
- **Package versions**: Downgraded to support Node.js 18.x
- **Build system**: Vite 5.x (stable and widely supported)

## 📦 Package Installation Problems

### Problem: Husky Installation Error
```
sh: 1: husky: not found
npm error code 127
npm error command failed
npm error command sh -c husky install
```

### Solution:
The `prepare` script has been removed from package.json. If you need Git hooks:
```bash
cd frontend
npm install husky --save-dev
npx husky install
```

### Problem: Legacy Peer Dependencies
```bash
# Use this flag for installation if you encounter peer dependency conflicts
npm install --legacy-peer-deps
```

## 🔄 GitHub Actions CI/CD Issues

### Problem: CodeQL Action Deprecated
```
Error: CodeQL Action major versions v1 and v2 have been deprecated
```

### Solution:
Updated to latest versions in `.github/workflows/ci.yml`:
- `actions/checkout@v4`
- `actions/setup-node@v4`
- `actions/setup-python@v5`
- `github/codeql-action/upload-sarif@v3`

### Problem: SARIF Upload Permission Issues
```
Warning: Resource not accessible by integration
Error: Resource not accessible by integration
```

### Solution:
Added proper permissions to workflow:
```yaml
permissions:
  contents: read
  security-events: write
  actions: read
```

## 🐳 Docker Issues

### Problem: Port Already in Use
```bash
# Check what's using the port
lsof -i :8000  # Backend
lsof -i :5173  # Frontend

# Kill the process
kill -9 <PID>

# Or use different ports
docker-compose -f docker-compose.dev.yml up --build
```

### Problem: Docker Build Fails
```bash
# Clean Docker system
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache

# Check logs
docker-compose logs <service-name>
```

## 🗄️ Database Connection Problems

### Problem: SQLite Permission Issues
```bash
# Ensure proper permissions
chmod 664 backend/db.sqlite3
chmod 755 backend/

# Reset database
cd backend
rm db.sqlite3
python manage.py migrate
python manage.py createsuperuser
```

### Problem: PostgreSQL Connection (Production)
```bash
# Check PostgreSQL status
docker-compose exec postgres psql -U postgres -d todo_db

# Reset PostgreSQL data
docker-compose down -v
docker-compose up -d postgres
```

## 🎨 Frontend Build Issues

### Problem: Vite Build Fails
```bash
cd frontend

# Clear cache
rm -rf node_modules/.vite dist

# Reinstall dependencies
npm ci --legacy-peer-deps

# Build with verbose logging
npm run build -- --debug
```

### Problem: Module Resolution Errors
```bash
# Check your jsconfig.json has proper path mapping
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## 🔧 Backend API Issues

### Problem: CORS Errors
```python
# In backend/core/settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]

CORS_ALLOW_CREDENTIALS = True
```

### Problem: JWT Token Issues
```bash
# Check token expiration in settings.py
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
}
```

### Problem: Static Files Not Serving
```python
# In production settings
STATIC_ROOT = '/app/staticfiles/'
STATIC_URL = '/static/'

# Run collectstatic
python manage.py collectstatic --noinput
```

## 🚀 Quick Fixes

### Complete Reset (Nuclear Option)
```bash
# Backend reset
cd backend
rm db.sqlite3
rm -rf __pycache__ */migrations/__pycache__
python manage.py migrate
python manage.py createsuperuser

# Frontend reset
cd ../frontend
rm -rf node_modules package-lock.json dist .vite
npm install --legacy-peer-deps
npm run build

# Docker reset
docker-compose down -v
docker system prune -a
docker-compose up --build
```

### Environment Verification
```bash
# Check versions
node --version    # Should be >= 18.0.0
npm --version     # Should be >= 8.0.0
python --version  # Should be >= 3.8
docker --version  # Should be >= 20.0.0

# Check ports
netstat -tlnp | grep :8000
netstat -tlnp | grep :5173
```

## 📞 Getting Help

### Useful Commands for Debugging
```bash
# Backend logs
cd backend && python manage.py runserver --verbosity=2

# Frontend dev server with debug
cd frontend && npm run dev -- --debug

# Docker logs
docker-compose logs -f <service-name>

# Database shell
cd backend && python manage.py shell

# Check API endpoints
curl -X GET http://localhost:8000/api/tasks/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Common Environment Variables
```bash
# Backend (.env)
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///db.sqlite3
CORS_ALLOWED_ORIGINS=http://localhost:5173

# Frontend (.env)
VITE_API_BASE_URL=http://localhost:8000/api
```

## 🎯 Interview Preparation

### Demonstrate Problem-Solving Skills:
1. **Show the issue**: Present the error message
2. **Explain the diagnosis**: How you identified the root cause
3. **Present the solution**: Multiple approaches if available
4. **Verify the fix**: How you tested the solution
5. **Prevent recurrence**: What you learned and how to avoid it

### Key Technical Points to Mention:
- Version compatibility management
- CI/CD pipeline troubleshooting
- Security permissions and best practices
- Cross-platform development considerations
- Production vs development environment differences

---

**💡 Remember**: These issues demonstrate real-world development challenges and your ability to solve them systematically!
