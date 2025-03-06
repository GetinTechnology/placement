from django.urls import path
from .views import *

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', login_view, name='login'),
    path('verify/', verify_code, name='verify'),
     path('logout/', logout_view, name='logout'),
     path('forgot_password/',forgot_password, name='forgot_password'),
     path('verify_reset_code/',verify_reset_code, name='verify_reset_code'),
     path('reset_password/',reset_password, name='reset_password'),
     path('register_student/',register_student,name='register_student'),
     path('student_login/',student_login,name='student_login')
]
