from django.core.mail import send_mail
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .models import PasswordResetToken  # Referenciando o modelo
from rest_framework.permissions import AllowAny

class ForgotPasswordView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        email_or_username = request.data.get('emailOrUsername')

        if not email_or_username:
            return Response({"error": "O e-mail ou nome de usuário é obrigatório."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email_or_username) if '@' in email_or_username else User.objects.get(username=email_or_username)
        except User.DoesNotExist:
            return Response({"error": "E-mail ou nome de usuário não encontrado."}, status=status.HTTP_404_NOT_FOUND)

        # Criar um token único e armazená-lo no banco
        password_reset_token = PasswordResetToken.objects.create(user=user)
        reset_link = f"http://localhost:3000/reset-password/{password_reset_token.token}/"

        self.send_reset_email(user.email, reset_link)

        return Response({"message": "E-mail de recuperação enviado com sucesso. Verifique sua caixa de entrada."}, status=status.HTTP_200_OK)

    def send_reset_email(self, email, reset_link):
        subject = "Redefinição de Senha"
        message = f"""
        Olá,

        Você solicitou a redefinição de sua senha. Clique no link abaixo para redefinir sua senha:

        {reset_link}

        Se você não solicitou essa mudança, ignore este e-mail.

        Atenciosamente,
        Sua Equipe
        """
        from_email = settings.DEFAULT_FROM_EMAIL
        recipient_list = [email]

        send_mail(subject, message, from_email, recipient_list)
