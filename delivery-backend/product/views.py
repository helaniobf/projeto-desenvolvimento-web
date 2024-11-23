import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Product
from category.models import Category
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from django.conf import settings

class ProductView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        name = request.data.get('name')
        description = request.data.get('description')
        price = request.data.get('price')
        category_id = request.data.get('categoryId')
        user_id = request.data.get('userId')
        image = request.FILES.get('image')

        try:
            category = Category.objects.get(id=category_id)
        except Category.DoesNotExist:
            return Response({"error": "Categoria não encontrada."}, status=status.HTTP_404_NOT_FOUND)

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "Usuário não encontrado."}, status=status.HTTP_404_NOT_FOUND)


        images_dir = os.path.join(settings.MEDIA_ROOT, 'ImagensdosProdutos')
        if not os.path.exists(images_dir):
            os.makedirs(images_dir)

        if image:
            image_path = os.path.join(images_dir, image.name)
            with open(image_path, 'wb+') as destination:
                for chunk in image.chunks():
                    destination.write(chunk)
            image_url = f'{settings.MEDIA_URL}ImagensdosProdutos/{image.name}'
        else:
            image_url = None


        try:
            product = Product(
                name=name,
                description=description,
                price=price,
                category=category,
                image=image_url,
                user=user
            )
            product.save()
            return Response({"message": "Produto adicionado com sucesso."}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, product_id):
        try:
            product = Product.objects.get(id=product_id)
            print(product)
            product.delete()
            return Response({"message": "Produto excluído com sucesso."}, status=status.HTTP_204_NO_CONTENT)
        except Product.DoesNotExist:
            return Response({"error": "Produto não encontrado."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, product_id):
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"error": "Produto não encontrado."}, status=status.HTTP_404_NOT_FOUND)


        name = request.data.get('name', product.name)
        description = request.data.get('description', product.description)
        price = request.data.get('price', product.price)
        category_id = request.data.get('categoryId', product.category.id)
        image = request.FILES.get('image')


        try:
            category = Category.objects.get(id=category_id)
        except Category.DoesNotExist:
            return Response({"error": "Categoria não encontrada."}, status=status.HTTP_404_NOT_FOUND)


        if image:
            images_dir = os.path.join(settings.MEDIA_ROOT, 'ImagensdosProdutos')
            if not os.path.exists(images_dir):
                os.makedirs(images_dir)


            image_path = os.path.join(images_dir, image.name)
            with open(image_path, 'wb+') as destination:
                for chunk in image.chunks():
                    destination.write(chunk)
            image_url = f'ImagensdosProdutos/{image.name}'
        else:
            image_url = product.image

        product.name = name
        product.description = description
        product.price = price
        product.category = category
        product.image = image_url

        print(product.image)
        print(product.image.url if hasattr(product.image, 'url') else 'URL não encontrada')

        try:
            product.save()
            return Response({"message": "Produto atualizado com sucesso."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, product_id=None):
        if product_id:
            try:
                product = Product.objects.get(id=product_id)
                product_data = {
                    "id": product.id,
                    "name": product.name,
                    "description": product.description,
                    "price": str(product.price),
                    "categoryId": product.category.id,
                    "image": f"{settings.MEDIA_URL}{product.image}" if product.image else None,
                }
                return Response(product_data, status=status.HTTP_200_OK)
            except Product.DoesNotExist:
                return Response({"error": "Produto não encontrado."}, status=status.HTTP_404_NOT_FOUND)
        else:
            user = request.query_params.get('user_id')
            products = Product.objects.filter(user=user)
            product_list = [
                {
                    "id": product.id,
                    "name": product.name,
                    "description": product.description,
                    "price": str(product.price),
                    "category": product.category.name,
                    "image": f"{settings.MEDIA_URL}{product.image}" if not str(product.image).startswith(
                        settings.MEDIA_URL) else str(product.image),
                }
                for product in products
            ]
            return Response(product_list, status=status.HTTP_200_OK)

