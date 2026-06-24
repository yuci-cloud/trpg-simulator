// 敌人数据定义

export type IntentionType = 'attack' | 'defend' | 'buff' | 'debuff' | 'unknown';

export interface Power {
  id: string;
  name: string;
  amount: number;
  type: 'strength' | 'dexterity' | 'vulnerable' | 'weak' | 'ritual';
}

export interface Intention {
  type: IntentionType;
  value: number;
  description: string;
}

export interface Enemy {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  block: number;
  powers: Power[];
  intention: Intention;
  aiPattern: IntentionType[]; // AI行动模式
  currentPatternIndex: number;
  tier: 'normal' | 'elite' | 'boss';
}

// 敌人模板数据库
export const ENEMY_TEMPLATES = {
  // === 普通敌人 ===
  cultist: {
    id: 'cultist',
    name: '狂信徒',
    maxHp: 15,
    aiPattern: ['attack', 'attack', 'buff'] as IntentionType[],
    tier: 'normal' as const,
    description: '失去理智的信徒'
  },

  rat_man: {
    id: 'rat_man',
    name: '鼠人',
    maxHp: 12,
    aiPattern: ['attack', 'buff', 'attack'] as IntentionType[],
    tier: 'normal' as const,
    description: '畸形的地下生物'
  },

  walking_corpse: {
    id: 'walking_corpse',
    name: '游荡尸体',
    maxHp: 20,
    aiPattern: ['unknown', 'attack', 'unknown', 'attack'] as IntentionType[],
    tier: 'normal' as const,
    description: '行动缓慢但力量强大'
  },

  shadow_spawn: {
    id: 'shadow_spawn',
    name: '暗影孽生',
    maxHp: 18,
    aiPattern: ['attack', 'attack', 'defend'] as IntentionType[],
    tier: 'normal' as const,
    description: '从阴影中诞生的怪物'
  },

  // === 精英敌人 ===
  deep_one: {
    id: 'deep_one',
    name: '深潜者',
    maxHp: 35,
    aiPattern: ['attack', 'defend', 'attack', 'buff'] as IntentionType[],
    tier: 'elite' as const,
    description: '来自深海的克苏鲁眷族'
  },

  shoggoth_spawn: {
    id: 'shoggoth_spawn',
    name: '修格斯幼体',
    maxHp: 40,
    aiPattern: ['attack', 'buff', 'attack', 'attack'] as IntentionType[],
    tier: 'elite' as const,
    description: '不定形的恐怖生物'
  },

  dark_priest: {
    id: 'dark_priest',
    name: '暗影祭司',
    maxHp: 30,
    aiPattern: ['debuff', 'attack', 'buff', 'attack'] as IntentionType[],
    tier: 'elite' as const,
    description: '侍奉旧神的祭司'
  },

  // === Boss ===
  cthulhu_priest: {
    id: 'cthulhu_priest',
    name: '克苏鲁祭司',
    maxHp: 80,
    aiPattern: ['attack', 'attack', 'buff', 'attack', 'defend'] as IntentionType[],
    tier: 'boss' as const,
    description: '旧神的高阶祭司'
  },

  ancient_thing: {
    id: 'ancient_thing',
    name: '古老之物',
    maxHp: 120,
    aiPattern: ['attack', 'debuff', 'attack', 'buff', 'attack', 'defend'] as IntentionType[],
    tier: 'boss' as const,
    description: '远古时代的存在'
  }
};

// 生成敌人实例
export function createEnemy(templateId: keyof typeof ENEMY_TEMPLATES): Enemy {
  const template = ENEMY_TEMPLATES[templateId];

  return {
    id: `${templateId}_${Date.now()}_${Math.random()}`,
    name: template.name,
    hp: template.maxHp,
    maxHp: template.maxHp,
    block: 0,
    powers: [],
    intention: getNextIntention(template.aiPattern, 0, template.tier),
    aiPattern: template.aiPattern,
    currentPatternIndex: 0,
    tier: template.tier
  };
}

// 根据AI模式获取下一个行动意图
function getNextIntention(pattern: IntentionType[], index: number, tier: 'normal' | 'elite' | 'boss'): Intention {
  const intentionType = pattern[index % pattern.length];

  // 根据敌人类型调整数值
  const multiplier = tier === 'boss' ? 1.5 : tier === 'elite' ? 1.2 : 1;

  switch (intentionType) {
    case 'attack':
      const damage = Math.floor((6 + Math.random() * 6) * multiplier);
      return {
        type: 'attack',
        value: damage,
        description: `准备攻击 ${damage} 点伤害`
      };

    case 'defend':
      const block = Math.floor((8 + Math.random() * 4) * multiplier);
      return {
        type: 'defend',
        value: block,
        description: `准备获得 ${block} 点格挡`
      };

    case 'buff':
      return {
        type: 'buff',
        value: 1 + Math.floor(multiplier),
        description: `准备获得力量`
      };

    case 'debuff':
      return {
        type: 'debuff',
        value: 2,
        description: `准备给予虚弱`
      };

    case 'unknown':
      return {
        type: 'unknown',
        value: 0,
        description: '意图未知'
      };

    default:
      return {
        type: 'attack',
        value: 5,
        description: '准备攻击'
      };
  }
}

// 更新敌人的下一个行动意图
export function updateEnemyIntention(enemy: Enemy): Enemy {
  const nextIndex = (enemy.currentPatternIndex + 1) % enemy.aiPattern.length;

  return {
    ...enemy,
    currentPatternIndex: nextIndex,
    intention: getNextIntention(enemy.aiPattern, nextIndex, enemy.tier)
  };
}

// 执行敌人行动
export function executeEnemyAction(enemy: Enemy): { damage?: number; block?: number; power?: Power; debuff?: Power } {
  const { intention } = enemy;

  switch (intention.type) {
    case 'attack':
      return { damage: intention.value };

    case 'defend':
      return { block: intention.value };

    case 'buff':
      return {
        power: {
          id: 'strength',
          name: '力量',
          amount: intention.value,
          type: 'strength'
        }
      };

    case 'debuff':
      return {
        debuff: {
          id: 'weak',
          name: '虚弱',
          amount: intention.value,
          type: 'weak'
        }
      };

    default:
      return {};
  }
}

// 获取随机遭遇战（1-3个敌人）
export function getRandomEncounter(difficulty: 'easy' | 'normal' | 'hard'): Enemy[] {
  const normalEnemies: (keyof typeof ENEMY_TEMPLATES)[] = ['cultist', 'rat_man', 'walking_corpse', 'shadow_spawn'];
  const eliteEnemies: (keyof typeof ENEMY_TEMPLATES)[] = ['deep_one', 'shoggoth_spawn', 'dark_priest'];

  let enemies: Enemy[] = [];

  if (difficulty === 'easy') {
    // 1-2个普通敌人
    const count = 1 + Math.floor(Math.random() * 2);
    for (let i = 0; i < count; i++) {
      const id = normalEnemies[Math.floor(Math.random() * normalEnemies.length)];
      enemies.push(createEnemy(id));
    }
  } else if (difficulty === 'normal') {
    // 2-3个普通敌人
    const count = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < count; i++) {
      const id = normalEnemies[Math.floor(Math.random() * normalEnemies.length)];
      enemies.push(createEnemy(id));
    }
  } else {
    // 1个精英敌人 或 3个普通敌人
    if (Math.random() < 0.5) {
      const id = eliteEnemies[Math.floor(Math.random() * eliteEnemies.length)];
      enemies.push(createEnemy(id));
    } else {
      for (let i = 0; i < 3; i++) {
        const id = normalEnemies[Math.floor(Math.random() * normalEnemies.length)];
        enemies.push(createEnemy(id));
      }
    }
  }

  console.log('生成敌人遭遇战:', enemies.length, '个敌人，难度:', difficulty);
  return enemies;
}

// 获取Boss战
export function getBossEncounter(): Enemy[] {
  const bossId = Math.random() < 0.5 ? 'cthulhu_priest' : 'ancient_thing';
  return [createEnemy(bossId)];
}
