from django.urls import path
from .views import ProductView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('addProduct/', ProductView.as_view(), name='product'),
    path('products/', ProductView.as_view(), name='product'),
    path('deleteProduct/', ProductView.as_view(), name='product'),
    path('deleteProduct/<int:product_id>/', ProductView.as_view(), name='delete_product'),
    path('editProduct/<int:product_id>/', ProductView.as_view(), name='edit_product'),
    path('products/<int:product_id>/', ProductView.as_view(), name='get_product'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
