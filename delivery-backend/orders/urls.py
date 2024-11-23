from django.urls import path
from .views import OrderListView, create_order

urlpatterns = [
    path('orders/', OrderListView.as_view(), name='order-list'),
    path('orders/create/', create_order, name='create-order'),
]