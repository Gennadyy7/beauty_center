from django.test import TestCase, Client
from django.urls import reverse
from .models import ServiceCategories, Specializations, ServiceSpecializations, Services, Clients, Doctors, Reviews, PromoCodes, Orders, Vacancies
from .forms import UserLoginForm, ClientRegistrationForm, ReviewForm
from django.contrib.auth.models import User

class ClinicTests(TestCase):
    def setUp(self):
        self.client = Client()

    def test_login_view(self):
        response = self.client.get(reverse('to_login'))
        self.assertEqual(response.status_code, 200)

    def test_registration_view(self):
        response = self.client.get(reverse('registration'))
        self.assertEqual(response.status_code, 200)

    def test_contacts_view(self):
        response = self.client.get(reverse('contacts'))
        self.assertEqual(response.status_code, 200)

    def test_vacancies_view(self):
        response = self.client.get(reverse('vacancies'))
        self.assertEqual(response.status_code, 200)

    def test_reviews_view(self):
        response = self.client.get(reverse('reviews'))
        self.assertEqual(response.status_code, 200)

    def test_add_review_view(self):
        response = self.client.get(reverse('add_review'))
        self.assertEqual(response.status_code, 200)

    def test_services_view(self):
        response = self.client.get(reverse('services'))
        self.assertEqual(response.status_code, 200)

    def test_promocodes_view(self):
        response = self.client.get(reverse('promocodes'))
        self.assertEqual(response.status_code, 200)

    def test_schedule_view(self):
        response = self.client.get(reverse('schedule'))
        self.assertEqual(response.status_code, 200)

    def test_ordering_view(self):
        response = self.client.get(reverse('ordering'))
        self.assertEqual(response.status_code, 200)

    def test_service_categories_model(self):
        service_category = ServiceCategories.objects.create(name='Test category')
        self.assertEqual(str(service_category), 'Test category')

    def test_specializations_model(self):
        specialization = Specializations.objects.create(name='Test specialization', description='Test description')
        self.assertEqual(str(specialization), 'Test specialization')

    def test_service_specializations_model(self):
        service_category = ServiceCategories.objects.create(name='Test category')
        specialization = Specializations.objects.create(name='Test specialization', description='Test description')
        service_specialization = ServiceSpecializations.objects.create(service_category=service_category, doctor_specialization=specialization)
        self.assertEqual(str(service_specialization), 'Test category - Test specialization')

    def test_services_model(self):
        service_category = ServiceCategories.objects.create(name='Test category')
        specialization = Specializations.objects.create(name='Test specialization', description='Test description')
        service_specialization = ServiceSpecializations.objects.create(service_category=service_category, doctor_specialization=specialization)
        service = Services.objects.create(title='Test service', description='Test description', service_specialization=service_specialization, price=100)
        self.assertEqual(str(service), 'Test service')

    def test_clients_model(self):
        user = User.objects.create_user(username='testuser', password='12345')
        client = Clients.objects.create(user=user, surname='Test', name='User', patronymic='Testovich', birth_date='2000-01-01', address='Test address', phone='+375 (29) 123-45-67')
        self.assertEqual(str(client), 'Test')

    def test_doctors_model(self):
        user = User.objects.create_user(username='testuser', password='12345')
        service_category = ServiceCategories.objects.create(name='Test category')
        specialization = Specializations.objects.create(name='Test specialization', description='Test description')
        service_specialization = ServiceSpecializations.objects.create(service_category=service_category, doctor_specialization=specialization)
        doctor = Doctors.objects.create(user=user, surname='Test', name='Doctor', patronymic='Testovich', phone='+375 (29) 123-45-67', email='test@example.com', service_specialization=service_specialization)
        self.assertEqual(str(doctor), 'Test')

    def test_reviews_model(self):
        user = User.objects.create_user(username='testuser', password='12345')
        review = Reviews.objects.create(user=user, text='Test review', rating=5)
        self.assertEqual(str(review), 'Отзыв от testuser')

    def test_promo_codes_model(self):
        promo_code = PromoCodes.objects.create(code='TESTCODE', discount=10, expiration_date='2022-12-31')
        self.assertEqual(str(promo_code), 'TESTCODE')

    def test_vacancies_model(self):
        service_category = ServiceCategories.objects.create(name='Test category')
        specialization = Specializations.objects.create(name='Test specialization', description='Test description')
        service_specialization = ServiceSpecializations.objects.create(service_category=service_category, doctor_specialization=specialization)
        vacancy = Vacancies.objects.create(service_specialization=service_specialization)
        self.assertEqual(str(vacancy), 'Test specialization')

    def test_user_login_form(self):
        User.objects.create_user(username='testuser', password='12345')
        form_data = {'username': 'testuser', 'password': '12345'}
        form = UserLoginForm(data=form_data)
        self.assertTrue(form.is_valid())

    def test_client_registration_form(self):
        form_data = {
            'username': 'testuser',
            'password1': '12345',
            'password2': '12345',
            'surname': 'Test',
            'name': 'User',
            'patronymic': 'Testovich',
            'birth_date': '2000-01-01',
            'address': 'Test address',
            'phone': '+375 (29) 123-45-67'
        }
        form = ClientRegistrationForm(data=form_data)
        self.assertTrue(form.is_valid())

    def test_review_form(self):
        form_data = {'rating': 5, 'text': 'Test review'}
        form = ReviewForm(data=form_data)
        self.assertTrue(form.is_valid())

    def test_orders_model(self):
        user = User.objects.create_user(username='testuser', password='12345')
        user2 = User.objects.create_user(username='testuser2', password='12345')
        service_category = ServiceCategories.objects.create(name='Test category')
        specialization = Specializations.objects.create(name='Test specialization', description='Test description')
        service_specialization = ServiceSpecializations.objects.create(service_category=service_category,
                                                                       doctor_specialization=specialization)
        doctor = Doctors.objects.create(user=user2, surname='Test', name='Doctor', patronymic='Testovich',
                                        phone='+375 (29) 123-45-67', email='test@example.com',
                                        service_specialization=service_specialization)
        service = Services.objects.create(title='Test service', description='Test description',
                                          service_specialization=service_specialization, price=100)
        promo_code = PromoCodes.objects.create(code='TESTCODE', discount=10, expiration_date='2022-12-31')
        order = Orders.objects.create(user=user, doctor=doctor, promo_code=promo_code,
                                      appointment_date='2022-12-31 12:00:00', total_price=90)
        order.services.add(service)
        self.assertEqual(str(order), 'Заказ №1 от testuser')
