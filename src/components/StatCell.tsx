import { Card } from '../types/Card';

interface StatCellProps {
  cardId: string;
  statKey: keyof Card['stats'];
  statValue: number;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onStatChange: (cardId: string, statKey: keyof Card['stats'], delta: number) => void;
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
        <span>{statValue}</span>
        {isHovered && canUpdate && (
          <div className="stat-controls">
            <button
              className="stat-btn stat-decrement"
              onClick={() => onStatChange(cardId, statKey, -1)}
              title="Decrease"
            >
              −
            </button>
            <button
              className="stat-btn stat-increment"
              onClick={() => onStatChange(cardId, statKey, 1)}
              title="Increase"
            >
              +
            </button>
          </div>
        )}
      </div>
    </td>
  );
};
