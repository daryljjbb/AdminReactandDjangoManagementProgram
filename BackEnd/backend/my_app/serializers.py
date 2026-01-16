from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import Customer


class CustomerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Customer
        fields = "__all__"

    

def perform_create(self, serializer):
    if serializer.validated_data["total"] <= 0:
        raise ValidationError("Invoice total must be greater than zero")
    serializer.save()