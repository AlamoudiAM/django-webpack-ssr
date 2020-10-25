from django.shortcuts import render
from .models import ToDo
from .serializers import ToDoSerializer
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.decorators import login_required


class TodoViewSet(viewsets.ModelViewSet):
    queryset = ToDo.objects.all()
    serializer_class = ToDoSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        additional_data = dict()
        additional_data['user'] = self.request.user
        serializer.save(**additional_data)

    def get_queryset(self):
        user = self.request.user
        return ToDo.objects.filter(user=user).order_by("-id")


@login_required(redirect_field_name='login')
def todo_react_page(request):
    user = request.user
    todos = ToDo.objects.filter(user=user).order_by("-id")

    return render(request, 'todo-react.html', context={
        "user": request.user,
        "initial_todos": ToDoSerializer(todos, many=True).data
    })


@login_required(redirect_field_name='login')
def todo_vue_page(request):
    user = request.user
    todos = ToDo.objects.filter(user=user).order_by("-id")

    return render(request, 'todo-vue.html', context={
        "user": request.user,
        "initial_todos": ToDoSerializer(todos, many=True).data
    })