from django.db import models
from django.contrib.auth import get_user_model
from django.conf import settings
import uuid
from datetime import timedelta
from django.utils.timezone import now
import random

User = get_user_model()

class Category(models.Model):
    name = models.CharField(max_length=100)  
    created_by = models.ForeignKey(User, on_delete=models.CASCADE,null=True)  
    created_at = models.DateTimeField(default=now)

class Test(models.Model):
    name = models.CharField(max_length=255)
    category = models.ForeignKey(Category,on_delete=models.CASCADE,null=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tests',null=True)  
    def __str__(self):
        return self.name

class TestActive(models.Model):
    test = models.OneToOneField(Test, on_delete=models.CASCADE, related_name="active_status")
    is_active = models.BooleanField(default=False)
    activated_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.is_active and not self.expires_at:
            self.expires_at = now() + timedelta(hours=1)  # Auto-expire after 1 hour
        super().save(*args, **kwargs)

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
    text = models.CharField(max_length=255,blank=True)
    is_correct = models.BooleanField(default=False)
    


class TestAttempt(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    test = models.ForeignKey(Test, on_delete=models.CASCADE)
    attempt_uuid = models.UUIDField(default=uuid.uuid4, unique=True)
    submitted = models.BooleanField(default=False)

    def calculate_score(self):
        total_score = 0
        total_marks = 0
        responses = self.responses.all()

        if not responses.exists():  # If no responses, return 0 safely
            return 0, 1  # Avoid division by zero in percentage calculation

        for response in responses:
            question = response.question
            correct_answers = set(question.answers.filter(is_correct=True).values_list("id", flat=True))
            selected_answers = set(response.selected_choices.values_list("id", flat=True))

            if correct_answers == selected_answers:
                total_score += question.points  #points only if the answer is correct
        
            total_marks += question.points  # Sum total possible marks

        return total_score, total_marks



class StudentResponse(models.Model):
    attempt = models.ForeignKey(TestAttempt, on_delete=models.CASCADE, related_name="responses")
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_choices = models.ManyToManyField(Answer, blank=True)
    descriptive_answer = models.TextField(blank=True, null=True)
    marks_awarded = models.FloatField(blank=True, null=True)  

    def __str__(self):
        return f"{self.attempt.student.email} - {self.question.text}"


class StudentTestResult(models.Model):
    attempt = models.OneToOneField(TestAttempt, on_delete=models.CASCADE, related_name="result")
    score = models.FloatField(default=0)
    total_marks = models.FloatField(default=0)
    percentage = models.FloatField(default=0)
    submitted_at = models.DateTimeField(auto_now_add=True)
    manual_grading_pending = models.BooleanField(default=False)  

    def calculate_percentage(self):
        return (self.score / self.total_marks) * 100

    def __str__(self):
        return f"Result: {self.attempt.student.username} - {self.attempt.test.name}"
    

class TestSet(models.Model):
    ORDER_TYPE_CHOICES = [
        ('fixed', 'Fixed Order'),
        ('shuffle', 'Shuffle Questions & Answers'),
    ]
    
    test = models.OneToOneField('Test', on_delete=models.CASCADE, related_name="test_set")
    order_type = models.CharField(max_length=10, choices=ORDER_TYPE_CHOICES, default='fixed')
    questions_per_page = models.IntegerField(default=5)  # Controls how many questions appear per page

    def get_questions(self):
        """Returns questions based on order type."""
        questions = list(self.test.questions.all())
        if self.order_type == 'shuffle':
            random.shuffle(questions)
        return questions

    def get_answers(self, question):
        """Returns answers for a question based on order type."""
        answers = list(question.answers.all())
        if self.order_type == 'shuffle':
            random.shuffle(answers)
        return answers
    




