from rest_framework import generics, permissions
from rest_framework.permissions import IsAdminUser
from rest_framework.views import APIView
from django.db.models.functions import TruncMonth
from django.db.models import Sum
from rest_framework import filters # 1. Make sure this is imported
from django.contrib.auth.models import User
from .models import Customer, Policy, Invoice, Payment, Document
from django.contrib.auth import authenticate, login, logout
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.decorators import api_view, permission_classes
from .serializers import CustomerSerializer, PolicySerializer, InvoiceSerializer, PaymentSerializer, UserSerializer, DocumentSerializer
from datetime import datetime
from datetime import timedelta
from django.db.models import Count
from django.utils.timezone import now
from django.contrib.auth.models import User
from rest_framework import viewsets

class CustomerListCreateView(generics.ListCreateAPIView):
    serializer_class = CustomerSerializer
    # Note: We don't need 'queryset = Customer.objects.all()' anymore 
    # because get_queryset handles everything.

    def get_queryset(self):
        user = self.request.user
        
        # 1. If user is logged in and is Staff/Admin, show everything
        if user.is_authenticated and user.is_staff:
            return Customer.objects.all()
        
        # 2. If user is a regular logged-in user (like Daryl), show only their own
        if user.is_authenticated:
            return Customer.objects.filter(user=user)

        # 3. FIX: Changed Invoice.objects.none() to Customer.objects.none()
        # This ensures guests see an empty list instead of a system error.
        return Customer.objects.none() 

    def perform_create(self, serializer):
        # Automatically link the CUSTOMER to whoever is logged in
        serializer.save(user=self.request.user)

    def get_permissions(self):
        # POST (Creating) requires a login
        if self.request.method == "POST":
            return [permissions.IsAuthenticated()]
        
        # GET (Viewing) is allowed for everyone (but guests see an empty list)
        return [permissions.AllowAny()]
    
    # 2. Add filters.SearchFilter to this list
    filter_backends = [
        DjangoFilterBackend, 
        filters.SearchFilter, # <--- Add this!
        filters.OrderingFilter
    ]

      # 3. Tell SearchFilter which fields to check when ?search= is in the URL
    search_fields = ["name", "email"] 
    
    filterset_fields = {
        "name": ["icontains"],                     # optional: search by name
        "email": ["icontains"],                    # optional: search by email
    }
    ordering_fields = ["name", "email"]
    ordering = ["name"]



@api_view(["GET"])
@permission_classes([AllowAny]) # Changed from IsAuthenticated to AllowAny
def me(request):
    if request.user.is_authenticated:
        return Response({
            "username": request.user.username,
            "is_staff": request.user.is_staff,
            "is_superuser": request.user.is_superuser
        })
    # If not authenticated, return status 200 (Success) with empty data
    return Response({
        "username": "", 
        "is_staff": False, 
        "is_superuser": False
    }, status=200)


@api_view(['POST'])
@permission_classes([AllowAny])
def api_login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    
    if user is not None:
        login(request, user)
        return Response({
            "message": "Logged in",
            "is_staff": user.is_staff,
            "is_superuser": user.is_superuser
        })
    return Response({"error": "Invalid credentials"}, status=400)

@api_view(['POST'])
def api_logout(request):
    logout(request)
    return Response({"message": "Logged out"}, status=200)


@api_view(['POST'])
@permission_classes([AllowAny])
def api_register(request):
    username = request.data.get('username')
    password = request.data.get('password')
    is_admin = request.data.get('is_admin', False)

    if not username or not password:
        return Response({"error": "Username and password required"}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=400)

    # Create the user
    user = User.objects.create_user(username=username, password=password)
    
    # If the checkbox was checked, make them a Staff/Superuser
    if is_admin:
        user.is_staff = True
        user.is_superuser = True
        user.save()

    return Response({"message": "User created successfully"}, status=201)

class AdminStatsView(APIView):
    # This prevents regular users from fetching admin data even if they know the URL
    permission_classes = [IsAdminUser] 
    
    def get(self, request):
        # Return admin-only statistics...
        pass


class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.is_staff:
            customers = Customer.objects.all()
            invoices = Invoice.objects.all()
        else:
            customers = Customer.objects.filter(user=user)
            invoices = Invoice.objects.filter(customer__user=user)

        customer_count = customers.count()
        total_revenue = sum(inv.total_amount for inv in invoices if inv.status == "paid")
        unpaid_count = invoices.filter(status="pending").count()
        paid_count = invoices.filter(status="paid").count()
        overdue_count = invoices.filter(status="overdue").count()

        return Response({
            "customer_count": customer_count,
            "total_revenue": total_revenue,
            "unpaid_count": unpaid_count,
            "paid_count": paid_count,
            "overdue_count": overdue_count,
            "is_admin": user.is_staff
        })

    
# ✨ NEW Detail View (REQUIRED for /api/customers/1/)
class CustomerDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated]


class PolicyListCreateView(generics.ListCreateAPIView):
    queryset = Policy.objects.all()
    serializer_class = PolicySerializer

    def get_queryset(self):
        user = self.request.user
        queryset = Policy.objects.all()

        # Optional filter by customer
        customer_id = self.request.query_params.get('customer')
        if customer_id:
            queryset = queryset.filter(customer_id=customer_id)

        # Staff/Admin: see everything (with optional customer filter)
        if user.is_authenticated and user.is_staff:
            return queryset

        # Regular logged-in user: only their own policies
        if user.is_authenticated:
            return queryset.filter(user=user)

        # Guest: see nothing
        return Policy.objects.none()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_permissions(self):
        if self.request.method == "POST":
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]


class InvoiceListCreateView(generics.ListCreateAPIView):

    serializer_class = InvoiceSerializer
    
    def get_queryset(self):
        user = self.request.user
        # Start with a base queryset (all or user-owned)
        if user.is_staff:
            queryset = Invoice.objects.all()
        else:
            queryset = Invoice.objects.filter(user=user)

        # Then apply the policy filter if it exists in the URL (?policy=4)
        policy_id = self.request.query_params.get('policy')
        if policy_id:
            queryset = queryset.filter(policy_id=policy_id)
            
        return queryset

    def perform_create(self, serializer):
        # Link the invoice to the logged-in user
        serializer.save(user=self.request.user)

class PaymentListCreateView(generics.ListCreateAPIView):

    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['invoice']
    ordering_fields = ['payment_date', 'amount']
    ordering = ['payment_date']

    def perform_create(self, serializer):
        payment = serializer.save()
        update_invoice_status(payment.invoice)




def update_invoice_status(invoice):
    total_paid = invoice.payments.aggregate(total=Sum("amount"))["total"] or 0

    if total_paid == 0:
        invoice.status = "unpaid"
    elif total_paid < invoice.total_amount:
        invoice.status = "partially_paid"
    else:
        invoice.status = "paid"

    invoice.save()


class MonthlyRevenueView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        invoices = Invoice.objects.filter(status="paid")

        data = (
            invoices
            .annotate(month=TruncMonth('issue_date'))
            .values('month')
            .annotate(total=Sum('total_amount'))
            .order_by('month')
        )

        formatted = [
            {
                "month": entry["month"].strftime("%b %Y"),
                "total": entry["total"]
            }
            for entry in data
        ]

        return Response(formatted)
    
class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer



class CustomerGrowthView(APIView):
    def get(self, request):
        # Get customers created in the last 12 months
        one_year_ago = now() - timedelta(days=365)
        monthly_counts = (
            Customer.objects.filter(created_at__gte=one_year_ago)
            .annotate(month=TruncMonth("created_at"))
            .values("month")
            .annotate(count=Count("id"))
            .order_by("month")
        )

        # Convert to cumulative format
        cumulative = []
        total = 0
        for entry in monthly_counts:
            total += entry["count"]
            cumulative.append({
                "month": entry["month"].strftime("%b %Y"),
                "customers": total
            })

        return Response(cumulative)


class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        customer_id = self.request.query_params.get("customer")
        if customer_id:
            qs = qs.filter(customer_id=customer_id)
        return qs
