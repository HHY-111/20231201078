from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Category(models.Model):
    """百科分类模型"""
    name = models.CharField(max_length=100, verbose_name='分类名称')
    description = models.TextField(blank=True, verbose_name='分类描述')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')
    
    class Meta:
        verbose_name = '分类'
        verbose_name_plural = '分类'
        ordering = ['name']
    
    def __str__(self):
        return self.name

class Entry(models.Model):
    """百科词条核心模型"""
    STATUS_CHOICES = [
        ('draft', '草稿'),
        ('published', '已发布'),
        ('archived', '已归档'),
    ]
    
    title = models.CharField(max_length=200, verbose_name='词条标题')
    content = models.TextField(verbose_name='词条内容')
    summary = models.TextField(max_length=500, blank=True, verbose_name='摘要')
    
    # 关联字段
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, 
                                null=True, blank=True, verbose_name='分类')
    author = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='作者')
    
    # 时间字段
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新时间')
    published_at = models.DateTimeField(null=True, blank=True, verbose_name='发布时间')
    
    # 状态管理
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, 
                            default='draft', verbose_name='状态')
    
    # 统计字段
    view_count = models.PositiveIntegerField(default=0, verbose_name='浏览次数')
    like_count = models.PositiveIntegerField(default=0, verbose_name='点赞数')
    
    class Meta:
        verbose_name = '百科词条'
        verbose_name_plural = '百科词条'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', 'published_at']),
            models.Index(fields=['category']),
            models.Index(fields=['author']),
        ]
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        """自动设置发布时间"""
        if self.status == 'published' and not self.published_at:
            self.published_at = timezone.now()
        super().save(*args, **kwargs)

class Tag(models.Model):
    """标签模型"""
    name = models.CharField(max_length=50, unique=True, verbose_name='标签名')
    entries = models.ManyToManyField(Entry, related_name='tags', blank=True, verbose_name='关联词条')
    
    class Meta:
        verbose_name = '标签'
        verbose_name_plural = '标签'
    
    def __str__(self):
        return self.name

class Comment(models.Model):
    """评论模型"""
    entry = models.ForeignKey(Entry, on_delete=models.CASCADE, related_name='comments', verbose_name='词条')
    author = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='评论者')
    content = models.TextField(max_length=1000, verbose_name='评论内容')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='评论时间')
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, 
                             related_name='replies', verbose_name='父评论')
    
    class Meta:
        verbose_name = '评论'
        verbose_name_plural = '评论'
        ordering = ['-created_at']
    
    def __str__(self):
        return f'{self.author.username} - {self.entry.title}'