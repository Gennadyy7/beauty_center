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

