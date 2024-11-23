from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Category
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny


class CategoryView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        category_name = request.data.get('category')
        user_id = request.data.get('user_id')

        if not category_name:
            return Response({"error": "Categoria é obrigatória."}, status=status.HTTP_400_BAD_REQUEST)

        if user_id is None:
            return Response({"error": "ID de usuário é obrigatório."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user_id = int(user_id)
        except ValueError:
            return Response({"error": "ID de usuário deve ser um número."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "Usuário não encontrado."}, status=status.HTTP_404_NOT_FOUND)

        category = Category(name=category_name, user=user)
        category.save()

        return Response({"message": "Categoria criada com sucesso!"}, status=status.HTTP_201_CREATED)

    def get(self, request, *args, **kwargs):
        user_id = request.query_params.get('user_id')

        if not user_id:
            return Response({"error": "ID de usuário é obrigatório."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user_id = int(user_id)
        except ValueError:
            return Response({"error": "ID de usuário deve ser um número."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "Usuário não encontrado."}, status=status.HTTP_404_NOT_FOUND)

        categories = Category.objects.filter(user=user)

        categories_data = [{"id": category.id, "name": category.name} for category in categories]

        return Response(categories_data, status=status.HTTP_200_OK)

    def delete(self, request, category_id, *args, **kwargs):
        user_id = request.data.get('user_id')

        if user_id is None:
            return Response({"error": "ID de usuário é obrigatório."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "Usuário não encontrado."}, status=status.HTTP_404_NOT_FOUND)

        try:
            category = Category.objects.get(id=category_id, user=user)
        except Category.DoesNotExist:
            return Response({"error": "Categoria não encontrada ou não pertence ao usuário."}, status=status.HTTP_404_NOT_FOUND)

        category.delete()

        return Response({"message": "Categoria excluída com sucesso."}, status=status.HTTP_200_OK)
