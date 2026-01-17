import { useState } from 'react';

interface FlavorTextCellProps {
  cardId: string;
  flavorText: string;
  onFlavorTextChange: (cardId: string, newFlavorText: string) => void;
  canUpdate: boolean;
}

export const FlavorTextCell: React.FC<FlavorTextCellProps> = ({
  cardId,
  flavorText,
  onFlavorTextChange,
  canUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(flavorText);

  const handleSave = () => {
    // Replace newlines with spaces
    const cleanedValue = editValue.replace(/\n/g, ' ').trim();
    if (cleanedValue !== flavorText) {
      onFlavorTextChange(cardId, cleanedValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(flavorText);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <td className="flavor-text-cell" onClick={(e) => e.stopPropagation()}>
      {!isEditing ? (
        <button
          className="flavor-text-btn"
          onClick={() => canUpdate && setIsEditing(true)}
          disabled={!canUpdate}
          title={flavorText}
        >
          Edit
        </button>
      ) : (
        <div className="flavor-text-editor">
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            placeholder="Enter flavor text..."
          />
          <div className="flavor-text-actions">
            <button
              className="flavor-text-save"
              onClick={handleSave}
              title="Save (Ctrl+Enter)"
            >
              Save
            </button>
            <button
              className="flavor-text-cancel"
              onClick={handleCancel}
              title="Cancel (Esc)"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </td>
  );
};
