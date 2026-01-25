

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from my_app import views
from .views import UserViewSet, DocumentViewSet, MonthlyRevenueView, CustomerGrowthView, DashboardStatsView, InvoiceListCreateView, PaymentListCreateView



router = DefaultRouter()
router.register("users", UserViewSet)
router.register("documents", DocumentViewSet)

urlpatterns = [
    path("", include(router.urls)),

    path('customers/', views.CustomerListCreateView.as_view()),
    path('customers/<int:pk>/', views.CustomerDetailView.as_view()),

    path('stats/', views.DashboardStatsView.as_view()),
    path('dashboard/monthly-revenue/', MonthlyRevenueView.as_view()),
    path("dashboard/customer-growth/", CustomerGrowthView.as_view()),

    path('policies/', views.PolicyListCreateView.as_view()),
    path('invoices/', views.InvoiceListCreateView.as_view()),   # renamed
    path('payments/', views.PaymentListCreateView.as_view()),   # renamed

    path('login/', views.api_login),
    path('logout/', views.api_logout),
    path('register/', views.api_register),
    path('me/', views.me),
]

