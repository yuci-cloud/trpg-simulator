// 卡牌数据定义

export type CardType = 'attack' | 'skill' | 'power' | 'status';
export type CardRarity = 'starter' | 'common' | 'uncommon' | 'rare';

export interface CardEffect {
  type: 'draw' | 'strength' | 'dexterity' | 'vulnerable' | 'weak';
  amount: number;
}

export interface Card {
  id: string;
  name: string;
  type: CardType;
  cost: number;
  damage?: number;
  block?: number;
  sanityCost?: number;
  effects?: CardEffect[];
  description: string;
  upgraded: boolean;
  rarity: CardRarity;
}

// 卡牌数据库
export const CARDS: Record<string, Card> = {
  // === 初始卡组 ===
  strike: {
    id: 'strike',
    name: '打击',
    type: 'attack',
    cost: 1,
    damage: 6,
    description: '造成 6 点伤害',
    upgraded: false,
    rarity: 'starter'
  },

  defend: {
    id: 'defend',
    name: '防御',
    type: 'skill',
    cost: 1,
    block: 5,
    description: '获得 5 点格挡',
    upgraded: false,
    rarity: 'starter'
  },

  mad_whisper: {
    id: 'mad_whisper',
    name: '疯狂低语',
    type: 'attack',
    cost: 1,
    damage: 10,
    sanityCost: 1,
    description: '造成 10 点伤害。失去 1 点理智。',
    upgraded: false,
    rarity: 'starter'
  },

  // === 基础攻击牌 ===
  heavy_strike: {
    id: 'heavy_strike',
    name: '重击',
    type: 'attack',
    cost: 2,
    damage: 12,
    description: '造成 12 点伤害',
    upgraded: false,
    rarity: 'common'
  },

  twin_slash: {
    id: 'twin_slash',
    name: '连斩',
    type: 'attack',
    cost: 1,
    damage: 3,
    description: '造成 3 点伤害两次',
    upgraded: false,
    rarity: 'common'
  },

  deadly_strike: {
    id: 'deadly_strike',
    name: '致命一击',
    type: 'attack',
    cost: 2,
    damage: 8,
    effects: [{ type: 'draw', amount: 1 }],
    description: '造成 8 点伤害。抽 1 张牌。',
    upgraded: false,
    rarity: 'uncommon'
  },

  sacrifice_strike: {
    id: 'sacrifice_strike',
    name: '献祭打击',
    type: 'attack',
    cost: 1,
    damage: 20,
    description: '造成 20 点伤害。失去 5 点生命。',
    upgraded: false,
    rarity: 'uncommon'
  },

  // === 防御/技能牌 ===
  barrier: {
    id: 'barrier',
    name: '屏障',
    type: 'skill',
    cost: 2,
    block: 12,
    description: '获得 12 点格挡',
    upgraded: false,
    rarity: 'common'
  },

  truth_shield: {
    id: 'truth_shield',
    name: '真言护盾',
    type: 'skill',
    cost: 2,
    block: 8,
    effects: [{ type: 'draw', amount: 1 }],
    description: '获得 8 点格挡。抽 1 张牌。',
    upgraded: false,
    rarity: 'uncommon'
  },

  // === 能力牌 ===
  strength_potion: {
    id: 'strength_potion',
    name: '力量药剂',
    type: 'power',
    cost: 1,
    effects: [{ type: 'strength', amount: 2 }],
    description: '获得 2 点力量',
    upgraded: false,
    rarity: 'uncommon'
  },

  agility_boost: {
    id: 'agility_boost',
    name: '敏捷提升',
    type: 'power',
    cost: 1,
    effects: [{ type: 'dexterity', amount: 2 }],
    description: '获得 2 点敏捷（格挡+2）',
    upgraded: false,
    rarity: 'uncommon'
  },

  // === 禁忌牌（强力但消耗理智）===
  elder_whisper: {
    id: 'elder_whisper',
    name: '旧神低语',
    type: 'attack',
    cost: 1,
    damage: 18,
    sanityCost: 3,
    description: '造成 18 点伤害。失去 3 点理智。',
    upgraded: false,
    rarity: 'rare'
  },

  forbidden_sacrifice: {
    id: 'forbidden_sacrifice',
    name: '禁忌献祭',
    type: 'attack',
    cost: 2,
    damage: 25,
    sanityCost: 5,
    description: '造成 25 点伤害。失去 5 点理智。',
    upgraded: false,
    rarity: 'rare'
  },

  madness_blessing: {
    id: 'madness_blessing',
    name: '疯狂祝福',
    type: 'skill',
    cost: 1,
    block: 15,
    sanityCost: 2,
    description: '获得 15 点格挡。失去 2 点理智。',
    upgraded: false,
    rarity: 'rare'
  },

  chaos_burst: {
    id: 'chaos_burst',
    name: '混沌爆发',
    type: 'attack',
    cost: 2,
    damage: 15, // 实际会随机10-30
    sanityCost: 2,
    description: '造成 10-30 点随机伤害。失去 2 点理智。',
    upgraded: false,
    rarity: 'rare'
  },

  // === 稀有牌 ===
  abyss_gaze: {
    id: 'abyss_gaze',
    name: '深渊凝视',
    type: 'attack',
    cost: 2,
    damage: 20,
    description: '造成 20 点伤害。若理智低于30，额外造成 10 点伤害。',
    upgraded: false,
    rarity: 'rare'
  },

  blood_for_blood: {
    id: 'blood_for_blood',
    name: '以血还血',
    type: 'attack',
    cost: 1,
    damage: 0, // 动态计算
    description: '造成等于已损失生命值的伤害',
    upgraded: false,
    rarity: 'rare'
  },

  perfect_defense: {
    id: 'perfect_defense',
    name: '完美防御',
    type: 'skill',
    cost: 3,
    block: 999,
    description: '获得 999 点格挡。消耗。',
    upgraded: false,
    rarity: 'rare'
  }
};

// 获取初始卡组
export function getStarterDeck(): Card[] {
  return [
    { ...CARDS.strike },
    { ...CARDS.strike },
    { ...CARDS.strike },
    { ...CARDS.strike },
    { ...CARDS.strike },
    { ...CARDS.defend },
    { ...CARDS.defend },
    { ...CARDS.defend },
    { ...CARDS.defend },
    { ...CARDS.mad_whisper }
  ];
}

// 根据稀有度获取可奖励的卡牌池
export function getCardPool(rarity: CardRarity): Card[] {
  return Object.values(CARDS)
    .filter(card => card.rarity === rarity && card.rarity !== 'starter')
    .map(card => ({ ...card }));
}

// 随机获取N张卡牌作为奖励
export function getRandomCards(count: number, rarity: CardRarity): Card[] {
  const pool = getCardPool(rarity);
  const result: Card[] = [];

  for (let i = 0; i < count && pool.length > 0; i++) {
    const index = Math.floor(Math.random() * pool.length);
    result.push(pool.splice(index, 1)[0]);
  }

  return result;
}
