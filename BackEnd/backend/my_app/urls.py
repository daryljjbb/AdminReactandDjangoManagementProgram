

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CustomerListCreateView,
    CustomerDetailView,
    PolicyListCreateView,
    InvoiceListCreateView,
    PaymentListCreateView,
    DocumentViewSet,
    UserViewSet,
    MonthlyRevenueView,
    CustomerGrowthView,
    DashboardStatsView,
    api_login, api_logout, api_register, me,
)
from .views import (

    # Reports
    BirthdayReportView,
    ExpiredPoliciesReportView,
    ExpiringSoonPoliciesReportView,
    NoActivePoliciesReportView,
    OverdueInvoicesReportView,
    RevenueReportView,
    RenewalReminderView,
)


router = DefaultRouter()
router.register("users", UserViewSet)
router.register("documents", DocumentViewSet)


urlpatterns = [
    path("", include(router.urls)),

    path('customers/', CustomerListCreateView.as_view()),
    path('customers/<int:pk>/', CustomerDetailView.as_view()),

    path('stats/', DashboardStatsView.as_view()),
    path('dashboard/monthly-revenue/', MonthlyRevenueView.as_view()),
    path("dashboard/customer-growth/", CustomerGrowthView.as_view()),

    path('policies/', PolicyListCreateView.as_view()),
    path('invoices/',InvoiceListCreateView.as_view()),   # renamed
    path('payments/',PaymentListCreateView.as_view()),   # renamed

    path('login/', api_login),
    path('logout/', api_logout),
    path('register/', api_register),
    path('me/', me),

    path("reports/birthdays/", BirthdayReportView.as_view(), name="report-birthdays"),
    path("reports/expired-policies/", ExpiredPoliciesReportView.as_view(), name="report-expired-policies"),
    path("reports/expiring-soon/", ExpiringSoonPoliciesReportView.as_view(), name="report-expiring-soon"),
    path("reports/no-active-policies/", NoActivePoliciesReportView.as_view(), name="report-no-active-policies"),
    path("reports/overdue-invoices/", OverdueInvoicesReportView.as_view(), name="report-overdue-invoices"),
    path("reports/revenue/", RevenueReportView.as_view(), name="report-revenue"),
    path("reports/renewal-reminders/", RenewalReminderView.as_view()),

]



urlpatterns += router.urls





