from datetime import timedelta
from django.utils import timezone
from .models import Policy, RenewalReminder

def generate_policy_renewal_reminders(days=30):
    today = timezone.now().date()
    cutoff = today + timedelta(days=days)

    expiring_policies = Policy.objects.filter(
        expiration_date__range=[today, cutoff],
        status="active"
    )

    created_count = 0

    for policy in expiring_policies:
        # Prevent duplicates
        exists = RenewalReminder.objects.filter(
            policy=policy,
            reminder_date=policy.expiration_date
        ).exists()

        if not exists:
            RenewalReminder.objects.create(
                policy=policy,
                customer=policy.customer,
                reminder_date=policy.expiration_date
            )
            created_count += 1

    return created_count

