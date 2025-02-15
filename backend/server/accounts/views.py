
from django.contrib.auth import authenticate
from django.core.mail import send_mail
from django.conf import settings
import random
import string
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import  *

@api_view(['POST','GET'])
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User registered successfully. Please log in."}, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    user = authenticate(username=email, password=password)  # Check user credentials

    if user is not None:
        # Generate a 6-digit verification code
        verification_code = ''.join(random.choices(string.digits, k=6))
        user.verification_code = verification_code
        user.save()
        
        # Send verification code via email
        send_mail(
            'Your Verification Code',
            f'Your verification code is: {verification_code}',
            settings.DEFAULT_FROM_EMAIL,
            [user.email]
        )
        
        return Response({"message": "Verification code sent to email."}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Invalid email or password."}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def verify_code(request):
    email = request.data.get('email')
    code = request.data.get('code')

    try:
        user = User.objects.get(email=email)

        if user.verification_code == code:
            user.is_verified = True
            user.verification_code = ''  # Clear the code after verification
            user.save()
            
            return Response({"message": "Verification successful. You are now logged in."}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid verification code."}, status=status.HTTP_400_BAD_REQUEST)

    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
