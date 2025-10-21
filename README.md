# 编程大赛投票系统

一个专为编程大赛设计的在线投票系统，支持移动端访问，具备防刷票功能和实时结果显示。

## ✨ 功能特性

- 🏆 **编程大赛投票** - 专为编程竞赛设计的投票界面
- 📱 **移动端优化** - 完全响应式设计，支持手机、平板访问
- 🔒 **防刷票机制** - 基于设备指纹技术，每设备限投一票
- ⚡ **实时更新** - 投票结果实时同步显示
- 🎨 **现代化UI** - 使用 Tailwind CSS 构建的美观界面
- 🚀 **快速部署** - 基于 Supabase 的后端服务

## 🛠️ 技术栈

- **前端**: React 18 + TypeScript + Vite
- **样式**: Tailwind CSS
- **后端**: Supabase (数据库 + 实时订阅)
- **防刷票**: FingerprintJS
- **状态管理**: Zustand
- **通知**: Sonner
- **图标**: Lucide React

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm 或 pnpm

### 安装依赖

```bash
npm install
# 或
pnpm install
```

### 环境配置

1. 在项目根目录创建 `.env` 文件
2. 配置 Supabase 连接信息：

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 数据库设置

项目已包含数据库迁移文件，位于 `supabase/migrations/` 目录：

- `001_create_voting_tables.sql` - 创建投票相关表结构
- `002_grant_permissions.sql` - 设置数据库权限

### 启动开发服务器

```bash
npm run dev
# 或
pnpm dev
```

访问 `http://localhost:3001` 查看应用。

## 📊 数据库结构

### teams (参赛队伍)
- `id` - 队伍唯一标识
- `name` - 队伍名称
- `description` - 队伍描述
- `members` - 队伍成员列表

### votes (投票记录)
- `id` - 投票记录ID
- `team_id` - 投票的队伍ID
- `device_fingerprint` - 设备指纹
- `user_agent` - 用户代理信息
- `created_at` - 投票时间

### vote_records (投票统计)
- `team_id` - 队伍ID
- `vote_count` - 得票数
- `percentage` - 得票百分比

## 🎨 主题配置

项目使用自定义主题颜色：
- **主色调**: `#32f08c` (绿色)
- **辅助色**: `#000000` (黑色)

主题配置位于 `tailwind.config.js` 文件中。

## 🔧 核心功能

### 设备指纹防刷票

使用 FingerprintJS 生成唯一设备标识，确保每个设备只能投票一次：

```typescript
// 使用 useFingerprint hook
const { fingerprint, isLoading, error } = useFingerprint()
```

### 实时投票结果

基于 Supabase 实时订阅功能，投票结果自动更新：

```typescript
// 实时订阅投票统计变化
const subscription = supabase
  .channel('vote_records_changes')
  .on('postgres_changes', { 
    event: '*', 
    schema: 'public', 
    table: 'vote_records' 
  }, handleUpdate)
  .subscribe()
```

### 移动端优化

- 响应式布局适配各种屏幕尺寸
- 触摸友好的交互设计
- 防止移动端页面缩放
- 优化的触摸目标大小

## 📱 移动端测试

项目包含移动端测试脚本 `test-voting.js`，可在浏览器控制台运行：

```javascript
// 运行所有测试
window.votingTests.runAllTests()

// 单独测试功能
window.votingTests.testFingerprint()
window.votingTests.testDatabaseConnection()
window.votingTests.testResponsiveDesign()
```

## 🚀 部署

### 本地构建和预览

#### 构建生产版本

```bash
npm run build
# 或
pnpm build
```

构建完成后，生产文件将位于 `dist/` 目录中。

#### 本地预览构建结果

```bash
npm run preview
# 或
pnpm preview
```

### 环境变量配置

在部署前，确保在部署平台配置以下环境变量：

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 部署到 Netlify

项目已包含 `netlify.toml` 配置文件，支持一键部署：

1. **连接仓库**
   - 登录 [Netlify](https://netlify.com)
   - 点击 "New site from Git"
   - 选择你的 GitHub 仓库

2. **配置环境变量**
   - 在 Netlify 控制台进入 "Site settings" > "Environment variables"
   - 添加以下变量：
     ```
     VITE_SUPABASE_URL = your_supabase_url
     VITE_SUPABASE_ANON_KEY = your_supabase_anon_key
     ```

3. **部署设置**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `18`

4. **自动部署**
   - 推送代码到 main 分支即可自动部署

### 部署到 Vercel

项目已包含 `vercel.json` 配置文件：

1. **安装 Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **登录并部署**
   ```bash
   vercel login
   vercel --prod
   ```

3. **或通过 Vercel 控制台**
   - 登录 [Vercel](https://vercel.com)
   - 导入 GitHub 仓库
   - 配置环境变量：
     ```
     VITE_SUPABASE_URL = your_supabase_url
     VITE_SUPABASE_ANON_KEY = your_supabase_anon_key
     ```

4. **自动部署**
   - 每次推送到 main 分支自动部署

### 部署到 GitHub Pages

项目已包含 GitHub Actions 工作流 `.github/workflows/deploy.yml`：

1. **启用 GitHub Pages**
   - 进入仓库 Settings > Pages
   - Source 选择 "GitHub Actions"

2. **配置 Secrets**
   - 进入仓库 Settings > Secrets and variables > Actions
   - 添加以下 Repository secrets：
     ```
     VITE_SUPABASE_URL = your_supabase_url
     VITE_SUPABASE_ANON_KEY = your_supabase_anon_key
     ```

3. **自动部署**
   - 推送代码到 main 分支即可触发自动部署
   - 部署完成后可通过 `https://username.github.io/repository-name` 访问

### 部署到其他平台

构建产物位于 `dist/` 目录，可部署到任何静态托管服务：

- **Firebase Hosting**
- **AWS S3 + CloudFront**
- **Azure Static Web Apps**
- **Cloudflare Pages**

#### 重要配置说明

由于这是一个 React 单页应用 (SPA)，需要配置路由重定向：

- **Netlify**: 已在 `netlify.toml` 中配置
- **Vercel**: 已在 `vercel.json` 中配置
- **其他平台**: 需要将所有路由重定向到 `index.html`

#### 部署检查清单

- [ ] 环境变量已正确配置
- [ ] Supabase 数据库已设置并可访问
- [ ] 构建成功无错误
- [ ] SPA 路由重定向已配置
- [ ] HTTPS 已启用（推荐）

### 部署到其他平台

构建产物位于 `dist/` 目录，可部署到任何静态托管服务。

## 🔒 安全特性

- **设备指纹验证** - 防止重复投票
- **数据库 RLS** - 行级安全策略
- **环境变量保护** - 敏感信息不暴露到前端
- **HTTPS 强制** - 生产环境强制使用 HTTPS

## 📝 开发指南

### 项目结构

```
src/
├── components/          # React 组件
│   ├── Header.tsx      # 页面头部
│   ├── TeamCard.tsx    # 队伍卡片
│   ├── VoteResults.tsx # 投票结果
│   └── ...
├── hooks/              # 自定义 Hooks
│   ├── useVoting.ts    # 投票逻辑
│   ├── useFingerprint.ts # 设备指纹
│   └── ...
├── lib/                # 工具库
│   └── supabase.ts     # Supabase 配置
├── pages/              # 页面组件
│   └── Home.tsx        # 主页
└── ...
```

### 添加新队伍

在 Supabase 数据库中的 `teams` 表添加记录：

```sql
INSERT INTO teams (name, description, members) VALUES 
('队伍名称', '队伍描述', ARRAY['成员1', '成员2', '成员3']);
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 📄 许可证

MIT License

## 🆘 支持

如有问题，请创建 Issue 或联系开发团队。

---

**编程大赛投票系统** - 公平 · 公正 · 公开