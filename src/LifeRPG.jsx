import React, { useState } from 'react';
import silhouette from './assets/silhouette.png';
import './index.css';

export default function LifeRPG() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [player, setPlayer] = useState({
    level: 1,
    xp: 0,
    gold: 0,
    inventory: [],
    stats: { strength: 5, intelligence: 5, luck: 5 },
    equipment: {
      투구: null,
      갑옷: null,
      무기: null,
      방패: null,
      장갑: null,
      부츠: null,
      반지: null,
      망토: null,
      벨트: null,
      장신구: null
    }
  });

  const parts = Object.keys(player.equipment);
  const rarities = ['하급', '중급', '상급', '희귀', '전설'];
  const weights = [50, 30, 15, 4, 1];

  const generateRandomItem = () => {
    const part = parts[Math.floor(Math.random() * parts.length)];
    const sum = weights.reduce((a, b) => a + b, 0);
    const rand = Math.random() * sum;
    let acc = 0;
    let rarity = rarities[0];
    for (let i = 0; i < rarities.length; i++) {
      acc += weights[i];
      if (rand < acc) {
        rarity = rarities[i];
        break;
      }
    }
    return { part, rarity, name: `${rarity} ${part}` };
  };

  const handleAddTask = () => {
    if (!taskInput.trim()) return;
    setTasks([...tasks, { id: Date.now(), description: taskInput, completed: false }]);
    setPlayer(prev => ({ ...prev, xp: prev.xp + 10, gold: prev.gold + 5 }));
    setTaskInput('');
  };

  const handleComplete = id => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: true } : t));
    const item = generateRandomItem();
    setPlayer(prev => ({
      ...prev,
      inventory: [...prev.inventory, item]
    }));
  };

  const handleEquip = item => {
    setPlayer(prev => ({
      ...prev,
      equipment: { ...prev.equipment, [item.part]: item.name },
      inventory: prev.inventory.filter(i => i.name !== item.name)
    }));
  };

  const handleSell = item => {
    setPlayer(prev => ({
      ...prev,
      gold: prev.gold + 10,
      inventory: prev.inventory.filter(i => i.name !== item.name)
    }));
  };

  const handleRest = type => {
    if (player.gold >= 30) {
      alert(`${type} 30분 사용!`);
      setPlayer(prev => ({ ...prev, gold: prev.gold - 30 }));
    } else {
      alert('골드 부족');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: '1rem', background: '#fff', borderRadius: '8px' }}>
      <h1>LR</h1>
      <p>레벨: {player.level} | XP: {player.xp} | 골드: {player.gold}</p>
      <div>
        <input
          value={taskInput}
          onChange={e => setTaskInput(e.target.value)}
          placeholder="할 일 입력"
        />
        <button onClick={handleAddTask}>추가</button>
      </div>
      <ul>
        {tasks.map(t => (
          <li key={t.id} style={{ margin: '0.5rem 0' }}>
            {t.description}
            {t.completed ? (
              ' ✅'
            ) : (
              <button onClick={() => handleComplete(t.id)} style={{ marginLeft: 8 }}>
                완료
              </button>
            )}
          </li>
        ))}
      </ul>
      <h2>🎒 인벤토리</h2>
      <ul>
        {player.inventory.map((it, i) => (
          <li key={i} style={{ margin: '0.5rem 0' }}>
            {it.name}
            <button onClick={() => handleEquip(it)} style={{ marginLeft: 8 }}>장착</button>
            <button onClick={() => handleSell(it)} style={{ marginLeft: 8 }}>판매</button>
          </li>
        ))}
      </div>
      <h2>🧍 장비창</h2>
      <div style={{ position: 'relative', width: 300, height: 500, margin: '1rem auto' }}>
        <img
          src={silhouette}
          alt="실루엣"
          style={{ width: '100%', height: '100%', opacity: 0.2, position: 'absolute' }}
        />
        {parts.map(part => (
          <div
            key={part}
            style={{
              position: 'absolute',
              background: '#fff8',
              padding: 6,
              border: '1px solid #aaa',
              borderRadius: 6,
              textAlign: 'center',
              width: 50,
              ...slotPos[part]
            }}
          >
            {player.equipment[part] || part}
          </div>
        ))}
      </div>
      <h2>☕ 휴식</h2>
      <button onClick={() => handleRest('유튜브 시청')} style={{ marginRight: 8 }}>
        유튜브 30분 (30G)
      </button>
      <button onClick={() => handleRest('게임 플레이')}>게임 30분 (30G)</button>
    </div>
  );
}

const slotPos = {
  투구: { top: '2%', left: '50%', transform: 'translateX(-50%)' },
  갑옷: { top: '22%', left: '50%', transform: 'translateX(-50%)' },
  장갑: { top: '40%', left: '15%' },
  무기: { top: '40%', left: '75%' },
  방패: { top: '40%', left: '25%' },
  벨트: { top: '60%', left: '50%', transform: 'translateX(-50%)' },
  부츠: { top: '78%', left: '50%', transform: 'translateX(-50%)' },
  반지: { top: '55%', left: '15%' },
  장신구: { top: '12%', left: '75%' },
  망토: { top: '12%', left: '25%' }
};
