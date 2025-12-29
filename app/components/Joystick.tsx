"use client";

import { useState } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Crosshair } from 'lucide-react';
import clsx from 'clsx';

interface JoystickProps {
    label: string;
    type: 'movement' | 'camera';
    onMove?: (x: number, y: number) => void;
    className?: string;
}

export default function Joystick({ label, type, onMove, className }: JoystickProps) {
    const [active, setActive] = useState(false);

    // This is a simplified visual representation. 
    // Real implementation would use touch events to calculate drag position.

    return (
        <div className={clsx("flex flex-col items-center gap-4", className)}>
            <div className="relative group">
                {/* Outer Ring */}
                <div className={clsx(
                    "w-48 h-48 rounded-full border-4 flex items-center justify-center transition-all duration-300",
                    active ? "border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)] bg-cyan-950/20" : "border-border bg-card"
                )}>
                    {/* Directional Click Areas (Simulated for this requirement) */}
                    <button onClick={() => onMove?.(0, 1)} className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 flex items-center justify-center text-neutral-600 hover:text-cyan-500 z-20 cursor-pointer" title="Forward"><ArrowUp size={20} /></button>
                    <button onClick={() => onMove?.(0, -1)} className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-12 flex items-center justify-center text-neutral-600 hover:text-cyan-500 z-20 cursor-pointer" title="Backward"><ArrowDown size={20} /></button>
                    <button onClick={() => onMove?.(-1, 0)} className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-neutral-600 hover:text-cyan-500 z-20 cursor-pointer" title="Left"><ArrowLeft size={20} /></button>
                    <button onClick={() => onMove?.(1, 0)} className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-neutral-600 hover:text-cyan-500 z-20 cursor-pointer" title="Right"><ArrowRight size={20} /></button>

                    {/* Stick */}
                    <button
                        className={clsx(
                            "w-20 h-20 rounded-full shadow-xl flex items-center justify-center transition-transform active:scale-95",
                            type === 'movement'
                                ? "bg-gradient-to-br from-cyan-500 to-blue-700 text-white"
                                : "bg-gradient-to-br from-purple-500 to-indigo-700 text-white"
                        )}
                        onMouseDown={() => setActive(true)}
                        onMouseUp={() => setActive(false)}
                        onMouseLeave={() => setActive(false)}
                    >
                        {type === 'movement' ? <Crosshair size={24} /> : <div className="w-3 h-3 bg-white rounded-full" />}
                    </button>
                </div>
            </div>

            <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
                {label}
            </span>
        </div>
    );
}
