import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';

export const NodeMap: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);  // 默认展开
  const { nodes, currentNodeId, visitedNodes } = useGameStore();
  
  const currentNode = nodes.find(n => n.id === currentNodeId);
  
  const getNodePosition = (x: number, y: number) => ({
    left: `${50 + x * 100}px`,
    top: `${40 + y * 50}px`
  });
  
  // 收起状态：只显示标题栏
  if (!isExpanded) {
    return (
      <div 
        onClick={() => setIsExpanded(true)}
        style={{
          height: '50px',
          background: 'linear-gradient(180deg, #0f0f1e 0%, #1a1a2e 100%)',
          borderBottom: '2px solid #e94560',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          cursor: 'pointer',
          transition: 'all 0.3s',
          position: 'relative',
          overflow: 'hidden'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'linear-gradient(180deg, #1a1a2e 0%, #2a2a4e 100%)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'linear-gradient(180deg, #0f0f1e 0%, #1a1a2e 100%)';
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '14px',
          color: '#888'
        }}>
          <span style={{ fontSize: '18px' }}>🗺️</span>
          <span>当前位置:</span>
          <span style={{ 
            color: '#ffd700', 
            fontWeight: 'bold',
            textShadow: '0 0 10px rgba(255,215,0,0.3)'
          }}>
            {currentNode?.name}
          </span>
          <span style={{ 
            marginLeft: '10px',
            padding: '2px 8px',
            background: 'rgba(233,69,96,0.2)',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#e94560',
            border: '1px solid rgba(233,69,96,0.3)'
          }}>
            {currentNode?.type === 'combat' && '⚔️ 战斗区域'}
            {currentNode?.type === 'event' && '❓ 事件区域'}
            {currentNode?.type === 'boss' && '👹 Boss区域'}
            {currentNode?.type === 'safe' && '🏕️ 安全区域'}
			{currentNode?.type === 'start' && '🚪 起点'}
          </span>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          color: '#666',
          fontSize: '12px'
        }}>
          <span>点击展开地图</span>
          <span style={{ 
            fontSize: '16px',
            transition: 'transform 0.3s',
            transform: 'rotate(-90deg)'  // 收起时箭头向下
          }}>▼</span>
        </div>
      </div>
    );
  }
  
  // 展开状态：显示完整地图
  return (
    <div style={{
      height: '160px',
      background: 'linear-gradient(180deg, #0f0f1e 0%, #1a1a2e 100%)',
      borderBottom: '2px solid #e94560',
      position: 'relative',
      overflow: 'hidden',
      padding: '15px',
      transition: 'all 0.3s ease-in-out',
      animation: 'slideDown 0.3s ease-out'
    }}>
      {/* 标题栏 + 收起按钮 */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: '10px'
      }}>
        <div style={{
          fontSize: '14px',
          color: '#888',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ fontSize: '16px' }}>🗺️</span>
          <span>当前位置:</span>
          <span style={{ 
            color: '#ffd700', 
            fontWeight: 'bold',
            fontSize: '15px'
          }}>
            {currentNode?.name}
          </span>
        </div>
        
       
      </div>
      
      {/* 地图画布区域 - 稍微缩小节省空间 */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '110px',
        opacity: isExpanded ? 1 : 0,
        transition: 'opacity 0.2s'
      }}>
        {/* 连接线 - 简化显示，只显示当前节点相关的 */}
        {nodes.map(node => 
          node.connectedTo.map(targetId => {
            const target = nodes.find(n => n.id === targetId);
            if (!target) return null;
            
            // 只显示与当前节点相连的线条，减少视觉混乱
            const isRelevant = node.id === currentNodeId || targetId === currentNodeId;
            if (!isRelevant && !visitedNodes.includes(node.id)) return null;
            
            const start = getNodePosition(node.x, node.y);
            const end = getNodePosition(target.x, target.y);
            
            const x1 = parseInt(start.left);
            const y1 = parseInt(start.top);
            const x2 = parseInt(end.left);
            const y2 = parseInt(end.top);
            
            const length = Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));
            const angle = Math.atan2(y2-y1, x2-x1) * 180 / Math.PI;
            
            const isPathActive = visitedNodes.includes(node.id) && visitedNodes.includes(targetId);
            const isCurrentPath = (node.id === currentNodeId && targetId) || (targetId === currentNodeId && node.id);
            
            return (
              <div
                key={`${node.id}-${targetId}`}
                style={{
                  position: 'absolute',
                  left: start.left,
                  top: start.top,
                  width: `${length}px`,
                  height: isCurrentPath ? '3px' : '2px',
                  background: isCurrentPath ? 'rgba(233, 69, 96, 0.8)' : 
                             isPathActive ? 'rgba(233, 69, 96, 0.3)' : 'rgba(255,255,255,0.05)',
                  transform: `rotate(${angle}deg)`,
                  transformOrigin: '0 50%',
                  zIndex: 1,
                  boxShadow: isCurrentPath ? '0 0 8px rgba(233,69,96,0.5)' : 'none',
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
          
          // 收起时隐藏非关键节点？不，展开时全显示，但非相关节点淡化
          const isRelevant = isCurrent || isNext || node.connectedTo.includes(currentNodeId || '');
          
          return (
            <div
              key={node.id}
              onClick={() => {
                // 只有相邻节点才能点击移动？或者只是查看信息
                if (isNext && node.id !== currentNodeId) {
                  // 可以在这里添加点击移动逻辑
                }
              }}
              style={{
                position: 'absolute',
                ...getNodePosition(node.x, node.y),
                width: isCurrent ? '45px' : '35px',
                height: isCurrent ? '45px' : '35px',
                borderRadius: '50%',
                background: isCurrent ? '#e94560' : 
                           isVisited ? '#2a2a4a' : '#151520',
                border: `3px solid ${isCurrent ? '#ffd700' : 
                         isNext ? '#e94560' : 
                         isVisited ? '#444' : '#222'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: isCurrent ? 10 : 2,
                transform: 'translate(-50%, -50%) scale(' + (isCurrent ? 1.1 : isRelevant ? 1 : 0.8) + ')',
                boxShadow: isCurrent ? '0 0 20px #e94560, 0 0 40px rgba(233,69,96,0.3)' : 'none',
                transition: 'all 0.3s ease',
                cursor: isNext ? 'pointer' : 'default',
                opacity: isRelevant ? 1 : 0.3
              }}
              title={node.name}
            >
              <span style={{ 
                fontSize: isCurrent ? '22px' : '16px',
                filter: isCurrent ? 'drop-shadow(0 0 5px rgba(0,0,0,0.5))' : 'none'
              }}>
                {node.type === 'start' && '🚪'}
                {node.type === 'combat' && '⚔️'}
                {node.type === 'event' && '❓'}
                {node.type === 'boss' && '👹'}
                {node.type === 'safe' && '🏕️'}
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
        
        {/* 节点标签 - 只显示当前节点和相邻节点，避免拥挤 */}
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
                transform: 'translate(-50%, 25px)',
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
      
      {/* 收起提示 - 点击空白处也能收起 */}
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