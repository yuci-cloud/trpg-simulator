# 克苏鲁卡牌跑团游戏 - 最终实现方案

## 项目概述
将现有的深渊行者跑团游戏重构为**克苏鲁风格的卡牌Roguelike游戏**，保留TRPG投骰子事件系统，战斗改为类杀戮尖塔的卡牌模式。

## 用户确认的设计决策
✅ **卡牌美术**：纯文字卡牌（Slay the Spire风格）
✅ **理智机制**：SAN归零触发疯狂状态（debuff），可继续游戏
✅ **卡牌数量**：15-20张初始卡池
✅ **AI集成**：完全移除AI，使用预设事件和剧情

## 核心设计

### 1. 游戏流程
```
开局 → 事件节点（投骰子选择） → 战斗节点（卡牌战斗） → 奖励 → 循环 → Boss战
```

### 2. 克苏鲁主题元素
- **理智值（SAN）系统**：使用禁忌卡牌或遭遇恐怖会降低理智
- **疯狂状态**：SAN归零后获得debuff（混乱、虚弱、易伤）
- **深色恐怖美学**：暗绿、深紫、血红配色，旧神符文装饰
- **克苏鲁生物**：敌人设计（修格斯、深潜者、夜魇等）
- **预设剧情**：精心编写的克苏鲁风格事件和对话

### 3. 卡牌战斗系统

#### 卡牌类型（15-20张卡池）
**基础卡牌（初始卡组）：**
1. 打击 - 攻击6，费用1
2. 防御 - 格挡5，费用1
3. 疯狂低语 - 攻击10，消耗1理智，费用1

**可获得攻击牌：**
4. 重击 - 攻击12，费用2
5. 连斩 - 攻击3×2次，费用1
6. 致命一击 - 攻击8，抽1张牌，费用2
7. 献祭打击 - 攻击20，消耗5HP，费用1

**可获得技能牌：**
8. 屏障 - 格挡12，费用2
9. 真言护盾 - 格挡8，抽1张牌，费用2
10. 力量药水 - 获得2点力量，费用1
11. 敏捷提升 - 获得2点敏捷，费用1

**禁忌牌（强力但消耗理智）：**
12. 旧神低语 - 攻击18，消耗3理智，费用1
13. 禁忌献祭 - 造成25伤害，消耗5理智，费用2
14. 疯狂祝福 - 格挡15，消耗2理智，费用1
15. 混沌爆发 - 攻击10-30随机，消耗2理智，费用2

**稀有牌：**
16. 深渊凝视 - 攻击20，若理智<30额外造成10伤害，费用2
17. 以血还血 - 攻击=已损失HP，费用1
18. 完美防御 - 格挡999，消耗，费用3

#### 战斗机制
- **能量系统**：每回合3点能量
- **手牌管理**：每回合抽5张，弃牌堆洗回牌库
- **敌人AI**：显示敌人意图（攻击数值/防御/技能）
- **Buff系统**：力量（+伤害）、敏捷（+格挡）、虚弱（-伤害）
- **回合流程**：玩家回合 → 结束回合 → 敌人行动 → 循环

### 4. TRPG事件系统（预设剧本）

#### 预设事件列表（10-15个精心设计的事件）

**1. 古老图书馆**
- [INT 12] 阅读禁书 → 获得稀有卡牌，-5理智
- [STR 10] 推倒书架阻挡追兵 → 安全逃离
- 快速离开 → 无奖励但安全

**2. 血祭仪式现场**
- [SAN 15] 直视仪式 → 成功获得遗物，失败-10理智
- [DEX 12] 偷取祭品 → 获得金币和消耗品
- 立即撤退 → 安全但无奖励

**3. 疯狂学者**
- [INT 14] 与他交谈 → 学会强力卡牌，-3理智
- [STR 12] 制服他 → 获得遗物
- 避开他 → 安全通过

**4. 深渊裂隙**
- [DEX 15] 跳过裂隙 → 获得金币
- [SAN 12] 凝视深渊 → 成功+MaxHP，失败-15理智
- 绕路 → HP-5但安全

**5. 神秘商人**
- 购买卡牌（花费金币）
- 移除卡牌（花费金币）
- 离开

**6. 篝火休息点**
- 恢复HP到满
- 升级一张卡牌
- 冥想恢复理智+10

### 5. 敌人设计（8-10种敌人）

**小怪：**
- **狂信徒**：15HP，攻击6-8
- **鼠人**：12HP，攻击4，每回合+1力量
- **游荡尸体**：20HP，攻击10，行动慢（每2回合攻击1次）

**精英怪：**
- **深潜者**：35HP，攻击12，获得5格挡
- **修格斯幼体**：40HP，攻击8，每回合+2力量
- **暗影祭司**：30HP，攻击10，给玩家上虚弱

**Boss：**
- **克苏鲁祭司**：80HP
  - 阶段1：攻击15，召唤小怪
  - 阶段2（<40HP）：攻击20，获得10格挡
- **古老之物**：120HP
  - 多技能切换：攻击/防御/理智攻击（-5理智）

### 6. 游戏地图（节点系统）
```
节点类型：
🔮 事件节点 - 投骰子TRPG事件
⚔️ 战斗节点 - 卡牌战斗
🏕️ 休息节点 - 恢复/升级
🏪 商店节点 - 买卖卡牌
👁️ Boss节点 - Boss战

地图结构（3层，共15个节点）：
Layer 1: [战] -> [事件] -> [战] -> [休息]
Layer 2: [战] -> [事件] -> [战] -> [商店] -> [精英战]
Layer 3: [战] -> [事件] -> [休息] -> [战] -> [Boss]
```

## 技术实现方案

### 文件结构
```
src/
├── store/
│   ├── gameStore.ts          # 【重写】主游戏状态
│   └── combatStore.ts        # 【新增】战斗状态
├── components/
│   ├── LeftPanel.tsx         # 【修改】添加SAN值
│   ├── MainContent.tsx       # 【修改】显示预设事件
│   ├── NodeMap.tsx           # 【修改】新节点类型
│   ├── InventoryScreen.tsx   # 【修改】改为卡组查看器
│   ├── CombatScreen.tsx      # 【新增】卡牌战斗主界面
│   ├── CardComponent.tsx     # 【新增】单张卡牌UI
│   ├── EnemyDisplay.tsx      # 【新增】敌人显示
│   └── RewardScreen.tsx      # 【新增】战斗奖励
├── data/
│   ├── cards.ts              # 【新增】卡牌数据
│   ├── enemies.ts            # 【新增】敌人数据
│   └── events.ts             # 【新增】预设事件
└── services/
    └── (删除StoryGenerator.ts)  # 移除AI服务
```

### 核心数据结构

#### PlayerStats（修改）
```typescript
interface PlayerStats {
  name: string;
  hp: number;
  maxHp: number;
  sanity: number;        // 理智值
  maxSanity: number;
  gold: number;
  stats: { str: number; dex: number; int: number; };
  deck: Card[];          // 卡组
  madnessLevel: number;  // 疯狂等级（0-3）
}
```

#### Card
```typescript
interface Card {
  id: string;
  name: string;
  type: 'attack' | 'skill' | 'power' | 'status';
  cost: number;
  damage?: number;
  block?: number;
  sanityCost?: number;
  effects?: CardEffect[];
  description: string;
  upgraded: boolean;
  rarity: 'common' | 'uncommon' | 'rare';
}
```

#### Enemy
```typescript
interface Enemy {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  intention: {
    type: 'attack' | 'defend' | 'buff';
    value: number;
  };
  block: number;
  powers: { type: string; amount: number }[];
}
```

#### CombatState
```typescript
interface CombatState {
  isActive: boolean;
  player: {
    hp: number;
    block: number;
    energy: number;
    maxEnergy: number;
    powers: Power[];
  };
  enemies: Enemy[];
  deck: Card[];
  hand: Card[];
  discardPile: Card[];
  turn: number;
}
```

## 视觉风格（克苏鲁主题）

### 配色
```css
--bg-deep: #0a0a15;           /* 深邃黑 */
--bg-dark: #1a1a2a;           /* 暗紫黑 */
--bg-card: #14161f;           /* 卡牌背景 */
--accent-blood: #8b0000;      /* 暗血红 */
--accent-void: #2d1b4e;       /* 虚空紫 */
--accent-old-gold: #c9a961;   /* 旧金 */
--san-purple: #6a4c93;        /* 理智紫 */
--text-light: #d4d4d4;
--text-dim: #8a8a8a;
```

### 卡牌样式
```
┌─────────────────┐
│  [能量] 卡牌名    │ ← 顶部：名称和费用
├─────────────────┤
│                 │
│   [大图标区域]   │ ← 中部：类型图标或插画
│                 │
├─────────────────┤
│  描述文本        │ ← 底部：效果描述
│  造成6点伤害     │
└─────────────────┘
```

## 实施步骤

### Phase 1: 数据层（1-2小时）
1. ✅ 创建 `data/cards.ts` - 15-20张卡牌数据
2. ✅ 创建 `data/enemies.ts` - 8-10种敌人
3. ✅ 创建 `data/events.ts` - 10-15个预设事件
4. ✅ 创建 `combatStore.ts` - 战斗逻辑

### Phase 2: 战斗系统（2-3小时）
5. ✅ 实现 `CombatScreen.tsx` - 战斗主界面
6. ✅ 实现 `CardComponent.tsx` - 卡牌显示
7. ✅ 实现 `EnemyDisplay.tsx` - 敌人UI
8. ✅ 实现战斗逻辑：打牌、结束回合、敌人AI

### Phase 3: 游戏流程（1-2小时）
9. ✅ 修改 `gameStore.ts` - 节点系统、理智值
10. ✅ 修改 `MainContent.tsx` - 显示预设事件
11. ✅ 实现 `RewardScreen.tsx` - 战斗奖励

### Phase 4: UI适配（1-2小时）
12. ✅ 修改 `LeftPanel.tsx` - SAN值、卡组按钮
13. ✅ 修改 `NodeMap.tsx` - 新节点类型
14. ✅ 修改 `InventoryScreen.tsx` - 卡组查看器
15. ✅ 删除 `services/StoryGenerator.ts` 和相关AI代码

### Phase 5: 视觉打磨（1小时）
16. ✅ 更新全局CSS - 克苏鲁配色
17. ✅ 添加卡牌动画
18. ✅ 调整标题和文案

## 关键功能清单

### 战斗系统
- [x] 抽牌、出牌、弃牌逻辑
- [x] 能量系统
- [x] 伤害计算（考虑格挡、buff）
- [x] 敌人AI（意图系统）
- [x] 回合流程控制
- [x] 理智消耗机制

### 事件系统
- [x] 骰子检定（D20+属性修正）
- [x] 分支选择
- [x] 奖励发放（卡牌/金币/遗物）
- [x] 理智检定

### 游戏流程
- [x] 节点地图导航
- [x] 战斗触发
- [x] 奖励结算
- [x] 休息/商店功能
- [x] 疯狂状态触发

## 预估工作量
- 数据层：1-2小时
- 战斗系统：2-3小时
- 游戏流程：1-2小时
- UI适配：1-2小时
- 打磨：1小时
- **总计：6-10小时**

现在开始实施！
