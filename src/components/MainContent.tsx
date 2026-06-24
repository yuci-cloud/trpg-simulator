import React from 'react';
import { useGameStore } from '../store/gameStore';

export const MainContent: React.FC = () => {
  const { currentScene, makeChoice, isProcessing, history } = useGameStore();

  if (!currentScene) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px'
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: '600px'
        }}>
          <h2 style={{
            fontSize: '32px',
            color: '#c9a961',
            marginBottom: '20px',
            textShadow: '0 0 20px rgba(201,169,97,0.3)'
          }}>
            ⛧ 深入未知 ⛧
          </h2>
          <p style={{
            fontSize: '18px',
            color: '#888',
            lineHeight: '1.8',
            marginBottom: '30px'
          }}>
            在这被遗忘的墓穴深处，你听到了某种不该存在的呼唤。
            古老的知识、禁忌的力量、还有无尽的疯狂在等待着你...
          </p>
          <p style={{
            fontSize: '16px',
            color: '#666',
            fontStyle: 'italic'
          }}>
            点击地图上的节点继续探索
          </p>
        </div>
      </div>
    );
  }

  const handleChoice = (choiceId: string) => {
    if (!isProcessing) {
      makeChoice(choiceId);
    }
  };

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      padding: '40px',
      maxWidth: '900px',
      margin: '0 auto',
      width: '100%'
    }}>
      {/* 场景标题 */}
      <div style={{
        marginBottom: '30px',
        paddingBottom: '15px',
        borderBottom: '2px solid rgba(139,0,0,0.3)'
      }}>
        <h1 style={{
          margin: 0,
          fontSize: '36px',
          color: '#c9a961',
          textShadow: '0 0 20px rgba(201,169,97,0.2)'
        }}>
          📍 {currentScene.title}
        </h1>
      </div>

      {/* 文字内容区 */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '25px',
        background: 'rgba(10,10,21,0.6)',
        borderRadius: '12px',
        border: '1px solid rgba(139,0,0,0.3)',
        marginBottom: '30px',
        boxShadow: 'inset 0 0 30px rgba(0,0,0,0.5)'
      }}>
        {/* 最近3条历史记录 */}
        {history.slice(-3).map((entry, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: '12px',
              padding: '10px',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '8px',
              fontSize: '13px',
              color: '#888',
              borderLeft: `3px solid ${
                entry.type === 'roll' ? '#4a90e2' :
                entry.type === 'reward' ? '#c9a961' :
                entry.type === 'madness' ? '#8b0000' :
                'rgba(255,255,255,0.1)'
              }`
            }}
          >
            <span style={{ opacity: 0.6, fontSize: '11px' }}>
              [{new Date(entry.timestamp).toLocaleTimeString()}]
            </span>{' '}
            {entry.content}
          </div>
        ))}

        {/* 当前场景描述 */}
        <div style={{
          fontSize: '17px',
          lineHeight: '2',
          color: '#d4d4d4',
          whiteSpace: 'pre-wrap',
          textShadow: '0 0 10px rgba(0,0,0,0.5)',
          marginTop: history.length > 0 ? '20px' : '0',
          paddingTop: history.length > 0 ? '20px' : '0',
          borderTop: history.length > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none'
        }}>
          {currentScene.description}
        </div>

        {/* 处理中提示 */}
        {isProcessing && (
          <div style={{
            marginTop: '30px',
            padding: '20px',
            textAlign: 'center',
            color: '#c9a961',
            fontSize: '16px'
          }}>
            <div style={{ marginBottom: '10px' }}>⚡ 命运的齿轮转动中...</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              结果计算中
            </div>
          </div>
        )}
      </div>

      {/* 选项按钮区 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {currentScene.choices.map((choice) => {
          const isCheckChoice = choice.type === 'check';
          const checkStat = choice.check?.stat.toUpperCase();
          const checkDC = choice.check?.difficulty;

          return (
            <button
              key={choice.id}
              onClick={() => handleChoice(choice.id)}
              disabled={isProcessing}
              style={{
                padding: '18px 24px',
                background: isCheckChoice
                  ? 'linear-gradient(90deg, rgba(74,58,90,0.3), rgba(74,58,90,0.1))'
                  : 'linear-gradient(90deg, rgba(139,0,0,0.2), rgba(139,0,0,0.05))',
                border: `1px solid ${isCheckChoice ? '#6a4c93' : '#8b0000'}`,
                borderRadius: '10px',
                color: '#fff',
                fontSize: '16px',
                textAlign: 'left',
                cursor: isProcessing ? 'not-allowed' : 'pointer',
                opacity: isProcessing ? 0.5 : 1,
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                if (!isProcessing) {
                  e.currentTarget.style.transform = 'translateX(5px)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(139,0,0,0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* 选项图标 */}
              <span style={{ fontSize: '20px', minWidth: '24px' }}>
                {choice.type === 'combat' && '⚔️'}
                {choice.type === 'check' && '🎲'}
                {choice.type === 'safe' && '✓'}
                {choice.type === 'shop' && '💰'}
              </span>

              {/* 选项文本 */}
              <span style={{ flex: 1 }}>{choice.text}</span>

              {/* 检定要求 */}
              {isCheckChoice && choice.check && (
                <span
                  style={{
                    fontSize: '12px',
                    color: '#c9a961',
                    border: '1px solid rgba(201,169,97,0.3)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    background: 'rgba(201,169,97,0.1)',
                    fontWeight: 'bold'
                  }}
                >
                  {checkStat} DC{checkDC}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
