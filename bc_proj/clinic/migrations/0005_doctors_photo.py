# Generated by Django 5.1.1 on 2024-09-12 20:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('clinic', '0004_specializations_description_vacancies'),
    ]

    operations = [
        migrations.AddField(
            model_name='doctors',
            name='photo',
            field=models.ImageField(blank=True, default='clinic/john_doe/john_doe.png', null=True, upload_to='doctors_photos/', verbose_name='Фотография'),
        ),
    ]
