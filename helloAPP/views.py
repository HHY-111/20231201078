from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.

def index(request):
    """展示姓名和学号的主页面"""
    name = "黄怡"
    student_id = "20231201078"
    
    html_content = f"""
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>个人信息展示</title>
        <style>
            body {{
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                background-color: #f5f5f5;
            }}
            .container {{
                max-width: 600px;
                margin: 50px auto;
                background: white;
                padding: 40px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                text-align: center;
            }}
            h1 {{
                color: #333;
                margin-bottom: 30px;
            }}
            .info {{
                font-size: 18px;
                margin: 15px 0;
                padding: 10px;
                background-color: #f8f9fa;
                border-radius: 5px;
            }}
            .name {{
                color: #007bff;
                font-weight: bold;
            }}
            .student-id {{
                color: #28a745;
                font-weight: bold;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1>个人信息展示</h1>
            <div class="info">
                <span class="name">姓名：</span>{name}
            </div>
            <div class="info">
                <span class="student-id">学号：</span>{student_id}
            </div>
        </div>
    </body>
    </html>
    """
    
    return HttpResponse(html_content)
