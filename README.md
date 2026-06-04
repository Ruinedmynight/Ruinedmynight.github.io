# 深度睡眠 · Forest Night Theme

> 一个安静的文字角落。简洁、质朴、历久弥新。

纯静态个人博客，基于 HTML + CSS + JavaScript 构建，部署在 GitHub Pages 上。文章以 Markdown 编写，前端通过 [marked.js](https://github.com/markedjs/marked) 渲染，无需任何构建工具或后端服务。

## ✨ 特性

- **暗色森林主题** — 深邃墨绿底色 + 玻璃拟态设计 + 动态星空粒子背景
- **明暗切换** — 支持暗色/亮色主题切换，通过 `localStorage` 持久化偏好
- **响应式布局** — 桌面端右侧固定边栏，移动端自动折叠导航菜单
- **Markdown 驱动** — 文章以 `.md` 文件存放，含 YAML 元数据头（标题、日期、分类、标签、摘要）
- **分类与标签** — 自动从文章元数据聚合分类列表和标签云
- **文章归档** — 按时间线组织的归档页面
- **零构建** — 无需 Node.js、Webpack 或其他工具链，纯静态直接运行

## 📁 项目结构

```
.
├── index.html           # 首页
├── about.html           # 关于页面
├── archive.html         # 归档页面
├── post.html            # 文章详情页模板
├── favicon.svg          # 站点图标
│
├── css/
│   └── style.css        # 全部样式（包含亮色/暗色主题变量）
│
├── js/
│   └── main.js          # 星空粒子、主题切换、文章渲染、菜单逻辑
│
├── posts/               # 文章目录
│   ├── posts.json       # 文章列表（只需写文件名，不含 .md）
│   └── *.md             # 你的文章（内嵌 YAML 头）
│
├── images/              # 图片资源
│
└── README.md
```

## 📝 添加新文章

1. 在 `posts/` 下创建 `.md` 文件，文件头部写入 YAML 元数据：

```markdown
---
title: 文章标题
category: 分类名称
date: May 30, 2026
tags: [tag1, tag2]
excerpt: 文章摘要，会显示在首页卡片上
---

正文内容从这里开始...
```

2. 在 `posts/posts.json` 中添加文件名（不含 `.md` 后缀）：

```json
"your-post"
```

> 文章列表按 JSON 中的顺序排列，最新文章推荐放在最前。

## 🚀 部署到 GitHub Pages

1. 在 GitHub 创建仓库 `https://github.com/你的用户名/你的用户名.github.io`

2. 推送代码：

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/你的用户名/你的用户名.github.io.git
git push -u origin main
```

3. 启用 GitHub Pages：
   - 进入仓库 **Settings** → **Pages**
   - **Source** 选择 **Deploy from a branch**
   - **Branch** 选择 `main`，目录选 `/ (root)`
   - 点击 **Save**

4. 站点将发布在：`https://你的用户名.github.io`

### 自定义域名（可选）

在仓库 **Settings** → **Pages** → **Custom domain** 中配置域名，或在根目录添加 `CNAME` 文件。

## 💻 本地预览

直接用浏览器打开 `index.html` 即可，无需任何构建工具。

如需本地 HTTP 服务（解决某些浏览器对 `file://` 的限制），可用 Python 快速启动：

```bash
python -m http.server 8000
# 访问 http://localhost:8000
```

## 🎨 主题定制

- **主题色** — 修改 `css/style.css` 中 `:root` 下的 CSS 变量（`--color-*` 系列）
- **星空粒子** — 编辑 `js/main.js` 中的 `initStars()` 函数，调整粒子数量、大小、颜色
- **站点信息** — 修改 `index.html`、`about.html` 中的标题、描述和社交链接

## 📄 License

MIT
