from django.shortcuts import render
from .models import ToDo
from .serializers import ToDoSerializer
from rest_framework import viewsets


class TodoViewSet(viewsets.ModelViewSet):
    queryset = ToDo.objects.all().order_by("-id")
    serializer_class = ToDoSerializer


def todo_react_page(request):
    return render(request, 'todo.html')
