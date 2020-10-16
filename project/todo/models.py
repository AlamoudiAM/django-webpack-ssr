from django.db import models


class ToDo (models.Model):
    task = models.TextField()
    done = models.BooleanField(default=False)
