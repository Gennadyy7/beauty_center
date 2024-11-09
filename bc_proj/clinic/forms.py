from django.contrib.auth.forms import AuthenticationForm
from .models import Clients, Reviews, PromoCodes, ServiceSpecializations
from django.forms import ModelForm, Select, Textarea
from django import forms
from .models import Doctors


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

class PromocodeForm(ModelForm):
    class Meta:
        model = PromoCodes
        fields = ['code', 'discount', 'expiration_date']

        widgets = {
            "code": forms.TextInput(attrs={'placeholder': 'Кодовое слово'}),
            "discount": forms.NumberInput(attrs={'min': 1, 'max': 100, 'step': 1, 'placeholder': 'Процент скидки'}),
            "expiration_date": forms.DateInput(
                attrs={'type': 'date', 'title': 'Выберите дату истечения срока действия промокода'})
        }

class DoctorForm(forms.ModelForm):
    url = forms.URLField(
        label="URL",
        required=True,
        widget=forms.URLInput(attrs={
            'id': 'url',
            'name': 'url',
            'required': 'required',
            'data-validation': 'url'
        })
    )

    class Meta:
        model = Doctors
        fields = ['name', 'surname', 'patronymic', 'service_specialization', 'photo', 'phone', 'email']
        widgets = {
            'name': forms.TextInput(attrs={
                'id': 'name',
                'name': 'name',
                'required': 'required'
            }),
            'surname': forms.TextInput(attrs={
                'id': 'surname',
                'name': 'surname',
                'required': 'required'
            }),
            'patronymic': forms.TextInput(attrs={
                'id': 'patronymic',
                'name': 'patronymic',
                'required': 'required'
            }),
            'service_specialization': forms.Select(attrs={
                'id': 'specialisation',
                'name': 'specialisation'
            }),
            'photo': forms.ClearableFileInput(attrs={
                'id': 'photo',
                'name': 'photo',
                'accept': 'image/*'
            }),
            'phone': forms.TextInput(attrs={
                'id': 'phone',
                'name': 'phone',
                'required': 'required',
                'data-validation': 'phone'
            }),
            'email': forms.EmailInput(attrs={
                'id': 'email',
                'name': 'email',
                'required': 'required'
            })
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Переопределяем queryset для отображения doctor_specialization
        self.fields['service_specialization'].queryset = ServiceSpecializations.objects.all()
        self.fields['service_specialization'].label_from_instance = lambda obj: obj.doctor_specialization.name

    def clean_phone(self):
        phone = self.cleaned_data.get('phone')
        # Add any additional phone validation logic if needed
        return phone

