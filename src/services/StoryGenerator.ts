export interface GeneratedScene {
  title: string;
  description: string;
  choices: Array<{
    id: string;
    text: string;
    type: 'combat' | 'explore' | 'talk' | 'item';
    requiredCheck?: {
      stat: 'str' | 'dex' | 'int';
      difficulty: number;
    };
  }>;
  nodeType: 'combat' | 'event' | 'safe' | 'boss';
  loot?: Array<{
    name: string;
    icon: string;
    type: string;
  }>;
}

export class StoryGenerator {
  private apiKey: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_SILICONFLOW_API_KEY || '';
  }

  async generateScene(
    previousScene: string,
    playerChoice: string,
    currentLocation: string,
    partyStatus: string
  ): Promise<GeneratedScene> {
    const prompt = {
      model: "deepseek-ai/DeepSeek-V2.5",
      messages: [
        {
          role: "system",
          content: `你是TRPG游戏主持人，负责生成地牢探险剧情。
          
【要求】
1. 描述要有感官细节（气味、声音、触觉）
2. 必须包含莱拉（女战士）的反应和对话
3. 提供3-4个具体行动选项，每个选项要有明确的检定类型（combat/explore/talk）
4. 剧情要连贯，有紧张感和进展感
5. 严格返回JSON格式

【输出格式】
{
  "title": "场景标题（简洁，5字以内）",
  "description": "详细描述（150-250字，分段落，用\\n换行）",
  "choices": [
    {"id": "选项ID", "text": "选项文本（15字以内）", "type": "combat|explore|talk|item", "requiredCheck": {"stat": "str|dex|int", "difficulty": 10-15}}
  ],
  "nodeType": "combat|event|safe",
  "loot": [{"name": "物品名", "icon": "emoji"}]
}`
        },
        {
          role: "user",
          content: `【前情提要】${previousScene.slice(0, 200)}...
          
【玩家行动】${playerChoice}

【当前位置】${currentLocation}

【队伍状态】${partyStatus}

请生成下一个场景内容：`
        }
      ],
      temperature: 0.8,
      max_tokens: 800,
      response_format: { type: "json_object" }
    };

    try {
      const response = await fetch("https://api.siliconflow.cn/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(prompt)
      });

      if (!response.ok) {
        throw new Error(`API错误: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // 解析JSON
      const result: GeneratedScene = JSON.parse(content);
      
      // 确保字段完整
      return {
        title: result.title || '未知区域',
        description: result.description || '你们在黑暗中前行...',
        choices: result.choices?.map((c, idx) => ({
          id: c.id || `choice_${idx}`,
          text: c.text || '继续前进',
          type: c.type || 'explore',
          requiredCheck: c.requiredCheck
        })) || [{ id: 'continue', text: '继续前进', type: 'explore' }],
        nodeType: result.nodeType || 'event',
        loot: result.loot
      };
      
    } catch (error) {
      console.error('AI生成失败:', error);
      // 返回保底内容
      return this.getFallbackScene();
    }
  }

  private getFallbackScene(): GeneratedScene {
    return {
      title: '黑暗走廊',
      description: '你们在狭窄的走廊中前行。墙壁上的火把忽明忽暗，远处传来水滴的回声。\n\n莱拉握紧武器："保持警惕，我感觉到有什么东西在注视我们。"',
      choices: [
        { id: 'advance', text: '小心前进', type: 'explore' },
        { id: 'search', text: '搜索墙面', type: 'explore' },
        { id: 'rest', text: '短暂休息', type: 'safe' }
      ],
      nodeType: 'event'
    };
  }
}