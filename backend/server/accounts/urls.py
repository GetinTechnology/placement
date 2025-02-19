from django.urls import path
from .views import register, login_view, verify_code,logout_view

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', login_view, name='login'),
    path('verify/', verify_code, name='verify'),
     path('logout/', logout_view, name='logout'),
   
]
