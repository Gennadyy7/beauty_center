from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.login_view, name='to_login'),
    path('registration', views.registration_view, name='registration'),
    path('accounts/', include('django.contrib.auth.urls')),
    path('contacts', views.contacts_view, name='contacts'),
    path('vacancies', views.vacancies_view, name='vacancies'),
    path('reviews', views.reviews_view, name='reviews'),
    path('add_review', views.add_review_view, name='add_review'),
    path('add_random_client', views.add_random_client, name='add_random_client'),
    path('update_review/<int:pk>', views.reviewsUpdateView.as_view(), name='update_review'),
    path('delete_review/<int:pk>', views.reviewsDeleteView.as_view(), name='delete_review'),
    path('services', views.services_view, name='services'),
    path('promocodes', views.promocodes_view, name='promocodes'),
    path('schedule', views.schedule_view, name='schedule'),
    path('ordering', views.ordering_view, name='ordering'),
    path('add_promocode', views.add_promocode_view, name='add_promocode'),
    path('update_promocode/<int:pk>', views.promocodeUpdateView.as_view(), name='update_promocode'),
    path('delete_promocode/<int:pk>', views.promocodeDeleteView.as_view(), name='delete_promocode'),
    path('statistics', views.statistics_view, name='statistics'),
    path('services/<int:service_id>/', views.service_detail_view, name='service_detail'),
    path('basket/', views.basket_view, name='basket'),
    path('employees/', views.EmployeesView.as_view(), name='employees'),
]
