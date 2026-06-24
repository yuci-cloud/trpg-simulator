import React from 'react';
import { useGameStore } from '../store/gameStore';
import { getRandomCards } from '../data/cards';

export const RewardScreen: React.FC = () => {
  const { setScreen, addToInventory, addHistory } = useGameStore();

  const [rewardCards] = React.useState(() => {
    // 70%概率获得普通卡，30%概率获得稀有卡
    const rarity = Math.random() < 0.7 ? 'common' : 'uncommon';
    return getRandomCards(3, rarity);
  });

  const handleSelectCard = (cardIndex: number) => {
    const card = rewardCards[cardIndex];
    addToInventory(card);
    addHistory({ type: 'reward', content: `获得卡牌：${card.name}` });
    setScreen('main');
  };

  const handleSkip = () => {
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
        marginBottom: '40px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '48px',
          margin: '0 0 10px 0',
          color: '#ffd700',
          textShadow: '0 0 30px rgba(255,215,0,0.5)'
        }}>
          ✓ 战斗胜利！
        </h1>
        <p style={{
          fontSize: '18px',
          color: '#888',
          margin: 0
        }}>
          选择一张卡牌加入你的卡组
        </p>
      </div>

      {/* 卡牌选择 */}
      <div style={{
        display: 'flex',
        gap: '30px',
        marginBottom: '40px'
      }}>
        {rewardCards.map((card, index) => (
          <div
            key={index}
            onClick={() => handleSelectCard(index)}
            style={{
              width: '200px',
              minHeight: '280px',
              background: 'linear-gradient(135deg, #2a2a4a 0%, #1a1a2e 100%)',
              border: '2px solid #4a3a5a',
              borderRadius: '15px',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px) scale(1.05)';
              e.currentTarget.style.borderColor = '#ffd700';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(255,215,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.borderColor = '#4a3a5a';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* 卡牌类型图标 */}
            <div style={{
              fontSize: '64px',
              marginBottom: '15px'
            }}>
              {card.type === 'attack' ? '⚔️' : card.type === 'skill' ? '🛡️' : '✨'}
            </div>

            {/* 卡牌名称 */}
            <div style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#fff',
              marginBottom: '10px',
              textAlign: 'center'
            }}>
              {card.name}
            </div>

            {/* 稀有度 */}
            <div style={{
              fontSize: '12px',
              color: card.rarity === 'rare' ? '#c9a961' : card.rarity === 'uncommon' ? '#4a90e2' : '#888',
              marginBottom: '15px',
              fontWeight: 'bold'
            }}>
              {card.rarity === 'rare' ? '稀有' : card.rarity === 'uncommon' ? '罕见' : '普通'}
            </div>

            {/* 能量消耗 */}
            <div style={{
              fontSize: '14px',
              color: '#4a90e2',
              marginBottom: '15px'
            }}>
              ⚡ 消耗 {card.cost} 能量
            </div>

            {/* 卡牌描述 */}
            <div style={{
              fontSize: '14px',
              color: '#d4d4d4',
              textAlign: 'center',
              lineHeight: '1.6',
              flex: 1
            }}>
              {card.description}
            </div>

            {/* 理智消耗警告 */}
            {card.sanityCost && (
              <div style={{
                marginTop: '10px',
                padding: '6px 12px',
                background: 'rgba(106,76,147,0.3)',
                border: '1px solid #6a4c93',
                borderRadius: '6px',
                fontSize: '12px',
                color: '#6a4c93',
                fontWeight: 'bold'
              }}>
                ⚠️ 消耗 {card.sanityCost} 理智
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 跳过按钮 */}
      <button
        onClick={handleSkip}
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
        跳过奖励
      </button>
    </div>
  );
};
