from django.urls import path

from . import views

urlpatterns = [
    path('', views.api_root, name='api-root'),
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('me/', views.get_current_user, name='current-user'),
    path('logs/', views.internship_logs, name='internship-logs'),
    path('logs/<int:log_id>/approve/', views.approve_log, name='approve-log'),
    path('logs/<int:log_id>/reject/', views.reject_log, name='reject-log'),
]
