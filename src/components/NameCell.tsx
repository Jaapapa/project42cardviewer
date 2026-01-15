interface NameCellProps {
  cardId: string;
  name: string;
  isEditing: boolean;
  editingValue: string;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onEditStart: (cardId: string, currentName: string) => void;
  onEditChange: (value: string) => void;
  onEditSave: (cardId: string) => void;
  onEditCancel: () => void;
  canUpdate: boolean;
}

export const NameCell: React.FC<NameCellProps> = ({
  cardId,
  name,
  isEditing,
  editingValue,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onEditStart,
  onEditChange,
  onEditSave,
  onEditCancel,
  canUpdate,
}) => {
  return (
    <td
      className="card-name-cell"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={(e) => {
        if (isEditing) {
          e.stopPropagation();
        }
      }}
    >
      {isEditing ? (
        <div className="name-edit-container">
          <input
            type="text"
            value={editingValue}
            onChange={(e) => onEditChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onEditSave(cardId);
              } else if (e.key === 'Escape') {
                onEditCancel();
              }
            }}
            onBlur={() => onEditSave(cardId)}
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : (
        <>
          <span>{name}</span>
          {isHovered && canUpdate && (
            <button
              className="name-edit-btn"
              onClick={(e) => {
                e.stopPropagation();
                onEditStart(cardId, name);
              }}
              title="Edit name"
            >
              ✏️
            </button>
          )}
        </>
      )}
    </td>
  );
};
