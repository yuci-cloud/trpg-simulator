// src/store/gameStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Token {
  id: string;
  x: number;
  y: number;
  type: 'player' | 'ally' | 'enemy' | 'npc';
  name: string;
  avatar: string;
  hp?: number;
  maxHp?: number;
}

interface GameState {
  // 地图状态
  gridSize: number; // 像素
  mapWidth: number;
  mapHeight: number;
  tokens: Token[];
  selectedTokenId: string | null;
  
  // 叙事状态
  currentScene: string;
  gameLog: { type: 'action' | 'dialogue' | 'system'; content: string; timestamp: number }[];
  allies: CharacterProfile[];
  
  // 行动系统
  currentTurn: 'player' | 'ally' | 'enemy';
  activeAllyIndex: number;
  
  // Actions
  moveToken: (id: string, x: number, y: number) => void;
  selectToken: (id: string | null) => void;
  addLog: (entry: { type: 'action' | 'dialogue' | 'system'; content: string }) => void;
  advanceTurn: () => void;
  updateAllyRelationship: (allyId: string, delta: number) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      gridSize: 40,
      mapWidth: 20, // 20格
      mapHeight: 15,
      tokens: [
        { id: 'player', x: 2, y: 2, type: 'player', name: '你', avatar: '🧙‍♂️', hp: 30, maxHp: 30 },
        { id: 'ally1', x: 3, y: 3, type: 'ally', name: '莱拉', avatar: '🗡️', hp: 25, maxHp: 25 },
      ],
      selectedTokenId: null,
      currentScene: "你站在一个阴暗的石室中，火把在墙壁上摇曳。前方有两扇门。",
      gameLog: [{ type: 'system', content: '游戏开始', timestamp: Date.now() }],
      allies: [{
        id: 'ally1',
        name: '莱拉',
        class: '战士',
        personality: '谨慎但忠诚，重视荣誉',
        speechStyle: '简洁直接，偶尔引用古代格言',
        motivation: '寻找失踪的弟弟',
        stats: { hp: 25, maxHp: 25, str: 16, dex: 12, int: 10 },
        relationship: 50,
      }],
      currentTurn: 'player',
      activeAllyIndex: 0,

      moveToken: (id, x, y) => set((state) => ({
        tokens: state.tokens.map(t => 
          t.id === id ? { ...t, x, y } : t
        )
      })),

      selectToken: (id) => set({ selectedTokenId: id }),

      addLog: (entry) => set((state) => ({
        gameLog: [...state.gameLog, { ...entry, timestamp: Date.now() }]
      })),

      advanceTurn: () => {
        const state = get();
        if (state.currentTurn === 'player') {
          set({ currentTurn: 'ally', activeAllyIndex: 0 });
        } else if (state.currentTurn === 'ally') {
          if (state.activeAllyIndex < state.allies.length - 1) {
            set({ activeAllyIndex: state.activeAllyIndex + 1 });
          } else {
            set({ currentTurn: 'enemy', activeAllyIndex: 0 });
            // 这里触发敌人AI...
            setTimeout(() => get().advanceTurn(), 1000);
          }
        } else {
          set({ currentTurn: 'player' });
        }
      },

      updateAllyRelationship: (allyId, delta) => set((state) => ({
        allies: state.allies.map(a => 
          a.id === allyId ? { ...a, relationship: Math.max(-100, Math.min(100, a.relationship + delta)) } : a
        )
      }))
    }),
    { name: 'ttrpg-save' }
  )
);