# 🔒 Production Security Deployment Guide

## 🚨 CRITICAL: Complete Security Checklist

### **Pre-Deployment Security Setup**

#### 1. **Generate Production Secrets**
```bash
# Create secrets directory
mkdir -p secrets

# Generate PostgreSQL password (32 characters)
openssl rand -base64 32 > secrets/postgres_password.txt

# Generate Django secret key
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())" > secrets/django_secret_key.txt

# Generate Grafana credentials
openssl rand -base64 32 > secrets/grafana_password.txt
openssl rand -base64 32 > secrets/grafana_secret_key.txt

# Set secure file permissions
chmod 600 secrets/*.txt
```

#### 2. **Set Required Environment Variables**
```bash
# Domain configuration
export ALLOWED_HOSTS="yourdomain.com,www.yourdomain.com"
export CORS_ALLOWED_ORIGINS="https://yourdomain.com,https://www.yourdomain.com"
export VITE_API_BASE_URL="https://yourdomain.com/api"

# Redis password
export REDIS_PASSWORD="$(openssl rand -base64 32)"
```

#### 3. **SSL Certificate Setup**
```bash
# Create SSL directory
mkdir -p nginx/ssl

# Generate or place your SSL certificates
# - nginx/ssl/certificate.crt
# - nginx/ssl/private.key
```

## 🛡️ **Security Features Implemented**

### **Container Security**
- ✅ **Read-only filesystems** for all containers
- ✅ **No new privileges** security option
- ✅ **Temporary filesystems** for writable directories
- ✅ **Non-root user execution** where possible

### **Secret Management**
- ✅ **Docker Secrets** for sensitive data
- ✅ **File-based secret loading** in Django
- ✅ **No hardcoded credentials** in any configuration
- ✅ **Secure file permissions** (600) for secret files

### **Network Security**
- ✅ **Internal network isolation** 
- ✅ **Health checks** for all services
- ✅ **Redis password protection**
- ✅ **PostgreSQL authentication**

### **Application Security**
- ✅ **Environment-based configuration**
- ✅ **Debug mode disabled** in production
- ✅ **Secure middleware stack**
- ✅ **CORS properly configured**

## 🚀 **Deployment Commands**

### **Standard Production Deployment**
```bash
# Verify all secrets are created
ls -la secrets/

# Deploy with security features
docker-compose -f docker-compose.prod.yml up -d
```

### **With Monitoring (Prometheus + Grafana)**
```bash
# Deploy with monitoring stack
docker-compose -f docker-compose.prod.yml --profile monitoring up -d
```

### **Health Check Verification**
```bash
# Check all services are healthy
docker-compose -f docker-compose.prod.yml ps

# Test endpoints
curl -f http://localhost/health
curl -f http://localhost:9090  # Prometheus (if monitoring enabled)
curl -f http://localhost:3001  # Grafana (if monitoring enabled)
```

## 🔍 **Security Validation**

### **Verify No Hardcoded Secrets**
```bash
# Search for potential secrets in codebase
grep -r "password\|secret\|key" --exclude-dir=secrets --exclude-dir=node_modules .
```

### **Check File Permissions**
```bash
# Verify secret files have correct permissions
ls -la secrets/
# Should show: -rw------- (600)
```

### **Validate Environment Variables**
```bash
# Ensure required variables are set
echo $ALLOWED_HOSTS
echo $CORS_ALLOWED_ORIGINS
echo $VITE_API_BASE_URL
echo $REDIS_PASSWORD
```

## 🚨 **Security Monitoring**

### **Log Monitoring**
```bash
# Monitor for security events
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f nginx
```

### **Container Security Scanning**
```bash
# Scan images for vulnerabilities
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy image todoapp_backend:latest

docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy image todoapp_frontend:latest
```

## 📋 **Production Checklist**

### **Before Deployment:**
- [ ] All secrets generated with `openssl rand -base64 32`
- [ ] Django secret key generated with Django utility
- [ ] File permissions set to 600 for all secret files
- [ ] Environment variables configured for your domain
- [ ] SSL certificates placed in nginx/ssl/
- [ ] No hardcoded credentials in any files
- [ ] .gitignore updated to exclude secrets/

### **After Deployment:**
- [ ] All containers showing "healthy" status
- [ ] Application accessible via HTTPS
- [ ] Database connections working
- [ ] Redis authentication working
- [ ] Monitoring endpoints accessible (if enabled)
- [ ] Log monitoring configured
- [ ] Backup strategy implemented

## 🔄 **Maintenance Security**

### **Regular Security Tasks:**
1. **Rotate secrets every 90 days**
2. **Update Docker images monthly**
3. **Monitor security advisories**
4. **Review access logs weekly**
5. **Test backup/restore procedures**

### **Security Updates:**
```bash
# Update images
docker-compose -f docker-compose.prod.yml pull

# Recreate containers with new images
docker-compose -f docker-compose.prod.yml up -d --force-recreate
```

---

**🔒 This deployment configuration implements enterprise-grade security practices suitable for production environments.**
