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
from .serializers import *
from .models import User
import random
import re



# Helper function for strong password validation
def validate_password(password):
    if len(password) < 8:
        return "Password must be at least 8 characters long."
    if not re.search(r"[A-Z]", password):
        return "Password must contain at least one uppercase letter."
    if not re.search(r"[a-z]", password):
        return "Password must contain at least one lowercase letter."
    if not re.search(r"\d", password):
        return "Password must contain at least one digit."
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return "Password must contain at least one special character (!@#$%^&* etc.)."
    return None


# User Registration
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    
    if serializer.is_valid():
        password = serializer.validated_data.get('password')

        # Validate password strength
        password_error = validate_password(password)
        if password_error:
            return Response({"error": password_error}, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.save()
        verification_code = str(random.randint(100000, 999999))
        user.verification_code = verification_code
        user.is_verified = False  # User must verify their email first
        user.save()

        # Send verification email
        send_mail(
            "Email Verification Code",
            f"Your verification code is: {verification_code}",
            "noreply@example.com",  # Change this to your email sender
            [user.email],
            fail_silently=False,
        )

        return Response({"message": "User registered successfully. Please verify your email."}, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# User Login (Step 1 - Send Verification Code)
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"error": "No account found with this email."}, status=status.HTTP_404_NOT_FOUND)

    if not user.check_password(password):
        return Response({"error": "Incorrect password."}, status=status.HTTP_400_BAD_REQUEST)

    if not user.is_verified:
        return Response({"error": "Please verify your email before logging in."}, status=status.HTTP_403_FORBIDDEN)

    token, created = Token.objects.get_or_create(user=user)

    return Response({
        "message": "Login successful.",
        "token": token.key
    }, status=status.HTTP_200_OK)




# Verify Code and Access Portal 
@api_view(['POST'])
@permission_classes([AllowAny])
def verify_code(request):
    email = request.data.get('email')
    code = request.data.get('code')

    try:
        user = User.objects.get(email=email)

        if user.verification_code != code:
            return Response({"error": "Invalid verification code."}, status=status.HTTP_400_BAD_REQUEST)

        
        user.verification_code = ''
        user.is_verified = True
        user.save()

        # Generate authentication token
        token, _ = Token.objects.get_or_create(user=user)

        return Response({
            "message": "Verification successful. You can now access the portal.",
            "token": token.key
        }, status=status.HTTP_200_OK)

    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)


# Logout (Destroy Token)
@api_view(['POST'])
@permission_classes([IsAuthenticated])  # Only authenticated users can log out
def logout_view(request):
    request.user.auth_token.delete()  # Delete the token
    return Response({"message": "Logged out successfully."}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password(request):
    email = request.data.get("email")
    
    try:
        user = User.objects.get(email=email)

        # ✅ Generate a 6-digit reset code
        reset_code = str(random.randint(100000, 999999))
        user.verification_code = reset_code
        user.save()

        # ✅ Send Email
        send_mail(
            "Reset Your Password",
            f"Your password reset code is: {reset_code}",
            "noreply@example.com",  
            [email],
            fail_silently=False,
        )

        return Response(
            {"message": "Password reset code sent to your email."},
            status=status.HTTP_200_OK
        )

    except User.DoesNotExist:
        return Response({"error": "No account found with this email."}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_reset_code(request):
    email = request.data.get("email")
    code = request.data.get("code")

    try:
        user = User.objects.get(email=email)

        if user.verification_code == code:
            return Response({"message": "Verification successful. You can now reset your password."}, status=status.HTTP_200_OK)

        return Response({"error": "Invalid verification code."}, status=status.HTTP_400_BAD_REQUEST)
    
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request):
    email = request.data.get("email")
    new_password = request.data.get("new_password")

    try:
        user = User.objects.get(email=email)

        # ✅ Validate password strength
        if len(new_password) < 8:
            return Response({"error": "Password must be at least 8 characters long."}, status=status.HTTP_400_BAD_REQUEST)

        # ✅ Reset password
        user.set_password(new_password)
        user.verification_code = ""  # Clear the reset code
        user.save()

        return Response({"message": "Password reset successfully. You can now log in."}, status=status.HTTP_200_OK)

    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
    


#student authendication 
@api_view(['POST'])
@permission_classes([AllowAny])
def register_student(request):
    print("Received Data:", request.data)  # Debugging
    serializer = StudentRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Student registered successfully"}, status=201)
    print("Errors:", serializer.errors)  # Print errors if request fails
    return Response(serializer.errors, status=400)


@api_view(['POST'])
@permission_classes([AllowAny])
def student_login(request):
    email = request.data.get("email")
    password = request.data.get("password")

    user = authenticate(email=email, password=password)

    if user:
        # ✅ Ensure the user has a student profile
        if Student.objects.filter(user=user).exists():
            token, _ = Token.objects.get_or_create(user=user)
            return Response({"message": "Student login successful", "token": token.key}, status=200)
        else:
            return Response({"error": "Not a student"}, status=403)  # Use 403 for permission denied
    return Response({"error": "Invalid credentials"}, status=401)
