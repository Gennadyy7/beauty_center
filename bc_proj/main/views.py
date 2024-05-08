from django.shortcuts import render

def index(request):
    data = {
        'latest_article': {
            'title': 'Приветствуем!!!',
            'summary': 'Мы очень рады, что вы посетили наш сайт!!!',
            'image': 'https://www.w3schools.com/images/picture.jpg'
        }
    }
    return render(request, 'main/index.html', data)

def about(request):
    pass

def news(request):
    pass

def faq(request):
    pass