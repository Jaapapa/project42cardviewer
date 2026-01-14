import { useState, useCallback, useEffect } from 'react';
import { Card } from '../types/Card';
import { cardStorage } from '../utils/cardStorage';
import sampleCards from '../data/sample-cards.json';

export const useCardStorage = () => {
  const [cards, setCards] = useState<Card[]>([]);

  // Initialize cards from storage
  useEffect(() => {
    let stored = cardStorage.getCards();
    
    // If no cards exist, load sample data
    if (stored.length === 0) {
      cardStorage.saveCards(sampleCards);
      stored = sampleCards;
    }
    
    setCards(stored);
  }, []);

  const addCard = useCallback((card: Card) => {
    cardStorage.addCard(card);
    setCards(cardStorage.getCards());
  }, []);

  const updateCard = useCallback((id: string, updatedCard: Partial<Card>) => {
    cardStorage.updateCard(id, updatedCard);
    setCards(cardStorage.getCards());
  }, []);

  const deleteCard = useCallback((id: string) => {
    cardStorage.deleteCard(id);
    setCards(cardStorage.getCards());
  }, []);

  const getCardById = useCallback((id: string): Card | undefined => {
    return cardStorage.getCardById(id);
  }, []);

  return {
    cards,
    addCard,
    updateCard,
    deleteCard,
    getCardById,
  };
};
