# resetpassword/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from forgotpassword.models import PasswordResetToken
from django.contrib.auth.models import User
from django.core.cache import cache

class ResetPasswordView(APIView):
    def post(self, request, token):
        try:
            # Encontrar o token na tabela forgotpassword_passwordresettoken
            reset_token = PasswordResetToken.objects.get(token=token)

            # Verificar se o token ainda é válido
            if not reset_token.is_valid():
                return Response({"error": "Token expirado."}, status=status.HTTP_400_BAD_REQUEST)

            # Atualizar a senha
            new_password = request.data.get("password")
            if not new_password:
                return Response({"error": "A senha é obrigatória."}, status=status.HTTP_400_BAD_REQUEST)

            user = reset_token.user
            user.set_password(new_password)
            user.save()

            cache.delete(f'login_attempts_{user.username}')
            cache.delete(f'lockout_{user.username}')

            return Response({"success": "Senha alterada com sucesso."}, status=status.HTTP_200_OK)

        except PasswordResetToken.DoesNotExist:
            return Response({"error": "Token inválido."}, status=status.HTTP_400_BAD_REQUEST)
