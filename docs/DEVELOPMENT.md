# Development Guide

This guide provides comprehensive instructions for setting up and contributing to the To-Do application.

## 🛠️ Development Setup

### Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.8+** with pip
- **Node.js 16+** with npm
- **Git** for version control
- **Code Editor** (VS Code recommended)

### Initial Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Jafor2646/to-do-app-django.git
   cd to-do-app-django
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   
   # Create virtual environment
   python -m venv venv
   
   # Activate virtual environment
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Set up environment variables
   cp .env.dev .env
   
   # Run migrations
   python manage.py migrate
   
   # Create superuser (optional)
   python manage.py createsuperuser
   
   # Start development server
   python manage.py runserver
   ```

3. **Frontend Setup:**
   ```bash
   cd frontend
   
   # Install dependencies
   npm install
   
   # Start development server
   npm run dev
   ```

### Environment Configuration

#### Backend Environment Variables (.env)

```env
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Database
DATABASE_URL=sqlite:///db.sqlite3

# JWT Settings
JWT_ACCESS_TOKEN_LIFETIME=60
JWT_REFRESH_TOKEN_LIFETIME=1440
```

#### Frontend Environment Variables (.env)

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## 🏗️ Project Structure

```
to-do-app-django/
├── backend/                    # Django REST API
│   ├── core/                  # Django project settings
│   │   ├── settings.py        # Main settings
│   │   ├── urls.py           # URL configuration
│   │   └── wsgi.py           # WSGI application
│   ├── todos/                 # Main app
│   │   ├── models.py         # Task model
│   │   ├── views.py          # API views
│   │   ├── serializers.py    # DRF serializers
│   │   └── urls.py           # App URLs
│   ├── requirements.txt       # Python dependencies
│   └── manage.py             # Django management
├── frontend/                  # React application
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── contexts/        # React contexts
│   │   ├── lib/             # Utility functions
│   │   └── assets/          # Static assets
│   ├── package.json         # Node dependencies
│   └── vite.config.js       # Vite configuration
├── docs/                     # Documentation
└── docker-compose.yml       # Docker configuration
```

## 🔧 Development Workflow

### Code Style and Standards

#### Backend (Python/Django)
- Follow PEP 8 style guide
- Use Black for code formatting
- Use isort for import sorting
- Type hints recommended

```bash
# Install development tools
pip install black isort flake8

# Format code
black .
isort .

# Check code style
flake8 .
```

#### Frontend (JavaScript/React)
- Use ESLint and Prettier
- Follow React best practices
- Use TypeScript for new files (optional)

```bash
# Lint code
npm run lint

# Format code
npm run format
```

### Database Migrations

When you modify Django models, create and apply migrations:

```bash
# Create migration
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Check migration status
python manage.py showmigrations
```

### Testing

#### Backend Tests

```bash
# Run all tests
python manage.py test

# Run specific test
python manage.py test todos.tests.TestTaskModel

# Run with coverage
pip install coverage
coverage run --source='.' manage.py test
coverage report
coverage html  # Generate HTML report
```

#### Frontend Tests

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 🧪 Creating Tests

### Backend Test Example

```python
# todos/tests.py
from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from .models import Task

class TaskAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)
    
    def test_create_task(self):
        data = {
            'title': 'Test Task',
            'description': 'Test Description',
            'priority': 'high'
        }
        response = self.client.post('/api/tasks/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Task.objects.count(), 1)
```

### Frontend Test Example

```javascript
// src/components/__tests__/TaskCard.test.jsx
import { render, screen } from '@testing-library/react';
import { TaskCard } from '../TaskCard';

const mockTask = {
  id: 1,
  title: 'Test Task',
  description: 'Test Description',
  status: 'pending',
  priority: 'high',
  due_date: '2025-07-20'
};

test('renders task card with title', () => {
  render(<TaskCard task={mockTask} />);
  expect(screen.getByText('Test Task')).toBeInTheDocument();
});
```

## 🔌 API Development

### Adding New Endpoints

1. **Create/Update Models:**
   ```python
   # todos/models.py
   class Task(models.Model):
       title = models.CharField(max_length=255)
       # ... other fields
   ```

2. **Create Serializers:**
   ```python
   # todos/serializers.py
   from rest_framework import serializers
   from .models import Task
   
   class TaskSerializer(serializers.ModelSerializer):
       class Meta:
           model = Task
           fields = '__all__'
   ```

3. **Create Views:**
   ```python
   # todos/views.py
   from rest_framework import viewsets
   from .models import Task
   from .serializers import TaskSerializer
   
   class TaskViewSet(viewsets.ModelViewSet):
       queryset = Task.objects.all()
       serializer_class = TaskSerializer
   ```

4. **Add URLs:**
   ```python
   # todos/urls.py
   from rest_framework.routers import DefaultRouter
   from .views import TaskViewSet
   
   router = DefaultRouter()
   router.register(r'tasks', TaskViewSet)
   urlpatterns = router.urls
   ```

### API Documentation

The API documentation is automatically generated using drf-yasg. You can enhance it by adding docstrings:

```python
class TaskViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing tasks.
    
    Provides CRUD operations for tasks with filtering capabilities.
    """
    
    def create(self, request):
        """
        Create a new task.
        
        ---
        parameters:
          - name: title
            required: true
            type: string
        """
        pass
```

## 🎨 Frontend Development

### Adding New Components

1. **Create Component:**
   ```jsx
   // src/components/NewComponent.jsx
   import React from 'react';
   
   export function NewComponent({ prop1, prop2 }) {
     return (
       <div className="...">
         {/* Component content */}
       </div>
     );
   }
   ```

2. **Add to Index:**
   ```javascript
   // src/components/index.js
   export { NewComponent } from './NewComponent';
   ```

### State Management

The application uses React Context for state management:

```jsx
// src/contexts/AppContext.jsx
import React, { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
```

### Adding shadcn/ui Components

```bash
# Add new shadcn/ui component
npx shadcn-ui@latest add dialog

# Use in your component
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
```

## 🚀 Build and Deployment

### Development Build

```bash
# Backend
python manage.py collectstatic
python manage.py check --deploy

# Frontend
npm run build
npm run preview
```

### Docker Development

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up --build

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop services
docker-compose -f docker-compose.dev.yml down
```

## 🐛 Debugging

### Backend Debugging

1. **Django Debug Toolbar:**
   ```python
   # settings.py (already configured)
   if DEBUG:
       INSTALLED_APPS += ['debug_toolbar']
   ```

2. **Logging:**
   ```python
   import logging
   logger = logging.getLogger(__name__)
   logger.info('Debug message')
   ```

### Frontend Debugging

1. **React Developer Tools** (browser extension)
2. **Console Logging:**
   ```javascript
   console.log('Debug info:', data);
   ```

3. **Vite Dev Tools:**
   ```bash
   # Detailed build info
   npm run build -- --debug
   ```

## 📝 Code Review Guidelines

### Pull Request Checklist

- [ ] Code follows project style guidelines
- [ ] Tests are included for new features
- [ ] Documentation is updated
- [ ] No console.log statements in production code
- [ ] Environment variables are not hardcoded
- [ ] API endpoints are properly documented
- [ ] UI is responsive and accessible

### Review Criteria

1. **Functionality:** Does the code work as expected?
2. **Code Quality:** Is the code clean and maintainable?
3. **Performance:** Are there any performance implications?
4. **Security:** Are there any security vulnerabilities?
5. **Testing:** Are tests comprehensive?

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Write/update tests**
5. **Update documentation**
6. **Commit your changes:** `git commit -m 'Add amazing feature'`
7. **Push to the branch:** `git push origin feature/amazing-feature`
8. **Open a Pull Request**

## 🔍 Troubleshooting

### Common Issues

1. **CORS Errors:**
   - Check `CORS_ALLOWED_ORIGINS` in backend settings
   - Ensure frontend URL is included

2. **Database Issues:**
   - Run `python manage.py migrate`
   - Check database file permissions

3. **npm Install Fails:**
   - Clear cache: `npm cache clean --force`
   - Delete node_modules and reinstall

4. **JWT Token Issues:**
   - Check token expiration
   - Verify secret key consistency

---

For additional help, check the main README.md or open an issue on GitHub.
