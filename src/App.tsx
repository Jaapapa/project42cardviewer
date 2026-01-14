import { useState } from 'react';
import { Card, ViewMode } from './types/Card';
import { useCardStorage } from './hooks/useCardStorage';
import { CardList } from './components/CardList';
import { CardDetail } from './components/CardDetail';
import { PrintView } from './components/PrintView';
import './styles/global.css';

function App() {
  const { cards } = useCardStorage();
  const [currentView, setCurrentView] = useState<ViewMode>('list');
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const handleSelectCard = (card: Card) => {
    setSelectedCard(card);
    setCurrentView('detail');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedCard(null);
  };

  const handlePrintView = () => {
    setCurrentView('print');
  };

  return (
    <div className="app">
      {currentView === 'list' && (
        <CardList
          cards={cards}
          onSelectCard={handleSelectCard}
          onPrintView={handlePrintView}
        />
      )}
      {currentView === 'detail' && selectedCard && (
        <CardDetail card={selectedCard} onBack={handleBackToList} />
      )}
      {currentView === 'print' && (
        <PrintView cards={cards} onBack={handleBackToList} />
      )}
    </div>
  );
}

export default App;
