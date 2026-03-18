from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import InternshipLog
from .serializers import (
    InternshipLogSerializer,
    RegisterSerializer,
    UserSerializer,
)


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request):
    return Response({'message': 'API is running'})


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    tokens = get_tokens_for_user(user)
    user_data = UserSerializer(user).data
    return Response({
        'user': user_data,
        'tokens': tokens,
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    user = authenticate(request, username=email, password=password)

    if user is None:
        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    tokens = get_tokens_for_user(user)
    user_data = UserSerializer(user).data
    return Response({
        'user': user_data,
        'tokens': tokens,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def internship_logs(request):
    # Students can create logs; staff can list/search logs
    if request.method == 'POST':
        serializer = InternshipLogSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    # GET
    if request.user.is_staff or request.user.role == 'supervisor':
        logs = InternshipLog.objects.all().order_by('-created_at')
    else:
        logs = InternshipLog.objects.filter(student=request.user).order_by('-created_at')

    serializer = InternshipLogSerializer(logs, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def approve_log(request, log_id):
    if not (request.user.is_staff or request.user.role == 'supervisor'):
        return Response({'detail': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

    log = get_object_or_404(InternshipLog, id=log_id)
    log.status = 'approved'
    log.supervisor_comments = request.data.get('supervisor_comments', log.supervisor_comments)
    log.save()
    serializer = InternshipLogSerializer(log)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reject_log(request, log_id):
    if not (request.user.is_staff or request.user.role == 'supervisor'):
        return Response({'detail': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

    log = get_object_or_404(InternshipLog, id=log_id)
    log.status = 'rejected'
    log.supervisor_comments = request.data.get('supervisor_comments', log.supervisor_comments)
    log.save()
    serializer = InternshipLogSerializer(log)
    return Response(serializer.data)
