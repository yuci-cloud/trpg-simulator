import { create } from 'zustand';
import type { Card } from '../data/cards';
import type { Enemy, Power } from '../data/enemies';
import { updateEnemyIntention, executeEnemyAction } from '../data/enemies';

interface PlayerCombatState {
  hp: number;
  maxHp: number;
  block: number;
  energy: number;
  maxEnergy: number;
  powers: Power[];
}

interface CombatState {
  isActive: boolean;
  player: PlayerCombatState;
  enemies: Enemy[];
  deck: Card[];
  hand: Card[];
  discardPile: Card[];
  exhaustPile: Card[];
  turn: number;
  isPlayerTurn: boolean;

  // Actions
  startCombat: (playerHp: number, playerMaxHp: number, enemies: Enemy[], deck: Card[]) => void;
  drawCards: (count: number) => void;
  playCard: (cardIndex: number, targetEnemyIndex?: number) => void;
  endTurn: () => void;
  endCombat: () => void;

  // Helper methods
  applyDamageToEnemy: (enemyIndex: number, damage: number) => void;
  applyDamageToPlayer: (damage: number) => void;
  gainBlock: (amount: number) => void;
  addPower: (power: Power, isPlayer: boolean, enemyIndex?: number) => void;
  shuffleDiscardIntoDeck: () => void;
}

export const useCombatStore = create<CombatState>((set, get) => ({
  isActive: false,
  player: {
    hp: 50,
    maxHp: 50,
    block: 0,
    energy: 3,
    maxEnergy: 3,
    powers: []
  },
  enemies: [],
  deck: [],
  hand: [],
  discardPile: [],
  exhaustPile: [],
  turn: 1,
  isPlayerTurn: true,

  startCombat: (playerHp, playerMaxHp, enemies, deck) => {
    const shuffledDeck = [...deck].sort(() => Math.random() - 0.5);

    set({
      isActive: true,
      player: {
        hp: playerHp,
        maxHp: playerMaxHp,
        block: 0,
        energy: 3,
        maxEnergy: 3,
        powers: []
      },
      enemies: enemies,
      deck: shuffledDeck,
      hand: [],
      discardPile: [],
      exhaustPile: [],
      turn: 1,
      isPlayerTurn: true
    });

    get().drawCards(5);
  },

  drawCards: (count) => {
    const state = get();
    let { deck, hand, discardPile } = state;

    for (let i = 0; i < count; i++) {
      if (deck.length === 0) {
        if (discardPile.length === 0) break;
        deck = [...discardPile].sort(() => Math.random() - 0.5);
        discardPile = [];
      }

      const card = deck.pop();
      if (card) {
        hand.push(card);
      }
    }

    set({ deck, hand, discardPile });
  },

  playCard: (cardIndex, targetEnemyIndex = 0) => {
    const state = get();
    const card = state.hand[cardIndex];

    if (!card || card.cost > state.player.energy) return;

    if (targetEnemyIndex >= state.enemies.length) {
      targetEnemyIndex = 0;
    }

    const newEnergy = state.player.energy - card.cost;
    const newHand = [...state.hand];
    newHand.splice(cardIndex, 1);

    const newDiscardPile = [...state.discardPile];

    // 攻击伤害
    if (card.damage !== undefined) {
      let damage = card.damage;

      if (card.id === 'blood_for_blood') {
        damage = state.player.maxHp - state.player.hp;
      }

      if (card.id === 'chaos_burst') {
        damage = 10 + Math.floor(Math.random() * 21);
      }

      const strengthPower = state.player.powers.find(p => p.type === 'strength');
      if (strengthPower) {
        damage += strengthPower.amount;
      }

      const weakPower = state.player.powers.find(p => p.type === 'weak');
      if (weakPower) {
        damage = Math.floor(damage * 0.75);
      }

      if (card.id === 'twin_slash') {
        get().applyDamageToEnemy(targetEnemyIndex, damage);
        get().applyDamageToEnemy(targetEnemyIndex, damage);
      } else {
        get().applyDamageToEnemy(targetEnemyIndex, damage);
      }

      if (card.id === 'sacrifice_strike') {
        const newHp = Math.max(0, state.player.hp - 5);
        set(currentState => ({
          player: { ...currentState.player, hp: newHp }
        }));

        // 同步更新gameStore
        import('./gameStore').then(({ useGameStore }) => {
          useGameStore.getState().updatePlayerStats({ hp: newHp });
        });
      }
    }

    // 格挡
    if (card.block !== undefined) {
      let block = card.block;
      const dexterityPower = state.player.powers.find(p => p.type === 'dexterity');
      if (dexterityPower) {
        block += dexterityPower.amount;
      }
      get().gainBlock(block);
    }

    // 特殊效果
    if (card.effects) {
      card.effects.forEach(effect => {
        switch (effect.type) {
          case 'draw':
            get().drawCards(effect.amount);
            break;
          case 'strength':
            get().addPower({
              id: 'strength',
              name: '力量',
              amount: effect.amount,
              type: 'strength'
            }, true);
            break;
          case 'dexterity':
            get().addPower({
              id: 'dexterity',
              name: '敏捷',
              amount: effect.amount,
              type: 'dexterity'
            }, true);
            break;
        }
      });
    }

    if (card.id !== 'perfect_defense') {
      newDiscardPile.push(card);
    }

    set({
      hand: newHand,
      discardPile: newDiscardPile,
      player: { ...state.player, energy: newEnergy }
    });

    setTimeout(() => {
      const currentState = get();
      const allEnemiesDead = currentState.enemies.every(e => e.hp <= 0);
      if (allEnemiesDead) {
        get().endCombat();
      }
    }, 100);
  },

  endTurn: () => {
    const state = get();

    if (state.isPlayerTurn) {
      const newDiscardPile = [...state.discardPile, ...state.hand];

      set({
        hand: [],
        discardPile: newDiscardPile,
        player: { ...state.player, block: 0 },
        isPlayerTurn: false
      });

      setTimeout(() => {
        executeEnemyTurn();
      }, 500);
    }
  },

  endCombat: () => {
    set({ isActive: false });
  },

  applyDamageToEnemy: (enemyIndex, damage) => {
    const state = get();
    const newEnemies = [...state.enemies];
    const enemy = newEnemies[enemyIndex];

    if (!enemy || enemy.hp <= 0) return;

    let remainingDamage = damage;
    if (enemy.block > 0) {
      const blockUsed = Math.min(enemy.block, damage);
      enemy.block -= blockUsed;
      remainingDamage -= blockUsed;
    }

    enemy.hp = Math.max(0, enemy.hp - remainingDamage);
    newEnemies[enemyIndex] = enemy;
    set({ enemies: newEnemies });
  },

  applyDamageToPlayer: (damage) => {
    const state = get();
    let remainingDamage = damage;

    let newBlock = state.player.block;
    if (newBlock > 0) {
      const blockUsed = Math.min(newBlock, damage);
      newBlock -= blockUsed;
      remainingDamage -= blockUsed;
    }

    const newHp = Math.max(0, state.player.hp - remainingDamage);

    set({
      player: {
        ...state.player,
        hp: newHp,
        block: newBlock
      }
    });

    // 实时同步更新gameStore中的玩家血量
    import('./gameStore').then(({ useGameStore }) => {
      useGameStore.getState().updatePlayerStats({ hp: newHp });
    });
  },

  gainBlock: (amount) => {
    set(state => ({
      player: {
        ...state.player,
        block: state.player.block + amount
      }
    }));
  },

  addPower: (power, isPlayer, enemyIndex) => {
    const state = get();

    if (isPlayer) {
      const existingPower = state.player.powers.find(p => p.id === power.id);

      if (existingPower) {
        const newPowers = state.player.powers.map(p =>
          p.id === power.id ? { ...p, amount: p.amount + power.amount } : p
        );
        set({
          player: { ...state.player, powers: newPowers }
        });
      } else {
        set({
          player: { ...state.player, powers: [...state.player.powers, power] }
        });
      }
    } else if (enemyIndex !== undefined) {
      const newEnemies = [...state.enemies];
      const enemy = newEnemies[enemyIndex];

      const existingPower = enemy.powers.find(p => p.id === power.id);

      if (existingPower) {
        enemy.powers = enemy.powers.map(p =>
          p.id === power.id ? { ...p, amount: p.amount + power.amount } : p
        );
      } else {
        enemy.powers = [...enemy.powers, power];
      }

      newEnemies[enemyIndex] = enemy;
      set({ enemies: newEnemies });
    }
  },

  shuffleDiscardIntoDeck: () => {
    const state = get();
    const shuffled = [...state.discardPile].sort(() => Math.random() - 0.5);
    set({
      deck: [...state.deck, ...shuffled],
      discardPile: []
    });
  }
}));

function executeEnemyTurn() {
  const state = useCombatStore.getState();
  let newEnemies = [...state.enemies];

  newEnemies.forEach((enemy, index) => {
    if (enemy.hp <= 0) return;

    const action = executeEnemyAction(enemy);

    if (action.damage) {
      useCombatStore.getState().applyDamageToPlayer(action.damage);
    }

    if (action.block) {
      newEnemies[index] = {
        ...enemy,
        block: enemy.block + action.block
      };
    }

    if (action.power) {
      newEnemies[index] = {
        ...enemy,
        powers: [...enemy.powers, action.power]
      };
    }

    if (action.debuff) {
      useCombatStore.getState().addPower(action.debuff, true);
    }

    newEnemies[index] = updateEnemyIntention(newEnemies[index]);
    newEnemies[index] = {
      ...newEnemies[index],
      block: 0
    };
  });

  useCombatStore.setState({ enemies: newEnemies });

  setTimeout(() => {
    const currentState = useCombatStore.getState();
    if (currentState.player.hp <= 0) {
      useCombatStore.getState().endCombat();
      return;
    }

    const newTurn = currentState.turn + 1;
    const newPlayer = {
      ...currentState.player,
      energy: currentState.player.maxEnergy
    };

    useCombatStore.setState({
      turn: newTurn,
      isPlayerTurn: true,
      player: newPlayer
    });

    useCombatStore.getState().drawCards(5);
  }, 1000);
}
