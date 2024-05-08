from django.contrib import admin
from .models import Articles, CompanyInfo, FAQ

admin.site.register(Articles)
admin.site.register(CompanyInfo)
admin.site.register(FAQ)