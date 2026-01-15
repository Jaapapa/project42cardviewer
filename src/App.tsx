import { useState } from 'react';
import { Card, ViewMode } from './types/Card';
import { useCardStorage } from './hooks/useCardStorage';
import { CardList } from './components/CardList';
import { CardDetail } from './components/CardDetail';
import { PrintView } from './components/PrintView';
import './styles/global.css';

function App() {
  const { cards, saveAllCards, updateCard, addCard } = useCardStorage();
  const [currentView, setCurrentView] = useState<ViewMode>('list');
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const handleSelectCard = (card: Card) => {
    setSelectedCard(card);
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedCard(null);
  };

  const handlePrintView = () => {
    setCurrentView('print');
  };

  const handleImport = (importedCards: Card[]) => {
    saveAllCards(importedCards);
  };

  const handleAddCard = (card: Card) => {
    addCard(card);
  };

  return (
    <div className="app">
      {currentView === 'list' && (
        <div className="list-detail-layout">
          <div className="list-panel">
            <CardList
              cards={cards}
              onSelectCard={handleSelectCard}
              onPrintView={handlePrintView}
              onImport={handleImport}
              onUpdateCard={updateCard}
              onAddCard={handleAddCard}
            />
          </div>
          {selectedCard && (
            <div className="detail-panel">
              <CardDetail
                card={selectedCard}
                onBack={() => setSelectedCard(null)}
              />
            </div>
          )}
        </div>
      )}
      {currentView === 'print' && (
        <PrintView cards={cards} onBack={handleBackToList} />
      )}
    </div>
  );
}

export default App;
