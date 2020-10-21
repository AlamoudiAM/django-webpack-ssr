from django.db import models
from user.models import User


class ToDo (models.Model):
    task = models.TextField()
    done = models.BooleanField(default=False, null=True)
    created_time = models.DateTimeField(verbose_name='Created Time', auto_now_add=True)
    updated_time = models.DateTimeField(verbose_name='Updated Time', auto_now=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user")
