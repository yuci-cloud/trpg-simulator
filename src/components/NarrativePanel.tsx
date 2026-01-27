// src/components/NarrativePanel.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { AIAgent } from '../services/AIAgent';

export const NarrativePanel: React.FC = () => {
  const { 
    currentScene, 
    gameLog, 
    addLog, 
    allies, 
    currentTurn, 
    activeAllyIndex,
    advanceTurn,
    tokens 
  } = useGameStore();
  
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 初始化AI Agents（实际应用中单例模式管理）
  const [agents] = useState(() => 
    allies.map(a => new AIAgent(a, import.meta.env.VITE_OPENAI_KEY || 'demo-key'))
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [gameLog]);

  // AI回合处理
  useEffect(() => {
    if (currentTurn === 'ally' && allies.length > 0) {
      handleAITurn();
    }
  }, [currentTurn, activeAllyIndex]);

  const handleAITurn = async () => {
    const ally = allies[activeAllyIndex];
    const agent = agents[activeAllyIndex];
    if (!ally || !agent) {
      advanceTurn();
      return;
    }

    setIsProcessing(true);
    
    // 构建当前场景上下文（认知过滤）
    const context = {
      sceneDescription: currentScene,
      visibleObjects: ["石墙", "火把", "木门", "地上的血迹"],
      recentEvents: gameLog.slice(-3).map(l => l.content),
      partyStatus: tokens.filter(t => t.type !== 'enemy').map(t => ({
        name: t.name,
        hp: `${t.hp}/${t.maxHp}`,
        position: `(${t.x},${t.y})`
      }))
    };

    try {
      const decision = await agent.decideAction(context);
      
      // 添加到日志
      addLog({
        type: 'dialogue',
        content: `【${ally.name}】${decision.dialogue}`
      });
      
      addLog({
        type: 'action',
        content: `【思考】${decision.thought}`
      });

      // 如果是移动建议，自动执行（演示用）
      if (decision.suggestedAction.includes("前进") || decision.suggestedAction.includes("靠近")) {
        const currentToken = tokens.find(t => t.id === ally.id);
        if (currentToken) {
          // 简单的向玩家靠近逻辑
          const player = tokens.find(t => t.type === 'player');
          if (player) {
            const dx = player.x - currentToken.x;
            const dy = player.y - currentToken.y;
            const moveX = currentToken.x + (dx > 0 ? 1 : dx < 0 ? -1 : 0);
            const moveY = currentToken.y + (dy > 0 ? 1 : dy < 0 ? -1 : 0);
            // 实际应通过store action移动
          }
        }
      }

    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
      setTimeout(advanceTurn, 1500); // 延迟给用户阅读时间
    }
  };

  const handlePlayerAction = async () => {
    if (!inputText.trim()) return;
    
    addLog({ type: 'action', content: `你：${inputText}` });
    setInputText('');
    
    // 在这里可以加入LLM判断玩家动作是否改变场景
    if (inputText.includes("调查") || inputText.includes("检查")) {
      addLog({ type: 'system', content: '需要进行侦查检定...' });
    }
    
    advanceTurn(); // 进入AI回合
  };

  return (
  <div style={{ 
    width: '420px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
    borderRadius: '12px',
    border: '2px solid var(--border-color)',
    boxShadow: '0 0 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
    overflow: 'hidden'
  }}>
    {/* 头部 - 场景标题 */}
    <div style={{ 
      padding: '20px',
      background: 'linear-gradient(90deg, var(--bg-tertiary) 0%, transparent 100%)',
      borderBottom: '2px solid var(--accent-red)',
      position: 'relative'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '10px',
        marginBottom: '8px'
      }}>
        <span style={{ fontSize: '20px' }}>📜</span>
        <h3 style={{ 
          margin: 0, 
          color: 'var(--accent-gold)',
          fontSize: '16px',
          letterSpacing: '1px',
          textTransform: 'uppercase'
        }}>当前场景</h3>
      </div>
      <p style={{ 
        margin: 0, 
        lineHeight: '1.6', 
        fontSize: '14px',
        color: 'var(--text-primary)',
        textShadow: '0 0 10px rgba(255,215,0,0.1)'
      }}>
        {currentScene}
      </p>
      {/* 装饰线 */}
      <div style={{ 
        position: 'absolute', 
        bottom: '-2px', 
        left: 0, 
        width: '100px', 
        height: '2px', 
        background: 'var(--accent-gold)' 
      }} />
    </div>

    {/* 日志流区域 */}
    <div style={{ 
      flex: 1,
      overflowY: 'auto',
      padding: '15px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      background: 'rgba(0,0,0,0.2)'
    }}>
      {gameLog.map((log, idx) => (
        <div key={idx} style={{
          padding: '12px 15px',
          borderRadius: '8px',
          background: log.type === 'dialogue' 
            ? 'linear-gradient(90deg, rgba(233,69,96,0.1) 0%, transparent 100%)' 
            : log.type === 'system' 
              ? 'rgba(255,215,0,0.1)' 
              : 'rgba(78,204,163,0.1)',
          borderLeft: `3px solid ${
            log.type === 'dialogue' ? 'var(--accent-red)' : 
            log.type === 'system' ? 'var(--accent-gold)' : '#4ecca3'
          }`,
          fontSize: '14px',
          lineHeight: '1.5',
          animation: 'fadeIn 0.3s ease-out',
          position: 'relative',
          ...(log.type === 'dialogue' && {
            border: '1px solid rgba(233,69,96,0.2)',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
          })
        }}>
          {/* 头像（如果是莱拉对话） */}
          {log.type === 'dialogue' && log.content.includes('【莱拉】') && (
            <div style={{
              position: 'absolute',
              left: '-10px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              background: 'var(--accent-green)',
              border: '2px solid var(--bg-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              boxShadow: '0 0 10px rgba(126,211,33,0.5)'
            }}>
              🗡️
            </div>
          )}
          
          <div style={{ 
            marginLeft: log.content.includes('【莱拉】') ? '15px' : '0',
            color: log.type === 'dialogue' ? '#ffcccb' : 'var(--text-primary)',
            fontWeight: log.type === 'dialogue' ? '500' : 'normal'
          }}>
            {log.content}
          </div>
          
          {/* 时间戳 */}
          <div style={{ 
            fontSize: '10px', 
            color: 'var(--text-secondary)', 
            marginTop: '5px',
            opacity: 0.7
          }}>
            {new Date(log.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
        </div>
      ))}
      
      {/* 正在输入提示 */}
      {isProcessing && (
        <div style={{
          padding: '10px 15px',
          color: 'var(--accent-gold)',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontStyle: 'italic'
        }}>
          <span style={{ animation: 'pulse 1.5s infinite' }}>⚡</span>
          <span>莱拉正在思考...</span>
          <span style={{ animation: 'dots 1.5s infinite' }}>...</span>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>

    {/* 输入区域 */}
    <div style={{ 
      padding: '20px',
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }}>
      {currentTurn === 'player' ? (
        <>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            fontSize: '12px',
            color: 'var(--text-secondary)' 
          }}>
            <span style={{ 
              width: '6px', 
              height: '6px', 
              borderRadius: '50%', 
              background: 'var(--accent-green)',
              boxShadow: '0 0 8px var(--accent-green)'
            }} />
            <span>轮到你行动</span>
            <span style={{ marginLeft: 'auto', opacity: 0.6 }}>按 Enter 发送</span>
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handlePlayerAction()}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'rgba(0,0,0,0.3)',
                color: 'var(--text-primary)',
                fontSize: '15px',
                outline: 'none',
                transition: 'all 0.3s',
                fontFamily: 'inherit'
              }}
              placeholder="输入行动指令..."
              onFocus={(e) => e.target.style.borderColor = 'var(--accent-red)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
            />
            <button
              onClick={handlePlayerAction}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, var(--accent-red) 0%, #c73e54 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
                transition: 'all 0.2s',
                boxShadow: '0 4px 15px rgba(233,69,96,0.3)',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(233,69,96,0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(233,69,96,0.3)';
              }}
            >
              执行
            </button>
          </div>
        </>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: '15px', 
          color: 'var(--accent-gold)',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          background: 'rgba(255,215,0,0.05)',
          borderRadius: '8px',
          border: '1px dashed rgba(255,215,0,0.3)'
        }}>
          <span style={{ animation: 'spin 2s linear infinite' }}>⚔️</span>
          <span>等待 {allies[activeAllyIndex]?.name} 行动...</span>
        </div>
      )}
    </div>
  </div>
);
};