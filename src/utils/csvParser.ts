import { Card, Stat } from '../types/Card';

interface CSVRow {
  [key: string]: string;
}

/**
 * Parse CSV content into Card objects
 * Expected CSV format with semicolon delimiter (header row required):
 * Name;Role;Analyseren;Gewicht;Ontwerpen;Gewicht;Integratie;Gewicht;Realiseren;Gewicht;Testen;Gewicht;...;Eindcijfer;[flavor text]
 */
export const parseCSV = (csvContent: string): Card[] => {
  const lines = csvContent.trim().split('\n');
  
  if (lines.length < 2) {
    throw new Error('CSV file must contain at least a header row and one data row');
  }

  const cards: Card[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    
    // Skip empty lines or lines that don't have a name in the first column
    if (values.length === 0 || !values[0] || values[0].trim() === '') continue;

    try {
      const card = rowToCardFromSample(values, i + 1);
      cards.push(card);
    } catch (error) {
      console.warn(`Skipping row ${i + 1}:`, error);
      // Continue processing other rows
    }
  }

  if (cards.length === 0) {
    throw new Error('No valid cards found in CSV file');
  }

  return cards;
};

/**
 * Parse a single CSV line handling quoted fields
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        current += '"';
        i++; // Skip next quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ';' && !insideQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

/**
 * Convert CSV row from sample format to Card object
 * Expected format: Name;Role;Analyseren;Gewicht;Ontwerpen;Gewicht;Integratie;Gewicht;Realiseren;Gewicht;Testen;Gewicht;Dekking;# Software;Samenwerken;Verantwoording;Zelfontwikkeling;# Vaardigheden;Eindcijfer;[flavor text columns]
 */
function rowToCardFromSample(values: string[], rowNum: number): Card {
  const name = values[0]?.trim();
  const role = values[1]?.trim();
  
  if (!name || !role) {
    throw new Error('Missing required fields: name or role');
  }

  // Parse stats with their weights (columns 2-13)
  // Format: stat value, weight, next stat value, weight, etc.
  const parseDecimal = (val: string): number => {
    if (!val) return 5;
    // Replace comma with dot for decimal parsing
    const normalized = val.replace(',', '.');
    const parsed = parseFloat(normalized);
    return isNaN(parsed) ? 5 : Math.max(1, Math.min(10, Math.round(parsed)));
  };

  const parseInt10 = (val: string): number => {
    if (!val) return 1;
    const parsed = parseInt(val, 10);
    return isNaN(parsed) ? 1 : Math.max(1, Math.min(4, parsed));
  };

  const stats = {
    analyseren: {
      value: parseDecimal(values[2]),
      weight: parseInt10(values[3]),
    },
    ontwerpen: {
      value: parseDecimal(values[4]),
      weight: parseInt10(values[5]),
    },
    integratie: {
      value: parseDecimal(values[6]),
      weight: parseInt10(values[7]),
    },
    realiseren: {
      value: parseDecimal(values[8]),
      weight: parseInt10(values[9]),
    },
    testen: {
      value: parseDecimal(values[10]),
      weight: parseInt10(values[11]),
    },
    // Columns 12-13: Dekking, # Software (skip)
    samenwerken: {
      value: parseDecimal(values[14]),
      weight: 1,
    },
    verantwoording: {
      value: parseDecimal(values[15]),
      weight: 1,
    },
    zelfontwikkeling: {
      value: parseDecimal(values[16]),
      weight: 1,
    },
  };

  // Column 18: Eindcijfer (finalGrade)
  const finalGrade = parseDecimal(values[18]);
  
  // Column 19: Flavor text
  const flavorText = values[19]?.trim() || '';

  // Generate ID from name
  const id = name.toLowerCase().replace(/\s+/g, '-') + '-' + rowNum;

  // Use first word of name as group (or default to role)
  const group = name.split(' ')[0] || role;

  return {
    id,
    name,
    group,
    role,
    stats,
    finalGrade,
    flavorText,
  };
}

/**
 * Convert CSV row to Card object (legacy format)
 */
function rowToCard(row: CSVRow): Card {
  const id = row['id'] || Math.random().toString(36).substring(2, 11);
  const name = row['name'];
  const group = row['group'];
  const role = row['role'];
  const finalGrade = parseInt(row['finalgrade'] || '0', 10);
  const flavorText = row['flavortext'] || '';

  if (!name || !group || !role) {
    throw new Error('Missing required fields: name, group, or role');
  }

  const stats = {
    analyseren: parseStatField(row, 'analyseren'),
    ontwerpen: parseStatField(row, 'ontwerpen'),
    integratie: parseStatField(row, 'integratie'),
    samenwerken: parseStatField(row, 'samenwerken'),
    realiseren: parseStatField(row, 'realiseren'),
    testen: parseStatField(row, 'testen'),
    verantwoording: parseStatField(row, 'verantwoording'),
    zelfontwikkeling: parseStatField(row, 'zelfontwikkeling'),
  };

  return {
    id,
    name,
    group,
    role,
    stats,
    finalGrade,
    flavorText,
  };
}

/**
 * Parse stat value and weight from CSV row
 */
function parseStatField(row: CSVRow, statName: string): Stat {
  const valueKey = `${statName}_value`;
  const weightKey = `${statName}_weight`;

  const value = parseInt(row[valueKey] || '5', 10);
  const weight = parseInt(row[weightKey] || '1', 10);

  // Validate ranges
  const validValue = Math.max(1, Math.min(10, value));
  const validWeight = Math.max(1, Math.min(4, weight));

  return { value: validValue, weight: validWeight };
}

/**
 * Generate sample CSV template in the sample format
 */
export const generateCSVTemplate = (): string => {
  const headers = [
    'Name',
    'Role',
    'Analyseren',
    'Gewicht',
    'Ontwerpen',
    'Gewicht',
    'Integratie',
    'Gewicht',
    'Realiseren',
    'Gewicht',
    'Testen',
    'Gewicht',
    'Dekking',
    '# Software',
    'Samenwerken',
    'Verantwoording',
    'Zelfontwikkeling',
    '# Vaardigheden',
    'Eindcijfer',
    '',
  ];

  const sampleRow = [
    'John Dent',
    'Backend Developer',
    '8',
    '2',
    '9',
    '1',
    '6',
    '3',
    '7',
    '1',
    '6',
    '1',
    '',
    '7,2',
    '5',
    '4',
    '8',
    '5,7',
    '6,5',
    'An ordinary student thrust into extraordinary projects.',
  ];

  return [headers.join(';'), sampleRow.join(';')].join('\n');
};

/**
 * Export cards as CSV in the sample format
 * Format: Name;Role;Analyseren;Gewicht;Ontwerpen;Gewicht;...;Eindcijfer;[flavor text]
 */
export const exportCardsToCSV = (cards: Card[]): string => {
  const headers = [
    'Name',
    'Role',
    'Analyseren',
    'Gewicht',
    'Ontwerpen',
    'Gewicht',
    'Integratie',
    'Gewicht',
    'Realiseren',
    'Gewicht',
    'Testen',
    'Gewicht',
    'Dekking',
    '# Software',
    'Samenwerken',
    'Verantwoording',
    'Zelfontwikkeling',
    '# Vaardigheden',
    'Eindcijfer',
    '', // Flavor text column (no header)
  ];

  const rows = cards.map((card) => {
    // Calculate average for # Software
    const softwareAvg = (
      (card.stats.analyseren.value + 
       card.stats.ontwerpen.value + 
       card.stats.integratie.value + 
       card.stats.realiseren.value + 
       card.stats.testen.value) / 5
    ).toFixed(1).replace('.', ',');

    // Calculate average for # Vaardigheden
    const vaardighedenAvg = (
      (card.stats.samenwerken.value + 
       card.stats.verantwoording.value + 
       card.stats.zelfontwikkeling.value) / 3
    ).toFixed(1).replace('.', ',');

    return [
      escapeCSVField(card.name),
      escapeCSVField(card.role),
      card.stats.analyseren.value,
      card.stats.analyseren.weight,
      card.stats.ontwerpen.value,
      card.stats.ontwerpen.weight,
      card.stats.integratie.value,
      card.stats.integratie.weight,
      card.stats.realiseren.value,
      card.stats.realiseren.weight,
      card.stats.testen.value,
      card.stats.testen.weight,
      '', // Dekking
      softwareAvg,
      card.stats.samenwerken.value,
      card.stats.verantwoording.value,
      card.stats.zelfontwikkeling.value,
      vaardighedenAvg,
      String(card.finalGrade).replace('.', ','),
      escapeCSVField(card.flavorText),
    ];
  });

  return [headers.join(';'), ...rows.map((row) => row.join(';'))].join('\n');
};

/**
 * Escape CSV field if needed (wrap in quotes if contains semicolon, quote, or newline)
 */
function escapeCSVField(field: string | number): string {
  const str = String(field);
  if (str.includes(';') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}
