from django.db import models

class Articles(models.Model):
    title = models.CharField('Название', max_length=50)
    summary = models.CharField('Краткая информация', max_length=500)
    image = models.ImageField('Картинка', upload_to='main/images')

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Новость'
        verbose_name_plural = 'Новости'

class CompanyInfo(models.Model):
    info = models.TextField('Информация о компании')
    video = models.FileField('Видео', upload_to='main/videos/', blank=True, null=True)
    logo = models.ImageField('Логотип', upload_to='main/logos/', blank=True, null=True)
    history = models.TextField('История компании', blank=True, null=True)
    requisites = models.TextField('Реквизиты', blank=True, null=True)
    certificate_file = models.FileField('Сертификат (HTML файл)', upload_to='main/certificates/', blank=True, null=True)
    css_file = models.FileField('CSS файл для сертификата', upload_to='main/certificates/', blank=True, null=True)

    def __str__(self):
        return "Информация о компании"

    class Meta:
        verbose_name = 'Информация о компании'
        verbose_name_plural = 'Информация о компании'

class FAQ(models.Model):
    question = models.CharField('Вопрос', max_length=250)
    answer = models.TextField('Ответ')
    date_added = models.DateTimeField('Дата добавления', auto_now_add=True)

    def __str__(self):
        return self.question

    class Meta:
        verbose_name = 'Часто задаваемый вопрос'
        verbose_name_plural = 'Часто задаваемые вопросы'

class Partners(models.Model):
    name = models.CharField('Название партнера', max_length=100)
    website = models.URLField('Веб-сайт')
    logo = models.ImageField('Логотип', upload_to='main/partner_logos/')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Партнер'
        verbose_name_plural = 'Партнеры'

