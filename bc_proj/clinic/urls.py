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
    path('delete_review/<int:pk>', views.reviewsDeleteView.as_view(), name='delete_review')
]
