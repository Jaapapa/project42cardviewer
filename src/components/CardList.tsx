import { useRef, useState } from 'react';
import { Card } from '../types/Card';
import { StatCell } from './StatCell';
import { NameCell } from './NameCell';
import { GroupCell } from './GroupCell';
import { FinalGradeCell } from './FinalGradeCell';
import '../styles/CardList.css';

interface CardListProps {
  cards: Card[];
  onSelectCard: (card: Card) => void;
  onPrintView: () => void;
  onImport?: (cards: Card[]) => void;
  onUpdateCard?: (id: string, updatedCard: Partial<Card>) => void;
  onAddCard?: (card: Card) => void;
}

export const CardList: React.FC<CardListProps> = ({
  cards,
  onSelectCard,
  onPrintView,
  onImport,
  onUpdateCard,
  onAddCard,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hoveredStatCell, setHoveredStatCell] = useState<string | null>(null);
  const [editingNameId, setEditingNameId] = useState<string | null>(null);
  const [editingNameValue, setEditingNameValue] = useState<string>('');
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingGroupValue, setEditingGroupValue] = useState<string>('');

  const statLabels = [
    'Analyseren',
    'Ontwerpen',
    'Integratie',
    'Samenwerken',
    'Realiseren',
    'Testen',
    'Verantwoording',
    'Zelfontwikkeling',
    'Final grade',
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

  const handleAddCard = () => {
    if (!onAddCard) return;

    const newCard: Card = {
      id: `card-${Date.now()}`,
      name: 'New Card',
      group: 'A',
      stats: {
        analyseren: 7,
        ontwerpen: 7,
        integratie: 7,
        samenwerken: 7,
        realiseren: 7,
        testen: 7,
        verantwoording: 7,
        zelfontwikkeling: 7,
      },
      finalGrade: 7,
      flavorText: 'Add your card description here.',
    };

    onAddCard(newCard);
  };

  const handleNameEditStart = (cardId: string, currentName: string) => {
    setEditingNameId(cardId);
    setEditingNameValue(currentName);
  };

  const handleNameEditSave = (cardId: string) => {
    if (editingNameValue.trim() && onUpdateCard) {
      onUpdateCard(cardId, { name: editingNameValue });
    }
    setEditingNameId(null);
    setEditingNameValue('');
  };

  const handleNameEditCancel = () => {
    setEditingNameId(null);
    setEditingNameValue('');
  };

  const handleGroupEditStart = (cardId: string, currentGroup: string) => {
    setEditingGroupId(cardId);
    setEditingGroupValue(currentGroup);
  };

  const handleGroupEditSave = (cardId: string) => {
    if (editingGroupValue.trim() && onUpdateCard) {
      onUpdateCard(cardId, { group: editingGroupValue });
    }
    setEditingGroupId(null);
    setEditingGroupValue('');
  };

  const handleGroupEditCancel = () => {
    setEditingGroupId(null);
    setEditingGroupValue('');
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
                  <NameCell
                    cardId={card.id}
                    name={card.name}
                    isEditing={editingNameId === card.id}
                    editingValue={editingNameValue}
                    isHovered={hoveredStatCell === `name-${card.id}`}
                    onMouseEnter={() => {
                      if (editingNameId !== card.id) {
                        setHoveredStatCell(`name-${card.id}`);
                      }
                    }}
                    onMouseLeave={() => setHoveredStatCell(null)}
                    onEditStart={handleNameEditStart}
                    onEditChange={setEditingNameValue}
                    onEditSave={handleNameEditSave}
                    onEditCancel={handleNameEditCancel}
                    canUpdate={!!onUpdateCard}
                  />
                  <GroupCell
                    cardId={card.id}
                    group={card.group}
                    isEditing={editingGroupId === card.id}
                    editingValue={editingGroupValue}
                    isHovered={hoveredStatCell === `group-${card.id}`}
                    onMouseEnter={() => {
                      if (editingGroupId !== card.id) {
                        setHoveredStatCell(`group-${card.id}`);
                      }
                    }}
                    onMouseLeave={() => setHoveredStatCell(null)}
                    onEditStart={handleGroupEditStart}
                    onEditChange={setEditingGroupValue}
                    onEditSave={handleGroupEditSave}
                    onEditCancel={handleGroupEditCancel}
                    canUpdate={!!onUpdateCard}
                  />
                  {statKeys.map((key) => {
                    const cellId = `${card.id}-${key}`;
                    const isHovered = hoveredStatCell === cellId;
                    return (
                      <StatCell
                        key={key}
                        cardId={card.id}
                        statKey={key}
                        statValue={card.stats[key]}
                        isHovered={isHovered}
                        onMouseEnter={() => setHoveredStatCell(cellId)}
                        onMouseLeave={() => setHoveredStatCell(null)}
                        onStatChange={handleStatChange}
                        canUpdate={!!onUpdateCard}
                      />
                    );
                  })}
                  <FinalGradeCell
                    cardId={card.id}
                    finalGrade={card.finalGrade}
                    isHovered={hoveredStatCell === `finalGrade-${card.id}`}
                    onMouseEnter={() => setHoveredStatCell(`finalGrade-${card.id}`)}
                    onMouseLeave={() => setHoveredStatCell(null)}
                    onDecrement={(cardId) => {
                      onUpdateCard?.(cardId, {
                        finalGrade: Math.max(1, card.finalGrade - 1),
                      });
                    }}
                    onIncrement={(cardId) => {
                      onUpdateCard?.(cardId, {
                        finalGrade: Math.min(10, card.finalGrade + 1),
                      });
                    }}
                    canUpdate={!!onUpdateCard}
                  />
                </tr>
              ))}
            </tbody>
          </table>
          {onAddCard && (
            <button className="add-card-btn" onClick={handleAddCard}>
              + Add New Card
            </button>
          )}
        </div>
      )}
    </div>
  );
};
