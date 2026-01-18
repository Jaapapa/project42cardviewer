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
    { label: 'Realiseren', key: 'realiseren' as const },
    { label: 'Testen', key: 'testen' as const },
    { label: 'Samenwerken', key: 'samenwerken' as const },
    { label: 'Verantwoording', key: 'verantwoording' as const },
    { label: 'Zelfontwikkeling', key: 'zelfontwikkeling' as const },
  ];

  const StatBar = (value: number) => {
    const filled = Math.min(value, 10);
    const empty = 10 - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
  };

  const flavorLines = wrapText(card.flavorText, 28);
  const paddedFlavorLines = Array(5)
    .fill('')
    .map((_, i) => (flavorLines[i] || '').padEnd(32));

  const cardContent = `┌──────────────────────────────────┐
│ ${card.name.substring(0, 24).padEnd(24)} │ ${card.group.substring(0, 5).padEnd(5)} │
├──────────────────────────────────┤
${statsList.map(({ label, key }) => {
    const stat = card.stats[key];
    const weightStars = '*'.repeat(Math.max(0, stat.weight - 1));
    return `│ ${label.substring(0, 15).padEnd(15)} ${StatBar(stat.value)} ${String(stat.value).padStart(2)} ${weightStars.padEnd(3)}│`;
  }).join('\n')}
├──────────────────────────────────┤
${paddedFlavorLines.map((line) => `│ ${line} │`).join('\n')}
├──────────────────────────────────┤
${`│ FINAL GRADE: ${String(card.finalGrade).padStart(2)} `.padEnd(35)}│
└──────────────────────────────────┘`;

  return (
    <div className="print-card">
      <pre className="print-card-content">{cardContent}</pre>
    </div>
  );
};

export const PrintView: React.FC<PrintViewProps> = ({ cards, onBack }) => {
  // Paginate cards: 9 cards per page
  const CARDS_PER_PAGE = 9;
  const pages = [];
  
  for (let i = 0; i < cards.length; i += CARDS_PER_PAGE) {
    pages.push(cards.slice(i, i + CARDS_PER_PAGE));
  }

  return (
    <div className="print-view-container">
      <button className="back-btn" onClick={onBack}>
        ← Back
      </button>
      
      <div className="print-instructions">
        <h2>Print Instructions</h2>
        <ol>
          <li>Press <strong>Ctrl+P</strong> (or <strong>Cmd+P</strong> on Mac) to open the print dialog</li>
          <li>In the print settings, set <strong>Scale</strong> to <strong>77%</strong> for optimal card sizing</li>
          <li>Set margins to <strong>None</strong> or <strong>Minimal</strong></li>
          <li>Select your paper size and printer, then print</li>
        </ol>
        <p className="note">Each page displays 9 cards (3×3 grid) on A4 size. Total pages: {pages.length}</p>
      </div>

      {pages.map((pageCards, pageIndex) => (
        <div key={pageIndex} className="print-page">
          <div className="print-grid">
            {pageCards.map((card) => (
              <PrintCard key={card.id} card={card} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
