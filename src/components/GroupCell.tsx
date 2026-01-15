interface GroupCellProps {
  cardId: string;
  group: string;
  isEditing: boolean;
  editingValue: string;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onEditStart: (cardId: string, currentGroup: string) => void;
  onEditChange: (value: string) => void;
  onEditSave: (cardId: string) => void;
  onEditCancel: () => void;
  canUpdate: boolean;
}

export const GroupCell: React.FC<GroupCellProps> = ({
  cardId,
  group,
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
      className="card-group-cell"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={(e) => {
        if (isEditing) {
          e.stopPropagation();
        }
      }}
    >
      {isEditing ? (
        <div className="group-edit-container">
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
          <span>{group}</span>
          {isHovered && canUpdate && (
            <button
              className="group-edit-btn"
              onClick={(e) => {
                e.stopPropagation();
                onEditStart(cardId, group);
              }}
              title="Edit group"
            >
              ✏️
            </button>
          )}
        </>
      )}
    </td>
  );
};
