import React from 'react';
import { useGameStore } from '../store/gameStore';

export const LeftPanel: React.FC = () => {
  const { player, currentScreen, setScreen } = useGameStore();
  
  const isActive = (screen: string) => currentScreen === screen;
  
  return (
    <div style={{ 
      width: '280px',
      height: '100%',
      background: 'linear-gradient(180deg, #16213e 0%, #0f0f1e 100%)',
      borderRight: '2px solid #e94560',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '2px 0 20px rgba(0,0,0,0.5)'
    }}>
      {/* 头像区域 */}
      <div style={{ 
        padding: '30px 20px',
        textAlign: 'center',
        borderBottom: '1px solid rgba(233,69,96,0.3)'
      }}>
        <div style={{ 
          width: '120px', 
          height: '120px', 
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #e94560, #ffd700)',
          margin: '0 auto 15px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '60px',
          boxShadow: '0 0 30px rgba(233,69,96,0.5)',
          border: '4px solid rgba(255,255,255,0.1)'
        }}>
          {player.avatar}
        </div>
        <h2 style={{ 
          margin: '0 0 5px 0', 
          fontSize: '24px',
          color: '#ffd700',
          textShadow: '0 0 10px rgba(255,215,0,0.3)'
        }}>
          {player.name}
        </h2>
        <div style={{ fontSize: '14px', color: '#888' }}>
          Lv.{player.level} 冒险者
        </div>
      </div>
      
      {/* 状态条 */}
      <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        {/* HP */}
        <div style={{ marginBottom: '15px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: '5px',
            fontSize: '14px'
          }}>
            <span style={{ color: '#e94560' }}>❤ HP</span>
            <span>{player.hp}/{player.maxHp}</span>
          </div>
          <div style={{ 
            height: '10px', 
            background: 'rgba(0,0,0,0.5)', 
            borderRadius: '5px',
            overflow: 'hidden'
          }}>
            <div style={{ 
              width: `${(player.hp/player.maxHp)*100}%`, 
              height: '100%', 
              background: 'linear-gradient(90deg, #e94560, #ff6b6b)',
              transition: 'width 0.3s'
            }} />
          </div>
        </div>
        
        {/* MP */}
        <div style={{ marginBottom: '10px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: '5px',
            fontSize: '14px'
          }}>
            <span style={{ color: '#4ecca3' }}>✦ MP</span>
            <span>{player.mp}/{player.maxMp}</span>
          </div>
          <div style={{ 
            height: '10px', 
            background: 'rgba(0,0,0,0.5)', 
            borderRadius: '5px',
            overflow: 'hidden'
          }}>
            <div style={{ 
              width: `${(player.mp/player.maxMp)*100}%`, 
              height: '100%', 
              background: 'linear-gradient(90deg, #4ecca3, #7ed321)',
              transition: 'width 0.3s'
            }} />
          </div>
        </div>
        
        {/* EXP */}
        <div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: '5px',
            fontSize: '14px'
          }}>
            <span style={{ color: '#ffd700' }}>★ EXP</span>
            <span>{player.exp}/100</span>
          </div>
          <div style={{ 
            height: '8px', 
            background: 'rgba(0,0,0,0.5)', 
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{ 
              width: `${player.exp}%`, 
              height: '100%', 
              background: 'linear-gradient(90deg, #ffd700, #ffed4e)',
              transition: 'width 0.3s'
            }} />
          </div>
        </div>
      </div>
      
      {/* 导航按钮 */}
      <div style={{ padding: '20px', flex: 1 }}>
        <NavButton 
          icon="🎒" 
          label="背包" 
          active={isActive('inventory')}
          onClick={() => setScreen('inventory')}
        />
        <NavButton 
          icon="📜" 
          label="详情" 
          active={isActive('status')}
          onClick={() => setScreen('status')}
        />
        <NavButton 
          icon="⚙️" 
          label="设置" 
          active={isActive('settings')}
          onClick={() => setScreen('settings')}
        />
      </div>
      
      {/* 底部装饰 */}
      <div style={{ 
        padding: '15px', 
        textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        fontSize: '12px',
        color: '#666'
      }}>
        深渊行者 v0.1
      </div>
    </div>
  );
};

const NavButton: React.FC<{
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
}> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      width: '100%',
      padding: '15px',
      marginBottom: '10px',
      background: active ? 'linear-gradient(90deg, rgba(233,69,96,0.3), transparent)' : 'transparent',
      border: 'none',
      borderLeft: active ? '3px solid #e94560' : '3px solid transparent',
      color: active ? '#fff' : '#888',
      fontSize: '16px',
      textAlign: 'left',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      transition: 'all 0.3s',
      borderRadius: '0 8px 8px 0'
    }}
    onMouseEnter={(e) => {
      if (!active) e.currentTarget.style.color = '#fff';
    }}
    onMouseLeave={(e) => {
      if (!active) e.currentTarget.style.color = '#888';
    }}
  >
    <span style={{ fontSize: '20px' }}>{icon}</span>
    <span>{label}</span>
  </button>
);