from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Test(models.Model):
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tests',null=True)  

    def __str__(self):
        return self.name
