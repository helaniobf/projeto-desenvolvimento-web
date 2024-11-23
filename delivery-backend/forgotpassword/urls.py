from django.urls import path
from .views import ForgotPasswordView

urlpatterns = {
    path('forgotpassword/', ForgotPasswordView.as_view(), name='forgot_password'),
}
