import React from 'react';
import { useGameStore } from '../store/gameStore';

export const LeftPanel: React.FC = () => {
  const { player, currentScreen, setScreen } = useGameStore();

  const isActive = (screen: string) => currentScreen === screen;

  return (
    <div style={{
      width: '280px',
      height: '100%',
      background: 'linear-gradient(180deg, #0f0f1e 0%, #0a0a15 100%)',
      borderRight: '2px solid #8b0000',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '2px 0 20px rgba(0,0,0,0.5)'
    }}>
      {/* 头像区域 */}
      <div style={{
        padding: '30px 20px',
        textAlign: 'center',
        borderBottom: '1px solid rgba(139,0,0,0.3)'
      }}>
        <div style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #4a3a5a, #2a1a3a)',
          margin: '0 auto 15px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '60px',
          boxShadow: '0 0 30px rgba(106,76,147,0.5)',
          border: '4px solid rgba(201,169,97,0.3)'
        }}>
          {player.avatar}
        </div>
        <h2 style={{
          margin: '0 0 5px 0',
          fontSize: '24px',
          color: '#c9a961',
          textShadow: '0 0 10px rgba(201,169,97,0.3)'
        }}>
          {player.name}
        </h2>
        <div style={{ fontSize: '14px', color: '#888' }}>
          调查员
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
              background: 'linear-gradient(90deg, #8b0000, #e94560)',
              transition: 'width 0.3s'
            }} />
          </div>
        </div>

        {/* SAN理智值 */}
        <div style={{ marginBottom: '15px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '5px',
            fontSize: '14px'
          }}>
            <span style={{ color: '#6a4c93' }}>🧠 理智</span>
            <span>{player.sanity}/{player.maxSanity}</span>
          </div>
          <div style={{
            height: '10px',
            background: 'rgba(0,0,0,0.5)',
            borderRadius: '5px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${(player.sanity/player.maxSanity)*100}%`,
              height: '100%',
              background: player.sanity < 20
                ? 'linear-gradient(90deg, #8b0000, #6a4c93)'
                : 'linear-gradient(90deg, #6a4c93, #9a6cc3)',
              transition: 'width 0.3s'
            }} />
          </div>
        </div>

        {/* 金币 */}
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '5px',
            fontSize: '14px'
          }}>
            <span style={{ color: '#c9a961' }}>💰 金币</span>
            <span style={{ color: '#ffd700', fontWeight: 'bold' }}>{player.gold}</span>
          </div>
        </div>

        {/* 疯狂等级警告 */}
        {player.madnessLevel > 0 && (
          <div style={{
            marginTop: '15px',
            padding: '10px',
            background: 'rgba(139,0,0,0.2)',
            border: '1px solid #8b0000',
            borderRadius: '8px'
          }}>
            <div style={{
              fontSize: '12px',
              color: '#ff4444',
              fontWeight: 'bold',
              marginBottom: '4px'
            }}>
              ⚠️ 疯狂等级 {player.madnessLevel}
            </div>
            <div style={{
              fontSize: '10px',
              color: '#888'
            }}>
              你已经不再正常...
            </div>
          </div>
        )}
      </div>

      {/* 导航按钮 */}
      <div style={{ padding: '20px', flex: 1 }}>
        <NavButton
          icon="🃏"
          label="卡组"
          active={isActive('inventory')}
          onClick={() => setScreen('inventory')}
        />
        {/* 暂时禁用属性页 */}
        {/* <NavButton
          icon="📊"
          label="属性"
          active={isActive('status')}
          onClick={() => setScreen('status')}
        /> */}
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
        fontSize: '11px',
        color: '#666'
      }}>
        <div style={{ marginBottom: '5px', color: '#8b0000' }}>
          ⛧ 克苏鲁卡牌跑团 ⛧
        </div>
        <div>v0.2 - Card Edition</div>
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
      background: active ? 'linear-gradient(90deg, rgba(139,0,0,0.3), transparent)' : 'transparent',
      border: 'none',
      borderLeft: active ? '3px solid #8b0000' : '3px solid transparent',
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
