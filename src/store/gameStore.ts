import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Card } from '../data/cards';
import { getStarterDeck } from '../data/cards';
import type { GameEvent, EventOutcome } from '../data/events';
import { getRandomEvent } from '../data/events';
import type { Enemy } from '../data/enemies';
import { getRandomEncounter, getBossEncounter } from '../data/enemies';
import type { CharacterClass } from '../data/characters';

interface PlayerStats {
  name: string;
  avatar: string;
  hp: number;
  maxHp: number;
  sanity: number;
  maxSanity: number;
  gold: number;
  stats: {
    str: number;
    dex: number;
    int: number;
    san: number;
  };
  deck: Card[];
  madnessLevel: number; // 0-3，疯狂等级
}

export type NodeType = 'start' | 'combat' | 'event' | 'rest' | 'shop' | 'boss' | 'elite';

interface GameNode {
  id: string;
  name: string;
  type: NodeType;
  x: number;
  y: number;
  connectedTo: string[];
}

export type GameScreen = 'home' | 'character-select' | 'main' | 'inventory' | 'combat' | 'reward' | 'settings';

interface GameState {
  player: PlayerStats;
  selectedClass: string | null;
  currentScene: GameEvent | null;
  currentScreen: GameScreen;
  isProcessing: boolean;

  // 节点系统
  currentNodeId: string;
  nodes: GameNode[];
  visitedNodes: string[];

  // 战斗相关
  currentEnemies: Enemy[];
  combatVictory: boolean;

  // 历史记录
  history: Array<{ type: string; content: string; timestamp: number }>;

  // Actions
  startNewGame: (characterClass: CharacterClass) => void;
  makeChoice: (choiceId: string) => void;
  setScreen: (screen: GameScreen) => void;
  moveToNode: (nodeId: string) => void;
  addToInventory: (card: Card) => void;
  removeFromInventory: (cardId: string) => void;
  updatePlayerStats: (stats: Partial<PlayerStats>) => void;
  addHistory: (entry: { type: string; content: string }) => void;
  startCombat: (enemies: Enemy[]) => void;
  endCombat: (victory: boolean, rewards?: { gold?: number; cards?: Card[] }) => void;
  applyMadness: () => void;
  resetGame: () => void;
}

// 初始节点地图
const INITIAL_NODES: GameNode[] = [
  // Layer 1
  { id: 'start', name: '遗忘墓穴', type: 'start', x: 0, y: 0, connectedTo: ['combat1'] },
  { id: 'combat1', name: '黑暗走廊', type: 'combat', x: 1, y: 0, connectedTo: ['event1', 'combat2'] },
  { id: 'event1', name: '神秘房间', type: 'event', x: 2, y: -1, connectedTo: ['rest1'] },
  { id: 'combat2', name: '腐朽大厅', type: 'combat', x: 2, y: 1, connectedTo: ['rest1'] },
  { id: 'rest1', name: '篝火', type: 'rest', x: 3, y: 0, connectedTo: ['combat3'] },

  // Layer 2
  { id: 'combat3', name: '扭曲回廊', type: 'combat', x: 4, y: 0, connectedTo: ['event2', 'elite1'] },
  { id: 'event2', name: '古老遗迹', type: 'event', x: 5, y: -1, connectedTo: ['shop1'] },
  { id: 'elite1', name: '污染圣殿', type: 'elite', x: 5, y: 1, connectedTo: ['shop1'] },
  { id: 'shop1', name: '神秘商人', type: 'shop', x: 6, y: 0, connectedTo: ['combat4'] },

  // Layer 3
  { id: 'combat4', name: '深渊边缘', type: 'combat', x: 7, y: 0, connectedTo: ['event3', 'combat5'] },
  { id: 'event3', name: '禁忌之地', type: 'event', x: 8, y: -1, connectedTo: ['rest2'] },
  { id: 'combat5', name: '黑暗深处', type: 'combat', x: 8, y: 1, connectedTo: ['rest2'] },
  { id: 'rest2', name: '最后营地', type: 'rest', x: 9, y: 0, connectedTo: ['boss'] },
  { id: 'boss', name: '深渊王座', type: 'boss', x: 10, y: 0, connectedTo: [] },
];

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      player: {
        name: '调查员',
        avatar: '🕵️',
        hp: 50,
        maxHp: 50,
        sanity: 50,
        maxSanity: 50,
        gold: 100,
        stats: {
          str: 14,
          dex: 12,
          int: 10,
          san: 50
        },
        deck: getStarterDeck(),
        madnessLevel: 0
      },

      selectedClass: null,
      currentScene: null,
      currentScreen: 'home',
      isProcessing: false,

      currentNodeId: 'start',
      nodes: INITIAL_NODES,
      visitedNodes: ['start'],

      currentEnemies: [],
      combatVictory: false,

      history: [],

      startNewGame: (characterClass) => {
        set({
          selectedClass: characterClass.id,
          player: {
            name: characterClass.name,
            avatar: characterClass.avatar,
            hp: characterClass.startingHp,
            maxHp: characterClass.startingHp,
            sanity: characterClass.startingSanity,
            maxSanity: characterClass.startingSanity,
            gold: characterClass.startingGold,
            stats: characterClass.stats,
            deck: [...characterClass.starterDeck],
            madnessLevel: 0
          },
          currentNodeId: 'start',
          visitedNodes: ['start'],
          currentScene: null,
          history: [],
          currentEnemies: []
        });
      },

      makeChoice: (choiceId: string) => {
        const state = get();
        const scene = state.currentScene;

        if (!scene) return;

        const choice = scene.choices.find(c => c.id === choiceId);
        if (!choice) return;

        get().addHistory({ type: 'choice', content: `你选择了：${choice.text}` });
        set({ isProcessing: true });

        // 处理检定
        let outcome: EventOutcome = choice.successOutcome;

        if (choice.check) {
          const roll = Math.floor(Math.random() * 20) + 1;
          const statValue = state.player.stats[choice.check.stat];
          const modifier = Math.floor((statValue - 10) / 2);
          const total = roll + modifier;
          const success = total >= choice.check.difficulty;

          get().addHistory({
            type: 'roll',
            content: `🎲 ${choice.check.stat.toUpperCase()}检定：${roll} + ${modifier} = ${total} (DC${choice.check.difficulty}) ${success ? '✓成功' : '✗失败'}`
          });

          outcome = success ? choice.successOutcome : (choice.failureOutcome || choice.successOutcome);
        }

        // 应用结果
        setTimeout(() => {
          get().addHistory({ type: 'outcome', content: outcome.description });

          if (outcome.rewards) {
            const { hp, sanity, maxHp, gold, cards } = outcome.rewards;

            if (hp !== undefined) {
              if (hp === 999) {
                // 完全恢复
                get().updatePlayerStats({ hp: state.player.maxHp });
              } else {
                const newHp = Math.max(0, Math.min(state.player.maxHp, state.player.hp + hp));
                get().updatePlayerStats({ hp: newHp });
              }
            }

            if (sanity !== undefined) {
              const newSanity = Math.max(0, Math.min(state.player.maxSanity, state.player.sanity + sanity));
              get().updatePlayerStats({ sanity: newSanity });

              // 检查疯狂
              if (newSanity === 0) {
                get().applyMadness();
              }
            }

            if (maxHp !== undefined) {
              get().updatePlayerStats({
                maxHp: state.player.maxHp + maxHp,
                hp: state.player.hp + maxHp
              });
            }

            if (gold !== undefined) {
              const newGold = Math.max(0, state.player.gold + gold);
              get().updatePlayerStats({ gold: newGold });
            }

            if (cards) {
              cards.forEach(cardId => {
                // 这里应该从CARDS数据库获取卡牌
                get().addHistory({ type: 'reward', content: `获得卡牌：${cardId}` });
              });
            }
          }

          if (outcome.combat) {
            // 触发战斗
            const enemies = getRandomEncounter('normal');
            get().startCombat(enemies);
          } else {
            // 继续探索
            set({ isProcessing: false, currentScene: null });
          }
        }, 800);
      },

      setScreen: (screen) => set({ currentScreen: screen }),

      moveToNode: (nodeId) => {
        const state = get();
        const node = state.nodes.find(n => n.id === nodeId);

        if (!node) return;

        // 检查是否相邻
        const currentNode = state.nodes.find(n => n.id === state.currentNodeId);
        if (currentNode && !currentNode.connectedTo.includes(nodeId)) {
          return;
        }

        set({
          currentNodeId: nodeId,
          visitedNodes: [...new Set([...state.visitedNodes, nodeId])]
        });

        // 触发节点事件
        switch (node.type) {
          case 'combat':
            const enemies = getRandomEncounter('normal');
            get().startCombat(enemies);
            break;

          case 'elite':
            const eliteEnemies = getRandomEncounter('hard');
            get().startCombat(eliteEnemies);
            break;

          case 'boss':
            const boss = getBossEncounter();
            get().startCombat(boss);
            break;

          case 'event':
            const event = getRandomEvent(state.visitedNodes);
            set({ currentScene: event, currentScreen: 'main' });
            break;

          case 'rest':
            const campfireEvent = getRandomEvent(['campfire']);
            set({ currentScene: campfireEvent, currentScreen: 'main' });
            break;

          case 'shop':
            const shopEvent = getRandomEvent(['mysterious_merchant']);
            set({ currentScene: shopEvent, currentScreen: 'main' });
            break;
        }
      },

      addToInventory: (card) => {
        const state = get();
        set({
          player: {
            ...state.player,
            deck: [...state.player.deck, card]
          }
        });
      },

      removeFromInventory: (cardId) => {
        const state = get();
        const newDeck = state.player.deck.filter((c, i) =>
          `${c.id}_${i}` !== cardId
        );
        set({
          player: {
            ...state.player,
            deck: newDeck
          }
        });
      },

      updatePlayerStats: (stats) => {
        const state = get();
        set({
          player: { ...state.player, ...stats }
        });
      },

      addHistory: (entry) => {
        const state = get();
        set({
          history: [...state.history, { ...entry, timestamp: Date.now() }]
        });
      },

      startCombat: (enemies) => {
        // 确保有敌人才开始战斗
        if (enemies && enemies.length > 0) {
          set({
            currentEnemies: enemies,
            currentScreen: 'combat'
          });
        } else {
          console.error('尝试开始战斗，但没有敌人！');
          // 如果没有敌人，直接给予奖励
          get().addHistory({ type: 'combat', content: '✓ 遭遇战自动胜利' });
          const goldReward = 20 + Math.floor(Math.random() * 30);
          get().updatePlayerStats({ gold: get().player.gold + goldReward });
          set({ currentScreen: 'reward', currentEnemies: [] });
        }
      },

      endCombat: (victory, rewards) => {
        const state = get();

        set({ combatVictory: victory });

        if (victory) {
          get().addHistory({ type: 'combat', content: '✓ 战斗胜利！' });

          // 战斗胜利后的奖励
          if (rewards) {
            if (rewards.gold) {
              get().updatePlayerStats({ gold: state.player.gold + rewards.gold });
              get().addHistory({ type: 'reward', content: `获得 ${rewards.gold} 金币` });
            }

            if (rewards.cards) {
              rewards.cards.forEach(card => {
                get().addToInventory(card);
                get().addHistory({ type: 'reward', content: `获得卡牌：${card.name}` });
              });
            }
          }

          set({ currentScreen: 'reward', currentEnemies: [] });
        } else {
          get().addHistory({ type: 'combat', content: '✗ 战斗失败...' });
          // 游戏结束逻辑
          set({ currentScreen: 'main', currentEnemies: [] });
        }
      },

      applyMadness: () => {
        const state = get();
        const newLevel = Math.min(3, state.player.madnessLevel + 1);

        get().updatePlayerStats({ madnessLevel: newLevel });

        const madnessMessages = [
          '你的理智彻底崩溃了...但某种疯狂的力量觉醒了。',
          '耳边的低语越来越清晰，你开始理解它们的意义...',
          '现实的边界变得模糊。你已经不再是曾经的自己。',
          '深渊凝视着你，而你也凝视着深渊。你们成为了一体。'
        ];

        get().addHistory({
          type: 'madness',
          content: `⚠️ 疯狂等级提升至 ${newLevel}！${madnessMessages[newLevel - 1]}`
        });

        // 恢复理智到10，但保留疯狂等级
        get().updatePlayerStats({ sanity: 10 });
      },

      resetGame: () => {
        set({
          player: {
            name: '调查员',
            avatar: '🕵️',
            hp: 50,
            maxHp: 50,
            sanity: 50,
            maxSanity: 50,
            gold: 100,
            stats: { str: 14, dex: 12, int: 10, san: 50 },
            deck: getStarterDeck(),
            madnessLevel: 0
          },
          selectedClass: null,
          currentScene: null,
          currentScreen: 'home',
          isProcessing: false,
          currentNodeId: 'start',
          visitedNodes: ['start'],
          currentEnemies: [],
          history: []
        });
      }
    }),
    { name: 'cthulhu-card-rpg-save' }
  )
);
