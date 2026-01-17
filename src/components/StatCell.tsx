import { Card, Stat } from '../types/Card';

interface StatCellProps {
  cardId: string;
  statKey: keyof Card['stats'];
  statValue: Stat;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onStatChange: (cardId: string, statKey: keyof Card['stats'], delta: number) => void;
  onWeightChange?: (cardId: string, statKey: keyof Card['stats'], delta: number) => void;
  canUpdate: boolean;
}

export const StatCell: React.FC<StatCellProps> = ({
  cardId,
  statKey,
  statValue,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onStatChange,
  onWeightChange,
  canUpdate,
}) => {
  return (
    <td
      className="card-stat-cell"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="stat-value-container">
        <span>{statValue.value}</span>
        {isHovered && canUpdate && (
          <div className="stat-controls">
            <button
              className="stat-btn stat-decrement"
              onClick={() => onStatChange(cardId, statKey, -1)}
              title="Decrease value"
            >
              −
            </button>
            <button
              className="stat-btn stat-increment"
              onClick={() => onStatChange(cardId, statKey, 1)}
              title="Increase value"
            >
              +
            </button>
          </div>
        )}
        {isHovered && canUpdate && onWeightChange && (
          <div className="weight-controls">
            <button
              className="weight-btn weight-decrement"
              onClick={() => onWeightChange(cardId, statKey, -1)}
              title="Decrease weight"
            >
              *▼
            </button>
            <button
              className="weight-btn weight-increment"
              onClick={() => onWeightChange(cardId, statKey, 1)}
              title="Increase weight"
            >
              *▲
            </button>
          </div>
        )}
      </div>
    </td>
  );
};
