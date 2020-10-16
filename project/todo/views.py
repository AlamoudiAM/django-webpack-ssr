from django.shortcuts import render, redirect, HttpResponse, Http404
from django.contrib.auth.decorators import user_passes_test
from django.core.paginator import Paginator
from .models import ToDo
from django.core import serializers


def ToDoView(request):
    # prepare page object + pagination
    todo_list = ToDo.objects.all().order_by("-id")
    paginator = Paginator(todo_list, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    return render(request, 'todo.html', {
        'page_obj': page_obj,
        'page_json_obj': serializers.serialize('json', page_obj)
    })
