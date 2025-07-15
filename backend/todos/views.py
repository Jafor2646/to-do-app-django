from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import date, timedelta
from .models import Task
from .serializers import TaskSerializer, UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]  # Allow registration
    
    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Task.objects.filter(user=self.request.user)
        
        # Filter by status
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Filter by priority
        priority_filter = self.request.query_params.get('priority')
        if priority_filter:
            queryset = queryset.filter(priority=priority_filter)
        
        # Filter by due date
        due_date_filter = self.request.query_params.get('due_date')
        if due_date_filter == 'today':
            queryset = queryset.filter(due_date=date.today())
        elif due_date_filter == 'upcoming':
            queryset = queryset.filter(due_date__gte=date.today(), due_date__lte=date.today() + timedelta(days=7))
        elif due_date_filter == 'overdue':
            queryset = queryset.filter(due_date__lt=date.today(), status__in=['pending', 'in_progress'])
        
        # Search functionality
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(title__icontains=search) | queryset.filter(description__icontains=search)
        
        return queryset.order_by('order', '-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['patch'])
    def reorder(self, request):
        """Handle drag and drop reordering of tasks"""
        task_orders = request.data.get('task_orders', [])
        for item in task_orders:
            task_id = item.get('id')
            new_order = item.get('order')
            try:
                task = Task.objects.get(id=task_id, user=request.user)
                task.order = new_order
                task.save()
            except Task.DoesNotExist:
                continue
        return Response({'status': 'success'})
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get task statistics"""
        queryset = self.get_queryset()
        total_tasks = queryset.count()
        completed_tasks = queryset.filter(status='completed').count()
        pending_tasks = queryset.filter(status='pending').count()
        in_progress_tasks = queryset.filter(status='in_progress').count()
        overdue_tasks = queryset.filter(due_date__lt=date.today(), status__in=['pending', 'in_progress']).count()
        
        return Response({
            'total_tasks': total_tasks,
            'completed_tasks': completed_tasks,
            'pending_tasks': pending_tasks,
            'in_progress_tasks': in_progress_tasks,
            'overdue_tasks': overdue_tasks,
            'completion_rate': round((completed_tasks / total_tasks * 100) if total_tasks > 0 else 0, 2)
        })
