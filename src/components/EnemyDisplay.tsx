import React from 'react';
import type { Enemy } from '../data/enemies';

interface EnemyDisplayProps {
  enemy: Enemy;
  index: number;
  isTargeted: boolean;
  onSelect: (index: number) => void;
}

export const EnemyDisplay: React.FC<EnemyDisplayProps> = ({ enemy, index, isTargeted, onSelect }) => {
  const isDead = enemy.hp <= 0;

  const getIntentionColor = () => {
    switch (enemy.intention.type) {
      case 'attack': return '#8b0000';
      case 'defend': return '#2d5a3d';
      case 'buff': return '#c9a961';
      case 'debuff': return '#6a4c93';
      default: return '#666';
    }
  };

  const getIntentionIcon = () => {
    switch (enemy.intention.type) {
      case 'attack': return '⚔️';
      case 'defend': return '🛡️';
      case 'buff': return '💪';
      case 'debuff': return '🕷️';
      default: return '❓';
    }
  };

  return (
    <div
      onClick={() => !isDead && onSelect(index)}
      style={{
        width: '180px',
        minHeight: '240px',
        background: isDead
          ? 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)'
          : 'linear-gradient(135deg, #2a2a4a 0%, #1a1a2e 100%)',
        border: `3px solid ${isTargeted ? '#ffd700' : isDead ? '#333' : '#4a3a5a'}`,
        borderRadius: '12px',
        padding: '15px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: isDead ? 'not-allowed' : 'pointer',
        opacity: isDead ? 0.4 : 1,
        transition: 'all 0.3s',
        position: 'relative',
        boxShadow: isTargeted
          ? '0 0 30px rgba(255,215,0,0.5)'
          : '0 4px 15px rgba(0,0,0,0.6)'
      }}
      onMouseEnter={(e) => {
        if (!isDead) {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.8)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isTargeted) {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.6)';
        }
      }}
    >
      {/* 敌人名称 */}
      <div style={{
        fontSize: '16px',
        fontWeight: 'bold',
        color: isDead ? '#666' : '#d4d4d4',
        marginBottom: '10px',
        textAlign: 'center'
      }}>
        {enemy.name}
      </div>

      {/* 敌人头像 */}
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: isDead ? '#1a1a1a' : 'linear-gradient(135deg, #4a3a5a, #2a1a3a)',
        border: '3px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '48px',
        marginBottom: '12px',
        opacity: isDead ? 0.3 : 1
      }}>
        {enemy.tier === 'boss' ? '👁️' : enemy.tier === 'elite' ? '👹' : '🦑'}
      </div>

      {/* HP条 */}
      <div style={{ width: '100%', marginBottom: '8px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: '#888',
          marginBottom: '4px'
        }}>
          <span>❤ HP</span>
          <span>{enemy.hp}/{enemy.maxHp}</span>
        </div>
        <div style={{
          width: '100%',
          height: '12px',
          background: 'rgba(0,0,0,0.5)',
          borderRadius: '6px',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{
            width: `${(enemy.hp / enemy.maxHp) * 100}%`,
            height: '100%',
            background: enemy.hp < enemy.maxHp * 0.3
              ? 'linear-gradient(90deg, #8b0000, #ff4444)'
              : 'linear-gradient(90deg, #e94560, #ff6b6b)',
            transition: 'width 0.3s'
          }} />
        </div>
      </div>

      {/* 格挡值 */}
      {enemy.block > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '13px',
          color: '#4ecca3',
          marginBottom: '8px'
        }}>
          <span>🛡️</span>
          <span>{enemy.block}</span>
        </div>
      )}

      {/* Buff/Debuff */}
      {enemy.powers.length > 0 && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '4px',
          marginBottom: '8px',
          justifyContent: 'center'
        }}>
          {enemy.powers.map((power, i) => (
            <div
              key={i}
              style={{
                padding: '2px 6px',
                background: 'rgba(74,58,90,0.5)',
                borderRadius: '4px',
                fontSize: '10px',
                color: '#c9a961',
                border: '1px solid rgba(201,169,97,0.3)'
              }}
            >
              {power.name} {power.amount}
            </div>
          ))}
        </div>
      )}

      {/* 意图显示 */}
      {!isDead && (
        <div style={{
          marginTop: 'auto',
          width: '100%',
          padding: '8px',
          background: `linear-gradient(135deg, ${getIntentionColor()}33, ${getIntentionColor()}11)`,
          border: `1px solid ${getIntentionColor()}`,
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '20px',
            marginBottom: '4px'
          }}>
            {getIntentionIcon()}
          </div>
          <div style={{
            fontSize: '11px',
            color: '#d4d4d4'
          }}>
            {enemy.intention.description}
          </div>
        </div>
      )}

      {/* 死亡标记 */}
      {isDead && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(-15deg)',
          fontSize: '48px',
          opacity: 0.6
        }}>
          ☠️
        </div>
      )}
    </div>
  );
};
