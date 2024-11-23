from django.urls import path
from .views import ResetPasswordView

urlpatterns = [
    path('reset-password/<uuid:token>/', ResetPasswordView.as_view(), name='resetpassword'),
]
