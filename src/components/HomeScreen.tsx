import React from 'react';
import { useGameStore } from '../store/gameStore';

export const HomeScreen: React.FC = () => {
  const { setScreen } = useGameStore();

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a0a15 0%, #1a1a2a 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* 背景装饰 */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '400px',
        opacity: 0.03,
        pointerEvents: 'none'
      }}>
        👁️
      </div>

      {/* 主内容 */}
      <div style={{
        textAlign: 'center',
        zIndex: 1
      }}>
        {/* 游戏标题 */}
        <h1 style={{
          fontSize: '64px',
          margin: '0 0 20px 0',
          color: '#c9a961',
          textShadow: '0 0 30px rgba(201,169,97,0.5)',
          fontFamily: 'serif',
          letterSpacing: '4px'
        }}>
          ⛧ 深渊低语 ⛧
        </h1>

        <div style={{
          fontSize: '20px',
          color: '#6a4c93',
          marginBottom: '60px',
          fontStyle: 'italic',
          textShadow: '0 0 10px rgba(106,76,147,0.3)'
        }}>
          Whispers from the Abyss
        </div>

        {/* 按钮区域 */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          alignItems: 'center'
        }}>
          <MenuButton
            onClick={() => setScreen('character-select')}
            icon="🎮"
            text="开始游戏"
            primary
          />

          <MenuButton
            onClick={() => setScreen('settings')}
            icon="⚙️"
            text="设置"
          />
        </div>

        {/* 底部提示 */}
        <div style={{
          marginTop: '80px',
          fontSize: '14px',
          color: '#444',
          fontStyle: 'italic'
        }}>
          "在黑暗中保持理智，或拥抱疯狂的力量..."
        </div>

        {/* 版本信息 */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '12px',
          color: '#333'
        }}>
          克苏鲁卡牌跑团 v0.2 - Card Edition
        </div>
      </div>
    </div>
  );
};

const MenuButton: React.FC<{
  onClick: () => void;
  icon: string;
  text: string;
  primary?: boolean;
}> = ({ onClick, icon, text, primary }) => (
  <button
    onClick={onClick}
    style={{
      width: '280px',
      padding: '20px 40px',
      background: primary
        ? 'linear-gradient(90deg, rgba(139,0,0,0.4), rgba(106,76,147,0.4))'
        : 'rgba(22,33,62,0.5)',
      border: primary
        ? '2px solid #8b0000'
        : '2px solid rgba(255,255,255,0.2)',
      borderRadius: '12px',
      color: '#fff',
      fontSize: '20px',
      fontWeight: 'bold',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '15px',
      transition: 'all 0.3s',
      boxShadow: primary
        ? '0 4px 20px rgba(139,0,0,0.3)'
        : '0 2px 10px rgba(0,0,0,0.3)'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
      e.currentTarget.style.boxShadow = primary
        ? '0 8px 30px rgba(139,0,0,0.5)'
        : '0 6px 20px rgba(0,0,0,0.5)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'none';
      e.currentTarget.style.boxShadow = primary
        ? '0 4px 20px rgba(139,0,0,0.3)'
        : '0 2px 10px rgba(0,0,0,0.3)';
    }}
  >
    <span style={{ fontSize: '28px' }}>{icon}</span>
    <span>{text}</span>
  </button>
);
