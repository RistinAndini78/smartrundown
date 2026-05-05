import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight,
  ChevronLeft,
  Settings,
  Maximize2,
  Mic2
} from 'lucide-react';
import { RundownItem } from '../types';
import { motion } from 'motion/react';

const MOCK_ITEMS: RundownItem[] = [
  { id: '1', startTime: '19:00', title: 'Opening: Lighting Show', duration: 5, endTime: '19:05', details: 'Full lighting setup and bass intro.', pic: 'Lighting Crew' },
  { id: '2', startTime: '19:05', title: 'MC Opening Statement', duration: 10, endTime: '19:15', details: 'MC welcoming guests and sponsors.', pic: 'MC Sarah' },
  { id: '3', startTime: '19:15', title: 'CEO Welcome Speech', duration: 10, endTime: '19:25', details: 'Speech about company milestones.', pic: 'CEO (Pak Anto)' },
  { id: '4', startTime: '19:25', title: 'Award Ceremony: Phase 1', duration: 30, endTime: '19:55', details: 'Awards for best employees Category A & B.', pic: 'HR Dept' },
  { id: '5', startTime: '19:55', title: 'Entertainment: Acoustic Band', duration: 20, endTime: '20:15', details: 'Smooth jazz for dining ambient.', pic: 'The Jazztra' },
];

export default function LiveMode({ onExit }: { onExit: () => void }) {
  const [activeItemIndex, setActiveItemIndex] = useState(1);
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      if (isRunning) {
        setTime(new Date().toLocaleTimeString());
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunning]);

  const activeItem = MOCK_ITEMS[activeItemIndex];
  const nextItem = MOCK_ITEMS[activeItemIndex + 1];

  return (
    <div className="bg-[#121212] flex flex-col h-screen overflow-hidden">
      {/* Live Header */}
      <div className="p-6 bg-black flex justify-between items-center border-b border-white/10 shrink-0">
        <div className="flex items-center gap-6">
          <button 
            onClick={onExit}
            className="p-2 hover:bg-white/10 rounded-lg text-gray-400 group flex items-center gap-2 transition-all mr-2"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest hidden sm:block">Exit</span>
          </button>
          <div className="flex items-center gap-2 bg-error/20 border border-error/30 px-4 py-2 rounded-full">
            <div className="w-2.5 h-2.5 rounded-full bg-error animate-pulse"></div>
            <span className="text-error font-black text-sm tracking-tighter uppercase">LIVE MODE</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white leading-tight">Product Launch 2024</h1>
            <p className="text-sm text-gray-500 font-medium">Grand Ballroom - Kempinski Jakarta</p>
          </div>
        </div>

        <div className="flex items-center gap-12">
          <div className="text-center">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Local Time</p>
            <p className="text-4xl font-black text-white font-mono tabular-nums leading-none tracking-tighter">
              {time}
            </p>
          </div>
          <div className="bg-white/5 p-2 rounded-xl flex items-center gap-2">
            <button className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-all text-white active:scale-95">
              <RotateCcw className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsRunning(!isRunning)}
              className={`p-3 rounded-lg transition-all text-black font-black flex items-center gap-2 active:scale-95 ${isRunning ? 'bg-warning' : 'bg-success'}`}
            >
              {isRunning ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Active Item Details */}
        <div className="flex-1 p-10 flex flex-col overflow-auto no-scrollbar">
          <div className="mb-8">
             <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4 block">Currently Playing</span>
             <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="space-y-6"
             >
                <h2 className="text-7xl font-black text-white tracking-tighter leading-tight bg-gradient-to-r from-white to-gray-600 bg-clip-text text-transparent">
                  {activeItem.title}
                </h2>
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                      <Clock className="text-white w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase">Estimated End</p>
                      <p className="text-2xl font-bold text-white">{activeItem.endTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                        <Mic2 className="text-white w-6 h-6" />
                     </div>
                     <div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase">On Duty</p>
                        <p className="text-2xl font-bold text-white">{activeItem.pic}</p>
                     </div>
                  </div>
                </div>
                
                <div className="p-8 bg-white/5 rounded-3xl border border-white/10 mt-8">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-warning mt-1 shrink-0" />
                    <div>
                      <p className="text-lg text-gray-300 leading-relaxed">
                        {activeItem.details}
                      </p>
                    </div>
                  </div>
                </div>
             </motion.div>
          </div>

          <div className="mt-auto pt-10 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Next Up</p>
                <div className="flex items-center gap-4">
                   <div className="bg-white/10 px-3 py-1 rounded text-white font-bold text-xs">{nextItem.startTime}</div>
                   <h3 className="text-2xl font-bold text-gray-400">{nextItem.title}</h3>
                </div>
              </div>
              <button 
                onClick={() => setActiveItemIndex(prev => Math.min(prev + 1, MOCK_ITEMS.length - 1))}
                className="group flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-black hover:bg-gray-200 transition-all active:scale-95"
              >
                SKIP TO NEXT <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Sidebar Rundown View */}
        <div className="w-96 bg-black/40 border-l border-white/10 flex flex-col p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-white font-black text-sm tracking-widest uppercase">Full Rundown</h4>
            <div className="flex items-center gap-2">
              <button className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 transition-colors">
                <Settings className="w-4 h-4" />
              </button>
              <button className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 transition-colors">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="space-y-4 overflow-auto no-scrollbar flex-1 pb-10">
            {MOCK_ITEMS.map((item, idx) => (
              <div 
                key={item.id}
                className={`relative flex gap-4 p-4 rounded-2xl transition-all duration-300 ${
                  idx === activeItemIndex ? 'bg-white/10 border border-white/20' : 
                  idx < activeItemIndex ? 'opacity-40 grayscale' : 'opacity-80 hover:bg-white/5 cursor-pointer'
                }`}
                onClick={() => idx > activeItemIndex && setActiveItemIndex(idx)}
              >
                <div className="flex flex-col items-center gap-2 shrink-0 pt-1">
                   {idx < activeItemIndex ? (
                     <CheckCircle2 className="w-5 h-5 text-success" />
                   ) : (
                     <div className={`w-2.5 h-2.5 rounded-full ${idx === activeItemIndex ? 'bg-warning scale-125' : 'bg-gray-700'}`}></div>
                   )}
                   <div className="w-[1px] flex-1 bg-white/10"></div>
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-gray-500 font-mono tracking-tight">{item.startTime}</span>
                    <span className="text-[10px] font-bold text-gray-600 bg-white/5 px-2 rounded">{item.duration}</span>
                  </div>
                  <p className={`text-sm font-bold ${idx === activeItemIndex ? 'text-white' : 'text-gray-400'}`}>
                    {item.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
