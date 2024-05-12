import random
from tempfile import NamedTemporaryFile
from urllib.request import urlopen

from django.core.files import File
from django.shortcuts import render, redirect
from django.utils import timezone
from translate import Translator
from urllib.error import HTTPError
from .models import Articles, CompanyInfo, FAQ
import requests
import pytz

def index(request):
    latest_article = Articles.objects.last()
    user_timezone = 'Europe/Moscow'
    tz = pytz.timezone(user_timezone)
    current_date = timezone.now().astimezone(tz)
    return render(request, 'main/index.html', {
        'latest_article': latest_article,
        'current_date': current_date,
        'user_timezone': user_timezone,
    })

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

    articles = data['articles']
    random.shuffle(articles)
    for article_data in articles:
        title = article_data.get('title')
        summary = article_data.get('description')
        image_url = article_data.get('urlToImage')

        if title and summary and image_url:
            translator = Translator(to_lang="ru")
            title_ru = translator.translate(title)
            summary_ru = translator.translate(summary)

            img_temp = NamedTemporaryFile(delete=True)
            try:
                img_temp.write(urlopen(image_url).read())
            except HTTPError as e:
                print(f"HTTP error occurred: {e}")
                continue
            img_temp.flush()

            article = Articles(title=title_ru, summary=summary_ru)
            article.image.save(f"{title_ru}.jpg", File(img_temp))
            article.save()
            break

    return redirect('home')