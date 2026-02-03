// src/components/TacticalMap.tsx
import React, { useRef, useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';

export const TacticalMap: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { gridSize, mapWidth, mapHeight, tokens, selectedTokenId, moveToken, selectToken } = useGameStore();
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const canvasWidth = mapWidth * gridSize;
  const canvasHeight = mapHeight * gridSize;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 清空画布
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // 绘制网格
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 1;
    for (let x = 0; x <= mapWidth; x++) {
      ctx.beginPath();
      ctx.moveTo(x * gridSize, 0);
      ctx.lineTo(x * gridSize, canvasHeight);
      ctx.stroke();
    }
    for (let y = 0; y <= mapHeight; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * gridSize);
      ctx.lineTo(canvasWidth, y * gridSize);
      ctx.stroke();
    }

    // 绘制场景物品（示例：墙壁和门）
    ctx.fillStyle = '#666';
    ctx.fillRect(10 * gridSize, 5 * gridSize, gridSize, 3 * gridSize); // 墙
    
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(10 * gridSize, 6 * gridSize, gridSize / 2, gridSize); // 门

    // 绘制Token
    tokens.forEach(token => {
      const x = token.x * gridSize + gridSize / 2;
      const y = token.y * gridSize + gridSize / 2;
      const radius = gridSize * 0.4;

      // 选中高亮
      if (token.id === selectedTokenId) {
        ctx.beginPath();
        ctx.arc(x, y, radius + 4, 0, Math.PI * 2);
        ctx.fillStyle = '#ffd700';
        ctx.fill();
      }

      // Token背景（根据类型变色）
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      if (token.type === 'player') ctx.fillStyle = '#4a90e2';
      else if (token.type === 'ally') ctx.fillStyle = '#7ed321';
      else if (token.type === 'enemy') ctx.fillStyle = '#d0021b';
      else ctx.fillStyle = '#9013fe';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 绘制头像/图标（简化版用emoji或首字母）
      ctx.fillStyle = '#fff';
      ctx.font = `${gridSize * 0.6}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(token.avatar || token.name[0], x, y);

      // 血条（如果有）
      if (token.hp !== undefined && token.maxHp) {
        const barWidth = gridSize * 0.8;
        const barHeight = 4;
        ctx.fillStyle = '#000';
        ctx.fillRect(x - barWidth/2, y + radius + 2, barWidth, barHeight);
        
        ctx.fillStyle = token.hp < token.maxHp * 0.3 ? '#ff4444' : '#44ff44';
        ctx.fillRect(x - barWidth/2, y + radius + 2, barWidth * (token.hp / token.maxHp), barHeight);
      }
    });

    // 绘制战争迷雾（示例：除视野范围外变暗）
    const player = tokens.find(t => t.type === 'player');
    if (player) {
      const gradient = ctx.createRadialGradient(
        player.x * gridSize + gridSize/2,
        player.y * gridSize + gridSize/2,
        gridSize * 3,
        player.x * gridSize + gridSize/2,
        player.y * gridSize + gridSize/2,
        gridSize * 8
      );
      gradient.addColorStop(0, 'rgba(0,0,0,0)');
      gradient.addColorStop(1, 'rgba(0,0,0,0.7)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    }
  }, [tokens, gridSize, mapWidth, mapHeight, selectedTokenId]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = Math.floor((e.clientX - rect.left) / gridSize);
    const y = Math.floor((e.clientY - rect.top) / gridSize);
    
    // 查找点击的token
    const clickedToken = tokens.find(t => t.x === x && t.y === y);
    if (clickedToken) {
      selectToken(clickedToken.id);
      setIsDragging(true);
      setDragOffset({ x: e.clientX - rect.left - x * gridSize, y: e.clientY - rect.top - y * gridSize });
    } else {
      selectToken(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedTokenId) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const rawX = (e.clientX - rect.left - dragOffset.x) / gridSize;
    const rawY = (e.clientY - rect.top - dragOffset.y) / gridSize;
    
    // 磁力吸附到网格
    const x = Math.max(0, Math.min(mapWidth - 1, Math.round(rawX)));
    const y = Math.max(0, Math.min(mapHeight - 1, Math.round(rawY)));
    
    moveToken(selectedTokenId, x, y);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
  <div style={{ 
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    height: '100%'
  }}>
    {/* 地图容器 */}
    <div style={{ 
      position: 'relative',
      flex: 1,
      background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%)',
      borderRadius: '12px',
      border: '2px solid var(--border-color)',
      boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5), 0 0 20px rgba(233, 69, 96, 0.1)',
      overflow: 'hidden'
    }}>
      {/* 装饰性边角 */}
      <div style={{ position: 'absolute', top: 10, left: 10, width: 20, height: 20, borderTop: '2px solid var(--accent-red)', borderLeft: '2px solid var(--accent-red)' }} />
      <div style={{ position: 'absolute', top: 10, right: 10, width: 20, height: 20, borderTop: '2px solid var(--accent-red)', borderRight: '2px solid var(--accent-red)' }} />
      <div style={{ position: 'absolute', bottom: 10, left: 10, width: 20, height: 20, borderBottom: '2px solid var(--accent-red)', borderLeft: '2px solid var(--accent-red)' }} />
      <div style={{ position: 'absolute', bottom: 10, right: 10, width: 20, height: 20, borderBottom: '2px solid var(--accent-red)', borderRight: '2px solid var(--accent-red)' }} />
      
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ 
          cursor: isDragging ? 'grabbing' : 'crosshair',
          display: 'block',
          filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))'
        }}
      />
      
      {/* 选中的单位信息浮层 */}
      {selectedTokenId && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(22, 33, 62, 0.95)',
          padding: '10px 20px',
          borderRadius: '20px',
          border: '1px solid var(--accent-red)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
          animation: 'slideUp 0.3s ease-out'
        }}>
          <span style={{ 
            width: '10px', 
            height: '10px', 
            borderRadius: '50%', 
            background: 'var(--accent-green)',
            boxShadow: '0 0 10px var(--accent-green)'
          }} />
          <span style={{ fontWeight: 'bold', color: 'var(--accent-gold)' }}>
            {tokens.find(t => t.id === selectedTokenId)?.name}
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            HP: {tokens.find(t => t.id === selectedTokenId)?.hp}/{tokens.find(t => t.id === selectedTokenId)?.maxHp}
          </span>
        </div>
      )}
    </div>
    
    {/* 底部信息栏 */}
    <div style={{ 
      padding: '12px 20px', 
      background: 'var(--bg-secondary)',
      borderRadius: '8px',
      border: '1px solid var(--border-color)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '13px',
      color: '#cccccc',
	  textShadow: '0 1px 2px rgba(0,0,0,0.5)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: 'var(--accent-red)' }}>◉</span>
        <span>战术地图</span>
        <span style={{ marginLeft: '15px', color: 'var(--text-secondary)' }}>
          坐标: {selectedTokenId ? 
            `${tokens.find(t => t.id === selectedTokenId)?.x}, ${tokens.find(t => t.id === selectedTokenId)?.y}` 
            : '未选择'}
        </span>
      </div>
      <div style={{ display: 'flex', gap: '15px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-green)' }} />
          莱拉
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4a90e2' }} />
          玩家
        </span>
      </div>
    </div>
  </div>
);
};