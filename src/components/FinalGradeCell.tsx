interface FinalGradeCellProps {
  cardId: string;
  finalGrade: number;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onDecrement: (cardId: string) => void;
  onIncrement: (cardId: string) => void;
  canUpdate: boolean;
}

export const FinalGradeCell: React.FC<FinalGradeCellProps> = ({
  cardId,
  finalGrade,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onDecrement,
  onIncrement,
  canUpdate,
}) => {
  return (
    <td
      className="card-final-grade-cell"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={(e) => {
        if (isHovered) {
          e.stopPropagation();
        }
      }}
    >
      <div className="stat-value-container">
        <span>{finalGrade}</span>
        {isHovered && canUpdate && (
          <div className="stat-controls">
            <button
              className="stat-btn stat-decrement"
              onClick={(e) => {
                e.stopPropagation();
                onDecrement(cardId);
              }}
              title="Decrease"
            >
              −
            </button>
            <button
              className="stat-btn stat-increment"
              onClick={(e) => {
                e.stopPropagation();
                onIncrement(cardId);
              }}
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
