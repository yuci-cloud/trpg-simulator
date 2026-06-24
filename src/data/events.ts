// TRPG事件数据定义

export type StatType = 'str' | 'dex' | 'int' | 'san';

export interface EventChoice {
  id: string;
  text: string;
  type: 'check' | 'safe' | 'combat' | 'shop';
  check?: {
    stat: StatType;
    difficulty: number;
  };
  successOutcome: EventOutcome;
  failureOutcome?: EventOutcome;
}

export interface EventOutcome {
  description: string;
  rewards?: {
    gold?: number;
    hp?: number;
    sanity?: number;
    maxHp?: number;
    cards?: string[]; // card IDs
  };
  combat?: boolean; // 是否触发战斗
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  choices: EventChoice[];
  image?: string;
}

// 预设事件库
export const EVENTS: Record<string, GameEvent> = {
  ancient_library: {
    id: 'ancient_library',
    title: '古老图书馆',
    description: `你推开厚重的木门，灰尘在微弱的光线中飞舞。

这座图书馆已经废弃多年，书架上满是破损的古籍。墙角的一本黑色皮质书散发着不祥的气息，封面用未知的文字写着某种咒文。

你的直觉告诉你，翻开它会带来知识——以及代价。`,
    choices: [
      {
        id: 'read_book',
        text: '阅读禁书（智力检定 12）',
        type: 'check',
        check: { stat: 'int', difficulty: 12 },
        successOutcome: {
          description: '你强忍着头痛，理解了书中的秘密。禁忌的知识涌入脑海，你学会了强大的技艺，但代价是部分理智的丧失。',
          rewards: { sanity: -5, cards: ['elder_whisper'] }
        },
        failureOutcome: {
          description: '文字在你眼前扭曲旋转，尖啸声在耳边回响。你慌忙合上书本，但已经太迟了——理智严重受损。',
          rewards: { sanity: -10 }
        }
      },
      {
        id: 'push_shelf',
        text: '推倒书架阻挡追兵（力量检定 10）',
        type: 'check',
        check: { stat: 'str', difficulty: 10 },
        successOutcome: {
          description: '书架轰然倒下，成功阻挡了身后的追击者。你从废墟中翻出一些有用的物品。',
          rewards: { gold: 30 }
        },
        failureOutcome: {
          description: '书架纹丝不动，你只能狼狈逃离，在混乱中受了伤。',
          rewards: { hp: -8 }
        }
      },
      {
        id: 'leave',
        text: '快速离开',
        type: 'safe',
        successOutcome: {
          description: '你谨慎地退出图书馆，什么也没发生。有时候明哲保身才是最好的选择。',
          rewards: {}
        }
      }
    ]
  },

  blood_ritual: {
    id: 'blood_ritual',
    title: '血祭仪式',
    description: `石室中央的祭坛上，鲜血还在滴落。

空气中弥漫着铁锈和焚香的味道。祭坛周围刻画着诡异的符文，地面的血迹组成了某种召唤阵。祭品——一颗还在跳动的心脏——放在黑曜石盘中。

仪式刚刚被打断，施术者不知所踪。`,
    choices: [
      {
        id: 'gaze_ritual',
        text: '直视仪式符文（理智检定 15）',
        type: 'check',
        check: { stat: 'san', difficulty: 15 },
        successOutcome: {
          description: '符文的真意在你眼前展开。你的意识触及了某个黑暗真理的边缘，获得了异样的力量。一个扭曲的护符凭空出现在你手中。',
          rewards: { sanity: -3, cards: ['chaos_burst'] }
        },
        failureOutcome: {
          description: '符文开始蠕动，世界在你眼中扭曲。你尖叫着后退，脑海中回荡着不应存在的呓语。理智严重受损。',
          rewards: { sanity: -12 }
        }
      },
      {
        id: 'steal_offering',
        text: '偷取祭品（敏捷检定 12）',
        type: 'check',
        check: { stat: 'dex', difficulty: 12 },
        successOutcome: {
          description: '你迅速抓起心脏和周围的贡品。祭坛发出低沉的嗡鸣，但你已经逃离。贡品中有不少金币。',
          rewards: { gold: 50 }
        },
        failureOutcome: {
          description: '你的手触碰到心脏的瞬间，它爆开了。黑色的血液腐蚀着你的皮肤，剧痛让你差点昏厥。',
          rewards: { hp: -12 }
        }
      },
      {
        id: 'retreat',
        text: '立即撤退',
        type: 'safe',
        successOutcome: {
          description: '你明智地选择远离这个不祥之地。保持距离才能活得更久。',
          rewards: {}
        }
      }
    ]
  },

  mad_scholar: {
    id: 'mad_scholar',
    title: '疯狂学者',
    description: `一个衣衫褴褛的老人蹲在墙角，用血在地上书写着什么。

他的眼神空洞却又透着某种疯狂的智慧。看到你后，他咧嘴笑了："来了...又一个寻求真理的人...我可以教你，教你那些被遗忘的东西...但你必须付出代价..."

他手中握着一把染血的匕首。`,
    choices: [
      {
        id: 'talk',
        text: '与他交谈学习（智力检定 14）',
        type: 'check',
        check: { stat: 'int', difficulty: 14 },
        successOutcome: {
          description: '在他疯癫的呓语中，你捕捉到了一些真实的知识。他传授给你一种禁忌技艺，代价是你的部分理智。',
          rewards: { sanity: -3, cards: ['forbidden_sacrifice'] }
        },
        failureOutcome: {
          description: '他的话语如同病毒侵入你的思维。你的头痛欲裂，理智在崩溃的边缘。',
          rewards: { sanity: -8 }
        }
      },
      {
        id: 'subdue',
        text: '制服他搜身（力量检定 12）',
        type: 'check',
        check: { stat: 'str', difficulty: 12 },
        successOutcome: {
          description: '你制服了疯狂的老人。在他破烂的长袍中，你找到了一些稀奇古怪的物品和金币。',
          rewards: { gold: 40, cards: ['deadly_strike'] }
        },
        failureOutcome: {
          description: '他比看起来强壮得多！疯狂赋予了他异常的力量，你被刺伤了。',
          rewards: { hp: -10 }
        }
      },
      {
        id: 'avoid',
        text: '避开他',
        type: 'safe',
        successOutcome: {
          description: '你绕开了这个危险的疯子。不是所有的知识都值得追求。',
          rewards: {}
        }
      }
    ]
  },

  abyss_rift: {
    id: 'abyss_rift',
    title: '深渊裂隙',
    description: `地面突然裂开，露出一道深不见底的裂缝。

黑暗的深渊中传来低沉的呼吸声，像是某个巨大的存在在沉睡。裂隙边缘散落着前人留下的背包和装备——他们显然没能跨越这道障碍。

裂隙不算宽，但一旦失足，后果不堪设想。`,
    choices: [
      {
        id: 'jump',
        text: '跳过裂隙（敏捷检定 15）',
        type: 'check',
        check: { stat: 'dex', difficulty: 15 },
        successOutcome: {
          description: '你成功跃过裂隙！在对面你捡到了前人遗留的金币。',
          rewards: { gold: 45 }
        },
        failureOutcome: {
          description: '你的脚滑了！虽然勉强抓住了边缘爬了上来，但身上多处擦伤。',
          rewards: { hp: -10 }
        }
      },
      {
        id: 'gaze_abyss',
        text: '凝视深渊（理智检定 12）',
        type: 'check',
        check: { stat: 'san', difficulty: 12 },
        successOutcome: {
          description: '深渊回视着你。某种难以名状的存在察觉到了你，但你挺住了。意志力得到了锻炼。',
          rewards: { maxHp: 5, sanity: -2 }
        },
        failureOutcome: {
          description: '深渊中的东西看到了你。你的灵魂仿佛被撕裂，恐怖的幻象涌入脑海。',
          rewards: { sanity: -15 }
        }
      },
      {
        id: 'detour',
        text: '绕路',
        type: 'safe',
        successOutcome: {
          description: '你选择绕远路前进。在狭窄的通道中艰难行进，受了些轻伤，但总算安全通过。',
          rewards: { hp: -5 }
        }
      }
    ]
  },

  mysterious_merchant: {
    id: 'mysterious_merchant',
    title: '神秘商人',
    description: `一个戴着兜帽的商人守在篝火旁。

"欢迎，旅人。"他的声音嘶哑却带着友善，"在这该死的地方，能碰到活人不容易。我这里有些货物，或许你用得上？"

他摊开手，展示着几张闪烁微光的卡牌。`,
    choices: [
      {
        id: 'buy_common',
        text: '购买普通卡牌（50金币）',
        type: 'shop',
        successOutcome: {
          description: '商人递给你一张卡牌。"明智的选择，这会帮到你的。"',
          rewards: { gold: -50, cards: ['heavy_strike'] } // 实际会随机普通卡
        }
      },
      {
        id: 'buy_rare',
        text: '购买稀有卡牌（100金币）',
        type: 'shop',
        successOutcome: {
          description: '商人露出满意的笑容。"好眼力！这可是稀罕货。"',
          rewards: { gold: -100, cards: ['abyss_gaze'] } // 实际会随机稀有卡
        }
      },
      {
        id: 'remove_card',
        text: '移除一张卡牌（75金币）',
        type: 'shop',
        successOutcome: {
          description: '商人接过卡牌，将它投入火焰中。"减轻负担，也是一种智慧。"',
          rewards: { gold: -75 }
        }
      },
      {
        id: 'leave_merchant',
        text: '离开',
        type: 'safe',
        successOutcome: {
          description: '你婉拒了商人的好意继续前行。他耸耸肩："祝你好运，旅人。"',
          rewards: {}
        }
      }
    ]
  },

  campfire: {
    id: 'campfire',
    title: '篝火休息点',
    description: `你发现了一处安全的营地。

篝火温暖的光芒驱散了黑暗和寒冷。这里暂时安全，你可以休息片刻恢复体力，或者花时间磨练你的技艺。`,
    choices: [
      {
        id: 'rest',
        text: '休息恢复生命',
        type: 'safe',
        successOutcome: {
          description: '你在篝火旁沉沉睡去。醒来时，伤口已经愈合了大半。',
          rewards: { hp: 999 } // 实际会恢复到满HP
        }
      },
      {
        id: 'upgrade',
        text: '升级一张卡牌',
        type: 'safe',
        successOutcome: {
          description: '你专注地练习技艺，对某个技能有了更深的理解。',
          rewards: {} // 实际会打开升级界面
        }
      },
      {
        id: 'meditate',
        text: '冥想恢复理智',
        type: 'safe',
        successOutcome: {
          description: '你盘坐冥想，理清思绪。疯狂的呓语逐渐远去，理智恢复了一些。',
          rewards: { sanity: 10 }
        }
      }
    ]
  },

  dark_altar: {
    id: 'dark_altar',
    title: '黑暗祭坛',
    description: `一座黑色的祭坛矗立在房间中央。

祭坛上刻满了扭曲的符文，散发着令人不安的能量。你隐约感觉到，这座祭坛可以给予力量——如果你愿意付出代价的话。

"献上你的血肉，获取力量..."空气中回荡着幽幽的低语。`,
    choices: [
      {
        id: 'blood_sacrifice',
        text: '献祭生命换取力量（-10HP）',
        type: 'safe',
        successOutcome: {
          description: '你割破手掌，鲜血滴在祭坛上。黑暗的能量涌入体内，你感到力量在增长。',
          rewards: { hp: -10, cards: ['sacrifice_strike'] }
        }
      },
      {
        id: 'soul_sacrifice',
        text: '献祭理智换取知识（-8理智）',
        type: 'safe',
        successOutcome: {
          description: '你触碰祭坛，意识被拉入黑暗之中。当你恢复清醒，脑海中多了一些不该知道的知识。',
          rewards: { sanity: -8, cards: ['elder_whisper'] }
        }
      },
      {
        id: 'resist',
        text: '抵抗诱惑离开（理智检定 10）',
        type: 'check',
        check: { stat: 'san', difficulty: 10 },
        successOutcome: {
          description: '你咬紧牙关，抵御住了祭坛的诱惑。意志力得到了磨练。',
          rewards: { maxHp: 3 }
        },
        failureOutcome: {
          description: '诱惑太强了。你不由自主地走向祭坛，失去了部分理智。',
          rewards: { sanity: -6 }
        }
      }
    ]
  },

  treasure_chest: {
    id: 'treasure_chest',
    title: '古老宝箱',
    description: `你发现了一个古老的宝箱。

宝箱表面镀着暗金色的花纹，虽然布满灰尘，但保存完好。锁已经锈蚀，似乎一脚就能踢开。

但总有一种不祥的预感...这会是陷阱吗？`,
    choices: [
      {
        id: 'open_carefully',
        text: '小心开启（敏捷检定 10）',
        type: 'check',
        check: { stat: 'dex', difficulty: 10 },
        successOutcome: {
          description: '你仔细检查后打开了宝箱。里面装满了金币和一张珍贵的卡牌！',
          rewards: { gold: 60, cards: ['truth_shield'] }
        },
        failureOutcome: {
          description: '陷阱触发了！毒针刺入你的手臂，剧痛让你跌倒在地。',
          rewards: { hp: -12 }
        }
      },
      {
        id: 'smash_open',
        text: '暴力破坏（力量检定 8）',
        type: 'check',
        check: { stat: 'str', difficulty: 8 },
        successOutcome: {
          description: '你一脚踹开宝箱。金币散落一地，你捡起了大部分。',
          rewards: { gold: 40 }
        },
        failureOutcome: {
          description: '宝箱比想象中结实，你的脚踢得生疼，什么也没得到。',
          rewards: { hp: -5 }
        }
      },
      {
        id: 'ignore',
        text: '忽略宝箱',
        type: 'safe',
        successOutcome: {
          description: '你决定不冒险，绕过了宝箱。谨慎总是明智的。',
          rewards: {}
        }
      }
    ]
  }
};

// 获取随机事件
export function getRandomEvent(excludeIds: string[] = []): GameEvent {
  const availableEvents = Object.values(EVENTS).filter(e => !excludeIds.includes(e.id));
  return availableEvents[Math.floor(Math.random() * availableEvents.length)];
}

// 获取指定事件
export function getEvent(id: string): GameEvent | undefined {
  return EVENTS[id];
}
