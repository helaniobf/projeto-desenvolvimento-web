from django.urls import path
from .views import save_company_info, getCompany

urlpatterns = [
    path('company-info/', save_company_info, name='save_company_info'),
    path('company-info/get', getCompany, name='getCompany'),
]
