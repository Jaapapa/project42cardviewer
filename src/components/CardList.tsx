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
  return (
    <div className="card-list-container">
      <div className="card-list-header">
        <h1>Project 42 Card Viewer</h1>
        <button className="print-btn" onClick={onPrintView}>
          Print View (9 per A4)
        </button>
      </div>
      <div className="card-grid">
        {cards.map((card) => (
          <div
            key={card.id}
            className="card-list-item"
            onClick={() => onSelectCard(card)}
          >
            <div className="card-name">{card.name}</div>
            <div className="card-group">{card.group}</div>
          </div>
        ))}
      </div>
      {cards.length === 0 && (
        <div className="no-cards">No cards yet. Add some cards to get started!</div>
      )}
    </div>
  );
};
