import React from 'react';
import { useGameStore } from '../store/gameStore';

export const InventoryScreen: React.FC = () => {
  const { inventory, useItem, setScreen } = useGameStore();
  
  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: '2px solid rgba(233,69,96,0.3)'
      }}>
        <h2 style={{ margin: 0, color: '#ffd700', fontSize: '28px' }}>🎒 背包</h2>
        <button 
          onClick={() => setScreen('main')}
          style={{
            padding: '10px 20px',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          返回游戏
        </button>
      </div>
      
      {inventory.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#666', padding: '60px' }}>
          背包是空的
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '15px' }}>
          {inventory.map((item) => (
            <div key={item.id} style={{
              padding: '20px',
              background: 'rgba(22, 33, 62, 0.5)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '15px'
            }}>
              <div style={{ fontSize: '40px' }}>{item.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontSize: '18px', 
                  fontWeight: 'bold',
                  color: item.type === 'weapon' ? '#e94560' : 
                         item.type === 'consumable' ? '#4ecca3' : '#ffd700'
                }}>
                  {item.name}
                </div>
                <div style={{ fontSize: '14px', color: '#888', marginTop: '5px' }}>
                  {item.description}
                </div>
              </div>
              {item.type === 'consumable' && (
                <button
                  onClick={() => useItem(item.id)}
                  style={{
                    padding: '10px 20px',
                    background: 'rgba(78, 204, 163, 0.2)',
                    border: '1px solid #4ecca3',
                    color: '#4ecca3',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  使用
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};