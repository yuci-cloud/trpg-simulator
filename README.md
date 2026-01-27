# 深渊行者 - 单人AI跑团模拟器

基于 React + TypeScript + Vite 开发的网页版跑团游戏，支持与 AI 队友协作冒险。

## 功能特性

- 🎮 **战术地图**：网格化战棋移动，Token 拖拽操作
- 🤖 **AI 队友**：基于 SiliconFlow/DeepSeek 的智能 NPC，可自然对话
- ⚔️ **回合制行动**：玩家与 AI 交替行动，沉浸式体验
- 🎨 **暗黑地牢风 UI**：科技感动态界面

## 快速开始

```bash
# 安装依赖
npm install

# 配置 API Key（必须）
echo VITE_SILICONFLOW_API_KEY=sk-你的密钥 > .env.local

# 启动开发服务器
npm run dev

# 浏览器访问 http://localhost:5173
游戏操作
鼠标拖拽：移动角色 Token
右侧输入框：输入行动指令（如"检查血迹"、"准备战斗"）
AI 响应：队友莱拉会根据场景智能回应
技术栈
React 18 + TypeScript
Vite 5
Zustand（状态管理）
HTML5 Canvas（地图渲染）
SiliconFlow API（AI 对话）
项目结构
复制
src/
├── components/    # 组件（地图、对话面板）
├── services/      # AI 服务
├── store/         # 状态管理
└── App.tsx        # 主应用
注意事项
.env.local 文件包含 API 密钥，请勿提交到 Git
首次运行需注册 SiliconFlow 获取免费 API Key
开发计划
[ ] 战斗检定系统（骰子判定）
[ ] 角色头像立绘
[ ] 地图贴图资源
[ ] 存档功能
作者：yuci-cloud
GitHub：https://github.com/yuci-cloud/trpg-simulator