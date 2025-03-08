import { GameProvider } from '@/lib/store/gameContext';
import { ReactNode } from 'react';

export default function GameLayout({ children }: { children: ReactNode }) {
  return (
    <GameProvider>
      {children}
    </GameProvider>
  );
} 