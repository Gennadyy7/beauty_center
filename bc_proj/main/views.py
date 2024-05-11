import random
from tempfile import NamedTemporaryFile
from urllib.request import urlopen

from django.core.files import File
from django.shortcuts import render, redirect
from translate import Translator

from .models import Articles, CompanyInfo, FAQ
import requests

def index(request):
    latest_article = Articles.objects.last()
    return render(request, 'main/index.html', {'latest_article': latest_article})

def about(request):
    company_info = CompanyInfo.objects.last()
    return render(request, 'main/about.html', {'company_info': company_info})

def news(request):
    articles = Articles.objects.order_by('-id')
    return render(request, 'main/news.html', {'articles': articles})

def faq(request):
    faq_items = FAQ.objects.order_by('-date_added')
    return render(request, 'main/faq.html', {'faq_items': faq_items})

def add_cosmetology_news(request):
    response = requests.get(
        'https://newsapi.org/v2/everything?q=cosmetology&apiKey=aabb6aa60cd64803ad49bcb76aec6ced')
    data = response.json()

    article_data = data['articles'][random.randint(0, 63)]
    title = article_data['title']
    summary = article_data['description']
    image_url = article_data['urlToImage']

    print('Это заголовок')
    print(title)
    print('Это содержание')
    print(summary)
    translator = Translator(to_lang="ru")
    title_ru = translator.translate(title)
    summary_ru = translator.translate(summary)
    print('Это заголовок')
    print(title_ru)
    print('Это содержание')
    print(summary_ru)

    img_temp = NamedTemporaryFile(delete=True)
    img_temp.write(urlopen(image_url).read())
    img_temp.flush()

    article = Articles(title=title_ru, summary=summary_ru)
    article.image.save(f"{title_ru}.jpg", File(img_temp))
    article.save()
    return redirect('home')