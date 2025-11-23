import React, { useState } from 'react';
import { PriorityLevel, Task } from '../types';
import { PlusIcon, TrashIcon, MagicWandIcon, SparklesIcon } from './Icons';
import { suggestTasks } from '../services/geminiService';

interface PriorityBoardProps {
  domainName: string;
  tasks: Task[];
  onTasksChange: (tasks: Task[]) => void;
}

const COLUMNS = [
  { id: PriorityLevel.MUST, label: 'THE MUSTS', color: 'bg-sys-red', glow: 'shadow-[0_0_15px_rgba(255,42,109,0.4)]', border: 'border-sys-red', text: 'text-sys-red', desc: 'CRITICAL // IMMEDIATE' },
  { id: PriorityLevel.SHOULD, label: 'THE SHOULDS', color: 'bg-sys-orange', glow: 'shadow-[0_0_15px_rgba(255,159,28,0.4)]', border: 'border-sys-orange', text: 'text-sys-orange', desc: 'IMPORTANT // TACTICAL' },
  { id: PriorityLevel.COULD, label: 'THE COULDS', color: 'bg-sys-green', glow: 'shadow-[0_0_15px_rgba(5,217,232,0.4)]', border: 'border-sys-green', text: 'text-sys-green', desc: 'OPTIONAL // BENEFICIAL' },
  { id: PriorityLevel.WOULD, label: 'THE WOULDS', color: 'bg-sys-yellow', glow: 'shadow-[0_0_15px_rgba(209,247,255,0.4)]', border: 'border-sys-yellow', text: 'text-sys-yellow', desc: 'WISHLIST // LONG-TERM' },
];

const PriorityBoard: React.FC<PriorityBoardProps> = ({ domainName, tasks, onTasksChange }) => {
  const [newTaskText, setNewTaskText] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<PriorityLevel>(PriorityLevel.MUST);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [showAiInput, setShowAiInput] = useState(false);

  const addTask = (text: string, priority: PriorityLevel) => {
    if (!text.trim()) return;
    const newTask: Task = {
      id: Date.now().toString() + Math.random().toString(),
      text,
      priority,
      completed: false,
    };
    onTasksChange([...tasks, newTask]);
  };

  const deleteTask = (id: string) => {
    onTasksChange(tasks.filter(t => t.id !== id));
  };

  const toggleComplete = (id: string) => {
    onTasksChange(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    const suggestions = await suggestTasks(domainName, aiPrompt);
    
    const newTasks = suggestions.map((s, idx) => ({
      id: Date.now().toString() + idx,
      text: s.text,
      priority: s.priority,
      completed: false
    }));

    onTasksChange([...tasks, ...newTasks]);
    setIsGenerating(false);
    setShowAiInput(false);
    setAiPrompt('');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Controls */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between holo-card p-4 rounded-xl">
        <div className="flex-1 w-full flex gap-2">
          <select 
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value as PriorityLevel)}
            className="bg-black/40 border border-sys-border text-white text-sm font-mono rounded-lg focus:ring-1 focus:ring-sys-green focus:border-sys-green block p-2.5 uppercase"
          >
            {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
          <input 
            type="text" 
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (addTask(newTaskText, selectedPriority), setNewTaskText(''))}
            placeholder="Input directive..."
            className="bg-black/40 border border-sys-border text-white text-sm rounded-lg block w-full p-2.5 focus:ring-1 focus:ring-sys-green focus:border-sys-green focus:outline-none placeholder-gray-600"
          />
          <button 
            onClick={() => { addTask(newTaskText, selectedPriority); setNewTaskText(''); }}
            className="bg-sys-green/10 border border-sys-green/50 text-sys-green hover:bg-sys-green/20 hover:shadow-[0_0_10px_rgba(5,217,232,0.3)] rounded-lg text-sm p-2.5 transition-all"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
        </div>

        <button 
          onClick={() => setShowAiInput(!showAiInput)}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold text-sys-primary border border-sys-primary/50 rounded-lg hover:bg-sys-primary/10 hover:shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all uppercase tracking-wider"
        >
          <MagicWandIcon className="w-4 h-4" />
          <span>AI_Optimise</span>
        </button>
      </div>

      {/* AI Input Panel */}
      {showAiInput && (
        <div className="mb-6 p-6 bg-sys-primary/5 border border-sys-primary/30 rounded-xl animate-in fade-in slide-in-from-top-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-20 text-sys-primary">
              <SparklesIcon className="w-24 h-24"/>
          </div>
          <h3 className="text-sys-primary text-sm mb-3 font-header tracking-widest uppercase">Define Mission Objective</h3>
          <div className="flex gap-2 relative z-10">
            <input 
              type="text" 
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g., Prepare for interstellar navigation exams..."
              className="bg-black/60 border border-sys-primary/30 text-white text-sm rounded-lg block w-full p-3 focus:outline-none focus:border-sys-primary"
            />
            <button 
              onClick={handleAiGenerate}
              disabled={isGenerating}
              className="px-6 py-2 bg-sys-primary text-white rounded-lg text-sm font-bold tracking-wide hover:bg-purple-600 disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(124,58,237,0.5)]"
            >
              {isGenerating ? 'COMPUTING...' : 'EXECUTE'}
            </button>
          </div>
        </div>
      )}

      {/* Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 h-full">
        {COLUMNS.map((col) => (
          <div key={col.id} className="flex flex-col h-full min-h-[400px] holo-card rounded-xl overflow-hidden relative group">
            {/* Top Light Bar */}
            <div className={`h-1 w-full ${col.color} shadow-[0_0_10px_currentColor] opacity-70`}></div>
            
            <div className={`p-5 border-b border-white/5 flex justify-between items-center`}>
              <div>
                <h3 className={`font-header font-bold text-lg tracking-widest ${col.text} drop-shadow-[0_0_5px_rgba(0,0,0,0.5)]`}>{col.label}</h3>
                <p className="text-[10px] text-gray-400 font-mono mt-1">{col.desc}</p>
              </div>
              <span className={`text-xs font-mono px-2 py-1 rounded border ${col.border} ${col.text} bg-black/30`}>
                  {tasks.filter(t => t.priority === col.id).length}
              </span>
            </div>
            
            <div className="flex-1 p-4 space-y-3 bg-gradient-to-b from-transparent to-black/20">
              {tasks.filter(t => t.priority === col.id).map(task => (
                <div key={task.id} className={`group/item relative p-4 rounded bg-black/40 border border-white/5 hover:border-white/20 transition-all hover:translate-x-1 ${task.completed ? 'opacity-40' : ''}`}>
                  <div className="flex items-start gap-3">
                    <button 
                      onClick={() => toggleComplete(task.id)}
                      className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-all ${task.completed ? `${col.color} border-transparent shadow-[0_0_10px_currentColor]` : 'border-gray-600 hover:border-white bg-black/50'}`}
                    >
                      {task.completed && <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </button>
                    <span className={`text-sm text-gray-300 leading-relaxed font-light ${task.completed ? 'line-through text-gray-600' : ''}`}>
                      {task.text}
                    </span>
                  </div>
                  <button 
                    onClick={() => deleteTask(task.id)}
                    className="absolute top-2 right-2 opacity-0 group-hover/item:opacity-100 text-gray-500 hover:text-sys-red transition-all transform hover:scale-110"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                  
                  {/* Corner accent */}
                  <div className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r ${col.border} opacity-0 group-hover/item:opacity-50`}></div>
                </div>
              ))}
              {tasks.filter(t => t.priority === col.id).length === 0 && (
                <div className="h-32 flex flex-col items-center justify-center opacity-20">
                    <div className="w-12 h-12 rounded-full border border-white mb-2"></div>
                    <div className="text-[10px] uppercase tracking-widest">Sector Clear</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriorityBoard;