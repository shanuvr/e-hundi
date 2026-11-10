import random
import uuid
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from temples.models import Temple
from payments.models import Payment


class Command(BaseCommand):
    help = 'Seeds realistic payment transactions for temples'

    def handle(self, *args, **options):
        temples = Temple.objects.all()
        if not temples.exists():
            self.stdout.write(self.style.ERROR('No temples found. Create a temple first.'))
            return

        now = timezone.now()
        names = [
            'Aravind Menon', 'Radhika Nair', 'Suresh Kumar', 'Ananya Pillai',
            'Gopalakrishnan N', 'Meera Varma', 'Rajesh K', 'Lakshmi Devi',
            'Deepak R', 'Sreeja Mohan', 'Vishnu Prasad', 'Devotee',
            'Kavitha S', 'Harikrishnan P', 'Devotee'
        ]
        amounts = [10, 20, 50, 50, 100, 100, 100, 200, 200, 500, 500, 1000, 2000]

        for temple in temples:
            # Check if temple already has payments
            existing = Payment.objects.filter(temple=temple).count()
            if existing >= 10:
                self.stdout.write(self.style.NOTICE(f'Temple {temple.name} already has {existing} payments. Skipping.'))
                continue

            self.stdout.write(f'Seeding payments for temple: {temple.name}...')
            created_count = 0

            # Create ~35 realistic payments spanning the last 7 days
            for day_offset in range(7, -1, -1):
                day_date = now - timedelta(days=day_offset)
                # 3 to 7 payments per day
                num_payments = random.randint(3, 7) if day_offset > 0 else 6

                for i in range(num_payments):
                    amount = random.choice(amounts)
                    status_rand = random.random()
                    if status_rand > 0.15:
                        status = 'SUCCESS'
                    elif status_rand > 0.08:
                        status = 'PENDING'
                    else:
                        status = 'FAILED'

                    hour = random.randint(6, 21)
                    minute = random.randint(0, 59)
                    created_time = day_date.replace(hour=hour, minute=minute, second=random.randint(0, 59))

                    donor_name = random.choice(names)
                    order_id = f"order_{temple.id}_{uuid.uuid4().hex[:10]}"
                    phone = f"98{random.randint(10000000, 99999999)}" if donor_name != 'Devotee' else ''

                    p = Payment(
                        temple=temple,
                        order_id=order_id,
                        cf_order_id=f"cf_{order_id}",
                        amount=amount,
                        currency='INR',
                        status=status,
                        gateway='cashfree',
                        payment_method='UPI',
                        donor_name=donor_name,
                        donor_phone=phone,
                        donor_email=f"{donor_name.lower().replace(' ', '.')}@gmail.com" if phone else '',
                        is_tax_exempt_80g=(amount >= 500),
                    )
                    p.save()
                    # Override created_at with historical timestamp
                    Payment.objects.filter(pk=p.pk).update(created_at=created_time, updated_at=created_time)
                    created_count += 1

            self.stdout.write(self.style.SUCCESS(f'Successfully created {created_count} payments for {temple.name}'))

