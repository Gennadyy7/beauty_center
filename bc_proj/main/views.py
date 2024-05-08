from django.shortcuts import render
from .models import Articles

def index(request):
    latest_article = Articles.objects.last()
    return render(request, 'main/index.html', {'latest_article': latest_article})

def about(request):
    pass

def news(request):
    articles = Articles.objects.order_by('-id')
    return render(request, 'main/news.html', {'articles': articles})

def faq(request):
    pass