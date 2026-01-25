# core/models.py
from django.db import models
from django.conf import settings
import uuid


class Customer(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)

    # New fields
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=[("M", "Male"), ("F", "Female"), ("O", "Other")], blank=True)
    address1 = models.CharField(max_length=255, blank=True)
    address2 = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=50, blank=True)
    zip_code = models.CharField(max_length=20, blank=True)

    # This links the invoice to a specific user
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name="customers",
        null=True, # Allow existing ones to be null for now
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True) # ← ADD THIS

    def __str__(self):
        return self.name
    
class Policy(models.Model):

    POLICY_TYPE = [
        ("auto", "Auto"),
        ("home", "Home"),
        ("life", "Life"),
    ]
    customer = models.ForeignKey(
        Customer,
        related_name="policies",
        on_delete=models.CASCADE
    )
    policy_number = models.CharField(max_length=255)
    policy_type = models.CharField(
        max_length=20,
        choices=POLICY_TYPE,
        default="auto"
    )
    effective_date = models.DateField()
    expiration_date = models.DateField()
    premium_amount = models.DecimalField(max_digits=10, decimal_places=2)

    # This links the invoice to a specific user
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name="policies",
        null=True, # Allow existing ones to be null for now
        blank=True
    )

    def __str__(self):
        return self.name
    
class Invoice(models.Model):
    STATUS_CHOICES = [
        ('unpaid', 'Unpaid'),
        ('partial', 'Partial Paid'),
        ('paid', 'Paid in Full'),
    ]

    policy = models.ForeignKey(Policy, related_name="invoices", on_delete=models.CASCADE)
    invoice_number = models.CharField(max_length=50, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    agency_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    balance_due = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='unpaid')  # 👈 new
    issue_date = models.DateField()
    due_date = models.DateField()


      # This links the invoice to a specific user
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name="invoices",
        null=True, # Allow existing ones to be null for now
        blank=True
    )

    def save(self, *args, **kwargs):
            if not self.invoice_number:
                self.invoice_number = str(uuid.uuid4())[:8]

            # If this is a new invoice (no payments yet), set balance_due to total_amount
            if not self.pk or self.payments.count() == 0:
                self.balance_due = self.total_amount
                self.status = 'unpaid'
            else:
                # Recalculate status based on balance_due
                if self.balance_due <= 0:
                    self.status = 'paid'
                    self.balance_due = 0
                elif self.balance_due < self.total_amount:
                    self.status = 'partial'
                else:
                    self.status = 'unpaid'

            super().save(*args, **kwargs)
    
    @property
    def customer(self):
            return self.policy.customer


class Payment(models.Model):
    invoice = models.ForeignKey(Invoice, related_name="payments", on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateField()
    method = models.CharField(max_length=50)  # e.g. "Credit Card", "Cash", "Bank Transfer"

      # This links the invoice to a specific user
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name="payments",
        null=True, # Allow existing ones to be null for now
        blank=True
    )




class Document(models.Model):
    customer = models.ForeignKey(
        Customer,
        related_name="documents",
        on_delete=models.CASCADE
    )
    file = models.FileField(upload_to="customer_documents/")
    file_name = models.CharField(max_length=255, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.file_name:
            self.file_name = self.file.name
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.customer.name} - {self.file_name}"
