import { useState } from 'react';

interface GroupCellProps {
  cardId: string;
  group: string;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onGroupChange: (cardId: string, newGroup: string) => void;
  canUpdate: boolean;
}

export const GroupCell: React.FC<GroupCellProps> = ({
  cardId,
  group,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onGroupChange,
  canUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingValue, setEditingValue] = useState(group);
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
            onChange={(e) => setEditingValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (editingValue.trim()) {
                  onGroupChange(cardId, editingValue);
                }
                setIsEditing(false);
              } else if (e.key === 'Escape') {
                setIsEditing(false);
                setEditingValue(group);
              }
            }}
            onBlur={() => {
              if (editingValue.trim()) {
                onGroupChange(cardId, editingValue);
              }
              setIsEditing(false);
              setEditingValue(group);
            }}
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
                setIsEditing(true);
                setEditingValue(group);
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
