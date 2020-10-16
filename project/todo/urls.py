from django.urls import path
from .views import ToDoView
urlpatterns = [
    path('', ToDoView, name='todo'),
]