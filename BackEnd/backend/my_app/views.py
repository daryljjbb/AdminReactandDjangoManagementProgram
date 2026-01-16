from rest_framework import generics, permissions
from .models import Customer
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.decorators import api_view, permission_classes
from .serializers import CustomerSerializer

class CustomerListCreateView(generics.ListCreateAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    # Uses default settings (IsAuthenticatedOrReadOnly)


@api_view(["GET"])
@permission_classes([AllowAny]) # Changed from IsAuthenticated to AllowAny
def me(request):
    if request.user.is_authenticated:
        return Response({
            "username": request.user.username,
            "is_staff": request.user.is_staff,
            "is_superuser": request.user.is_superuser
        })
    # If not authenticated, return status 200 (Success) with empty data
    return Response({
        "username": "", 
        "is_staff": False, 
        "is_superuser": False
    }, status=200)


@api_view(['POST'])
@permission_classes([AllowAny])
def api_login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    
    if user is not None:
        login(request, user)
        return Response({
            "message": "Logged in",
            "is_staff": user.is_staff,
            "is_superuser": user.is_superuser
        })
    return Response({"error": "Invalid credentials"}, status=400)

@api_view(['POST'])
def api_logout(request):
    logout(request)
    return Response({"message": "Logged out"}, status=200)


@api_view(['POST'])
@permission_classes([AllowAny])
def api_register(request):
    username = request.data.get('username')
    password = request.data.get('password')
    is_admin = request.data.get('is_admin', False)

    if not username or not password:
        return Response({"error": "Username and password required"}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=400)

    # Create the user
    user = User.objects.create_user(username=username, password=password)
    
    # If the checkbox was checked, make them a Staff/Superuser
    if is_admin:
        user.is_staff = True
        user.is_superuser = True
        user.save()

    return Response({"message": "User created successfully"}, status=201)