import { useRef, useState } from 'react';
import { Card } from '../types/Card';
import { parseCSV, generateCSVTemplate } from '../utils/csvParser';

interface CSVImportProps {
  onImport: (cards: Card[]) => void;
  onCancel?: () => void;
}

export const CSVImport: React.FC<CSVImportProps> = ({ onImport, onCancel }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setError('Please select a CSV file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const cards = parseCSV(content);
        setError('');
        onImport(cards);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to parse CSV file');
      }
    };

    reader.onerror = () => {
      setError('Failed to read file');
    };

    reader.readAsText(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDownloadTemplate = () => {
    const template = generateCSVTemplate();
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cards_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="csv-import-modal">
      <div className="csv-import-content">
        <h2>Import Cards from CSV</h2>

        <div
          className={`csv-drop-zone ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <p>Drag and drop a CSV file here</p>
          <p className="csv-or">or</p>
          <button
            className="csv-select-button"
            onClick={() => fileInputRef.current?.click()}
          >
            Select File
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleInputChange}
            style={{ display: 'none' }}
          />
        </div>

        {error && <div className="csv-error">{error}</div>}

        <div className="csv-import-actions">
          <button className="csv-template-button" onClick={handleDownloadTemplate}>
            Download Template
          </button>
          {onCancel && (
            <button className="csv-cancel-button" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>

        <div className="csv-info">
          <h3>CSV Format Requirements</h3>
          <ul>
            <li>File must have a header row</li>
            <li>Required columns: id, name, group, role</li>
            <li>
              Stat columns: {'{stat_name}'}_value and {'{stat_name}'}_weight for each stat
            </li>
            <li>Stats: analyseren, ontwerpen, integratie, samenwerken, realiseren, testen, verantwoording, zelfontwikkeling</li>
            <li>Stat values: 1-10, weights: 1-4</li>
            <li>Optional columns: finalGrade, flavorText</li>
            <li>Download the template to see the exact format</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
