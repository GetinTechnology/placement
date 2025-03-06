from django.db import models
from django.contrib.auth import get_user_model
from django.conf import settings
import uuid

User = get_user_model()

class Category(models.Model):
    name = models.CharField(max_length=100)

class Test(models.Model):
    name = models.CharField(max_length=255)
    category = models.ForeignKey(Category,on_delete=models.CASCADE,null=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tests',null=True)  

    def __str__(self):
        return self.name

class Question(models.Model):
    SINGLE_CHOICE = "single_choice"
    MULTIPLE_CHOICE = "multiple_choice"
    DESCRIPTIVE = "descriptive"
    TRUE_FALSE = "true_false"
    SHORT_ANSWER = "short_answer"
    SURVEY = "survey"

    QUESTION_TYPES = [
        (SINGLE_CHOICE, "Single Choice"),
        (MULTIPLE_CHOICE, "Multiple Choice"),
        (DESCRIPTIVE, "Descriptive"),
        (TRUE_FALSE, "True/False"),
        (SHORT_ANSWER, "Short Answer"),
        (SURVEY, "Survey"),
    ]

    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name="questions")
    text = models.TextField()
    question_type = models.CharField(max_length=50, choices=QUESTION_TYPES)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    points = models.IntegerField(default=1)  


    def __str__(self):
        return self.text

class Answer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="answers")
    text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)

class TestAttempt(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    test = models.ForeignKey(Test, on_delete=models.CASCADE)
    attempt_uuid = models.UUIDField(default=uuid.uuid4, unique=True)
    submitted = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.student.email} - {self.test.title} ({self.attempt_uuid})"


class StudentResponse(models.Model):
    attempt = models.ForeignKey(TestAttempt, on_delete=models.CASCADE, related_name="responses")
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_choices = models.ManyToManyField(Answer, blank=True)
    descriptive_answer = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.attempt.student.email} - {self.question.text}"