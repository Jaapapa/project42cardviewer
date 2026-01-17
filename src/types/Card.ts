export interface Stat {
  value: number;    // 1-10
  weight: number;   // 1-4
}

export interface Card {
  id: string;
  name: string;
  group: string;
  stats: {
    analyseren: Stat;
    ontwerpen: Stat;
    integratie: Stat;
    samenwerken: Stat;
    realiseren: Stat;
    testen: Stat;
    verantwoording: Stat;
    zelfontwikkeling: Stat;
  };
  finalGrade: number;
  flavorText: string;
}

export type ViewMode = 'list' | 'detail' | 'print';
