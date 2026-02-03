import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StoryGenerator } from '../services/StoryGenerator';

interface PlayerStats {
  name: string;
  avatar: string;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  level: number;
  exp: number;
  stats: {
    str: number;
    dex: number;
    int: number;
  };
}

interface GameEvent {
  id: string;
  description: string;
  choices: GameChoice[];
  requiredCheck?: {
    stat: 'str' | 'dex' | 'int';
    difficulty: number;
  };
}

interface Item {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'consumable' | 'key';
  description: string;
  icon: string;
}

interface GameChoice {
  id: string;
  text: string;
  type: 'combat' | 'explore' | 'talk' | 'item';
  consequence?: string;
  requiredCheck?: {
    stat: 'str' | 'dex' | 'int';
    difficulty: number;
  };
}

interface GameScene {
  id: string;
  title: string;
  description: string;
  choices: GameChoice[];
  backgroundImage?: string;
}

export type GameScreen = 'main' | 'inventory' | 'status' | 'settings';

interface GameState {
  player: PlayerStats;
  inventory: Item[];
  currentScene: GameScene;
  history: { type: 'scene' | 'choice' | 'combat' | 'loot'; content: string; timestamp: number }[];
  currentScreen: GameScreen;
  isProcessing: boolean;
  currentNodeId: string;
  nodes: Array<{
    id: string;
    name: string;
    type: 'start' | 'combat' | 'event' | 'boss' | 'safe';
    x: number;
    y: number;
    connectedTo: string[];
  }>;
  visitedNodes: string[];
  
  makeChoice: (choiceId: string) => Promise<void>;
  setScreen: (screen: GameScreen) => void;
  addToInventory: (item: Item) => void;
  removeFromInventory: (itemId: string) => void;
  useItem: (itemId: string) => void;
  updatePlayerStats: (stats: Partial<PlayerStats>) => void;
  addHistory: (entry: { type: 'scene' | 'choice' | 'combat' | 'loot'; content: string }) => void;
  moveToNode: (nodeId: string) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      player: {
        name: '冒险者',
        avatar: '👤',
        hp: 50,
        maxHp: 50,
        mp: 30,
        maxMp: 30,
        level: 1,
        exp: 0,
        stats: {
          str: 14,
          dex: 12,
          int: 10
        }
      },
      inventory: [
        { id: 'potion1', name: '生命药水', type: 'consumable', description: '恢复 20 HP', icon: '🧪' },
        { id: 'sword1', name: '铁剑', type: 'weapon', description: '攻击力 +5', icon: '⚔️' }
      ],
      currentNodeId: 'start',
      visitedNodes: ['start'],
      nodes: [
        { id: 'start', name: '地牢入口', type: 'start', x: 0, y: 0, connectedTo: ['hallway'] },
        { id: 'hallway', name: '血腥走廊', type: 'combat', x: 1, y: 0, connectedTo: ['start', 'chamber', 'pit'] },
        { id: 'chamber', name: '秘密石室', type: 'event', x: 2, y: -1, connectedTo: ['hallway', 'boss'] },
        { id: 'pit', name: '深渊边缘', type: 'combat', x: 2, y: 1, connectedTo: ['hallway'] },
        { id: 'boss', name: '王座间', type: 'boss', x: 3, y: 0, connectedTo: ['chamber'] }
      ],
      currentScene: {
        id: 'cell_awakening',
        title: '囚室·苏醒',
        description: `金属撞击声将你从黑暗中拽回现实。

你躺在冰冷的石板上，手腕被粗糙的麻绳磨得生疼。空气中弥漫着霉味和某种甜腻的腐臭——像是放了一个月的葡萄酒混合着铁锈味。

"别动，"一个低沉的女声从左侧传来，"你吵醒了守卫，我们都得死。"

借着墙缝透进的微光，你看到一个身披破旧铠甲的女人。她的脸藏在阴影里，只能看到下巴上一道狰狞的伤疤。她手里握着一把缺了口的短剑，剑尖正对着你的喉咙。

"听着，"她压低声音，"我是莱拉。不管你犯了什么罪被扔进来，现在我们有同一个问题——"她踢了踢地上的尸体，一具穿着狱卒制服的东西，"这家伙半小时前还是活的。如果他没按时回去报告，整个地牢都会警报。"

她解开了你的绳子："你能站起来吗？我们需要在换岗前离开这里。你有三分钟说服我你不值得被扔下等死。"`,
        choices: [
          { 
            id: 'check_cell', 
            text: '检查囚室环境，寻找线索', 
            type: 'explore',
            consequence: 'reveal_exit'
          },
          { 
            id: 'ask_crime', 
            text: '"你是谁？我为什么会在这里？"', 
            type: 'talk',
            consequence: 'laila_backstory'
          },
          { 
            id: 'attack_laila', 
            text: '趁她不注意抢夺武器（力量检定 12）', 
            type: 'combat',
            requiredCheck: { stat: 'str', difficulty: 12 },
            consequence: 'combat_laila'
          },
          { 
            id: 'cooperate', 
            text: '"我配合，但你知道出口在哪吗？"', 
            type: 'talk',
            consequence: 'laila_plan'
          }
        ]
      },
      history: [],
      currentScreen: 'main',
      isProcessing: false,
      
      makeChoice: async (choiceId: string) => {
        const choice = get().currentScene.choices.find(c => c.id === choiceId);
        if (!choice) return;
        
        get().addHistory({ type: 'choice', content: `选择了：${choice.text}` });
        set({ isProcessing: true });
        
        let checkResult = null;
        if (choice.requiredCheck) {
          const roll = Math.floor(Math.random() * 20) + 1;
          const statValue = get().player.stats[choice.requiredCheck.stat];
          const modifier = Math.floor((statValue - 10) / 2);
          const total = roll + modifier;
          const success = total >= choice.requiredCheck.difficulty;
          
          checkResult = { success, roll, total, difficulty: choice.requiredCheck.difficulty };
          
          get().addHistory({ 
            type: 'combat', 
            content: `🎲 ${choice.requiredCheck.stat.toUpperCase()}检定：${roll} + ${modifier} = ${total} (目标${choice.requiredCheck.difficulty}) ${success ? '✓' : '✗'}`
          });
          
          await new Promise(r => setTimeout(r, 600));
        }
        
        try {
          const generator = new StoryGenerator();
          const partyStatus = `HP:${get().player.hp}, 位置:${get().currentNodeId}`;
          const location = get().nodes.find(n => n.id === get().currentNodeId)?.name || '未知区域';
          
          const generated = await generator.generateScene(
            get().currentScene.description,
            choice.text,
            location,
            partyStatus
          );
          
          const newScene: GameScene = {
            id: `ai_${Date.now()}`,
            title: generated.title,
            description: generated.description,
            choices: generated.choices
          };
          
          if (generated.loot && generated.loot.length > 0) {
            generated.loot.forEach(item => {
              get().addToInventory({
                id: `loot_${Date.now()}_${Math.random()}`,
                name: item.name,
                type: item.type as any || 'consumable',
                description: 'AI生成的物品',
                icon: item.icon
              });
              get().addHistory({ type: 'loot', content: `获得：${item.name}` });
            });
          }
          
          set({ 
            currentScene: newScene, 
            isProcessing: false 
          });
          
        } catch (error) {
          console.error('生成失败:', error);
          set({
            currentScene: {
              id: 'error_fallback',
              title: '迷失',
              description: '莱拉摇摇头："这里有些不对劲...我们先退回安全的地方重新规划。"',
              choices: [
                { id: 'retry', text: '重新探索', type: 'explore' },
                { id: 'rest', text: '原地休息', type: 'safe' }
              ]
            },
            isProcessing: false
          });
        }
      },
      
      moveToNode: (nodeId) => set((state) => ({
        currentNodeId: nodeId,
        visitedNodes: [...new Set([...state.visitedNodes, nodeId])]
      })),
      
      setScreen: (screen) => set({ currentScreen: screen }),
      
      addToInventory: (item) => set((state) => ({ 
        inventory: [...state.inventory, item] 
      })),
      
      removeFromInventory: (itemId) => set((state) => ({
        inventory: state.inventory.filter(i => i.id !== itemId)
      })),
      
      useItem: (itemId) => {
        const item = get().inventory.find(i => i.id === itemId);
        if (!item) return;
        
        if (item.type === 'consumable') {
          if (item.id === 'potion1') {
            get().updatePlayerStats({ hp: Math.min(get().player.hp + 20, get().player.maxHp) });
          }
          get().removeFromInventory(itemId);
          get().addHistory({ type: 'loot', content: `使用了 ${item.name}` });
        }
      },
      
      updatePlayerStats: (stats) => set((state) => ({
        player: { ...state.player, ...stats }
      })),
      
      addHistory: (entry) => set((state) => ({
        history: [...state.history, { ...entry, timestamp: Date.now() }]
      })),
      
      resetGame: () => set({
        player: {
          name: '冒险者',
          avatar: '👤',
          hp: 50,
          maxHp: 50,
          mp: 30,
          maxMp: 30,
          level: 1,
          exp: 0,
          stats: { str: 14, dex: 12, int: 10 }
        },
        inventory: [
          { id: 'potion1', name: '生命药水', type: 'consumable', description: '恢复 20 HP', icon: '🧪' }
        ],
        currentScene: {
          id: 'cell_awakening',
          title: '囚室·苏醒',
          description: `金属撞击声将你从黑暗中拽回现实。

你躺在冰冷的石板上，手腕被粗糙的麻绳磨得生疼。空气中弥漫着霉味和某种甜腻的腐臭——像是放了一个月的葡萄酒混合着铁锈味。

"别动，"一个低沉的女声从左侧传来，"你吵醒了守卫，我们都得死。"

借着墙缝透进的微光，你看到一个身披破旧铠甲的女人。她的脸藏在阴影里，只能看到下巴上一道狰狞的伤疤。她手里握着一把缺了口的短剑，剑尖正对着你的喉咙。

"听着，"她压低声音，"我是莱拉。不管你犯了什么罪被扔进来，现在我们有同一个问题——"她踢了踢地上的尸体，一具穿着狱卒制服的东西，"这家伙半小时前还是活的。如果他没按时回去报告，整个地牢都会警报。"

她解开了你的绳子："你能站起来吗？我们需要在换岗前离开这里。你有三分钟说服我你不值得被扔下等死。"`,
          choices: [
            { id: 'check_cell', text: '检查囚室环境，寻找线索', type: 'explore' },
            { id: 'ask_crime', text: '"你是谁？我为什么会在这里？"', type: 'talk' },
            { id: 'attack_laila', text: '趁她不注意抢夺武器（力量检定 12）', type: 'combat', requiredCheck: {stat: 'str', difficulty: 12} },
            { id: 'cooperate', text: '"我配合，但你知道出口在哪吗？"', type: 'talk' }
          ]
        },
        currentNodeId: 'start',
        visitedNodes: ['start'],
        history: [],
        currentScreen: 'main',
        isProcessing: false
      })
    }),
    { name: 'text-rpg-save' }
  )
);