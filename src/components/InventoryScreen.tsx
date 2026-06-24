import React from 'react';
import { useGameStore } from '../store/gameStore';

export const InventoryScreen: React.FC = () => {
  const { player, setScreen } = useGameStore();

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: '2px solid rgba(139,0,0,0.3)'
      }}>
        <h2 style={{ margin: 0, color: '#c9a961', fontSize: '28px' }}>🃏 卡组</h2>
        <button
          onClick={() => setScreen('main')}
          style={{
            padding: '10px 20px',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#fff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
          }}
        >
          返回游戏
        </button>
      </div>

      {/* 卡组统计 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '15px',
        marginBottom: '30px'
      }}>
        <div style={{
          padding: '15px',
          background: 'rgba(10,10,21,0.5)',
          border: '1px solid rgba(139,0,0,0.3)',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#c9a961' }}>
            {player.deck.length}
          </div>
          <div style={{ fontSize: '12px', color: '#888' }}>总卡牌数</div>
        </div>
        <div style={{
          padding: '15px',
          background: 'rgba(10,10,21,0.5)',
          border: '1px solid rgba(139,0,0,0.3)',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b0000' }}>
            {player.deck.filter(c => c.type === 'attack').length}
          </div>
          <div style={{ fontSize: '12px', color: '#888' }}>攻击牌</div>
        </div>
        <div style={{
          padding: '15px',
          background: 'rgba(10,10,21,0.5)',
          border: '1px solid rgba(139,0,0,0.3)',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2d5a3d' }}>
            {player.deck.filter(c => c.type === 'skill').length}
          </div>
          <div style={{ fontSize: '12px', color: '#888' }}>技能牌</div>
        </div>
      </div>

      {/* 卡牌列表 */}
      {player.deck.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#666', padding: '60px' }}>
          卡组为空
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '15px'
        }}>
          {player.deck.map((card, index) => {
            const cardId = `${card.id}_${index}`;

            return (
              <div
                key={cardId}
                style={{
                  padding: '20px',
                  background: 'rgba(10,10,21,0.5)',
                  border: `1px solid ${
                    card.rarity === 'rare' ? '#c9a961' :
                    card.rarity === 'uncommon' ? '#4a90e2' :
                    'rgba(255,255,255,0.1)'
                  }`,
                  borderRadius: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* 能量消耗 */}
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: '#4a90e2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#fff'
                }}>
                  {card.cost}
                </div>

                {/* 卡牌类型图标 */}
                <div style={{ fontSize: '48px', textAlign: 'center', marginBottom: '10px' }}>
                  {card.type === 'attack' ? '⚔️' : card.type === 'skill' ? '🛡️' : '✨'}
                </div>

                {/* 卡牌名称 */}
                <div style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#fff',
                  marginBottom: '8px',
                  textAlign: 'center'
                }}>
                  {card.name}
                </div>

                {/* 卡牌描述 */}
                <div style={{
                  fontSize: '13px',
                  color: '#d4d4d4',
                  lineHeight: '1.4',
                  textAlign: 'center',
                  flex: 1,
                  marginBottom: '10px'
                }}>
                  {card.description}
                </div>

                {/* 理智消耗 */}
                {card.sanityCost && (
                  <div style={{
                    fontSize: '11px',
                    color: '#6a4c93',
                    textAlign: 'center',
                    fontWeight: 'bold'
                  }}>
                    ⚠️ 消耗 {card.sanityCost} 理智
                  </div>
                )}

                {/* 移除按钮（可选功能） */}
                {/* <button
                  onClick={() => removeFromInventory(cardId)}
                  style={{
                    marginTop: '10px',
                    padding: '6px 12px',
                    background: 'rgba(139,0,0,0.2)',
                    border: '1px solid #8b0000',
                    color: '#ff4444',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  移除
                </button> */}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
