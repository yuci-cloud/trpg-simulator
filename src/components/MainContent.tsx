import React from 'react';
import { useGameStore } from '../store/gameStore';

export const MainContent: React.FC = () => {
  const { currentScene, makeChoice, isProcessing, history } = useGameStore();
  
  const handleChoice = async (choiceId: string) => {
    await makeChoice(choiceId);
  };

  return (
    <div style={{ 
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      padding: '40px',
      maxWidth: '800px',
      margin: '0 auto',
      width: '100%'
    }}>
      {/* 场景标题 */}
      <div style={{ 
        marginBottom: '30px',
        paddingBottom: '15px',
        borderBottom: '2px solid rgba(233,69,96,0.3)'
      }}>
        <h1 style={{ 
          margin: 0, 
          fontSize: '32px',
          color: '#ffd700',
          textShadow: '0 0 20px rgba(255,215,0,0.2)'
        }}>
          📍 {currentScene.title}
        </h1>
      </div>
      
      {/* 文字内容区 */}
      <div style={{ 
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        background: 'rgba(22, 33, 62, 0.5)',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.1)',
        marginBottom: '30px',
        boxShadow: 'inset 0 0 30px rgba(0,0,0,0.3)'
      }}>
        {/* 历史记录 */}
        {history.slice(-3).map((entry, idx) => (
          <div key={idx} style={{ 
            marginBottom: '15px',
            padding: '10px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#888',
            fontStyle: 'italic'
          }}>
            [{new Date(entry.timestamp).toLocaleTimeString()}] {entry.content}
          </div>
        ))}
        
        {/* 当前场景描述 */}
        <div style={{ 
          fontSize: '18px',
          lineHeight: '2',
          color: '#fff',
          whiteSpace: 'pre-wrap',
          textShadow: '0 0 10px rgba(0,0,0,0.5)'
        }}>
          {currentScene.description}
        </div>
        
        {/* AI思考中提示 */}
        {isProcessing && (
          <div style={{ 
            marginTop: '30px',
            padding: '20px',
            textAlign: 'center',
            color: '#ffd700',
            fontSize: '16px'
          }}>
            <div style={{ marginBottom: '10px' }}>⚡ AI 正在编织命运...</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              莱拉在评估局势，生成独特的剧情分支
            </div>
          </div>
        )}
      </div>

      {/* 选项按钮区 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {currentScene.choices.map((choice) => (
          <button
            key={choice.id}
            onClick={() => handleChoice(choice.id)}
            disabled={isProcessing}
            style={{
              padding: '18px 24px',
              background: 'linear-gradient(90deg, rgba(233,69,96,0.2), rgba(233,69,96,0.05))',
              border: '1px solid rgba(233,69,96,0.3)',
              borderRadius: '10px',
              color: '#fff',
              fontSize: '16px',
              textAlign: 'left',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              opacity: isProcessing ? 0.5 : 1,
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <span style={{ fontSize: '20px' }}>
              {choice.type === 'combat' && '⚔️'}
              {choice.type === 'explore' && '🔍'}
              {choice.type === 'talk' && '💬'}
              {choice.type === 'item' && '🎒'}
            </span>
            <span style={{ flex: 1 }}>{choice.text}</span>
            {choice.requiredCheck && (
              <span style={{ 
                fontSize: '12px', 
                color: '#e94560',
                border: '1px solid rgba(233,69,96,0.3)',
                padding: '2px 8px',
                borderRadius: '4px'
              }}>
                {choice.requiredCheck.stat.toUpperCase()} {choice.requiredCheck.difficulty}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};