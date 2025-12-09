# 我的博客

这是一个使用纯HTML、CSS和JavaScript创建的简单博客，可以部署到GitHub Pages上。

## 技术栈

- **HTML5** - 页面结构
- **CSS3** - 样式设计和响应式布局
- **JavaScript** - 交互功能
- **GitHub Pages** - 部署和托管

## 项目结构

```
.
├── css/
│   └── style.css          # 主样式文件
├── js/
│   └── main.js            # JavaScript交互功能
├── posts/
│   └── first-post.html    # 示例博客文章
├── .gitignore             # Git忽略文件
├── about.html             # 关于页面
├── index.html             # 首页
└── README.md              # 项目说明文档
```

## 功能特点

- 简洁美观的设计
- 响应式布局，适配各种设备
- 平滑滚动效果
- 悬停动画
- 导航栏滚动变化效果
- 页面加载动画

## 本地测试

### 方法1：直接在浏览器中打开

1. 找到项目目录
2. 双击 `index.html` 文件
3. 在浏览器中查看效果

### 方法2：使用本地HTTP服务器

#### 使用Python 3：
```bash
python -m http.server 8000
```

#### 使用Node.js (需要安装http-server)：
```bash
npx http-server -p 8000
```

#### 使用PHP：
```bash
php -S localhost:8000
```

然后在浏览器中访问 `http://localhost:8000`

## 部署到GitHub Pages

### 步骤1：创建GitHub仓库

1. 登录你的GitHub账号
2. 点击右上角的 "+" 按钮，选择 "New repository"
3. 仓库名称填写：`你的GitHub用户名.github.io`（例如：`username.github.io`）
4. 选择公开仓库（Public）
5. 点击 "Create repository"

### 步骤2：将本地项目推送到GitHub

1. 打开终端或命令提示符
2. 进入项目目录
3. 初始化Git仓库：
   ```bash
   git init
   ```
4. 添加所有文件：
   ```bash
   git add .
   ```
5. 提交文件：
   ```bash
   git commit -m "Initial commit"
   ```
6. 关联远程仓库：
   ```bash
   git remote add origin https://github.com/你的GitHub用户名/你的GitHub用户名.github.io.git
   ```
7. 推送代码到GitHub：
   ```bash
   git push -u origin main
   ```

### 步骤3：启用GitHub Pages

1. 进入你的GitHub仓库页面
2. 点击 "Settings" 选项卡
3. 在左侧菜单中选择 "Pages"
4. 在 "Source" 部分，选择 "main" 分支，然后选择 "/ (root)"
5. 点击 "Save"
6. 等待几分钟，GitHub Pages就会部署你的博客

### 步骤4：访问你的博客

部署完成后，你可以通过以下网址访问你的博客：
```
https://你的GitHub用户名.github.io
```

## 添加新文章

1. 在 `posts/` 目录下创建新的HTML文件
2. 复制 `posts/first-post.html` 的内容作为模板
3. 修改标题、内容和日期
4. 在 `index.html` 中添加新文章的链接

## 自定义样式

你可以修改 `css/style.css` 文件来自定义博客的样式，包括：
- 颜色方案
- 字体
- 布局
- 动画效果

## 自定义导航栏

你可以修改 `index.html`、`about.html` 和 `posts/first-post.html` 中的导航栏部分，添加或删除导航链接。

## 浏览器兼容性

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 许可证

MIT License

## 更新日志

### v1.0.0 (2024-01-01)
- 初始版本
- 完成基本博客功能
- 实现响应式设计
- 添加示例文章

## 贡献

欢迎提交Issue和Pull Request！

## 联系方式

如果有任何问题或建议，欢迎通过GitHub Issues与我联系。