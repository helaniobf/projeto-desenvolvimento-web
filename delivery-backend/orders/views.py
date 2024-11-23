from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Order, OrderItem
from .serializers import OrderSerializer

class OrderListView(APIView):
    def get(self, request):
        orders = Order.objects.all()
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

@api_view(['POST'])
def create_order(request):
    data = request.data
    order = Order.objects.create(
        customer_name=data.get('customer_name', 'Anônimo'),
        address=data.get('address', ''),
        phone=data.get('phone', ''),
        observation=data.get('observation', ''),
        total_price=data.get('total_price', 0),
        payment_method=data.get('payment_method', 'Não informado')
    )
    for item in data.get('items', []):
        OrderItem.objects.create(
            order=order,
            product_name=item.get('product_name') or item.get('name'),  # Verifica múltiplas chaves
            quantity=item.get('quantity', 1),  # Valor padrão de 1 caso não seja enviado
            price=item.get('price', 0.0)  # Valor padrão de 0.0 caso não seja enviado
        )
    return Response({"message": "Pedido criado com sucesso!", "order_id": order.id})