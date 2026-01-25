from django.urls import path
from . import views
from .views import MonthlyRevenueView, UserViewSet, CustomerGrowthView
from django.urls import include
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register("users", UserViewSet)

urlpatterns = [

     path("", include(router.urls)),
    # ... your existing invoice paths ...
    path('customers/', views.CustomerListCreateView.as_view(), name='customer-list-create'),
    path('stats/', views.DashboardStatsView.as_view()),
    path('dashboard/monthly-revenue/', MonthlyRevenueView.as_view(), name='monthly-revenue'),
    path("dashboard/customer-growth/", CustomerGrowthView.as_view(), name="customer-growth"),
    path('policies/', views.PolicyListCreateView.as_view()),
    path('invoices/', views.InvoiceViewSet.as_view()),
    path('payments/', views.PaymentViewSet.as_view()),

    # ✨ ADD THIS LINE: This handles GET /api/customers/1/ (The specific customer)
    path('customers/<int:pk>/', views.CustomerDetailView.as_view()),

    # Add these NEW lines:
    path('login/', views.api_login, name='api_login'),
    path('logout/', views.api_logout, name='api_logout'),
    path('register/', views.api_register, name='api_register'),
    path('me/', views.me, name='me'), # Ensure your 'me' view is also here
]
