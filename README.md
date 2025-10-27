# 百科词条管理系统

基于 Django + React/Vue 构建的现代化百科词条管理系统，支持多前端框架选择。

## 项目特性

- **多前端支持**: 同时支持 React 和 Vue 前端框架
- **响应式设计**: 适配桌面端和移动端
- **用户认证**: 完整的用户注册、登录、权限管理
- **词条管理**: 创建、编辑、删除、浏览词条
- **分类标签**: 支持分类和标签管理
- **搜索功能**: 全文搜索和筛选功能
- **评论系统**: 用户评论和互动
- **点赞功能**: 词条点赞统计

## 技术栈

### 后端
- **框架**: Django 4.x
- **数据库**: SQLite (开发) / PostgreSQL (生产)
- **认证**: Django REST Framework + JWT
- **API**: RESTful API 设计

### 前端
- **React 前端**: React 18 + React Router + Zustand + Bootstrap 5
- **Vue 前端**: Vue 3 + Vue Router + Pinia + Bootstrap 5
- **构建工具**: Vite
- **样式框架**: Bootstrap 5 + Font Awesome

## 项目结构

```
项目根目录/
├── encyclopedia/          # Django 应用
├── mysite/               # Django 项目配置
├── templates/            # Django 模板
├── react-frontend/       # React 前端项目
├── vue-frontend/         # Vue 前端项目
├── requirements.txt      # Python 依赖
└── README.md            # 项目文档
```

## 快速开始

### 1. 环境准备

确保已安装以下软件：
- Python 3.8+
- Node.js 16+
- npm 或 yarn

#### Node.js 安装指南
前端开发需要 Node.js 环境，请先安装：

**Windows:**
- 访问 [Node.js官网](https://nodejs.org/) 下载安装包
- 选择 LTS 版本下载并安装
- 安装完成后重启终端

**验证安装：**
```bash
node --version
npm --version
```

### 2. 后端启动

```bash
# 安装 Python 依赖
pip install -r requirements.txt

# 数据库迁移
python manage.py migrate

# 创建超级用户
python manage.py createsuperuser

# 启动开发服务器
python manage.py runserver
```

后端服务将在 http://localhost:8000 启动

### 3. 前端启动

#### React 前端
```bash
cd react-frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

React 前端将在 http://localhost:3000 启动

#### Vue 前端
```bash
cd vue-frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

Vue 前端将在 http://localhost:5173 启动

### 4. 生产部署

#### 后端部署
```bash
# 收集静态文件
python manage.py collectstatic

# 使用 Gunicorn 部署
pip install gunicorn
gunicorn mysite.wsgi:application
```

#### 前端部署
```bash
# React 构建
cd react-frontend
npm run build

# Vue 构建
cd vue-frontend
npm run build
```

## API 接口

### 认证相关
- `POST /api/auth/register/` - 用户注册
- `POST /api/auth/login/` - 用户登录
- `POST /api/auth/logout/` - 用户登出
- `GET /api/auth/user/` - 获取当前用户信息

### 词条相关
- `GET /api/entries/` - 获取词条列表
- `POST /api/entries/` - 创建词条
- `GET /api/entries/{id}/` - 获取词条详情
- `PUT /api/entries/{id}/` - 更新词条
- `DELETE /api/entries/{id}/` - 删除词条
- `POST /api/entries/{id}/like/` - 点赞词条
- `GET /api/entries/{id}/comments/` - 获取评论列表
- `POST /api/entries/{id}/comments/` - 发表评论

### 分类标签
- `GET /api/categories/` - 获取分类列表
- `GET /api/tags/` - 获取标签列表

## 开发指南

### 添加新功能

1. **后端开发**: 在 `encyclopedia` 应用中添加模型、视图、序列化器
2. **前端开发**: 在对应的前端项目中添加组件和路由
3. **API 集成**: 在前端调用对应的 API 接口

### 数据库设计

主要数据表：
- `User`: 用户表
- `Category`: 分类表
- `Tag`: 标签表
- `Entry`: 词条表
- `Comment`: 评论表
- `Like`: 点赞表

### 权限控制

- 匿名用户: 只能浏览已发布的词条
- 登录用户: 可以创建、编辑自己的词条，发表评论
- 管理员: 管理所有词条和用户

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License

## 联系方式

如有问题请联系项目维护者。