import { useState } from 'react';

interface NameCellProps {
  cardId: string;
  name: string;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onNameChange: (cardId: string, newName: string) => void;
  canUpdate: boolean;
}

export const NameCell: React.FC<NameCellProps> = ({
  cardId,
  name,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onNameChange,
  canUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingValue, setEditingValue] = useState(name);
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
            onChange={(e) => setEditingValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (editingValue.trim()) {
                  onNameChange(cardId, editingValue);
                }
                setIsEditing(false);
              } else if (e.key === 'Escape') {
                setIsEditing(false);
                setEditingValue(name);
              }
            }}
            onBlur={() => {
              if (editingValue.trim()) {
                onNameChange(cardId, editingValue);
              }
              setIsEditing(false);
              setEditingValue(name);
            }}
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
                setIsEditing(true);
                setEditingValue(name);
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
