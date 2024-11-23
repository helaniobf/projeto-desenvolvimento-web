from django.urls import path
from .views import CategoryView

urlpatterns = [
    path('category/', CategoryView.as_view(), name='create-category'),
    path('category/<int:category_id>/', CategoryView.as_view(), name='category-delete'),
]