from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import Customer, Policy, Invoice, Payment, Document
from django.contrib.auth.models import User
from rest_framework import viewsets
from rest_framework.serializers import ModelSerializer


class CustomerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Customer
        fields = "__all__"

    

def perform_create(self, serializer):
    if serializer.validated_data["total"] <= 0:
        raise ValidationError("Invoice total must be greater than zero")
    serializer.save()


class PolicySerializer(serializers.ModelSerializer):

    customer_name = serializers.CharField(
        source="customer.name",
        read_only=True
    )

    class Meta:
        model = Policy
        fields = ['id', 'customer', 'policy_number', 'policy_type', 'effective_date', 'expiration_date', 'premium_amount', 'customer_name']
        read_only_fields = ['user']

    

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = "__all__"

    def create(self, validated_data):
        payment = super().create(validated_data)
        invoice = payment.invoice

        total_paid = sum(p.amount for p in invoice.payments.all())
        invoice.balance_due = invoice.total_amount - total_paid
        invoice.save()  # 👈 triggers status logic in model.save()

        return payment


class InvoiceSerializer(serializers.ModelSerializer):
    payments = PaymentSerializer(many=True, read_only=True)
    total_paid = serializers.SerializerMethodField()
    customer = serializers.PrimaryKeyRelatedField(source='policy.customer', read_only=True)
    customer_name = serializers.CharField(source='policy.customer.name', read_only=True)

    class Meta:
        model = Invoice
        fields = [
            'id',
            'invoice_number',
            'policy',
            'customer',
            'customer_name',
            'amount',
            'total_amount',
            'balance_due',
            'status',
            'issue_date',
            'due_date',
            'agency_fee',
            'payments',
            'total_paid',  # 👈 ADD THIS
        ]
        read_only_fields = ['amount', 'total_amount', 'balance_due', 'invoice_number', 'status']


    def get_total_paid(self, obj): 
        return sum(p.amount for p in obj.payments.all())

    def create(self, validated_data):
        policy = validated_data['policy']
        agency_fee = validated_data.get('agency_fee', 0.00)

        # Use the correct field name from your Policy model: premium_amount
        amount = policy.premium_amount 
        total_amount = amount + agency_fee

        validated_data['amount'] = amount
        validated_data['total_amount'] = total_amount
        validated_data['balance_due'] = total_amount
        validated_data['status'] = 'unpaid'

        return super().create(validated_data)
    


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "is_staff", "is_active"]

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer



class DocumentSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Document
        fields = ["id", "customer", "file_name", "file_url", "uploaded_at", "file"]

    def get_file_url(self, obj):
        request = self.context.get("request")
        return request.build_absolute_uri(obj.file.url)




class CustomerReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ["id", "name", "date_of_birth", "phone", "email"]

class PolicyReportSerializer(serializers.ModelSerializer):
    customer = CustomerReportSerializer()

    class Meta:
        model = Policy
        fields = ["id", "policy_type", "effective_date", "expiration_date", "status", "customer"]

class InvoiceReportSerializer(serializers.ModelSerializer):
    customer = CustomerReportSerializer()

    class Meta:
        model = Invoice
        fields = ["id", "due_date", "is_paid", "total_amount", "customer"]

class RevenuePointSerializer(serializers.Serializer):
    month = serializers.CharField()
    total = serializers.DecimalField(max_digits=12, decimal_places=2)
