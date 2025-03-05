from django.urls import path
from .views import register, login_view, verify_code,logout_view,forgot_password,verify_reset_code,reset_password

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', login_view, name='login'),
    path('verify/', verify_code, name='verify'),
     path('logout/', logout_view, name='logout'),
     path('forgot_password/',forgot_password, name='forgot_password'),
     path('verify_reset_code/',verify_reset_code, name='verify_reset_code'),
     path('reset_password/',reset_password, name='reset_password'),
]
