from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('student', 'Student Intern'),
        ('workplace_supervisor', 'Workplace Supervisor'),
        ('academic_supervisor', 'Academic Supervisor'),
        ('admin', 'Internship Administrator'),
    ]

    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)
    role = models.CharField(max_length=30, choices=ROLE_CHOICES, default='student')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'full_name']

    def __str__(self):
        return f"{self.full_name} ({self.role})"


class InternshipLog(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='logs')
    date = models.DateField()
    department = models.CharField(max_length=255)
    task_description = models.TextField()
    skills_learned = models.TextField()
    hours_worked = models.DecimalField(max_digits=5, decimal_places=2)
    challenges_faced = models.TextField(blank=True, null=True)
    supervisor_comments = models.TextField(blank=True, null=True)
    attachments = models.FileField(upload_to='log_attachments/', blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student.full_name} - {self.date}"
