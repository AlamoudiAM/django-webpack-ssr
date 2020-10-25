from django.urls import path, include
from .views import TodoViewSet, todo_react_page, todo_vue_page
from rest_framework import routers

router = routers.SimpleRouter()
router.register(r'', TodoViewSet)

urlpatterns = [
    path('react/', todo_react_page, name='todo'),
    path('vue/', todo_vue_page, name='todo'),
    path('api/', include((router.urls, 'todo_app'))),
]