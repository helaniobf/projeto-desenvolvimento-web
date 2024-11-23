from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('login.urls')),
    path('', include('createuser.urls')),
    path('', include('forgotpassword.urls')),
    path('', include('resetpassword.urls')),
    path('', include('resetpassword.urls')),
    path('', include('category.urls')),
    path('', include('product.urls')),
    path('', include('save_company_info.urls')),
    path('', include('orders.urls')),
]
