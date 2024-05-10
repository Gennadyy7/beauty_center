from django.contrib.auth import login
from django.shortcuts import render, redirect
from .forms import UserLoginForm, UserRegistrationForm


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
    form = UserRegistrationForm()

    data = {
        'form': form
    }
    return render(request, 'clinic/registration.html')