import React, { useState, useEffect } from 'react';
import { AppState, DomainId, INITIAL_HEALTH, INITIAL_SKILL, Task } from './types';
import PriorityBoard from './components/PriorityBoard';
import HealthPanel from './components/HealthPanel';
import SkillTracker from './components/SkillTracker';
import { BriefcaseIcon, HeartIcon, SparklesIcon, CoffeeIcon } from './components/Icons';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('life-system-state');
    return saved ? JSON.parse(saved) : {
      userName: null,
      activeDomain: DomainId.WORK,
      tasks: {
        [DomainId.WORK]: [],
        [DomainId.HEALTH]: [],
        [DomainId.SKILLS]: [],
        [DomainId.JOY]: []
      },
      health: INITIAL_HEALTH,
      skill: INITIAL_SKILL
    };
  });

  const [nameInput, setNameInput] = useState('');

  useEffect(() => {
    localStorage.setItem('life-system-state', JSON.stringify(state));
  }, [state]);

  const handleTaskChange = (domain: DomainId, newTasks: Task[]) => {
    setState(prev => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        [domain]: newTasks
      }
    }));
  };

  const getDomainTitle = (id: DomainId) => {
    switch(id) {
      case DomainId.WORK: return 'COMMAND_CENTER // CAREER';
      case DomainId.HEALTH: return 'BIO_LABS // HEALTH';
      case DomainId.SKILLS: return 'UPGRADE_STATION // SKILLS';
      case DomainId.JOY: return 'RECREATION_DECK // JOY';
    }
  };

  const getDomainColor = (id: DomainId) => {
    switch(id) {
      case DomainId.WORK: return 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]';
      case DomainId.HEALTH: return 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]';
      case DomainId.SKILLS: return 'text-fuchsia-400 drop-shadow-[0_0_8px_rgba(232,121,249,0.8)]';
      case DomainId.JOY: return 'text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]';
    }
  };

  const getActiveGlow = (id: DomainId) => {
     switch(id) {
      case DomainId.WORK: return 'shadow-[0_0_15px_rgba(34,211,238,0.3)] border-cyan-500/50 text-cyan-300';
      case DomainId.HEALTH: return 'shadow-[0_0_15px_rgba(52,211,153,0.3)] border-emerald-500/50 text-emerald-300';
      case DomainId.SKILLS: return 'shadow-[0_0_15px_rgba(232,121,249,0.3)] border-fuchsia-500/50 text-fuchsia-300';
      case DomainId.JOY: return 'shadow-[0_0_15px_rgba(253,224,71,0.3)] border-yellow-500/50 text-yellow-200';
    }
  };

  // Onboarding Screen
  if (!state.userName) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/20 blur-[120px] rounded-full"></div>
        
        <div className="max-w-md w-full z-10 animate-[fadeIn_1.5s_ease-out] border border-white/10 bg-black/30 backdrop-blur-xl p-8 rounded-2xl shadow-2xl">
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 border-2 border-cyan-400 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.5)]">
              <SparklesIcon className="w-8 h-8 text-cyan-400" />
            </div>
          </div>
          <h1 className="text-4xl font-header mb-2 text-white tracking-widest uppercase">System Initialize</h1>
          <p className="text-cyan-200/60 mb-8 font-mono text-sm">Identify yourself to access the mainframe.</p>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (nameInput.trim()) setState(prev => ({ ...prev, userName: nameInput }));
            }}
            className="relative"
          >
            <div className="relative group">
                <input 
                type="text" 
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg text-center text-2xl py-4 text-white focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all"
                placeholder="ENTER NAME"
                autoFocus
                />
                <div className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
            </div>
            
            <button 
              type="submit"
              className={`mt-8 w-full py-3 rounded-lg bg-cyan-500/10 border border-cyan-500/50 text-cyan-300 font-header tracking-widest hover:bg-cyan-500/20 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all duration-500 ${!nameInput ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
            >
              ACCESS GRANTED
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Main Application
  return (
    <div className="min-h-screen text-gray-200 flex flex-col md:flex-row overflow-hidden selection:bg-cyan-500/30 selection:text-cyan-100">
      
      {/* Navigation Sidebar - "Control Deck" */}
      <nav className="w-full md:w-24 lg:w-72 bg-black/40 backdrop-blur-xl border-b md:border-b-0 md:border-r border-white/10 flex md:flex-col justify-between z-20 flex-shrink-0 relative">
        
        {/* Top User Section */}
        <div className="p-6 hidden md:block relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
          <h2 className="font-header text-2xl text-white tracking-widest leading-none mb-1">{state.userName}</h2>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_5px_#22c55e]"></div>
            <span className="text-xs text-cyan-400/60 font-mono tracking-wider">SYSTEM ONLINE</span>
          </div>
        </div>

        {/* Nav Buttons */}
        <div className="flex md:flex-col w-full justify-around md:justify-start gap-3 p-2 md:p-4">
          {[
            { id: DomainId.WORK, icon: BriefcaseIcon, label: 'CAREER', sub: 'Operations' },
            { id: DomainId.HEALTH, icon: HeartIcon, label: 'LIFESTYLE', sub: 'Vitals' },
            { id: DomainId.SKILLS, icon: SparklesIcon, label: 'GROWTH', sub: 'Upgrades' },
            { id: DomainId.JOY, icon: CoffeeIcon, label: 'JOY', sub: 'Recreation' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setState(prev => ({ ...prev, activeDomain: item.id }))}
              className={`relative group flex flex-col md:flex-row items-center md:gap-4 p-3 md:px-5 md:py-4 rounded-lg border border-transparent transition-all duration-300 overflow-hidden ${state.activeDomain === item.id ? getActiveGlow(item.id) + ' bg-white/5' : 'text-gray-500 hover:text-gray-200 hover:bg-white/5 hover:border-white/10'}`}
            >
               {state.activeDomain === item.id && <div className="absolute left-0 top-0 h-full w-[3px] bg-current shadow-[0_0_10px_currentColor]"></div>}
              <item.icon className={`w-5 h-5 md:w-6 md:h-6 z-10 transition-transform group-hover:scale-110 duration-300 ${state.activeDomain === item.id ? 'animate-pulse-slow' : ''}`} />
              <div className="flex flex-col items-start z-10">
                <span className="text-[10px] md:text-sm font-header tracking-widest mt-1 md:mt-0">{item.label}</span>
                <span className="hidden md:block text-[10px] opacity-50 font-mono uppercase">{item.sub}</span>
              </div>
            </button>
          ))}
        </div>
        
        {/* Footer */}
        <div className="p-6 hidden md:block border-t border-white/5">
           <div className="flex justify-between items-end">
             <div className="text-[10px] text-gray-600 font-mono">
               OS.VER.2.4.9<br/>
               BUILD: NEBULA
             </div>
             <div className="flex gap-1">
               {[1,2,3].map(i => <div key={i} className="w-1 h-4 bg-gray-800 rounded-sm"></div>)}
             </div>
           </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 h-[calc(100vh-80px)] md:h-screen overflow-hidden flex flex-col relative">
        
        {/* Dynamic ambient light */}
         <div className={`absolute top-[-50%] left-[20%] w-[1000px] h-[1000px] rounded-full blur-[150px] opacity-10 pointer-events-none transition-colors duration-1000
          ${state.activeDomain === DomainId.WORK ? 'bg-cyan-600' : 
            state.activeDomain === DomainId.HEALTH ? 'bg-emerald-600' :
            state.activeDomain === DomainId.SKILLS ? 'bg-fuchsia-600' : 'bg-yellow-600'
          }`} 
        />

        {/* Header */}
        <header className="px-6 pt-6 md:px-10 md:pt-10 pb-2 z-10 shrink-0 flex justify-between items-end border-b border-white/5 bg-black/20 backdrop-blur-sm">
          <div>
            <h1 className={`text-2xl md:text-4xl font-header font-bold tracking-widest uppercase transition-colors duration-500 ${getDomainColor(state.activeDomain)}`}>
              {getDomainTitle(state.activeDomain)}
            </h1>
            <p className="text-gray-400 mt-1 max-w-2xl font-light text-sm md:text-base tracking-wide border-l-2 border-white/10 pl-3 mb-4">
              {state.activeDomain === DomainId.WORK && "Mission control for professional objectives."}
              {state.activeDomain === DomainId.HEALTH && "System diagnostics and biological maintenance."}
              {state.activeDomain === DomainId.SKILLS && "Skill acquisition and capability expansion."}
              {state.activeDomain === DomainId.JOY && "Mental regeneration and leisure protocols."}
            </p>
          </div>
          <div className="hidden lg:block pb-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-black/40">
               <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
               <span className="text-xs font-mono text-cyan-300">SERVER: STABLE</span>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden z-10">
            {/* Domain Specific Widgets */}
            <div className="px-6 md:px-10 py-6">
            {state.activeDomain === DomainId.HEALTH && (
                <HealthPanel 
                data={state.health} 
                onChange={(h) => setState(prev => ({ ...prev, health: h }))} 
                />
            )}
            {state.activeDomain === DomainId.SKILLS && (
                <SkillTracker 
                data={state.skill}
                onChange={(s) => setState(prev => ({ ...prev, skill: s }))}
                />
            )}
            {state.activeDomain === DomainId.JOY && (
                <div className="mb-8 holo-card p-6 rounded-xl flex items-center justify-between group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex items-center gap-4 relative z-10">
                      <div className="p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                        <CoffeeIcon className="w-8 h-8"/>
                      </div>
                      <div>
                        <h4 className="font-header text-lg text-white tracking-wide">Stasis Pod // Nap Station</h4>
                        <p className="text-xs text-gray-400 font-mono">Initiate regeneration sequence.</p>
                      </div>
                  </div>
                  <button 
                    onClick={() => alert("Stasis mode initiated. Waking in 20 minutes.")}
                    className="relative z-10 px-6 py-2 text-sm font-bold bg-yellow-500/10 border border-yellow-500/50 text-yellow-300 rounded hover:bg-yellow-500/20 hover:shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-all uppercase tracking-wider"
                  >
                    Activate 20m Nap
                  </button>
                </div>
            )}
            </div>

            {/* Main Priority Board */}
            <div className="px-6 md:px-10 pb-10">
             <PriorityBoard 
                domainName={getDomainTitle(state.activeDomain)}
                tasks={state.tasks[state.activeDomain]}
                onTasksChange={(t) => handleTaskChange(state.activeDomain, t)}
            />
            </div>
        </div>
      </main>
    </div>
  );
};

export default App;