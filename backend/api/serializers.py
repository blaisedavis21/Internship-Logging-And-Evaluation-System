from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser, InternshipLog


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = CustomUser
        fields = ['full_name', 'email', 'password', 'role']

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            full_name=validated_data['full_name'],
            role=validated_data['role'],
            password=validated_data['password'],
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'full_name', 'email', 'role']


class InternshipLogSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)

    class Meta:
        model = InternshipLog
        fields = [
            'id', 'student', 'student_name', 'date', 'department', 'task_description',
            'skills_learned', 'hours_worked', 'challenges_faced', 'supervisor_comments',
            'attachments', 'status', 'created_at'
        ]
        read_only_fields = ['student', 'status', 'supervisor_comments', 'created_at']

    def create(self, validated_data):
        validated_data['student'] = self.context['request'].user
        return super().create(validated_data)
