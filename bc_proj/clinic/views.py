from django.contrib import messages
from django.contrib.auth import login
from django.contrib.auth.models import User
from django.shortcuts import render, redirect
from .forms import UserLoginForm, ClientRegistrationForm
from .models import Clients, ServiceSpecializations


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