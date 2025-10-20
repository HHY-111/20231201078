#!/usr/bin/env python
"""
直接运行Django服务器的脚本
绕过虚拟环境问题
"""

import os
import sys

def main():
    # 设置Django环境变量
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mysite.settings')
    
    # 添加当前目录到Python路径
    current_dir = os.path.dirname(os.path.abspath(__file__))
    sys.path.insert(0, current_dir)
    
    try:
        # 尝试导入Django
        from django.core.management import execute_from_command_line
        print("Django导入成功，正在启动服务器...")
        
        # 启动Django开发服务器
        execute_from_command_line(['manage.py', 'runserver'])
        
    except ImportError as e:
        print(f"导入Django时出错: {e}")
        print("请确保Django已正确安装")
        return 1
    except Exception as e:
        print(f"启动服务器时出错: {e}")
        return 1

if __name__ == "__main__":
    main()