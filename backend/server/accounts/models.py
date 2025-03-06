from django.contrib.auth.models import AbstractUser,BaseUserManager
from django.db import models
from django.conf import settings


class User(AbstractUser):
    username = None  # Remove username field
    email = models.EmailField(unique=True)  # Make email the unique identifier
    is_verified = models.BooleanField(default=True)
    verification_code = models.CharField(max_length=6, blank=True)

    USERNAME_FIELD = 'email'  # Use email instead of username
    REQUIRED_FIELDS = []  # No additional required fields

    def __str__(self):
        return self.email



class Student(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="student_profile")
    student_name = models.EmailField(unique=True)
    enrolled_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Student: {self.user.email}"