import { Card } from '../types/Card';

const STORAGE_KEY = 'project42_cards';

// Migrate card data to ensure all required fields exist
const migrateCard = (card: any): Card => {
  // Convert old format (number values) to new format (Stat objects with value and weight)
  const migrateStats = (oldStats: any) => {
    const newStats: any = {};
    const statKeys = ['analyseren', 'ontwerpen', 'integratie', 'samenwerken', 'realiseren', 'testen', 'verantwoording', 'zelfontwikkeling'] as const;
    
    statKeys.forEach((key) => {
      const oldValue = oldStats[key];
      if (typeof oldValue === 'number') {
        // Old format: just a number
        newStats[key] = { value: oldValue, weight: 1 };
      } else if (typeof oldValue === 'object' && oldValue.value) {
        // New format: already has value and weight
        newStats[key] = {
          value: oldValue.value ?? 1,
          weight: oldValue.weight ?? 1,
        };
      } else {
        newStats[key] = { value: 5, weight: 1 };
      }
    });
    return newStats;
  };

  return {
    id: card.id,
    name: card.name,
    group: card.group,
    stats: migrateStats(card.stats),
    finalGrade: card.finalGrade ?? 7, // Default to 7 if missing
    flavorText: card.flavorText,
  };
};

export const cardStorage = {
  getCards(): Card[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      const cards = JSON.parse(data);
      if (!Array.isArray(cards)) return [];
      return cards.map(migrateCard);
    } catch (error) {
      console.error('Error reading cards from storage:', error);
      return [];
    }
  },

  saveCards(cards: Card[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    } catch (error) {
      console.error('Error saving cards to storage:', error);
    }
  },

  addCard(card: Card): void {
    const cards = this.getCards();
    cards.push(card);
    this.saveCards(cards);
  },

  updateCard(id: string, updatedCard: Partial<Card>): void {
    const cards = this.getCards();
    const index = cards.findIndex((c) => c.id === id);
    if (index !== -1) {
      cards[index] = { ...cards[index], ...updatedCard };
      this.saveCards(cards);
    }
  },

  deleteCard(id: string): void {
    const cards = this.getCards().filter((c) => c.id !== id);
    this.saveCards(cards);
  },

  getCardById(id: string): Card | undefined {
    const cards = this.getCards();
    return cards.find((c) => c.id === id);
  },
};
