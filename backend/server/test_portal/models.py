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

class Question(models.Model):
    ANSWER_TYPES = [
        ('single', 'Single Choice'),
        ('multiple', 'Multiple Choice'),
        ('descriptive', 'Descriptive'),
        ('true_false', 'True/False'),
        ('short_answer', 'Short Answer'),
        ('survey', 'Survey'),
    ]

    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name='questions')
    text = models.TextField()
    answer_type = models.CharField(max_length=20, choices=ANSWER_TYPES)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.text

class Answer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    text = models.CharField(max_length=500)
    is_correct = models.BooleanField(default=False)  # Used for MCQs & True/False

    def __str__(self):
        return self.text