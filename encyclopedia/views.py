from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.core.paginator import Paginator
from django.db.models import Q
from .models import Entry, Category, Tag, Comment
from .forms import EntryForm, CommentForm

def entry_list(request):
    """词条列表页"""
    entries = Entry.objects.filter(status='published').select_related('category', 'author')
    
    # 搜索功能
    query = request.GET.get('q')
    if query:
        entries = entries.filter(
            Q(title__icontains=query) | 
            Q(content__icontains=query) |
            Q(summary__icontains=query)
        )
    
    # 分类筛选
    category_id = request.GET.get('category')
    if category_id:
        entries = entries.filter(category_id=category_id)
    
    # 标签筛选
    tag_id = request.GET.get('tag')
    if tag_id:
        entries = entries.filter(tags__id=tag_id)
    
    # 分页
    paginator = Paginator(entries, 10)  # 每页10条
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    context = {
        'page_obj': page_obj,
        'categories': Category.objects.all(),
        'tags': Tag.objects.all(),
        'query': query,
    }
    return render(request, 'encyclopedia/entry_list.html', context)

def entry_detail(request, pk):
    """词条详情页"""
    entry = get_object_or_404(Entry.objects.select_related('category', 'author'), 
                            pk=pk, status='published')
    
    # 增加浏览次数
    entry.view_count += 1
    entry.save(update_fields=['view_count'])
    
    # 评论功能
    comments = entry.comments.filter(parent__isnull=True).select_related('author')
    
    if request.method == 'POST':
        comment_form = CommentForm(request.POST)
        if comment_form.is_valid() and request.user.is_authenticated:
            comment = comment_form.save(commit=False)
            comment.entry = entry
            comment.author = request.user
            comment.save()
            messages.success(request, '评论发表成功！')
            return redirect('entry_detail', pk=entry.pk)
    else:
        comment_form = CommentForm()
    
    context = {
        'entry': entry,
        'comments': comments,
        'comment_form': comment_form,
    }
    return render(request, 'encyclopedia/entry_detail.html', context)

@login_required
def entry_create(request):
    """创建词条"""
    if request.method == 'POST':
        form = EntryForm(request.POST)
        if form.is_valid():
            entry = form.save(commit=False)
            entry.author = request.user
            entry.save()
            form.save_m2m()  # 保存多对多关系
            messages.success(request, '词条创建成功！')
            return redirect('entry_detail', pk=entry.pk)
    else:
        form = EntryForm()
    
    context = {'form': form}
    return render(request, 'encyclopedia/entry_form.html', context)

@login_required
def entry_edit(request, pk):
    """编辑词条"""
    entry = get_object_or_404(Entry, pk=pk, author=request.user)
    
    if request.method == 'POST':
        form = EntryForm(request.POST, instance=entry)
        if form.is_valid():
            form.save()
            messages.success(request, '词条更新成功！')
            return redirect('entry_detail', pk=entry.pk)
    else:
        form = EntryForm(instance=entry)
    
    context = {'form': form, 'entry': entry}
    return render(request, 'encyclopedia/entry_form.html', context)

@login_required
def entry_delete(request, pk):
    """删除词条"""
    entry = get_object_or_404(Entry, pk=pk, author=request.user)
    
    if request.method == 'POST':
        entry.delete()
        messages.success(request, '词条删除成功！')
        return redirect('entry_list')
    
    context = {'entry': entry}
    return render(request, 'encyclopedia/entry_confirm_delete.html', context)

def category_list(request):
    """分类列表页"""
    categories = Category.objects.prefetch_related('entry_set').all()
    context = {'categories': categories}
    return render(request, 'encyclopedia/category_list.html', context)

def tag_list(request):
    """标签列表页"""
    tags = Tag.objects.prefetch_related('entries').all()
    context = {'tags': tags}
    return render(request, 'encyclopedia/tag_list.html', context)

@login_required
def my_entries(request):
    """我的词条"""
    entries = Entry.objects.filter(author=request.user).order_by('-created_at')
    context = {'entries': entries}
    return render(request, 'encyclopedia/my_entries.html', context)