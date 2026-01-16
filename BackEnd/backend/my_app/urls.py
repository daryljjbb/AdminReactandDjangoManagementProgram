from django.urls import path
from . import views

urlpatterns = [
    # ... your existing invoice paths ...
    path('customers/', views.CustomerListCreateView.as_view(), name='customer-list-create'),
    
    # Add these NEW lines:
    path('login/', views.api_login, name='api_login'),
    path('logout/', views.api_logout, name='api_logout'),
    path('register/', views.api_register, name='api_register'),
    path('me/', views.me, name='me'), # Ensure your 'me' view is also here
]
