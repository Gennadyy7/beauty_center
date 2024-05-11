from django.contrib import messages
from django.contrib.auth import login
from django.contrib.auth.models import User
from django.db.models import Avg
from django.shortcuts import render, redirect
from .forms import UserLoginForm, ClientRegistrationForm, ReviewForm
from .models import Clients, ServiceSpecializations, Vacancies, Reviews


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