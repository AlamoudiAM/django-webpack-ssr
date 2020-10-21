from django.shortcuts import render
from .models import ToDo
from .serializers import ToDoSerializer
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.decorators import login_required


class TodoViewSet(viewsets.ModelViewSet):
    queryset = ToDo.objects.all().order_by("-id")
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
    return render(request, 'todo.html', context={
        "user": request.user
    })
