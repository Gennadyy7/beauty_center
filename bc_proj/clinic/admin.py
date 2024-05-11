from django.contrib import admin
from .models import Services, ServiceSpecializations, Specializations, ServiceCategories, Clients, Doctors, Orders, Reviews, PromoCodes, Vacancies

admin.site.register(Services)
admin.site.register(ServiceSpecializations)
admin.site.register(Specializations)
admin.site.register(ServiceCategories)
admin.site.register(Clients)
admin.site.register(Doctors)
admin.site.register(Orders)
admin.site.register(Reviews)
admin.site.register(PromoCodes)
admin.site.register(Vacancies)
