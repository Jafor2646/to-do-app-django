# 🚀 Full-Stack To-Do Application

A modern, feature-rich To-Do application built with Django REST Framework and React, featuring JWT authentication, drag-and-drop functionality, real-time filtering, and a beautiful UI with Tailwind CSS and shadcn/ui components.

## ✨ Features

### 🔐 Authentication
- **User Registration & Login** with form validation
- **JWT Authentication** with automatic token refresh
- **Protected Routes** and secure API endpoints
- **Password visibility toggle** and strength validation

### 📋 Task Management
- **Create, Read, Update, Delete (CRUD)** operations
- **Task Properties:**
  - Title and Description
  - Due Date with validation
  - Priority levels (Low, Medium, High)
  - Status tracking (Pending, In Progress, Completed)
  - Creation and update timestamps
  - Custom ordering support

### 🎯 Advanced Features
- **Drag & Drop Ordering** - Reorder tasks intuitively
- **Real-time Filtering** - Filter by status, priority, and search
- **Task Statistics Dashboard** - View completion rates and overdue tasks
- **Responsive Design** - Works perfectly on desktop and mobile
- **Date Formatting** - Smart date display (Today, Tomorrow, etc.)
- **Overdue Detection** - Visual indicators for overdue tasks
- **Modern UI Components** - Built with shadcn/ui and Tailwind CSS

### 🔍 Filtering & Search
- **Status Filter:** All, Pending, In Progress, Completed
- **Priority Filter:** All, High, Medium, Low
- **Search Functionality:** Search through task titles and descriptions
- **Quick Filters:** Today's tasks, upcoming tasks, overdue tasks

## 🛠️ Technology Stack

### Backend
- **Django 5.2.4** - Web framework
- **Django REST Framework** - API development
- **JWT Authentication** - Simple JWT tokens
- **CORS Headers** - Cross-origin support
- **drf-yasg** - API documentation (Swagger/ReDoc)
- **SQLite** - Database (easily switchable to PostgreSQL)

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Modern UI components
- **React Hook Form** - Form handling and validation
- **@dnd-kit** - Drag and drop functionality
- **Lucide React** - Beautiful icons
- **date-fns** - Date manipulation
- **Axios** - HTTP client

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment (recommended):**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\\Scripts\\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

5. **Create superuser (optional):**
   ```bash
   python manage.py createsuperuser
   ```

6. **Start development server:**
   ```bash
   python manage.py runserver
   ```
   Backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   Frontend will be available at `http://localhost:5173`

## 📚 API Documentation

The API documentation is automatically generated and available at:
- **Swagger UI:** `http://localhost:8000/swagger/`
- **ReDoc:** `http://localhost:8000/redoc/`

### API Endpoints

#### Authentication
- `POST /api/auth/login/` - User login
- `POST /api/auth/refresh/` - Refresh JWT token
- `POST /api/users/` - User registration

#### Tasks
- `GET /api/tasks/` - List all tasks (with filtering)
- `POST /api/tasks/` - Create new task
- `GET /api/tasks/{id}/` - Get specific task
- `PUT /api/tasks/{id}/` - Update task
- `PATCH /api/tasks/{id}/` - Partial update task
- `DELETE /api/tasks/{id}/` - Delete task
- `PATCH /api/tasks/reorder/` - Reorder tasks (drag & drop)
- `GET /api/tasks/stats/` - Get task statistics

#### Query Parameters for Tasks
- `status` - Filter by status (pending, in_progress, completed)
- `priority` - Filter by priority (low, medium, high)
- `due_date` - Filter by due date (today, upcoming, overdue)
- `search` - Search in title and description

## 🔧 Configuration

### Environment Variables

Create `.env` files for different environments:

**Backend (.env):**
```env
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

**Frontend (.env):**
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## 🚀 Deployment

### Backend Deployment (Django)

#### Using Heroku
1. **Prepare files:**
   ```bash
   pip install gunicorn whitenoise
   pip freeze > requirements.txt
   ```

2. **Create Procfile:**
   ```
   web: gunicorn core.wsgi:application
   ```

3. **Deploy to Heroku:**
   ```bash
   heroku create your-app-name
   heroku config:set DEBUG=False
   heroku config:set SECRET_KEY=your-production-secret-key
   git push heroku main
   heroku run python manage.py migrate
   ```

### Frontend Deployment

#### Using Vercel
1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel:**
   ```bash
   npm install -g vercel
   vercel --prod
   ```

### Docker Deployment (Full Stack)

**Create docker-compose.yml:**
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DEBUG=False
      - DATABASE_URL=sqlite:///db.sqlite3
    volumes:
      - ./backend:/app

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - VITE_API_BASE_URL=http://localhost:8000/api
    depends_on:
      - backend
```

**Build and run:**
```bash
docker-compose up --build
```

## 🔒 Security Features

- **JWT Authentication** with automatic refresh
- **CORS Protection** configured for allowed origins
- **CSRF Protection** enabled
- **Input Validation** on both frontend and backend
- **Password Strength Requirements**

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch:** `git checkout -b feature/amazing-feature`
3. **Commit changes:** `git commit -m 'Add amazing feature'`
4. **Push to branch:** `git push origin feature/amazing-feature`
5. **Open Pull Request**

---

**Built with ❤️ for task management excellence! 🎉**