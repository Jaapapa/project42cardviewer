import { useRef, useState } from 'react';
import { Card } from '../types/Card';
import '../styles/CardList.css';

interface CardListProps {
  cards: Card[];
  onSelectCard: (card: Card) => void;
  onPrintView: () => void;
  onImport?: (cards: Card[]) => void;
  onUpdateCard?: (id: string, updatedCard: Partial<Card>) => void;
}

export const CardList: React.FC<CardListProps> = ({
  cards,
  onSelectCard,
  onPrintView,
  onImport,
  onUpdateCard,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hoveredStatCell, setHoveredStatCell] = useState<string | null>(null);

  const statLabels = [
    'Analyseren',
    'Ontwerpen',
    'Integratie',
    'Samenwerken',
    'Realiseren',
    'Testen',
    'Verantwoording',
    'Zelfontwikkeling',
  ];

  const statKeys: (keyof Card['stats'])[] = [
    'analyseren',
    'ontwerpen',
    'integratie',
    'samenwerken',
    'realiseren',
    'testen',
    'verantwoording',
    'zelfontwikkeling',
  ];

  const handleExport = () => {
    const dataStr = JSON.stringify(cards, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `project42-cards-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedCards = JSON.parse(e.target?.result as string);
        if (Array.isArray(importedCards) && importedCards.length > 0) {
          onImport?.(importedCards);
          alert(`Successfully imported ${importedCards.length} cards!`);
        } else {
          alert('Invalid file format. Please ensure it contains an array of cards.');
        }
      } catch (error) {
        alert('Error reading file. Please ensure it is valid JSON.');
        console.error('Import error:', error);
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleStatChange = (cardId: string, statKey: keyof Card['stats'], delta: number) => {
    const card = cards.find((c) => c.id === cardId);
    if (!card || !onUpdateCard) return;

    const currentValue = card.stats[statKey];
    const newValue = Math.max(1, Math.min(10, currentValue + delta));

    if (newValue !== currentValue) {
      onUpdateCard(cardId, {
        stats: {
          ...card.stats,
          [statKey]: newValue,
        },
      });
    }
  };

  return (
    <div className="card-list-container">
      <div className="card-list-header">
        <h1>Project 42 Card Viewer</h1>
        <div className="card-list-buttons">
          <button className="action-btn" onClick={handleExport}>
            Export JSON
          </button>
          <button className="action-btn" onClick={handleImportClick}>
            Import JSON
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            style={{ display: 'none' }}
          />
          <button className="print-btn" onClick={onPrintView}>
            Print View (9 per A4)
          </button>
        </div>
      </div>

      {cards.length === 0 && (
        <div className="no-cards">No cards yet. Add some cards to get started!</div>
      )}

      {cards.length > 0 && (
        <div className="card-table-wrapper">
          <table className="card-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Group</th>
                {statLabels.map((label) => (
                  <th key={label} title={label}>
                    {label.substring(0, 3)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cards.map((card) => (
                <tr
                  key={card.id}
                  className="card-row"
                  onClick={() => onSelectCard(card)}
                >
                  <td className="card-name-cell">{card.name}</td>
                  <td className="card-group-cell">{card.group}</td>
                  {statKeys.map((key) => {
                    const cellId = `${card.id}-${key}`;
                    const isHovered = hoveredStatCell === cellId;
                    return (
                      <td
                        key={key}
                        className="card-stat-cell"
                        onMouseEnter={() => setHoveredStatCell(cellId)}
                        onMouseLeave={() => setHoveredStatCell(null)}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="stat-value-container">
                          <span>{card.stats[key]}</span>
                          {isHovered && onUpdateCard && (
                            <div className="stat-controls">
                              <button
                                className="stat-btn stat-decrement"
                                onClick={() => handleStatChange(card.id, key, -1)}
                                title="Decrease"
                              >
                                −
                              </button>
                              <button
                                className="stat-btn stat-increment"
                                onClick={() => handleStatChange(card.id, key, 1)}
                                title="Increase"
                              >
                                +
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
