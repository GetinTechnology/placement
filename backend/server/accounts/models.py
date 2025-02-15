from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    username = None  # Remove username field
    email = models.EmailField(unique=True)  # Make email the unique identifier
    is_verified = models.BooleanField(default=False)
    verification_code = models.CharField(max_length=6, blank=True)

    USERNAME_FIELD = 'email'  # Use email instead of username
    REQUIRED_FIELDS = []  # No additional required fields

    def __str__(self):
        return self.email
