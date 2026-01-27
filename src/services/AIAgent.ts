// src/services/AIAgent.ts
export interface CharacterProfile {
  id: string;
  name: string;
  class: string;
  personality: string;
  speechStyle: string;
  motivation: string;
  stats: { hp: number; maxHp: number; str: number; dex: number; int: number };
  relationship: number;
}

export interface GameContext {
  sceneDescription: string;
  visibleObjects: string[];
  recentEvents: string[];
  partyStatus: { name: string; hp: string; position: string }[];
  playerAction?: string;
}

export class AIAgent {
  private profile: CharacterProfile;
  private apiKey: string;

  constructor(profile: CharacterProfile) {
    this.profile = profile;
    // 读取环境变量，如果没设置就用空字符串
    this.apiKey = 'sk-tqwtscdmjjlbddjasegqntftdnlqdxfourmiwmzhxiqhkepr';
	console.log('Key是否设置:', this.apiKey ? '已设置' : '未设置');
  }

  async decideAction(context: GameContext) {
    // 如果有 API Key，尝试调用真实 AI
    if (this.apiKey && this.apiKey.startsWith('sk-')) {
      try {
        return await this.callSiliconFlow(context);
      } catch (error) {
        console.log('AI 调用失败，使用本地逻辑:', error);
        // 失败了不报错，自动切换本地模式
      }
    }
    
    // 没有 Key 或调用失败，使用增强演示模式
    return this.smartDemoResponse(context);
  }

 private async callSiliconFlow(context: GameContext) {
  console.log('调用 SiliconFlow...');
  
  try {
    const response = await fetch("https://api.siliconflow.cn/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-ai/DeepSeek-V2.5",  // SiliconFlow 的 DeepSeek
        messages: [
          {
            role: "system",
            content: `你是战士莱拉，正在地牢中。说话简短（10字以内），描述眼前具体事物（血、门、声音）。绝对禁止：守护、命运、指引、耐心、荣誉、信念、灵魂、正义、承诺、永远。`
          },
          {
            role: "user",
            content: `玩家：${context.playerAction}
莱拉（压低声音）：`
          }
        ],
        temperature: 0.2,  // 低温度减少胡说
        max_tokens: 15,
        presence_penalty: 1.5  // 重复惩罚，避免套路用语
      })
    });

    console.log('状态码:', response.status);
    
    if (!response.ok) {
      const err = await response.text();
      console.error('API出错:', err);
      throw new Error('API失败');
    }

    const data = await response.json();
    let text = data.choices[0].message.content.trim();
    
    console.log('AI原话:', text);
    
    // 违禁词过滤
    const forbidden = ['守护', '命运', '指引', '耐心', '静待', '荣誉', '鲁莽', '信念', '灵魂', '正义', '承诺', '永远', '之路', '方向', '直到', '我会', '让我', '耐心等待', '美德'];
    
    // 如果包含违禁词，截断或替换
    for (const word of forbidden) {
      if (text.includes(word)) {
        console.log('检测到违禁词:', word);
        // 截断到违禁词之前
        const idx = text.indexOf(word);
        text = text.substring(0, idx).trim();
        
        // 如果截断后太短，用默认实用回复
        if (text.length < 3) {
          return { 
            thought: "强制本地", 
            dialogue: "血没干，小心。", 
            suggestedAction: "警戒", 
            emotion: "worried" 
          };
        }
        break;
      }
    }
    
    // 如果还是太长，取第一句
    if (text.length > 12) {
      text = text.split(/[，。]/)[0] + '。';
    }
    
    return {
      thought: "观察",
      dialogue: text || "有血，小心。",
      suggestedAction: "配合",
      emotion: /血|杀|敌|刀/.test(text) ? "worried" : "neutral"
    };
    
  } catch (e) {
    console.error('SiliconFlow调用失败:', e);
    throw e; // 抛出去让外层用本地逻辑兜底
  }
}

  private smartDemoResponse(context: GameContext) {
    const input = (context.playerAction || "").toLowerCase();
    
    // 关键词匹配（比之前的更加丰富）
    if (input.includes("血") || input.includes("危险")) {
      return { 
        thought: "情况不妙", 
        dialogue: "这血迹还没干，保持警戒！", 
        suggestedAction: "侦查埋伏", 
        emotion: "worried" as const 
      };
    }
    if (input.includes("打") || input.includes("杀")) {
      return { 
        thought: "终于开战", 
        dialogue: "我来扛伤害，你输出！", 
        suggestedAction: "冲锋", 
        emotion: "excited" as const 
      };
    }
    if (input.includes("宝箱") || input.includes("金")) {
      return { 
        thought: "小心陷阱", 
        dialogue: "别急，先让我检查一下机关。", 
        suggestedAction: "排查陷阱", 
        emotion: "excited" as const 
      };
    }
    
    // 根据输入长度智能回应
    if (input.length > 8) {
      return { 
        thought: "听着呢", 
        dialogue: "计划听着可行，我跟着你。", 
        suggestedAction: "协同行动", 
        emotion: "neutral" as const 
      };
    }
    
    // 完全随机，避免重复
    const responses = [
      { thought: "警戒中", dialogue: "我盯着背后，你放心走。", suggestedAction: "殿后", emotion: "neutral" as const },
      { thought: "太安静", dialogue: "这里静得可怕，有埋伏？", suggestedAction: "侦查", emotion: "worried" as const },
      { thought: "等待", dialogue: "你说，我听着。", suggestedAction: "待命", emotion: "neutral" as const }
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  addMemory(event: string) {
    console.log(`[${this.profile.name}] 记忆: ${event}`);
  }
}