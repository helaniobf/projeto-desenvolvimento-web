from django.db import models
from django.contrib.auth.models import User

class NewCompanyInfo(models.Model):
    name = models.CharField(max_length=255)
    opening_hours = models.CharField(max_length=255, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    contact = models.CharField(max_length=50, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='restaurant_images/', blank=True, null=True)  # Novo campo para imagem
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name
