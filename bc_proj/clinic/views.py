from decimal import Decimal
from datetime import datetime, date
from io import BytesIO
from django.views.generic import ListView
from statistics import mean, multimode, median

from django.core.files.base import ContentFile
from django.http import Http404
from django.utils import timezone
import random

from django.utils.crypto import get_random_string
from django.views.generic import UpdateView, DeleteView
from django.contrib import messages
from django.contrib.auth import login
from django.contrib.auth.models import User
from django.db.models import Avg, Sum
from django.shortcuts import render, redirect, get_object_or_404
from .forms import UserLoginForm, ClientRegistrationForm, ReviewForm, PromocodeForm
from .models import Clients, ServiceSpecializations, Vacancies, Reviews, Services, PromoCodes, \
    Orders, Doctors, Specializations
import requests
from django.contrib.auth.mixins import UserPassesTestMixin
import matplotlib.pyplot as plt

def remove_cat_from_basket(request, cat_name):
    cat_dict = request.session.get('basket_services', dict())
    if cat_name in cat_dict:
        del cat_dict[cat_name]
    request.session['basket_services'] = cat_dict

class AdminRequiredMixin(UserPassesTestMixin):
    def test_func(self):
        return self.request.user.is_superuser

    def handle_no_permission(self):
        return redirect('home')

class reviewsUpdateView(AdminRequiredMixin, UpdateView):
    model = Reviews
    template_name = 'clinic/add_review.html'
    form_class = ReviewForm

class reviewsDeleteView(AdminRequiredMixin, DeleteView):
    model = Reviews
    success_url = '/clinic/reviews'
    template_name = 'clinic/delete_review.html'

class promocodeUpdateView(AdminRequiredMixin, UpdateView):
    model = PromoCodes
    template_name = 'clinic/add_promocode.html'
    form_class = PromocodeForm

class promocodeDeleteView(AdminRequiredMixin, DeleteView):
    model = PromoCodes
    success_url = '/clinic/promocodes'
    template_name = 'clinic/delete_promocode.html'

def login_view(request):
    error = ''
    if request.method == 'POST':
        form = UserLoginForm(data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('home')
        else:
            error = 'Неверное имя пользователя или пароль'

    form = UserLoginForm()

    data = {
        'form': form,
        'error': error
    }

    return render(request, 'clinic/login.html', data)

def registration_view(request):
    error = ''
    if request.method == 'POST':
        form = ClientRegistrationForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password1')
            user = User.objects.create_user(username=username, password=password)

            client = Clients(
                user=user,
                surname=form.cleaned_data.get('surname'),
                name=form.cleaned_data.get('name'),
                patronymic=form.cleaned_data.get('patronymic'),
                birth_date=form.cleaned_data.get('birth_date'),
                address=form.cleaned_data.get('address'),
                phone=form.cleaned_data.get('phone')
            )
            client.save()
            messages.success(request, f'Аккаунт создан для {username}!')
            return redirect('to_login')
        else:
            error = 'Неверная форма'
            print(form.errors)

    form = ClientRegistrationForm()

    data = {
        'form': form,
        'error': error
    }
    return render(request, 'clinic/registration.html', data)

def contacts_view(request):
    service_specializations = ServiceSpecializations.objects.all()
    return render(request, 'clinic/contacts.html', {'service_specializations': service_specializations})

def vacancies_view(request):
    vacancies = Vacancies.objects.all()
    return render(request, 'clinic/vacancies.html', {'vacancies': vacancies})

def reviews_view(request):
    reviews = Reviews.objects.order_by('-id')
    average_rating = reviews.aggregate(Avg('rating'))['rating__avg']
    if average_rating is not None:
        average_rating = round(average_rating, 1)
    else:
        average_rating = '-'
    return render(request, 'clinic/reviews.html', {'reviews': reviews, 'average_rating': average_rating})

def add_review_view(request):
    error = ''
    if request.method == 'POST':
        form = ReviewForm(request.POST)
        if form.is_valid():
            review = form.save(commit=False)
            review.user = request.user
            review.save()
            return redirect('reviews')
        else:
            error = 'Форма была неверной'

    form = ReviewForm()

    data = {
        'form': form,
        'error': error
    }

    return render(request, 'clinic/add_review.html', data)

def add_random_client(request):
    response = requests.get('https://randomuser.me/api/')
    data = response.json()

    user_data = data['results'][0]
    username = user_data['login']['username']
    password = 'nageraper7'
    first_name = user_data['name']['first']
    last_name = user_data['name']['last']
    patronymic = 'Апишевич'
    dob = datetime.strptime(user_data['dob']['date'], "%Y-%m-%dT%H:%M:%S.%fZ").date()
    part1 = random.randint(10, 99)
    part2 = random.randint(100, 999)
    part3 = random.randint(10, 99)
    part4 = random.randint(10, 99)
    phone = f"+375 ({part1}) {part2}-{part3}-{part4}"
    address = f"{user_data['location']['street']['name']} {user_data['location']['street']['number']}, {user_data['location']['city']}, {user_data['location']['state']}, {user_data['location']['country']}"

    user = User.objects.create_user(username=username, password=password)

    client = Clients(user=user, surname=last_name, name=first_name, patronymic=patronymic, birth_date=dob, address=address, phone=phone)
    client.save()
    return redirect('home')


def services_view(request):
    services = Services.objects.order_by('-id')
    service_specializations = ServiceSpecializations.objects.filter(services__in=services).distinct()

    category = request.GET.get('category')
    if category:
        services = services.filter(service_specialization__service_category=category)

    sort = request.GET.get('sort')
    if sort == 'price_asc':
        services = services.order_by('price')
    elif sort == 'price_desc':
        services = services.order_by('-price')

    ordered_services = request.session.get('ordered_services', [])

    if request.method == 'POST':
        service_id = request.POST.get('service_id')
        if service_id:
            service = Services.objects.get(id=service_id)

            if service_id in ordered_services:
                ordered_services.remove(service_id)
            else:
                current_category = service.service_specialization.service_category.id
                ordered_services = [
                    sid for sid in ordered_services
                    if Services.objects.get(id=sid).service_specialization.service_category.id == current_category
                ]
                ordered_services.append(service_id)

            request.session['ordered_services'] = ordered_services

        if (basket_service_id:=request.POST.get('basket_service_id')):
            service = get_object_or_404(Services, id=basket_service_id)
            cat_dict = request.session.get('basket_services', dict())
            sub_list = cat_dict.setdefault(str(service.service_specialization.service_category), [])

            if service.id in sub_list:
                sub_list.remove(service.id)
            else:
                sub_list.append(service.id)

            if not sub_list:
                del cat_dict[str(service.service_specialization.service_category)]

            request.session['basket_services'] = cat_dict
            return redirect(f'{request.path}?scroll_to={service.id}')

        return redirect(f'{request.path}?scroll_to={service_id}')

    ordered_services_objects = Services.objects.filter(id__in=ordered_services)
    basket_id_lst = sum(request.session.get('basket_services', dict()).values(), [])

    return render(request, 'clinic/services.html', {
        'services': services,
        'service_specializations': service_specializations,
        'selected_category': category,
        'selected_sort': sort,
        'ordered_services': ordered_services_objects,
        'scroll_to': request.GET.get('scroll_to'),
        'basket_id_lst': basket_id_lst,
    })

def promocodes_view(request):
    promocodes = PromoCodes.objects.filter(expiration_date__gte=date.today()).order_by('-id')
    archived_promocodes = PromoCodes.objects.filter(expiration_date__lt=date.today()).order_by('-id')
    return render(request, 'clinic/promocodes.html', {'promocodes': promocodes,
                                                                            'archived_promocodes': archived_promocodes})


def schedule_view(request):
    if request.user.is_authenticated:
        if hasattr(request.user, 'client'):
            current_orders = Orders.objects.filter(user=request.user, appointment_date__gte=datetime.now())
            past_orders = Orders.objects.filter(user=request.user, appointment_date__lt=datetime.now())
            return render(request, 'clinic/schedule.html', {'current_orders': current_orders, 'past_orders': past_orders})
        elif hasattr(request.user, 'doctor'):
            current_orders = Orders.objects.filter(doctor=request.user.doctor, appointment_date__gte=datetime.now())
            past_orders = Orders.objects.filter(doctor=request.user.doctor, appointment_date__lt=datetime.now())
            print(current_orders)
            return render(request, 'clinic/schedule.html', {'current_orders': current_orders, 'past_orders': past_orders})
    return render(request, 'clinic/schedule.html')

def ordering_view(request):
    if (cat_name:=request.GET.get('category_name_from_basket')):
        ordered_services = request.session.get('basket_services', dict()).get(cat_name, [])
    else:
        ordered_services = request.session.get('ordered_services', [])

    services = Services.objects.filter(id__in=ordered_services)
    total_price = sum(service.price for service in services)
    service_category_id = services.first().service_specialization.service_category.id if services else None
    doctors = Doctors.objects.filter(service_specialization__service_category__id=service_category_id)
    promo_codes = PromoCodes.objects.filter(expiration_date__gte=timezone.now().date())

    if request.method == 'POST':
        doctor_id = request.POST.get('doctor')
        promo_code_input = request.POST.get('promo_code')
        doctor = Doctors.objects.get(id=doctor_id)
        promo_code = promo_codes.filter(code=promo_code_input).first()

        if promo_code:
            discount = total_price * (Decimal(promo_code.discount) / 100)
            total_price -= discount

        appointment_date = timezone.now().replace(hour=12, minute=0, second=0, microsecond=0) + timezone.timedelta(days=1)
        last_order = Orders.objects.filter(doctor=doctor).order_by('-appointment_date').first()
        if last_order and last_order.appointment_date.date() >= appointment_date.date():
            appointment_date = last_order.appointment_date + timezone.timedelta(days=1)

        new_order = Orders(
            user=request.user,
            doctor=doctor,
            promo_code=promo_code,
            appointment_date=appointment_date,
            total_price=total_price
        )
        new_order.save()
        new_order.services.set(services)
        new_order.save()
        if cat_name:
            remove_cat_from_basket(request, cat_name)
        else:
            request.session['ordered_services'] = []
        return redirect('schedule')

    return render(request, 'clinic/ordering.html', {
        'services': services,
        'total_price': total_price,
        'doctors': doctors,
        'promo_codes': promo_codes
    })

def add_promocode_view(request):
    error = ''
    if request.method == 'POST':
        form = PromocodeForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('promocodes')
        else:
            error = 'Форма была неверной'

    form = PromocodeForm()

    data = {
        'form': form,
        'error': error
    }
    return render(request, 'clinic/add_promocode.html', data)


def calculate_age(born):
    today = date.today()
    return today.year - born.year - ((today.month, today.day) < (born.month, born.day))


def create_doctor_income_histogram(doctor_data):
    labels = [
        f'{doctor.surname} {doctor.name} {doctor.patronymic}\n{doctor.service_specialization.doctor_specialization.name}'
        for doctor in doctor_data]

    income_values = [doctor.total_income for doctor in doctor_data]
    fig, ax = plt.subplots(figsize=(10, 8))
    ax.barh(labels, income_values, color='skyblue')
    ax.set_xlabel('Общая сумма заказов')
    ax.set_title('Доходы врачей')

    temp_image = BytesIO()
    plt.savefig(temp_image, format='png', bbox_inches='tight')
    temp_image.seek(0)
    file_name = f'doctor_income_histogram_{get_random_string(8)}.png'
    histogram_image = ContentFile(temp_image.getvalue(), name=file_name)
    return histogram_image


def statistics_view(request):
    clients_alphabetical = Clients.objects.order_by('surname', 'name', 'patronymic').values_list('surname', 'name',
                                                                                                 'patronymic')
    total_orders_sum = Orders.objects.aggregate(Sum('total_price'))['total_price__sum'] or 0
    order_values = list(Orders.objects.values_list('total_price', flat=True))
    average_order = mean(order_values) if order_values else 0
    mode_order = max(multimode(order_values)) if order_values else 0
    median_order = median(order_values) if order_values else 0
    client_ages = [calculate_age(client.birth_date) for client in Clients.objects.all()]
    average_age = mean(client_ages) if client_ages else 0
    median_age = median(client_ages) if client_ages else 0
    services_stats = Services.objects.annotate(total_count=Sum('orders__total_price')).order_by('-total_count')
    most_popular_service_category = services_stats[0].service_specialization.service_category.name if services_stats else 'Нет данных'
    most_profitable_service_category = services_stats[0].service_specialization.service_category.name if services_stats else 'Нет данных'
    doctor_data = Doctors.objects.annotate(total_income=Sum('orders__total_price')).order_by('-total_income')
    histogram_image = create_doctor_income_histogram(doctor_data) if doctor_data else None

    file_path = ''

    if histogram_image:
        file_path = f'media/main/images/{histogram_image.name}'
        with open(file_path, 'wb') as f:
            f.write(histogram_image.read())
        file_path = f'/media/main/images/{histogram_image.name}'

    data = {
        'clients_alphabetical': clients_alphabetical,
        'total_orders_sum': total_orders_sum,
        'average_order': average_order,
        'mode_order': mode_order,
        'median_order': median_order,
        'average_age': average_age,
        'median_age': median_age,
        'most_popular_service_category': most_popular_service_category,
        'most_profitable_service_category': most_profitable_service_category,
        'histogram_url': file_path,
    }

    return render(request, 'clinic/statistics.html', data)

def remove_service_from_basket(request, service_id):
    service = get_object_or_404(Services, id=service_id)
    cat_dict = request.session.get('basket_services', dict())
    sub_list = cat_dict.setdefault(str(service.service_specialization.service_category), [])

    if request.method == 'POST':
        if service.id in sub_list:
            sub_list.remove(service.id)
        else:
            sub_list.append(service.id)

        if not sub_list:
            del cat_dict[str(service.service_specialization.service_category)]

        request.session['basket_services'] = cat_dict

    is_service_in_basket = service.id in sub_list

    return service, is_service_in_basket

def service_detail_view(request, service_id):
    service, is_service_in_basket = remove_service_from_basket(request, service_id)

    return render(request, 'clinic/service_detail.html', context={
        'service': service,
        'is_service_in_basket': is_service_in_basket,
    })

def basket_view(request):
    try:
        request.user.client
    except Exception:
        raise Http404('В корзину могут зайти только авторизованные клиенты')

    if request.method == 'POST':
        match request.POST.get('to_delete'):
            case str() as service_id if service_id.isdigit():
                remove_service_from_basket(request, int(service_id))
            case str() as cat_name:
                remove_cat_from_basket(request, cat_name)
            case _:
                pass

    basket_services = request.session.get('basket_services', dict())
    cat_obj_services_with_totals = dict()

    for cat, ids in basket_services.items():
        services = Services.objects.filter(id__in=ids)
        cat_obj_services_with_totals[(cat, sum(service.price for service in services))] = services

    return render(request, 'clinic/basket.html', context={
        'cat_obj_services_with_totals': cat_obj_services_with_totals,
    })

class EmployeesView(AdminRequiredMixin, ListView):
    model = Doctors
    template_name = 'clinic/employees.html'
    context_object_name = 'employees'
    extra_context = {
        'specialisations': Specializations.objects.all(),
    }

def adding_an_employee(request):
    return redirect('employees')