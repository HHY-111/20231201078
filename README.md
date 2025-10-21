# Django SinglePage 应用

这是一个Django项目，包含一个单页面应用（SinglePage Application）示例。

## 项目结构

```
20231201078/
├── mysite/                 # Django项目配置
│   ├── settings.py         # 项目设置
│   ├── urls.py            # 主URL配置
│   └── wsgi.py            # WSGI配置
├── helloAPP/               # 示例应用
├── singlepage/             # 单页面应用
│   ├── views.py           # 视图函数
│   ├── urls.py            # URL路由
│   ├── templates/          # 模板文件
│   └── ...
├── manage.py               # Django管理脚本
└── start_singlepage.bat    # 启动脚本
```

## SinglePage 应用功能

### 主要特性

1. **单页面应用架构**：使用JavaScript History API实现无刷新页面导航
2. **动态内容加载**：通过AJAX请求加载不同章节的内容
3. **浏览器历史支持**：支持浏览器前进/后退按钮

### 视图功能

- **主页视图** (`/`)：显示带有三个按钮的主页面
- **章节视图** (`/sections/<num>`)：返回对应章节的文本内容

### JavaScript功能

- `showSection(section)`：动态加载并显示指定章节内容
- `window.onpopstate`：处理浏览器前进/后退事件
- 按钮点击事件：更新浏览器历史并加载内容

## 安装和运行

### 前提条件

- Python 3.8+
- Django 4.2+

### 运行步骤

1. 激活虚拟环境（如果存在）：
   ```bash
   .venv\Scripts\activate
   ```

2. 安装依赖：
   ```bash
   pip install -r requirements.txt
   ```

3. 运行开发服务器：
   ```bash
   python manage.py runserver
   ```
   或者使用批处理文件：
   ```
   start_singlepage.bat
   ```

4. 访问应用：
   - 主页：http://localhost:8000/
   - 章节1：http://localhost:8000/sections/1
   - 章节2：http://localhost:8000/sections/2
   - 章节3：http://localhost:8000/sections/3

## 技术栈

- **后端**：Django 4.2.25
- **前端**：HTML5, JavaScript (ES6+)
- **API**：Django REST框架（如有需要）
- **数据库**：SQLite（开发环境）

## 文件说明

### 核心文件

- `singlepage/views.py`：包含index和section视图函数
- `singlepage/urls.py`：配置应用的路由
- `singlepage/templates/singlepage/index.html`：主页面模板
- `mysite/urls.py`：项目主路由配置
- `mysite/settings.py`：项目设置，已添加singlepage应用

### 启动脚本

- `start_singlepage.bat`：Windows批处理启动脚本
- `start_server.bat`：通用启动脚本

## 开发说明

### 添加新章节

1. 在 `singlepage/views.py` 中更新 `texts` 列表
2. 在 `singlepage/templates/singlepage/index.html` 中添加对应按钮

### 自定义样式

编辑 `singlepage/templates/singlepage/index.html` 中的 `<style>` 部分。

### 扩展功能

- 可以添加数据库模型来存储章节内容
- 可以实现用户认证系统
- 可以添加REST API接口

## 许可证

本项目基于MIT许可证开源。

## 贡献

欢迎提交Issue和Pull Request来改进这个项目。