import React, { useState } from 'react';

interface RoleCellProps {
  cardId: string;
  role: string;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onRoleChange: (cardId: string, newRole: string) => void;
  canUpdate: boolean;
}

export const RoleCell: React.FC<RoleCellProps> = ({
  cardId,
  role,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onRoleChange,
  canUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingValue, setEditingValue] = useState(role);

  return (
    <td
      className="card-role-cell"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={(e) => {
        if (isEditing) {
          e.stopPropagation();
        }
      }}
    >
      {isEditing ? (
        <div className="role-edit-container">
          <input
            type="text"
            value={editingValue}
            onChange={(e) => setEditingValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (editingValue.trim()) {
                  onRoleChange(cardId, editingValue);
                }
                setIsEditing(false);
              } else if (e.key === 'Escape') {
                setIsEditing(false);
                setEditingValue(role);
              }
            }}
            onBlur={() => {
              if (editingValue.trim()) {
                onRoleChange(cardId, editingValue);
              }
              setIsEditing(false);
              setEditingValue(role);
            }}
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : (
        <>
          <span>{role}</span>
          {isHovered && canUpdate && (
            <button
              className="role-edit-btn"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
                setEditingValue(role);
              }}
              title="Edit role"
            >
              ✏️
            </button>
          )}
        </>
      )}
    </td>
  );
};
