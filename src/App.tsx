import React from 'react';
import { TacticalMap } from './components/TacticalMap';
import { NarrativePanel } from './components/NarrativePanel';
import { useGameStore } from './store/gameStore';

function App() {
  const { allies } = useGameStore();

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      background: 'linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 50%, #16213e 100%)',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      boxSizing: 'border-box',
      gap: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* 背景装饰 - 网格纹理 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          linear-gradient(rgba(42, 42, 74, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(42, 42, 74, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        pointerEvents: 'none',
        opacity: 0.5
      }} />
      
      {/* 顶部标题栏 */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 10px',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: '28px',
            background: 'linear-gradient(90deg, var(--accent-red), var(--accent-gold))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 30px rgba(233,69,96,0.3)',
            letterSpacing: '2px'
          }}>
            ⚔️ 深渊行者
          </h1>
          <span style={{ 
            padding: '4px 12px', 
            background: 'rgba(233,69,96,0.2)', 
            borderRadius: '20px',
            fontSize: '12px',
            color: 'var(--accent-red)',
            border: '1px solid rgba(233,69,96,0.3)'
          }}>
            BETA
          </span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            fontSize: '14px',
            color: 'var(--text-secondary)'
          }}>
            <span style={{ color: 'var(--accent-green)' }}>●</span>
            <span>在线: {allies.length + 1} 人</span>
          </div>
          
          <button style={{
            padding: '8px 16px',
            background: 'transparent',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '13px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.borderColor = 'var(--accent-gold)'}
          onMouseLeave={(e) => e.target.style.borderColor = 'var(--border-color)'}
          >
            ⚙️ 设置
          </button>
        </div>
      </header>

      {/* 主内容区 */}
      <main style={{ 
        flex: 1, 
        display: 'flex', 
        gap: '20px',
        position: 'relative',
        zIndex: 10,
        minHeight: 0
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <TacticalMap />
        </div>
        
        <NarrativePanel />
      </main>
      
      {/* 底部装饰线 */}
      <div style={{
        height: '2px',
        background: 'linear-gradient(90deg, transparent, var(--accent-red), var(--accent-gold), transparent)',
        opacity: 0.5
      }} />
    </div>
  );
}

export default App;