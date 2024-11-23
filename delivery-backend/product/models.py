from django.db import models
from django.contrib.auth.models import User
from category.models import Category

class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    image = models.ImageField(upload_to='products/')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='products', null=True)

    def __str__(self):
        return self.name
