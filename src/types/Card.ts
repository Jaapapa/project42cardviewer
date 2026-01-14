export interface Card {
  id: string;
  name: string;
  group: string;
  stats: {
    analyseren: number;
    ontwerpen: number;
    integratie: number;
    samenwerken: number;
    realiseren: number;
    testen: number;
    verantwoording: number;
    zelfontwikkeling: number;
  };
  flavorText: string;
}

export type ViewMode = 'list' | 'detail' | 'print';
