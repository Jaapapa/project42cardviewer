import { Card } from '../types/Card';
import { useState } from 'react';
import '../styles/CardDetail.css';

interface CardDetailProps {
  card: Card;
  onBack: () => void;
}

const StatBar: React.FC<{ value: number }> = ({ value }) => {
  const filled = Math.min(value, 10);
  const empty = 10 - filled;
  return (
    <>
      {'█'.repeat(filled)}
      {'░'.repeat(empty)}
    </>
  );
};

const wrapText = (text: string, width: number): string[] => {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  words.forEach((word) => {
    if ((currentLine + word).length <= width) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      if (currentLine) lines.push(currentLine.substring(0, width));
      currentLine = word;
    }
  });
  if (currentLine) lines.push(currentLine.substring(0, width));
  return lines;
};

export const CardDetail: React.FC<CardDetailProps> = ({ card, onBack }) => {
  const [hoveredStat, setHoveredStat] = useState<string | null>(null);

  const statsList = [
    { label: 'Analyseren', key: 'analyseren' as const },
    { label: 'Ontwerpen', key: 'ontwerpen' as const },
    { label: 'Integratie', key: 'integratie' as const },
    { label: 'Realiseren', key: 'realiseren' as const },
    { label: 'Testen', key: 'testen' as const },
    { label: 'Samenwerken', key: 'samenwerken' as const },
    { label: 'Verantwoording', key: 'verantwoording' as const },
    { label: 'Zelfontwikkeling', key: 'zelfontwikkeling' as const },
  ];

  const flavorLines = wrapText(card.flavorText, 32);
  const paddedFlavorLines = flavorLines.slice(0, 5).map((line) => line.padEnd(34));

  return (
    <div className="card-detail-container">
      <button className="back-btn" onClick={onBack}>
        ✕ Close
      </button>
      <pre className="card-display">
        <div className="card-border">
          <div className="card-border-top">
            ┌────────────────────────────────────┐
          </div>
          <div className="card-header">
            │ {card.name.substring(0, 20).padEnd(26)} │ {card.group.substring(0, 5).padEnd(5)} │
          </div>
          <div className="card-border-mid">
            ├────────────────────────────────────┤
          </div>

          {statsList.map(({ label, key }) => {
            const stat = card.stats[key];
            const weightStars = '*'.repeat(Math.max(0, stat.weight - 1));
            return (
              <div key={key} className="stat-row">
                │ {label.substring(0, 13).padEnd(13)} <StatBar value={stat.value}/> {String(stat.value).padStart(2)}/10 {weightStars.padEnd(3)} │
              </div>
            );
          })}

          <div className="card-border-mid">
            ├────────────────────────────────────┤
          </div>

          {paddedFlavorLines.map((line, idx) => (
            <div key={`flavor-${idx}`} className="flavor-row">
              │ <span className="flavor-text">{line}</span> │
            </div>
          ))}

          <div className="card-border-mid">
            ├────────────────────────────────────┤
          </div>

          <div className="card-final-grade-display">
            │ FINAL GRADE: {String(card.finalGrade).padEnd(21)} │
          </div>

          <div className="card-border-bottom">
            └────────────────────────────────────┘
          </div>
        </div>
      </pre>
    </div>
  );
};
