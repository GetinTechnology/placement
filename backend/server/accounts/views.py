from django.contrib.auth import authenticate
from django.core.mail import send_mail
from django.conf import settings
import random
import string
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from .serializers import UserRegistrationSerializer
from .models import User


#  User Registration
@api_view(['POST'])
@permission_classes([AllowAny])  
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({"message": "User registered successfully. Please log in."}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# User Login (Step 1 - Get Verification Code)
@api_view(['POST','Get'])
@permission_classes([AllowAny])  
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')

    user = authenticate(email=email, password=password)  # Authenticate with email

    if user is None:
        return Response({"error": "Invalid email or password."}, status=status.HTTP_400_BAD_REQUEST)

    if not user.is_verified:
        return Response({"error": "User email is not verified."}, status=status.HTTP_400_BAD_REQUEST)

    # Generate or retrieve the authentication token
    token, created = Token.objects.get_or_create(user=user)

    return Response({"token": token.key, "message": "Login successful"}, status=status.HTTP_200_OK)

# Verify Code and Access Portal (Step 2)
@api_view(['POST'])
@permission_classes([AllowAny])
def verify_code(request):
    email = request.data.get('email')
    code = request.data.get('code')

    try:
        user = User.objects.get(email=email)

        if user.verification_code == code:
            # Clear the verification code after use
            user.verification_code = ''
            user.save()

            # Generate authentication token
            token, _ = Token.objects.get_or_create(user=user)

            return Response({"message": "Verification successful. You can now access the portal.", "token": token.key}, status=status.HTTP_200_OK)

        return Response({"error": "Invalid verification code."}, status=status.HTTP_400_BAD_REQUEST)

    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)


# Logout (Destroy Token)
@api_view(['POST'])
@permission_classes([IsAuthenticated])  # Only authenticated users can log out
def logout_view(request):
    request.user.auth_token.delete()  # Delete the token
    return Response({"message": "Logged out successfully."}, status=status.HTTP_200_OK)
