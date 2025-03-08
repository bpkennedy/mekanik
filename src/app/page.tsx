import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold tracking-tight mb-6 bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent">
            MEKANIK
          </h1>
          <p className="text-xl mb-8 text-slate-300">
            Component-Based Starship Engineering Simulator
          </p>
          
          <div className="mb-12 space-y-4 text-slate-300">
            <p>
              Take on the role of a skilled space mechanic aboard an interstellar vessel. 
              Fix, maintain, upgrade, and optimize modular starship systems through a 
              component-based engineering approach.
            </p>
            <p>
              Success depends on understanding the complex interrelationships between 
              components and how they affect overall ship performance in various space 
              environments and mission scenarios.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-medium mb-2 text-orange-500">Engine Modules</h3>
              <p className="text-slate-400">
                Responsible for ship propulsion, speed, and maneuverability. 
                Optimize for fuel efficiency and heat management.
              </p>
            </div>
            
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-medium mb-2 text-blue-500">Shield Modules</h3>
              <p className="text-slate-400">
                Provides defensive capabilities against space hazards and hostile encounters.
                Balance protection strength with energy demands.
              </p>
            </div>
            
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-medium mb-2 text-purple-500">Power Modules</h3>
              <p className="text-slate-400">
                Core system that supplies energy to all ship functions.
                Manage output, stability, and efficiency.
              </p>
            </div>
          </div>
          
          <Link href="/game">
            <Button size="lg" className="bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600">
              Start Engineering
            </Button>
          </Link>
        </div>
      </main>
      
      <footer className="py-6 text-center text-slate-500 text-sm">
        <p>Mekanik - A Component-Based Starship Engineering Simulator</p>
      </footer>
    </div>
  );
}
