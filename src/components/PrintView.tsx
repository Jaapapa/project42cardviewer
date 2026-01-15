import { Card } from '../types/Card';
import '../styles/PrintView.css';

interface PrintViewProps {
  cards: Card[];
  onBack: () => void;
}

interface PrintCardProps {
  card: Card;
}

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

  const flavorLines = wrapText(card.flavorText, 28);
  const paddedFlavorLines = flavorLines.slice(0, 3).map((line) => line.padEnd(28));

  const cardContent = `┌──────────────────────────────┐
│ ${card.name.substring(0, 20).padEnd(20)} │ ${card.group.substring(0, 5).padEnd(5)} │
├──────────────────────────────┤
${statsList.map(({ label, key }) => `│ ${label.substring(0, 9).padEnd(9)}  ${StatBar(card.stats[key])}  ${String(card.stats[key]).padStart(2)}/10 │`).join('\n')}
├──────────────────────────────┤
${paddedFlavorLines.map((line) => `│ ${line} │`).join('\n')}
├──────────────────────────────┤
${`│ FINAL GRADE: ${String(card.finalGrade).padStart(2)} `.padEnd(31)}│
└──────────────────────────────┘`;

  return (
    <div className="print-card">
      <pre className="print-card-content">{cardContent}</pre>
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
