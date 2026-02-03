import React from 'react';
import { useGameStore } from './store/gameStore';
import { LeftPanel } from './components/LeftPanel';
import { MainContent } from './components/MainContent';
import { InventoryScreen } from './components/InventoryScreen';
import { NodeMap } from './components/NodeMap';

export default function App() {
  // 解构出所有需要的方法
  const { currentScreen, setScreen, resetGame } = useGameStore();

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 100%)',
      display: 'flex',
      overflow: 'hidden',
      fontFamily: '"Microsoft YaHei", "SimSun", serif',
      color: '#fff'
    }}>
      {/* 左侧状态栏 */}
      <LeftPanel />
      
      {/* 右侧主内容区 */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
        background: 'rgba(0,0,0,0.3)',
        overflow: 'hidden'
      }}>
        {/* 上方地图 */}
        <div style={{ flex: '0 0 auto' }}>
          <NodeMap />
        </div>
        
        {/* 下方内容 */}
        <div style={{ 
          flex: 1, 
          overflow: 'auto',
          position: 'relative'
        }}>
          {currentScreen === 'main' && <MainContent />}
          {currentScreen === 'inventory' && <InventoryScreen />}
          
          {currentScreen === 'status' && (
            <div style={{ padding: 40 }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '30px',
                paddingBottom: '20px',
                borderBottom: '2px solid rgba(233,69,96,0.3)'
              }}>
                <h2 style={{ margin: 0, color: '#ffd700', fontSize: '28px' }}>📊 详细状态</h2>
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
              <p style={{ color: '#888' }}>HP、MP、装备详情等功能开发中...</p>
            </div>
          )}

          {currentScreen === 'settings' && (
            <div style={{ padding: 40, maxWidth: '600px', margin: '0 auto' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '30px',
                paddingBottom: '20px',
                borderBottom: '2px solid rgba(233,69,96,0.3)'
              }}>
                <h2 style={{ margin: 0, color: '#ffd700', fontSize: '28px' }}>⚙️ 设置</h2>
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
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ 
                  padding: '20px', 
                  background: 'rgba(22,33,62,0.5)', 
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <h3 style={{ color: '#e94560', marginBottom: '10px' }}>游戏进度</h3>
                  <p style={{ color: '#888', fontSize: '14px', marginBottom: '15px' }}>
                    重新开始将重置所有进度（HP、物品、剧情进度），返回初始囚室场景。
                  </p>
                  <button
                    onClick={() => {
                      if (confirm('确定要重新开始吗？所有进度将丢失！')) {
                        resetGame();
                        setScreen('main');
                      }
                    }}
                    style={{
                      padding: '12px 24px',
                      background: 'rgba(233,69,96,0.2)',
                      border: '2px solid #e94560',
                      color: '#e94560',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    🔄 重新开始游戏
                  </button>
                </div>
                
                <div style={{ 
                  padding: '20px', 
                  background: 'rgba(22,33,62,0.5)', 
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <h3 style={{ color: '#ffd700', marginBottom: '10px' }}>存档管理</h3>
                  <p style={{ color: '#888', fontSize: '14px' }}>
                    当前游戏进度会自动保存到浏览器本地存储。
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* 底部装饰线 */}
        <div style={{
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #e94560, transparent)',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0
        }} />
      </div>
    </div>
  );
}