"use client";

import { Search, ScanLine, Target } from 'lucide-react';

export default function DetectionLogic() {
    return (
        <div className="w-full p-6 bg-card border border-border rounded-xl relative overflow-hidden">
            {/* Decorative scan line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-20 animate-[shimmer_2s_infinite]"></div>

            <div className="flex flex-col md:flex-row gap-6 items-end">
                <div className="flex-1 w-full">
                    <label className="text-xs font-mono uppercase text-neutral-500 mb-2 block">Detection Target</label>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Enter object class (e.g., 'person', 'cup')..."
                            className="w-full bg-black/5 dark:bg-black/50 border border-border rounded-lg py-3 pl-12 pr-4 text-foreground outline-none focus:border-cyan-500 transition-colors font-mono"
                        />
                    </div>
                </div>

                <div className="flex gap-3">
                    <div className="px-4 py-2 rounded-lg bg-card border border-border flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                        <span className="text-xs font-bold text-neutral-500 dark:text-neutral-300 uppercase">Looking For</span>
                    </div>

                    {/* Example 'Found' chip (inactive state shown for contrast logic) */}
                    <div className="px-4 py-2 rounded-lg bg-black/30 border border-neutral-800 flex items-center gap-2 opacity-50">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span className="text-xs font-bold text-neutral-500 uppercase">Target Locked</span>
                    </div>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-card rounded border border-border flex items-center justify-between">
                    <span className="text-xs text-neutral-500">CONFIDENCE</span>
                    <span className="text-cyan-600 dark:text-cyan-400 font-mono font-bold">--%</span>
                </div>
                <div className="p-3 bg-card rounded border border-border flex items-center justify-between">
                    <span className="text-xs text-neutral-500">DISTANCE</span>
                    <span className="text-cyan-600 dark:text-cyan-400 font-mono font-bold">-- m</span>
                </div>
            </div>
        </div>
    );
}
