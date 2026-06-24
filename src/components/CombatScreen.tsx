import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { useCombatStore } from '../store/combatStore';
import { CardComponent } from './CardComponent';
import { EnemyDisplay } from './EnemyDisplay';

export const CombatScreen: React.FC = () => {
  const { player, currentEnemies, endCombat } = useGameStore();
  const {
    isActive,
    player: combatPlayer,
    enemies,
    hand,
    deck,
    discardPile,
    turn,
    isPlayerTurn,
    startCombat,
    playCard,
    endTurn
  } = useCombatStore();

  const [selectedTarget, setSelectedTarget] = useState(0);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  // 初始化战斗
  useEffect(() => {
    if (currentEnemies.length > 0 && !isActive) {
      console.log('初始化战斗，敌人数量:', currentEnemies.length);
      console.log('玩家当前HP:', player.hp);
      startCombat(player.hp, player.maxHp, currentEnemies, player.deck);
    }
  }, [currentEnemies, isActive]);

  // 监听战斗结束
  useEffect(() => {
    if (!isActive && currentEnemies.length > 0 && enemies.length > 0) {
      // 战斗结束
      const allEnemiesDead = enemies.every(e => e.hp <= 0);

      if (allEnemiesDead) {
        // 胜利 - 更新gameStore中的玩家血量
        const { updatePlayerStats } = useGameStore.getState();
        updatePlayerStats({ hp: combatPlayer.hp });

        const goldReward = 20 + Math.floor(Math.random() * 30);
        endCombat(true, { gold: goldReward });
      } else if (combatPlayer.hp <= 0) {
        // 失败
        const { updatePlayerStats } = useGameStore.getState();
        updatePlayerStats({ hp: 0 });
        endCombat(false);
      }
    }
  }, [isActive, enemies]);

  const handlePlayCard = (cardIndex: number) => {
    if (!isPlayerTurn) return;

    const card = hand[cardIndex];
    if (!card || card.cost > combatPlayer.energy) return;

    setSelectedCard(cardIndex);

    // 如果是攻击牌，需要选择目标
    if (card.type === 'attack') {
      // 找到第一个活着的敌人作为默认目标
      const aliveEnemyIndex = enemies.findIndex(e => e.hp > 0);
      playCard(cardIndex, aliveEnemyIndex >= 0 ? aliveEnemyIndex : selectedTarget);
    } else {
      // 技能牌和能力牌直接施放
      playCard(cardIndex);
    }

    setSelectedCard(null);
  };

  const handleEndTurn = () => {
    if (!isPlayerTurn) return;
    endTurn();
  };

  if (!isActive) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        fontSize: '24px',
        color: '#888'
      }}>
        战斗初始化中...
      </div>
    );
  }

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #0a0a15 0%, #1a1a2a 100%)',
      overflow: 'hidden'
    }}>
      {/* 顶部：敌人区域 */}
      <div style={{
        flex: '0 0 300px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        padding: '20px',
        background: 'linear-gradient(180deg, #0f0f1e 0%, transparent 100%)',
        borderBottom: '2px solid rgba(139,0,0,0.3)'
      }}>
        {enemies.map((enemy, index) => (
          <EnemyDisplay
            key={enemy.id}
            enemy={enemy}
            index={index}
            isTargeted={selectedTarget === index}
            onSelect={setSelectedTarget}
          />
        ))}
      </div>

      {/* 中部：玩家状态栏 */}
      <div style={{
        flex: '0 0 80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px',
        background: 'rgba(22,33,62,0.5)',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        {/* 左侧：HP */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div>
            <div style={{
              fontSize: '14px',
              color: '#888',
              marginBottom: '4px'
            }}>
              ❤ 生命
            </div>
            <div style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: combatPlayer.hp < combatPlayer.maxHp * 0.3 ? '#ff4444' : '#e94560'
            }}>
              {combatPlayer.hp} / {combatPlayer.maxHp}
            </div>
          </div>

          {/* 格挡 */}
          {combatPlayer.block > 0 && (
            <div style={{
              padding: '8px 16px',
              background: 'rgba(45,90,61,0.5)',
              border: '2px solid #4ecca3',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '20px' }}>🛡️</span>
              <span style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#4ecca3'
              }}>
                {combatPlayer.block}
              </span>
            </div>
          )}
        </div>

        {/* 中间：回合和能量 */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{
            fontSize: '14px',
            color: '#ffd700',
            fontWeight: 'bold'
          }}>
            回合 {turn}
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ fontSize: '18px' }}>⚡</span>
            <span style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#4a90e2'
            }}>
              {combatPlayer.energy} / {combatPlayer.maxEnergy}
            </span>
          </div>
        </div>

        {/* 右侧：Buffs */}
        <div style={{
          display: 'flex',
          gap: '8px'
        }}>
          {combatPlayer.powers.map((power, i) => (
            <div
              key={i}
              style={{
                padding: '8px 12px',
                background: 'rgba(74,58,90,0.5)',
                border: '1px solid #6a4c93',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: '60px'
              }}
            >
              <div style={{ fontSize: '14px', color: '#c9a961' }}>
                {power.name}
              </div>
              <div style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#ffd700'
              }}>
                {power.amount}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 底部：手牌区域 */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        background: 'linear-gradient(0deg, #0f0f1e 0%, transparent 100%)'
      }}>
        {/* 手牌 */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          flexWrap: 'wrap',
          padding: '20px 0'
        }}>
          {hand.length === 0 ? (
            <div style={{ color: '#666', fontSize: '16px' }}>
              手牌已耗尽
            </div>
          ) : (
            hand.map((card, index) => (
              <CardComponent
                key={`${card.id}_${index}`}
                card={card}
                index={index}
                canPlay={isPlayerTurn && card.cost <= combatPlayer.energy}
                onPlay={handlePlayCard}
                isSelected={selectedCard === index}
              />
            ))
          )}
        </div>

        {/* 控制栏 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '15px 20px',
          background: 'rgba(22,33,62,0.5)',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          {/* 牌堆信息 */}
          <div style={{
            display: 'flex',
            gap: '20px',
            fontSize: '14px',
            color: '#888'
          }}>
            <div>
              <span style={{ color: '#4a90e2' }}>📚 抽牌堆</span>{' '}
              <span style={{ color: '#fff', fontWeight: 'bold' }}>{deck.length}</span>
            </div>
            <div>
              <span style={{ color: '#8b0000' }}>🗑️ 弃牌堆</span>{' '}
              <span style={{ color: '#fff', fontWeight: 'bold' }}>{discardPile.length}</span>
            </div>
          </div>

          {/* 结束回合按钮 */}
          <button
            onClick={handleEndTurn}
            disabled={!isPlayerTurn}
            style={{
              padding: '12px 40px',
              background: isPlayerTurn
                ? 'linear-gradient(90deg, #8b0000, #e94560)'
                : '#333',
              border: isPlayerTurn ? '2px solid #ffd700' : '2px solid #444',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: isPlayerTurn ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s',
              boxShadow: isPlayerTurn ? '0 4px 15px rgba(233,69,96,0.5)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (isPlayerTurn) {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(233,69,96,0.7)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = isPlayerTurn ? '0 4px 15px rgba(233,69,96,0.5)' : 'none';
            }}
          >
            {isPlayerTurn ? '结束回合' : '敌人回合'}
          </button>
        </div>
      </div>
    </div>
  );
};
