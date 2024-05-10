from django import forms
from django.contrib.auth.forms import AuthenticationForm
from .models import Clients
from django.forms import ModelForm, TextInput, DateInput


class UserLoginForm(AuthenticationForm):
    username = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Имя пользователя'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder': 'Пароль'}))

class UserRegistrationForm(ModelForm):
    username = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Имя пользователя'}))
    password1 = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder': 'Пароль'}))
    password2 = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder': 'Подтвердите пароль'}))
    class Meta:
        model = Clients
        fields = ['surname', 'name', 'patronymic', 'birth_date', 'address', 'phone']

        widget = {
            "surname": TextInput(attrs={
                'placeholder': 'Фамилия'
            }),
            "name": TextInput(attrs={
                'placeholder': 'Имя'
            }),
            "patronymic": TextInput(attrs={
                'placeholder': 'Отчество'
            }),
            "birth_date": DateInput(attrs={
                'placeholder': 'Дата рождения'
            }),
            "address": TextInput(attrs={
                'placeholder': 'Адрес'
            }),
            "phone": TextInput(attrs={
                'placeholder': 'Телефон'
            })
        }
