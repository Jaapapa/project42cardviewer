import { Card } from '../types/Card';
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

export const CardDetail: React.FC<CardDetailProps> = ({ card, onBack }) => {
  const statsList = [
    { label: 'Analyseren', key: 'analyseren' as const },
    { label: 'Ontwerpen', key: 'ontwerpen' as const },
    { label: 'Integratie', key: 'integratie' as const },
    { label: 'Samenwerken', key: 'samenwerken' as const },
    { label: 'Realiseren', key: 'realiseren' as const },
    { label: 'Testen', key: 'testen' as const },
    { label: 'Verantwoording', key: 'verantwoording' as const },
    { label: 'Zelfontwikkeling', key: 'zelfontwikkeling' as const },
  ];

  return (
    <div className="card-detail-container">
      <button className="back-btn" onClick={onBack}>
        ← Back to List
      </button>
      <pre className="card-display">
        <div className="card-border">
          <div className="card-border-top">
            ┌─────────────────────────────────────┐
          </div>
          <div className="card-header">
            │ {card.name.padEnd(18)} | {card.group.padEnd(14)} │
          </div>
          <div className="card-border-mid">
            ├─────────────────────────────────────┤
          </div>

          <div className="card-image-space">
            │                                     │
          </div>
          <div className="card-image-space">
            │     [Space for Graphic/Image]       │
          </div>
          <div className="card-image-space">
            │                                     │
          </div>

          <div className="card-border-mid">
            ├─────────────────────────────────────┤
          </div>

          {statsList.map(({ label, key }) => {
            const value = card.stats[key];
            return (
              <div key={key} className="stat-row">
                │ {label.padEnd(15)} <StatBar value={value} /> {value}/10       │
              </div>
            );
          })}

          <div className="card-border-mid">
            ├─────────────────────────────────────┤
          </div>

          <div className="flavor-text">
            │ "{card.flavorText}"                 │
          </div>

          <div className="card-border-bottom">
            └─────────────────────────────────────┘
          </div>
        </div>
      </pre>
    </div>
  );
};
