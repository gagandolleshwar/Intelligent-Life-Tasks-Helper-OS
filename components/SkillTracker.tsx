import React from 'react';
import { SkillData } from '../types';
import { SparklesIcon } from './Icons';

interface SkillTrackerProps {
  data: SkillData;
  onChange: (data: SkillData) => void;
}

const SkillTracker: React.FC<SkillTrackerProps> = ({ data, onChange }) => {
  
  // Calculate days since last update
  const daysSince = Math.floor((new Date().getTime() - new Date(data.lastUpdate).getTime()) / (1000 * 3600 * 24));
  const needsUpdate = daysSince >= 7;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      
      {/* Main Skill Card */}
      <div className="holo-card p-6 rounded-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-fuchsia-500 transform group-hover:scale-110 transition-transform duration-700">
            <SparklesIcon className="w-32 h-32" />
        </div>
        
        {/* Tech decorative corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-fuchsia-500/50"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-fuchsia-500/50"></div>

        <h3 className="text-fuchsia-400 font-header tracking-widest text-sm mb-2 uppercase">Current Protocol</h3>
        <input 
          type="text" 
          value={data.currentSkill}
          onChange={(e) => onChange({ ...data, currentSkill: e.target.value })}
          placeholder="ENTER SKILL..."
          className="bg-transparent text-3xl font-bold text-white w-full focus:outline-none placeholder-gray-800 mb-8 font-header tracking-wide border-none p-0 focus:ring-0"
        />
        
        <div className="mt-6 bg-black/40 p-4 rounded-lg border border-fuchsia-500/20">
          <div className="flex justify-between mb-3">
            <span className="text-xs text-fuchsia-300 font-mono uppercase tracking-wider">Proficiency Level</span>
            <span className="text-xs text-fuchsia-300 font-mono">{data.progress}%</span>
          </div>
          
          {/* Custom Tech Slider */}
          <div className="relative h-6 bg-black/60 rounded border border-fuchsia-500/30 overflow-hidden">
             <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-fuchsia-900 via-fuchsia-500 to-fuchsia-400 transition-all duration-500"
                style={{width: `${data.progress}%`}}
             >
                 <div className="w-full h-full animate-pulse opacity-50 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzhhYWGMYAEYB8RmROaABADeOQ8CXl/xfgAAAABJRU5ErkJggg==')]"></div>
             </div>
             <input 
                type="range" 
                min="0" 
                max="100" 
                value={data.progress}
                onChange={(e) => onChange({ ...data, progress: parseInt(e.target.value) })}
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Update Reminder */}
      <div className={`p-6 rounded-xl border backdrop-blur-md flex flex-col justify-center items-center text-center transition-all relative overflow-hidden ${needsUpdate ? 'bg-red-900/10 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'bg-black/30 border-white/10'}`}>
         {needsUpdate && <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-500/10 to-transparent animate-pulse"></div>}
        
        <h3 className={`font-header tracking-widest text-xl mb-2 relative z-10 ${needsUpdate ? 'text-red-400' : 'text-gray-400'}`}>
            {needsUpdate ? '⚠ SYSTEM ALERT' : 'STATUS: OPTIMAL'}
        </h3>
        
        {needsUpdate ? (
          <>
            <p className="text-red-200 mb-6 text-sm font-mono relative z-10">Last update detected {daysSince} days ago. Data refresh required.</p>
            <button 
              onClick={() => onChange({...data, lastUpdate: new Date().toISOString()})}
              className="relative z-10 px-6 py-2 bg-red-500/20 border border-red-500 text-red-200 rounded text-sm font-bold tracking-wider hover:bg-red-500/30 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all uppercase"
            >
              Sync Progress
            </button>
          </>
        ) : (
          <div className="text-green-400 relative z-10">
            <div className="w-12 h-12 rounded-full border-2 border-green-500 mx-auto mb-3 flex items-center justify-center shadow-[0_0_10px_#22c55e]">
                <span className="text-xl">✓</span>
            </div>
            <p className="text-xs font-mono text-green-400/80 tracking-wider">NEXT CHECK-IN: T-MINUS {7 - daysSince} DAYS</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillTracker;