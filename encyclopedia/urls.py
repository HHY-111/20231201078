from django.urls import path
from . import views

app_name = 'encyclopedia'

urlpatterns = [
    # 词条相关
    path('', views.entry_list, name='entry_list'),
    path('entry/<int:pk>/', views.entry_detail, name='entry_detail'),
    path('entry/create/', views.entry_create, name='entry_create'),
    path('entry/<int:pk>/edit/', views.entry_edit, name='entry_edit'),
    path('entry/<int:pk>/delete/', views.entry_delete, name='entry_delete'),
    
    # 分类和标签
    path('categories/', views.category_list, name='category_list'),
    path('tags/', views.tag_list, name='tag_list'),
    
    # 用户相关
    path('my-entries/', views.my_entries, name='my_entries'),
]