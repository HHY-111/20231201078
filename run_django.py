#!/usr/bin/env python
"""
直接运行Django服务器的脚本
"""
import os
import sys

# 添加虚拟环境的site-packages到Python路径
venv_path = os.path.join(os.path.dirname(__file__), '.venv', 'Lib', 'site-packages')
if os.path.exists(venv_path):
    sys.path.insert(0, venv_path)

# 设置Django设置模块
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mysite.settings')

try:
    from django.core.management import execute_from_command_line
except ImportError as exc:
    raise ImportError(
        "Couldn't import Django. Are you sure it's installed and "
        "available on your PYTHONPATH environment variable? Did you "
        "forget to activate a virtual environment?"
    ) from exc

# 运行Django开发服务器
if __name__ == '__main__':
    execute_from_command_line(['run_django.py', 'runserver'])