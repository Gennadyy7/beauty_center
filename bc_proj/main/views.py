import random
from tempfile import NamedTemporaryFile
from urllib.request import urlopen
from datetime import datetime, timezone
from django.core.files import File
from django.http import HttpResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic import TemplateView
from translate import Translator
from urllib.error import HTTPError
from .models import Articles, CompanyInfo, FAQ, Partners
import requests
from calendar import monthcalendar, month_name
from newspaper import Article

from clinic.models import ServiceSpecializations


def index(request):
    latest_article = Articles.objects.last()

    date_utc = datetime.now(timezone.utc)

    current_date = date_utc.astimezone()

    user_timezone = current_date.tzname()
    utc_offset = current_date.utcoffset().total_seconds() / 3600

    year = current_date.year
    month = current_date.month
    calendar_month = monthcalendar(year, month)
    month_name_current  = month_name[int(month)]

    grouped_services = {s_specialization.service_category: s_specialization.services.all() for s_specialization in ServiceSpecializations.objects.all()}
    partners = Partners.objects.all()

    return render(request, 'main/index.html', {
        'latest_article': latest_article,
        'grouped_services': grouped_services,
        'partners': partners,
        'current_date': current_date,
        'user_timezone': user_timezone,
        'utc_offset': utc_offset,
        'calendar_month': calendar_month,
        'current_day': current_date.day,
        'month_name': month_name_current
    })


def about(request):
    company_info = CompanyInfo.objects.last()

    if company_info:
        if company_info.certificate_file:
            with open(company_info.certificate_file.path, 'r+', encoding='utf-8') as f:
                certificate_html = f.read()
                f.seek(0)

                if company_info.css_file:
                    css_link = f'<link rel="stylesheet" type="text/css" href="{company_info.css_file.url}">'
                    certificate_html = certificate_html.replace("<!--css_link-->", css_link)

                f.write(certificate_html)

    context = {'company_info': company_info}

    return render(request, 'main/about.html', context)

def news(request):
    articles = Articles.objects.order_by('-id')
    return render(request, 'main/news.html', {'articles': articles})

def article_detail(request, article_id):
    article = get_object_or_404(Articles, id=article_id)
    return render(request, 'main/newsletter.html', {'article': article})

def faq(request):
    faq_items = FAQ.objects.order_by('-date_added')
    return render(request, 'main/faq.html', {'faq_items': faq_items})


import re


def translate_text(text, translator, chunk_size=500):
    translated_parts = []
    start = 0

    while start < len(text):
        end = start + chunk_size

        if end < len(text):
            part = text[start:end]
            last_separator = max(part.rfind('.'), part.rfind(','), part.rfind(' '))

            if last_separator != -1:
                end = start + last_separator

        chunk = text[start:end].strip()
        if chunk:
            translated_chunk = translator.translate(chunk)
            translated_parts.append(translated_chunk)

        start = end

    return ''.join(translated_parts)

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
        source_url = article_data.get('url')

        if title and summary and image_url:
            translator = Translator(to_lang="ru")
            title_ru = translator.translate(title)
            summary_ru = translator.translate(summary)

            full_text = ""
            try:
                article = Article(source_url)
                article.download()
                article.parse()
                full_text = article.text
            except Exception as e:
                print(f"Не удалось извлечь полный текст статьи: {e}")
                full_text = "Полный текст недоступен."

            full_text_ru = translate_text(full_text, translator)

            img_temp = NamedTemporaryFile(delete=True)
            try:
                img_temp.write(urlopen(image_url).read())
            except HTTPError as e:
                print(f"HTTP error occurred: {e}")
                continue
            img_temp.flush()

            article = Articles(title=title_ru, summary=summary_ru, content=full_text_ru)
            try:
                article.image.save(f"{title_ru}.jpg", File(img_temp))
                article.save()
            except Exception:
                return HttpResponse('Произошла ошибка при сохранении статьи')
            break

    return redirect('home')

def privacy_policy(request):
    return render(request, 'main/privacy_policy.html')

class SeventhTask(TemplateView):
    template_name = 'main/seventh_task.html'

class NinthTask(TemplateView):
    template_name = 'main/ninth_task.html'