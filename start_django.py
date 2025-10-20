#!/usr/bin/env python
"""
Django服务器启动脚本
直接使用虚拟环境中的Python可执行文件启动服务器
"""

import os
import sys
import subprocess

def main():
    # 获取当前目录
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # 虚拟环境Python路径
    venv_python = os.path.join(current_dir, ".venv", "Scripts", "python.exe")
    
    # 检查Python可执行文件是否存在
    if not os.path.exists(venv_python):
        print(f"错误: Python可执行文件不存在: {venv_python}")
        print("请检查虚拟环境是否已正确创建")
        return 1
    
    # 检查manage.py文件是否存在
    manage_py = os.path.join(current_dir, "manage.py")
    if not os.path.exists(manage_py):
        print(f"错误: manage.py文件不存在: {manage_py}")
        return 1
    
    print("正在启动Django开发服务器...")
    print(f"Python路径: {venv_python}")
    print(f"项目目录: {current_dir}")
    
    try:
        # 直接使用虚拟环境Python启动Django服务器
        result = subprocess.run([
            venv_python, 
            "manage.py", 
            "runserver"
        ], cwd=current_dir)
        
        return result.returncode
    except Exception as e:
        print(f"启动服务器时出错: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(main())