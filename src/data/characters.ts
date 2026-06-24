// 职业数据定义

import type { Card } from './cards';
import { CARDS } from './cards';

export interface CharacterClass {
  id: string;
  name: string;
  description: string;
  avatar: string;
  startingHp: number;
  startingSanity: number;
  startingGold: number;
  stats: {
    str: number;
    dex: number;
    int: number;
    san: number;
  };
  starterDeck: Card[];
  cardPool: string[]; // 该职业可获得的卡牌ID
}

// 职业数据库
export const CHARACTER_CLASSES: Record<string, CharacterClass> = {
  investigator: {
    id: 'investigator',
    name: '调查员',
    description: '平衡型职业，擅长使用知识和理智对抗未知。拥有均衡的攻防能力，理智值较高。',
    avatar: '🕵️',
    startingHp: 50,
    startingSanity: 60,
    startingGold: 100,
    stats: {
      str: 12,
      dex: 14,
      int: 14,
      san: 60
    },
    starterDeck: [
      { ...CARDS.strike },
      { ...CARDS.strike },
      { ...CARDS.strike },
      { ...CARDS.strike },
      { ...CARDS.defend },
      { ...CARDS.defend },
      { ...CARDS.defend },
      { ...CARDS.defend },
      { ...CARDS.defend },
      { ...CARDS.mad_whisper }
    ],
    cardPool: [
      'strike', 'defend', 'heavy_strike', 'twin_slash', 'deadly_strike',
      'barrier', 'truth_shield', 'strength_potion', 'agility_boost',
      'elder_whisper', 'madness_blessing', 'abyss_gaze', 'blood_for_blood'
    ]
  },

  cultist: {
    id: 'cultist',
    name: '狂信徒',
    description: '激进型职业，拥抱疯狂与禁忌力量。血量较低但拥有强大的禁忌卡牌，理智值较低。',
    avatar: '🗡️',
    startingHp: 45,
    startingSanity: 40,
    startingGold: 120,
    stats: {
      str: 16,
      dex: 10,
      int: 12,
      san: 40
    },
    starterDeck: [
      { ...CARDS.strike },
      { ...CARDS.strike },
      { ...CARDS.strike },
      { ...CARDS.defend },
      { ...CARDS.defend },
      { ...CARDS.defend },
      { ...CARDS.mad_whisper },
      { ...CARDS.mad_whisper },
      { ...CARDS.sacrifice_strike },
      { ...CARDS.elder_whisper }
    ],
    cardPool: [
      'strike', 'defend', 'heavy_strike', 'sacrifice_strike', 'deadly_strike',
      'barrier', 'strength_potion',
      'elder_whisper', 'forbidden_sacrifice', 'madness_blessing', 'chaos_burst',
      'abyss_gaze', 'blood_for_blood', 'perfect_defense'
    ]
  }
};

// 获取职业
export function getCharacterClass(id: string): CharacterClass | undefined {
  return CHARACTER_CLASSES[id];
}

// 获取所有职业
export function getAllCharacterClasses(): CharacterClass[] {
  return Object.values(CHARACTER_CLASSES);
}
