from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny


class CreateUserView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        print(username)
        print(email)
        print(password)

        if not username or not email or not password:
            return Response({"error": "Usuário, email e senha são obrigatórios."}, status=status.HTTP_400_BAD_REQUEST)


        if User.objects.filter(username=username).exists():
            return Response({"error": "Usuário já existe."}, status=status.HTTP_400_BAD_REQUEST)


        user = User.objects.create_user(username=username, email=email, password=password)

        return Response({
            'success': True,
            'message': 'Usuário criado com sucesso.'
        }, status=status.HTTP_201_CREATED)

