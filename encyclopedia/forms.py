from django import forms
from .models import Entry, Comment

class EntryForm(forms.ModelForm):
    """词条表单"""
    class Meta:
        model = Entry
        fields = ['title', 'summary', 'content', 'category', 'tags', 'status']
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': '请输入词条标题'
            }),
            'summary': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 3,
                'placeholder': '请输入词条摘要（可选）'
            }),
            'content': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 15,
                'placeholder': '请输入词条详细内容'
            }),
            'category': forms.Select(attrs={'class': 'form-control'}),
            'tags': forms.SelectMultiple(attrs={'class': 'form-control'}),
            'status': forms.Select(attrs={'class': 'form-control'}),
        }
        labels = {
            'title': '标题',
            'summary': '摘要',
            'content': '内容',
            'category': '分类',
            'tags': '标签',
            'status': '状态',
        }

class CommentForm(forms.ModelForm):
    """评论表单"""
    class Meta:
        model = Comment
        fields = ['content']
        widgets = {
            'content': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 3,
                'placeholder': '请输入您的评论...'
            }),
        }
        labels = {
            'content': '评论内容',
        }