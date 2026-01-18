# next-navigation

基于Next.js和MySQL的导航站应用

## 功能特性

- 📱 响应式设计 - 支持桌面、平板和移动设备
- 🎨 主题切换 - 支持深色/浅色模式
- 🔄 拖拽排序 - 分组和站点支持拖拽排序
- 📊 分组管理 - 创建、编辑、删除分组
- 🔗 站点管理 - 创建、编辑、删除站点
- ⚙️ 网站设置 - 自定义网站标题、名称和CSS
- 💾 数据导入导出 - 支持JSON格式的数据备份和恢复
- 🔐 用户认证 - 用户注册、登录、登出
- 👤 用户资料 - 编辑用户信息和头像
- 🎯 配置管理 - 灵活的配置系统

## 技术栈

### 前端
- Next.js 15
- React 19
- TypeScript
- Material-UI 7
- React Hook Form
- @dnd-kit (拖拽排序)
- Axios (HTTP客户端)

### 后端
- Next.js API Routes
- TypeORM
- MySQL
- bcryptjs (密码加密)

## 快速开始

### 前置要求
- Node.js 18+
- MySQL 5.7+
- pnpm (推荐) 或 npm

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/wustdjf/next-navigation.git
cd next-navigation
```

2. **安装依赖**
```bash
pnpm install
# 或
npm install
```

3. **配置环境变量**
```bash
# 复制示例文件
cp .env.example .env

# 编辑.env文件，配置数据库连接
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWD=your_password
DB_DATABASE=navigationDB
```

4. **创建数据库**
```bash
# 使用MySQL客户端创建数据库
mysql -u root -p
CREATE DATABASE navigationDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

5. **启动开发服务器**
```bash
pnpm dev
# 或
npm run dev
```

6. **访问应用**
打开浏览器访问 `http://localhost:3000`

## 项目结构

```
src/
├── app/
│   ├── api/                    # API路由
│   │   ├── auth/              # 认证API
│   │   ├── groups/            # 分组API
│   │   ├── sites/             # 站点API
│   │   ├── configs/           # 配置API
│   │   └── data/              # 数据导入导出API
│   ├── navigation/            # 导航页面
│   ├── login/                 # 登录页面
│   ├── register/              # 注册页面
│   ├── services/              # 前端API客户端
│   └── layout.tsx             # 根布局
├── components/                # React组件
├── services/                  # 后端业务逻辑
├── entities/                  # 数据模型
├── types/                     # TypeScript类型定义
├── configs/                   # 配置文件
├── utils/                     # 工具函数
├── hooks/                     # React Hooks
└── constant/                  # 常量定义
```

## API文档

### 认证API

#### 用户登录
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "登录成功",
  "data": {
    "user": { ... },
    "token": "..."
  }
}
```

#### 用户注册
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "newuser",
  "password": "password123",
  "nickname": "用户昵称"
}

Response:
{
  "success": true,
  "message": "注册成功",
  "data": {
    "user": { ... },
    "token": "..."
  }
}
```

#### 用户登出
```
POST /api/auth/logout

Response:
{
  "success": true,
  "message": "登出成功"
}
```

### 分组API

#### 获取所有分组
```
GET /api/groups/all

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "开发工具",
      "order_num": 0,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### 创建分组
```
POST /api/groups/create
Content-Type: application/json

{
  "name": "新分组",
  "order_num": 0
}
```

#### 更新分组
```
PUT /api/groups/:id
Content-Type: application/json

{
  "name": "更新后的名称",
  "order_num": 1
}
```

#### 删除分组
```
DELETE /api/groups/:id
```

#### 批量更新分组排序
```
PUT /api/groups/order
Content-Type: application/json

[
  { "id": 1, "order_num": 0 },
  { "id": 2, "order_num": 1 }
]
```

### 站点API

#### 获取站点列表
```
GET /api/sites/list?groupId=1

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "group_id": 1,
      "name": "GitHub",
      "url": "https://github.com",
      "icon": "https://github.com/favicon.ico",
      "description": "代码托管平台",
      "notes": "备注信息",
      "order_num": 0,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### 创建站点
```
POST /api/sites/create
Content-Type: application/json

{
  "group_id": 1,
  "name": "新站点",
  "url": "https://example.com",
  "icon": "https://example.com/favicon.ico",
  "description": "站点描述",
  "notes": "备注",
  "order_num": 0
}
```

#### 更新站点
```
PUT /api/sites/:id
Content-Type: application/json

{
  "name": "更新后的名称",
  "url": "https://updated.com"
}
```

#### 删除站点
```
DELETE /api/sites/:id
```

#### 批量更新站点排序
```
PUT /api/sites/order
Content-Type: application/json

[
  { "id": 1, "order_num": 0 },
  { "id": 2, "order_num": 1 }
]
```

### 配置API

#### 获取所有配置
```
GET /api/configs

Response:
{
  "success": true,
  "data": {
    "site.title": "导航站",
    "site.name": "我的导航站",
    "site.customCss": ""
  }
}
```

#### 获取单个配置
```
GET /api/configs/:key
```

#### 更新配置
```
PUT /api/configs/:key
Content-Type: application/json

{
  "value": "新值"
}
```

#### 批量更新配置
```
POST /api/configs
Content-Type: application/json

{
  "site.title": "新标题",
  "site.name": "新名称"
}
```

#### 删除配置
```
DELETE /api/configs/:key
```

### 数据导入导出API

#### 导出数据
```
GET /api/data/export

Response:
{
  "success": true,
  "data": {
    "groups": [...],
    "sites": [...],
    "configs": {...}
  }
}
```

#### 导入数据
```
POST /api/data/import
Content-Type: application/json

{
  "groups": [...],
  "sites": [...],
  "configs": {...}
}

Response:
{
  "success": true,
  "data": {
    "groupsCount": 5,
    "sitesCount": 20,
    "configsCount": 3
  }
}
```

## 使用指南

### 首次使用

1. 访问 `http://localhost:3000/register` 注册账户
2. 使用注册的账户登录
3. 进入导航页面 `/navigation`
4. 创建分组和站点

### 管理分组

- **创建分组**: 点击"新增分组"按钮
- **编辑分组**: 点击分组卡片上的编辑按钮
- **删除分组**: 点击分组卡片上的删除按钮
- **排序分组**: 点击"更多选项" > "编辑排序"，然后拖拽分组

### 管理站点

- **创建站点**: 点击分组中的"新增站点"按钮
- **编辑站点**: 点击站点卡片上的设置按钮
- **删除站点**: 点击站点卡片上的删除按钮
- **排序站点**: 在分组中点击"编辑排序"，然后拖拽站点

### 网站设置

1. 点击"更多选项" > "网站设置"
2. 修改网站标题、名称和自定义CSS
3. 点击保存

### 数据备份和恢复

**导出数据**:
1. 点击"更多选项" > "导出数据"
2. 浏览器会自动下载JSON文件

**导入数据**:
1. 点击"更多选项" > "导入数据"
2. 选择之前导出的JSON文件
3. 点击导入

## 开发指南

### 添加新的API路由

1. 在 `src/app/api/` 中创建新的路由文件
2. 实现相应的HTTP方法处理函数
3. 使用 `successResponse` 和 `errorResponse` 返回响应

### 添加新的服务

1. 在 `src/services/` 中创建新的服务类
2. 实现业务逻辑方法
3. 导出单例实例

### 添加新的前端组件

1. 在 `src/components/` 中创建新的React组件
2. 使用Material-UI组件库
3. 导出组件

## 常见问题

### 数据库连接失败

检查以下几点：
- MySQL服务是否运行
- 数据库凭证是否正确
- 数据库是否已创建

### 端口被占用

如果3000端口被占用，可以使用其他端口：
```bash
pnpm dev -- -p 3001
```

### 密码加密问题

应用使用bcryptjs进行密码加密，确保已安装该依赖：
```bash
pnpm add bcryptjs
```

## 部署

### 生产构建

```bash
pnpm build
pnpm start
```

### Docker部署

创建 `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
```

构建和运行：
```bash
docker build -t next-navigation .
docker run -p 3000:3000 -e DB_HOST=host.docker.internal next-navigation
```

## 许可证

MIT

## 贡献

欢迎提交Issue和Pull Request！

## 支持

如有问题，请提交Issue或联系开发者。