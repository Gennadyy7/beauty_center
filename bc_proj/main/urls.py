from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='home'),
    path('about', views.about, name='about'),
    path('news', views.news, name='news'),
    path('faq', views.faq, name='faq'),
    path('add_cosmetology_news', views.add_cosmetology_news, name='add_cosmetology_news'),
    path('privacy_policy', views.privacy_policy, name='policy'),
]
