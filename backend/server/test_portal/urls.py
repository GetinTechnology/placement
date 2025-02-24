from django.urls import path
from . import views

urlpatterns = [
    path('test/', views.test, name='test'),
    path('updatetest/<int:test_id>', views.test, name='update'),
    path('delete/<int:test_id>',views.delete_test,name='delete'),
    path("test/<int:test_id>/questions/add", views.add_question, name="add_question"),
    path("test/<int:test_id>/questions", views.get_questions, name="get_questions"),
    path("question/<int:question_id>/answers/add", views.add_answer, name="add_answer"),
    path("question/<int:question_id>/answers", views.get_answers, name="get_answers"),
]