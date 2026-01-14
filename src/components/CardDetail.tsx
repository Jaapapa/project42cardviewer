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
        ✕ Close
      </button>
      <pre className="card-display">
        <div className="card-border">
          <div className="card-border-top">
            ┌─────────────────────────────────┐
          </div>
          <div className="card-header">
            │ {card.name.padEnd(14)} │ {card.group.padEnd(8)} │
          </div>
          <div className="card-border-mid">
            ├─────────────────────────────────┤
          </div>

          <div className="card-image-space">
            │     [Graphic]                   │
          </div>

          <div className="card-border-mid">
            ├─────────────────────────────────┤
          </div>

          {statsList.map(({ label, key }) => {
            const value = card.stats[key];
            return (
              <div key={key} className="stat-row">
                │ {label.substring(0, 11).padEnd(11)} <StatBar value={value} /> {value}/10 │
              </div>
            );
          })}

          <div className="card-border-mid">
            ├─────────────────────────────────┤
          </div>

          <div className="flavor-text">
            │ "{card.flavorText.substring(0, 28)}"│
          </div>

          <div className="card-border-bottom">
            └─────────────────────────────────┘
          </div>
        </div>
      </pre>
    </div>
  );
};
