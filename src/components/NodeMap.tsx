import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';

export const NodeMap: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { nodes, currentNodeId, visitedNodes, moveToNode } = useGameStore();

  const currentNode = nodes.find(n => n.id === currentNodeId);

  const getNodePosition = (x: number, y: number) => ({
    left: `${50 + x * 80}px`,
    top: `${40 + y * 50}px`
  });

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'start': return '🚪';
      case 'combat': return '⚔️';
      case 'elite': return '👹';
      case 'boss': return '👁️';
      case 'event': return '❓';
      case 'rest': return '🏕️';
      case 'shop': return '🏪';
      default: return '◉';
    }
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'combat': return '#8b0000';
      case 'elite': return '#c9a961';
      case 'boss': return '#6a4c93';
      case 'event': return '#4a90e2';
      case 'rest': return '#2d5a3d';
      case 'shop': return '#c9a961';
      default: return '#666';
    }
  };

  if (!isExpanded) {
    return (
      <div
        onClick={() => setIsExpanded(true)}
        style={{
          height: '50px',
          background: 'linear-gradient(180deg, #0f0f1e 0%, #1a1a2e 100%)',
          borderBottom: '2px solid #8b0000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          cursor: 'pointer',
          transition: 'all 0.3s'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#888' }}>
          <span style={{ fontSize: '18px' }}>🗺️</span>
          <span>当前位置:</span>
          <span style={{ color: '#c9a961', fontWeight: 'bold' }}>{currentNode?.name}</span>
        </div>
        <div style={{ color: '#666', fontSize: '12px' }}>点击展开地图 ▼</div>
      </div>
    );
  }

  return (
    <div style={{
      height: '180px',
      background: 'linear-gradient(180deg, #0f0f1e 0%, #1a1a2e 100%)',
      borderBottom: '2px solid #8b0000',
      position: 'relative',
      overflow: 'hidden',
      padding: '15px',
      transition: 'all 0.3s'
    }}>
      {/* 标题栏 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px'
      }}>
        <div style={{ fontSize: '14px', color: '#888', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>🗺️</span>
          <span>探索地图</span>
          <span style={{ color: '#c9a961', fontWeight: 'bold', marginLeft: '10px' }}>
            {currentNode?.name}
          </span>
        </div>
      </div>

      {/* 地图画布 */}
      <div style={{ position: 'relative', width: '100%', height: '130px', opacity: 1 }}>
        {/* 连接线 */}
        {nodes.map(node =>
          node.connectedTo.map(targetId => {
            const target = nodes.find(n => n.id === targetId);
            if (!target) return null;

            const start = getNodePosition(node.x, node.y);
            const end = getNodePosition(target.x, target.y);

            const x1 = parseInt(start.left);
            const y1 = parseInt(start.top);
            const x2 = parseInt(end.left);
            const y2 = parseInt(end.top);

            const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

            const isPathActive = visitedNodes.includes(node.id) && visitedNodes.includes(targetId);

            return (
              <div
                key={`${node.id}-${targetId}`}
                style={{
                  position: 'absolute',
                  left: start.left,
                  top: start.top,
                  width: `${length}px`,
                  height: '2px',
                  background: isPathActive ? 'rgba(139,0,0,0.5)' : 'rgba(255,255,255,0.05)',
                  transform: `rotate(${angle}deg)`,
                  transformOrigin: '0 50%',
                  zIndex: 1,
                  transition: 'all 0.3s'
                }}
              />
            );
          })
        )}

        {/* 节点 */}
        {nodes.map(node => {
          const isCurrent = node.id === currentNodeId;
          const isVisited = visitedNodes.includes(node.id);
          const isNext = currentNode?.connectedTo.includes(node.id);
          const canMove = isNext && !isCurrent;

          return (
            <div
              key={node.id}
              onClick={() => canMove && moveToNode(node.id)}
              style={{
                position: 'absolute',
                ...getNodePosition(node.x, node.y),
                width: isCurrent ? '50px' : '40px',
                height: isCurrent ? '50px' : '40px',
                borderRadius: '50%',
                background: isCurrent
                  ? getNodeColor(node.type)
                  : isVisited
                  ? '#2a2a4a'
                  : '#151520',
                border: `3px solid ${isCurrent ? '#ffd700' : isVisited ? getNodeColor(node.type) : '#333'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: isCurrent ? 10 : 2,
                transform: `translate(-50%, -50%) scale(${isCurrent ? 1.1 : 1})`,
                boxShadow: isCurrent ? `0 0 20px ${getNodeColor(node.type)}` : 'none',
                transition: 'all 0.3s',
                cursor: canMove ? 'pointer' : 'default',
                opacity: isVisited || isNext || isCurrent ? 1 : 0.3
              }}
              title={node.name}
              onMouseEnter={(e) => {
                if (canMove) {
                  e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.2)';
                  e.currentTarget.style.boxShadow = `0 0 25px ${getNodeColor(node.type)}`;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = `translate(-50%, -50%) scale(${isCurrent ? 1.1 : 1})`;
                e.currentTarget.style.boxShadow = isCurrent ? `0 0 20px ${getNodeColor(node.type)}` : 'none';
              }}
            >
              <span style={{ fontSize: isCurrent ? '24px' : '20px' }}>
                {getNodeIcon(node.type)}
              </span>

              {isCurrent && (
                <div style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  border: '2px solid #ffd700',
                  animation: 'pulse 2s infinite'
                }} />
              )}
            </div>
          );
        })}

        {/* 节点名称标签 */}
        {nodes.map(node => {
          const isCurrent = node.id === currentNodeId;
          const isNext = currentNode?.connectedTo.includes(node.id);
          if (!isCurrent && !isNext) return null;

          return (
            <div
              key={`label-${node.id}`}
              style={{
                position: 'absolute',
                ...getNodePosition(node.x, node.y),
                transform: 'translate(-50%, 28px)',
                fontSize: '11px',
                color: isCurrent ? '#ffd700' : '#888',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                zIndex: 3,
                fontWeight: isCurrent ? 'bold' : 'normal',
                textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                pointerEvents: 'none'
              }}
            >
              {node.name}
            </div>
          );
        })}
      </div>

      {/* 收起按钮 */}
      <div
        onClick={() => setIsExpanded(false)}
        style={{
          position: 'absolute',
          bottom: '5px',
          right: '15px',
          fontSize: '11px',
          color: '#666',
          cursor: 'pointer',
          zIndex: 10
        }}
      >
        点击收起 ▲
      </div>
    </div>
  );
};
