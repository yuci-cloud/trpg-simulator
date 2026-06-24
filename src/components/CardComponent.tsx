import React from 'react';
import type { Card } from '../data/cards';

interface CardComponentProps {
  card: Card;
  index: number;
  canPlay: boolean;
  onPlay: (index: number) => void;
  isSelected?: boolean;
}

export const CardComponent: React.FC<CardComponentProps> = ({ card, index, canPlay, onPlay, isSelected }) => {
  const getCardColor = () => {
    switch (card.type) {
      case 'attack': return '#8b0000';
      case 'skill': return '#2d5a3d';
      case 'power': return '#4a3a5a';
      default: return '#333';
    }
  };

  const getCardIcon = () => {
    switch (card.type) {
      case 'attack': return '⚔️';
      case 'skill': return '🛡️';
      case 'power': return '✨';
      default: return '📜';
    }
  };

  const getRarityColor = () => {
    switch (card.rarity) {
      case 'common': return '#8a8a8a';
      case 'uncommon': return '#4a90e2';
      case 'rare': return '#c9a961';
      case 'starter': return '#666';
      default: return '#666';
    }
  };

  return (
    <div
      onClick={() => canPlay && onPlay(index)}
      style={{
        width: '140px',
        height: '200px',
        background: `linear-gradient(135deg, ${getCardColor()} 0%, #14161f 100%)`,
        border: `2px solid ${isSelected ? '#ffd700' : canPlay ? getRarityColor() : '#444'}`,
        borderRadius: '12px',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        cursor: canPlay ? 'pointer' : 'not-allowed',
        opacity: canPlay ? 1 : 0.5,
        transition: 'all 0.2s',
        position: 'relative',
        boxShadow: isSelected
          ? '0 0 20px rgba(255,215,0,0.5)'
          : canPlay
          ? '0 4px 12px rgba(0,0,0,0.5)'
          : 'none',
        transform: isSelected ? 'translateY(-10px) scale(1.05)' : 'none'
      }}
      onMouseEnter={(e) => {
        if (canPlay) {
          e.currentTarget.style.transform = 'translateY(-10px) scale(1.05)';
          e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.7)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = canPlay ? '0 4px 12px rgba(0,0,0,0.5)' : 'none';
        }
      }}
    >
      {/* 能量消耗 */}
      <div style={{
        position: 'absolute',
        top: '-5px',
        left: '-5px',
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        background: canPlay ? 'linear-gradient(135deg, #4a90e2, #2d5a8a)' : '#333',
        border: '2px solid #0a0a15',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
      }}>
        {card.cost}
      </div>

      {/* 卡牌名称 */}
      <div style={{
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: '8px',
        textShadow: '0 1px 3px rgba(0,0,0,0.8)'
      }}>
        {card.name}
      </div>

      {/* 卡牌图标区域 */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '48px',
        opacity: 0.8
      }}>
        {getCardIcon()}
      </div>

      {/* 卡牌描述 */}
      <div style={{
        fontSize: '11px',
        color: '#d4d4d4',
        textAlign: 'center',
        lineHeight: '1.4',
        minHeight: '40px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        paddingTop: '8px'
      }}>
        {card.description}
      </div>

      {/* 理智消耗警告 */}
      {card.sanityCost && (
        <div style={{
          position: 'absolute',
          bottom: '-5px',
          right: '-5px',
          padding: '4px 8px',
          background: '#6a4c93',
          borderRadius: '8px',
          fontSize: '10px',
          fontWeight: 'bold',
          color: '#fff',
          border: '1px solid #0a0a15',
          boxShadow: '0 2px 8px rgba(106,76,147,0.5)'
        }}>
          -{card.sanityCost} SAN
        </div>
      )}

      {/* 稀有度指示 */}
      {card.rarity !== 'starter' && (
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: getRarityColor(),
          boxShadow: `0 0 8px ${getRarityColor()}`
        }} />
      )}
    </div>
  );
};
