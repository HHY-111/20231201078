from django.contrib import admin
from .models import Category, Entry, Tag, Comment

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'created_at']
    search_fields = ['name']
    list_filter = ['created_at']

@admin.register(Entry)
class EntryAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'author', 'status', 'created_at', 'view_count']
    list_filter = ['status', 'category', 'created_at']
    search_fields = ['title', 'content']
    readonly_fields = ['created_at', 'updated_at', 'view_count', 'like_count']
    fieldsets = [
        ('基本信息', {'fields': ['title', 'summary', 'content']}),
        ('分类信息', {'fields': ['category', 'tags']}),
        ('状态管理', {'fields': ['status', 'published_at']}),
        ('统计信息', {'fields': ['view_count', 'like_count']}),
        ('时间信息', {'fields': ['created_at', 'updated_at']}),
    ]
    filter_horizontal = ['tags']

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['entry', 'author', 'created_at']
    list_filter = ['created_at']
    search_fields = ['content', 'author__username']