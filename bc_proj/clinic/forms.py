from django import forms
from django.contrib.auth.forms import AuthenticationForm
from .models import Clients, Reviews
from django.forms import ModelForm, Select, Textarea


class UserLoginForm(AuthenticationForm):
    username = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Имя пользователя'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder': 'Пароль'}))

class ClientRegistrationForm(ModelForm):
    username = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Имя пользователя'}))
    password1 = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder': 'Пароль'}))
    password2 = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder': 'Подтвердите пароль'}))
    surname = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Фамилия'}))
    name = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Имя'}))
    patronymic = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Отчество'}))
    birth_date = forms.DateField(widget=forms.DateInput(attrs={'placeholder': 'Дата рождения', 'type': 'date', 'title': 'Дата рождения'}))
    address = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Адрес'}))
    phone = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Телефон'}))
    class Meta:
        model = Clients
        fields = ['surname', 'name', 'patronymic', 'birth_date', 'address',
                  'phone']

class ReviewForm(ModelForm):
    class Meta:
        model = Reviews
        fields = ['rating', 'text']

        widgets = {
            "rating": Select(choices=[(i, i) for i in range(1, 6)], attrs={'placeholder': 'Выберите оценку от 1 до 5', 'title': 'Выберите оценку от 1 до 5'}),
            "text": Textarea(attrs={'placeholder': 'Напишите здесь свой отзыв'})
        }
