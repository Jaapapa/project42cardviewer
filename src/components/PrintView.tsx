import { Card } from '../types/Card';
import '../styles/PrintView.css';

interface PrintViewProps {
  cards: Card[];
  onBack: () => void;
}

interface PrintCardProps {
  card: Card;
}

const PrintCard: React.FC<PrintCardProps> = ({ card }) => {
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

  const StatBar = (value: number) => {
    const filled = Math.min(value, 10);
    const empty = 10 - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
  };

  return (
    <div className="print-card">
      <pre className="print-card-content">
        {`┌─────────────────────────────────────┐
│ ${card.name.substring(0, 18).padEnd(18)} │ ${card.group.substring(0, 14).padEnd(14)} │
├─────────────────────────────────────┤
│                                     │
│     [Space for Graphic/Image]       │
│                                     │
├─────────────────────────────────────┤
${statsList.map(({ label, key }) => `│ ${label.padEnd(15)} ${StatBar(card.stats[key])} ${card.stats[key]}/10       │`).join('\n')}
├─────────────────────────────────────┤
│ "${card.flavorText.substring(0, 33).padEnd(33)}" │
└─────────────────────────────────────┘`}
      </pre>
    </div>
  );
};

export const PrintView: React.FC<PrintViewProps> = ({ cards, onBack }) => {
  // Get first 9 cards for printing
  const printCards = cards.slice(0, 9);

  return (
    <div className="print-view-container">
      <button className="back-btn" onClick={onBack}>
        ← Back
      </button>
      <div className="print-grid">
        {printCards.map((card) => (
          <PrintCard key={card.id} card={card} />
        ))}
      </div>
      <p className="print-hint">Use Ctrl+P (Cmd+P on Mac) to print this page.</p>
    </div>
  );
};
