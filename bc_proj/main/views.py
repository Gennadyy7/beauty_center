from django.shortcuts import render

def index(request):
    return render(request, 'main/index.html')

def about(request):
    pass

def news(request):
    pass

def faq(request):
    pass