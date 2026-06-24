import React from 'react';
import { useGameStore } from '../store/gameStore';
import { getAllCharacterClasses, type CharacterClass } from '../data/characters';

export const CharacterSelectScreen: React.FC = () => {
  const { setScreen, startNewGame } = useGameStore();
  const classes = getAllCharacterClasses();

  const handleSelectClass = (characterClass: CharacterClass) => {
    startNewGame(characterClass);
    setScreen('main');
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a0a15 0%, #1a1a2a 100%)',
      padding: '40px'
    }}>
      {/* 标题 */}
      <div style={{
        marginBottom: '60px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '48px',
          margin: '0 0 15px 0',
          color: '#c9a961',
          textShadow: '0 0 20px rgba(201,169,97,0.3)'
        }}>
          选择你的身份
        </h1>
        <p style={{
          fontSize: '16px',
          color: '#888',
          margin: 0
        }}>
          每个职业拥有独特的起始卡组和可获得卡牌
        </p>
      </div>

      {/* 职业卡片 */}
      <div style={{
        display: 'flex',
        gap: '40px',
        marginBottom: '40px'
      }}>
        {classes.map((characterClass) => (
          <div
            key={characterClass.id}
            onClick={() => handleSelectClass(characterClass)}
            style={{
              width: '320px',
              padding: '30px',
              background: 'linear-gradient(135deg, rgba(22,33,62,0.8), rgba(10,10,21,0.8))',
              border: '2px solid rgba(139,0,0,0.5)',
              borderRadius: '15px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px) scale(1.03)';
              e.currentTarget.style.borderColor = '#c9a961';
              e.currentTarget.style.boxShadow = '0 10px 40px rgba(201,169,97,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.borderColor = 'rgba(139,0,0,0.5)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* 头像 */}
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #4a3a5a, #2a1a3a)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '64px',
              marginBottom: '20px',
              border: '4px solid rgba(201,169,97,0.3)',
              boxShadow: '0 0 30px rgba(106,76,147,0.4)'
            }}>
              {characterClass.avatar}
            </div>

            {/* 职业名 */}
            <h2 style={{
              fontSize: '28px',
              margin: '0 0 15px 0',
              color: '#c9a961',
              fontWeight: 'bold'
            }}>
              {characterClass.name}
            </h2>

            {/* 描述 */}
            <p style={{
              fontSize: '14px',
              color: '#aaa',
              lineHeight: '1.6',
              textAlign: 'center',
              marginBottom: '20px',
              minHeight: '80px'
            }}>
              {characterClass.description}
            </p>

            {/* 属性 */}
            <div style={{
              width: '100%',
              padding: '15px',
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '8px',
              marginBottom: '15px'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
                fontSize: '13px'
              }}>
                <StatItem label="❤ 生命" value={characterClass.startingHp} />
                <StatItem label="🧠 理智" value={characterClass.startingSanity} />
                <StatItem label="💪 力量" value={characterClass.stats.str} />
                <StatItem label="🏃 敏捷" value={characterClass.stats.dex} />
                <StatItem label="📚 智力" value={characterClass.stats.int} />
                <StatItem label="💰 金币" value={characterClass.startingGold} />
              </div>
            </div>

            {/* 初始卡组 */}
            <div style={{
              fontSize: '12px',
              color: '#666',
              textAlign: 'center'
            }}>
              初始卡组：{characterClass.starterDeck.length} 张卡牌
            </div>
          </div>
        ))}
      </div>

      {/* 返回按钮 */}
      <button
        onClick={() => setScreen('home')}
        style={{
          padding: '12px 30px',
          background: 'transparent',
          border: '2px solid rgba(255,255,255,0.3)',
          borderRadius: '8px',
          color: '#888',
          fontSize: '16px',
          cursor: 'pointer',
          transition: 'all 0.3s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#fff';
          e.currentTarget.style.color = '#fff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
          e.currentTarget.style.color = '#888';
        }}
      >
        ← 返回主菜单
      </button>
    </div>
  );
};

const StatItem: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }}>
    <span style={{ color: '#888' }}>{label}</span>
    <span style={{ color: '#fff', fontWeight: 'bold' }}>{value}</span>
  </div>
);
