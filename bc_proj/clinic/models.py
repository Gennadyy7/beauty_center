from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from django.contrib.auth.models import User
from decimal import Decimal

class ServiceCategories(models.Model):
    name = models.CharField('Категория', max_length=50)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Категория услуг'
        verbose_name_plural = 'Категории услуг'


class Specializations(models.Model):
    name = models.CharField('Специализация', max_length=50)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Специализация врачей'
        verbose_name_plural = 'Специализации врачей'


class ServiceSpecializations(models.Model):
    service_category = models.ForeignKey(ServiceCategories, on_delete=models.CASCADE, related_name='specializations')
    doctor_specialization = models.ForeignKey(Specializations, on_delete=models.CASCADE, related_name='services')

    def __str__(self):
        return f"{self.service_category.name} - {self.doctor_specialization.name}"

    def save(self, *args, **kwargs):
        self.service_category, _ = ServiceCategories.objects.get_or_create(name=self.service_category.name)
        self.doctor_specialization, _ = Specializations.objects.get_or_create(name=self.doctor_specialization.name)
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = 'Специализация для категории услуг'
        verbose_name_plural = 'Специализации для категорий услуг'



class Services(models.Model):
    title = models.CharField('Название', max_length=70)
    description = models.TextField('Описание')
    service_specialization = models.ForeignKey(ServiceSpecializations, on_delete=models.CASCADE,
                                               verbose_name='Специализация услуги', related_name='services')
    price = models.DecimalField('Цена', max_digits=10, decimal_places=2)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Услуга'
        verbose_name_plural = 'Услуги'


class Clients(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    surname = models.CharField('Фамилия', max_length=50)
    name = models.CharField('Имя', max_length=50)
    patronymic = models.CharField('Отчество', max_length=50)
    birth_date = models.DateField('Дата рождения')
    address = models.CharField('Адрес', max_length=250)
    phone = models.CharField('Телефон', max_length=20)

    def __str__(self):
        return self.surname

    class Meta:
        verbose_name = 'Клиент'
        verbose_name_plural = 'Клиенты'


class Doctors(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    surname = models.CharField('Фамилия', max_length=50)
    name = models.CharField('Имя', max_length=50)
    patronymic = models.CharField('Отчество', max_length=50)
    phone = models.CharField('Телефон', max_length=20)
    email = models.EmailField('Электронная почта')
    service_specialization = models.ForeignKey(ServiceSpecializations, on_delete=models.CASCADE, related_name='doctors',
                                               verbose_name='Специализация врача')

    def __str__(self):
        return self.surname

    class Meta:
        verbose_name = 'Врач'
        verbose_name_plural = 'Врачи'

class Reviews(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField('Текст отзыва')
    rating = models.PositiveSmallIntegerField('Оценка', choices=[(i, str(i)) for i in range(1, 6)])
    created_at = models.DateTimeField('Дата и время отзыва', auto_now_add=True)

    def __str__(self):
        return f'Отзыв от {self.user.username}'

    class Meta:
        verbose_name = 'Отзыв'
        verbose_name_plural = 'Отзывы'


class PromoCodes(models.Model):
    code = models.CharField('Промокод', max_length=50, unique=True)
    discount = models.PositiveSmallIntegerField('Скидка, %', validators=[MinValueValidator(1), MaxValueValidator(100)])
    expiration_date = models.DateField('Дата истечения срока действия')

    def __str__(self):
        return self.code

    class Meta:
        verbose_name = 'Промокод'
        verbose_name_plural = 'Промокоды'



class Orders(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    services = models.ManyToManyField(Services, verbose_name='Услуги')
    doctor = models.ForeignKey(Doctors, on_delete=models.CASCADE, verbose_name='Врач')
    promo_code = models.ForeignKey(PromoCodes, on_delete=models.SET_NULL, null=True, blank=True)
    appointment_date = models.DateTimeField('Дата и время приема')
    total_price = models.DecimalField('Итоговая цена', max_digits=10, decimal_places=2, editable=False)

    def __str__(self):
        return f'Заказ №{self.id} от {self.user.username}'

    def save(self, *args, **kwargs):
        if not self.pk:
            self.total_price = 0
            super().save(*args, **kwargs)

        self.total_price = sum(service.price for service in self.services.all())
        if self.promo_code:
            discount = Decimal(self.promo_code.discount) / 100
            self.total_price *= (1 - discount)
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = 'Заказ'
        verbose_name_plural = 'Заказы'