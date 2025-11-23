import React from 'react';
import { HealthData } from '../types';

interface HealthPanelProps {
  data: HealthData;
  onChange: (data: HealthData) => void;
}

const HealthPanel: React.FC<HealthPanelProps> = ({ data, onChange }) => {
  
  const updateMeal = (type: keyof HealthData['meals'], value: string) => {
    onChange({ ...data, meals: { ...data.meals, [type]: value } });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Vitals Card */}
      <div className="holo-card p-6 rounded-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-sys-green shadow-[0_0_10px_#05d9e8]"></div>
        <h3 className="text-sys-green font-header tracking-widest text-xl mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-sys-green rounded-full animate-pulse"></span>
            DAILY VITALS
        </h3>
        <div className="space-y-8">
          <div>
            <div className="flex justify-between mb-2 text-xs font-mono text-sys-green/80 uppercase tracking-wider">
              <span>Hydration Level</span>
              <span>{data.waterIntake} UNITS</span>
            </div>
            <div className="flex gap-1 p-1 bg-black/40 rounded border border-white/5">
              {Array.from({ length: 8 }).map((_, i) => (
                <button 
                  key={i}
                  onClick={() => onChange({ ...data, waterIntake: i + 1 })}
                  className={`h-8 flex-1 rounded-sm transition-all duration-300 ${i < data.waterIntake ? 'bg-sys-green shadow-[0_0_10px_rgba(5,217,232,0.6)]' : 'bg-white/5 hover:bg-white/10'}`}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2 text-xs font-mono text-sys-green/80 uppercase tracking-wider">
              <span>Sleep Cycle</span>
              <span>{data.sleepHours} HRS</span>
            </div>
            <div className="relative h-4 bg-black/40 rounded-full border border-white/5 flex items-center px-1">
                <input 
                type="range" 
                min="0" 
                max="12" 
                step="0.5"
                value={data.sleepHours}
                onChange={(e) => onChange({ ...data, sleepHours: parseFloat(e.target.value) })}
                className="w-full h-1 bg-transparent appearance-none cursor-pointer z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-sys-green [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_10px_#05d9e8]"
                />
                <div className="absolute top-1/2 left-0 h-1 bg-sys-green/30 rounded-full -translate-y-1/2 pointer-events-none" style={{width: `${(data.sleepHours/12)*100}%`}}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Cycle & Mood */}
      <div className="holo-card p-6 rounded-xl relative">
         <div className="absolute top-0 left-0 w-full h-1 bg-purple-500 shadow-[0_0_10px_#a855f7]"></div>
        <h3 className="text-purple-400 font-header tracking-widest text-xl mb-6">PSYCHE & CYCLE</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-xs text-purple-400/80 font-mono mb-2 uppercase tracking-wider">Mood Log</label>
            <textarea 
              value={data.mood}
              onChange={(e) => onChange({ ...data, mood: e.target.value })}
              className="w-full bg-black/40 border border-purple-500/30 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-purple-500 focus:shadow-[0_0_15px_rgba(168,85,247,0.2)] h-24 resize-none transition-all"
              placeholder="Input emotional status..."
            />
          </div>
          <div>
            <label className="block text-xs text-purple-400/80 font-mono mb-2 uppercase tracking-wider">Cycle Start Date</label>
            <input 
              type="date" 
              value={data.lastPeriodDate}
              onChange={(e) => onChange({ ...data, lastPeriodDate: e.target.value })}
              className="w-full bg-black/40 border border-purple-500/30 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-purple-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Meals */}
      <div className="holo-card p-6 rounded-xl relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-sys-orange shadow-[0_0_10px_#ff9f1c]"></div>
        <h3 className="text-sys-orange font-header tracking-widest text-xl mb-6">NUTRIENT INPUT</h3>
        <div className="space-y-4">
          {(['breakfast', 'lunch', 'dinner'] as const).map((meal) => (
            <div key={meal} className="group">
              <label className="block text-[10px] text-sys-orange/60 font-mono uppercase tracking-widest mb-1 group-focus-within:text-sys-orange transition-colors">{meal}</label>
              <div className="relative">
                <input 
                    type="text" 
                    value={data.meals[meal]}
                    onChange={(e) => updateMeal(meal, e.target.value)}
                    placeholder="EMPTY"
                    className="w-full bg-transparent border-b border-white/10 py-1 text-sm text-white focus:outline-none focus:border-sys-orange focus:shadow-[0_4px_10px_-4px_rgba(255,159,28,0.5)] transition-all placeholder-gray-800"
                />
                <div className="absolute right-0 top-1 w-2 h-2 bg-sys-orange/20 rounded-full group-focus-within:bg-sys-orange group-focus-within:shadow-[0_0_5px_#ff9f1c]"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HealthPanel;