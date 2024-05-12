import re
from datetime import datetime
import random
from django.views.generic import UpdateView, DeleteView
from django.contrib import messages
from django.contrib.auth import login
from django.contrib.auth.models import User
from django.db.models import Avg
from django.shortcuts import render, redirect
from .forms import UserLoginForm, ClientRegistrationForm, ReviewForm
from .models import Clients, ServiceSpecializations, Vacancies, Reviews, Services, ServiceCategories
import requests
from django.contrib.auth.mixins import UserPassesTestMixin

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
            return redirect('login')
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

    return render(request, 'clinic/services.html', {'services': services, 'service_specializations': service_specializations, 'selected_category': category, 'selected_sort': sort})