from django.db import models
from django.contrib.auth.models import User

class Task(models.Model):
    STATUS = (
        ('pending', 'Pending'),
        ('completed', 'Completed'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=10, choices=STATUS, default='pending')
    due_date = models.DateField()

    def __str__(self):
        return self.title
