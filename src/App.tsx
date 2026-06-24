import { useGameStore } from './store/gameStore';
import { HomeScreen } from './components/HomeScreen';
import { CharacterSelectScreen } from './components/CharacterSelectScreen';
import { LeftPanel } from './components/LeftPanel';
import { MainContent } from './components/MainContent';
import { InventoryScreen } from './components/InventoryScreen';
import { NodeMap } from './components/NodeMap';
import { CombatScreen } from './components/CombatScreen';
import { RewardScreen } from './components/RewardScreen';

export default function App() {
  const { currentScreen, setScreen, resetGame } = useGameStore();

  // 首页和职业选择界面不显示左侧面板
  const showLeftPanel = currentScreen !== 'home' && currentScreen !== 'character-select';

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #0a0a15 0%, #1a1a2a 100%)',
      display: 'flex',
      overflow: 'hidden',
      fontFamily: '"Microsoft YaHei", "SimSun", serif',
      color: '#fff'
    }}>
      {/* 左侧状态栏（游戏中才显示） */}
      {showLeftPanel && <LeftPanel />}

      {/* 右侧主内容区 */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        background: showLeftPanel ? 'rgba(0,0,0,0.3)' : 'transparent',
        overflow: 'hidden'
      }}>
        {/* 上方地图（只在游戏主界面显示） */}
        {showLeftPanel && currentScreen !== 'combat' && currentScreen !== 'reward' && (
          <div style={{ flex: '0 0 auto' }}>
            <NodeMap />
          </div>
        )}

        {/* 下方内容 */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          position: 'relative'
        }}>
          {currentScreen === 'home' && <HomeScreen />}
          {currentScreen === 'character-select' && <CharacterSelectScreen />}
          {currentScreen === 'main' && <MainContent />}
          {currentScreen === 'inventory' && <InventoryScreen />}
          {currentScreen === 'combat' && <CombatScreen />}
          {currentScreen === 'reward' && <RewardScreen />}

          {/* 暂时禁用状态界面 */}
          {false && (
            <div style={{ padding: 40 }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px',
                paddingBottom: '20px',
                borderBottom: '2px solid rgba(139,0,0,0.3)'
              }}>
                <h2 style={{ margin: 0, color: '#c9a961', fontSize: '28px' }}>📊 角色属性</h2>
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
              <p style={{ color: '#888' }}>详细属性功能开发中...</p>
            </div>
          )}

          {/* 设置界面 */}
          {currentScreen === 'settings' && (
            <div style={{ padding: 40, maxWidth: '600px', margin: '0 auto' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px',
                paddingBottom: '20px',
                borderBottom: '2px solid rgba(139,0,0,0.3)'
              }}>
                <h2 style={{ margin: 0, color: '#c9a961', fontSize: '28px' }}>⚙️ 设置</h2>
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
                  background: 'rgba(10,10,21,0.5)',
                  borderRadius: '10px',
                  border: '1px solid rgba(139,0,0,0.3)'
                }}>
                  <h3 style={{ color: '#8b0000', marginBottom: '10px' }}>游戏进度</h3>
                  <p style={{ color: '#888', fontSize: '14px', marginBottom: '15px' }}>
                    重新开始将重置所有进度（HP、理智、金币、卡组、剧情进度），返回初始状态。
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
                      background: 'rgba(139,0,0,0.2)',
                      border: '2px solid #8b0000',
                      color: '#ff4444',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(139,0,0,0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(139,0,0,0.2)';
                    }}
                  >
                    🔄 重新开始游戏
                  </button>
                </div>

                <div style={{
                  padding: '20px',
                  background: 'rgba(10,10,21,0.5)',
                  borderRadius: '10px',
                  border: '1px solid rgba(139,0,0,0.3)'
                }}>
                  <h3 style={{ color: '#c9a961', marginBottom: '10px' }}>存档管理</h3>
                  <p style={{ color: '#888', fontSize: '14px' }}>
                    当前游戏进度会自动保存到浏览器本地存储。
                  </p>
                </div>

                <div style={{
                  padding: '20px',
                  background: 'rgba(10,10,21,0.5)',
                  borderRadius: '10px',
                  border: '1px solid rgba(139,0,0,0.3)'
                }}>
                  <h3 style={{ color: '#6a4c93', marginBottom: '10px' }}>关于游戏</h3>
                  <p style={{ color: '#888', fontSize: '14px', lineHeight: '1.6' }}>
                    克苏鲁卡牌跑团 v0.2<br/>
                    一款融合了卡牌战斗和TRPG元素的Roguelike游戏。<br/>
                    在探索中保持理智，在战斗中运用策略。<br/>
                    <br/>
                    祝你好运，调查员。
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 底部装饰线 */}
        <div style={{
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #8b0000, transparent)',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0
        }} />
      </div>
    </div>
  );
}
