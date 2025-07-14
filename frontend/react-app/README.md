# 期权定价计算器 React 前端

这是期权定价计算器的React前端实现，提供了用户友好的界面来计算期权价格。

## 功能特点

- 基于React和React Bootstrap构建的现代化UI
- 响应式设计，适配各种屏幕尺寸
- 表单验证和错误处理
- 与后端API无缝集成
- 清晰直观地展示计算结果

## 技术栈

- React 18
- React Bootstrap
- Axios（用于API请求）
- CSS3

## 项目结构

```
src/
├── components/           # 组件目录
│   ├── OptionCalculator.js  # 期权计算器表单组件
│   └── ResultDisplay.js     # 结果显示组件
├── App.js                # 主应用组件
├── index.js              # 应用入口点
└── index.css             # 全局样式
```

## 开发指南

### 安装依赖

```bash
cd frontend/react-app
npm install
```

### 启动开发服务器

```bash
npm start
```

应用将在 http://localhost:3000 上运行。

### 构建生产版本

```bash
npm run build
```

构建文件将生成在 `build` 目录中。

## 与后端集成

前端应用通过 Axios 与后端 API 通信。API 端点配置在 `package.json` 的 `proxy` 字段中，默认指向 `http://localhost:8000`。

## 自定义

- 修改 `src/index.css` 来自定义全局样式
- 在 `components` 目录中添加新组件来扩展功能
- 调整 `App.js` 来更改应用的整体布局