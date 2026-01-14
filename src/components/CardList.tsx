import { Card } from '../types/Card';
import '../styles/CardList.css';

interface CardListProps {
  cards: Card[];
  onSelectCard: (card: Card) => void;
  onPrintView: () => void;
}

export const CardList: React.FC<CardListProps> = ({
  cards,
  onSelectCard,
  onPrintView,
}) => {
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

  return (
    <div className="card-list-container">
      <div className="card-list-header">
        <h1>Project 42 Card Viewer</h1>
        <button className="print-btn" onClick={onPrintView}>
          Print View (9 per A4)
        </button>
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
                  {statKeys.map((key) => (
                    <td key={key} className="card-stat-cell">
                      {card.stats[key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
