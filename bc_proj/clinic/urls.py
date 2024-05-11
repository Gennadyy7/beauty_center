from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.login_view, name='to_login'),
    path('registration', views.registration_view, name='registration'),
    path('accounts/', include('django.contrib.auth.urls'))
]
