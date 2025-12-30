"use client";

import { useState, useRef } from 'react';
import { Crosshair } from 'lucide-react';
import clsx from 'clsx';

interface JoystickProps {
    label: string;
    type: 'movement' | 'camera';
    onMove?: (x: number, y: number) => void;
    className?: string;
}

export default function Joystick({ label, type, onMove, className }: JoystickProps) {
    const [active, setActive] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const stickRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const maxRadius = 60; // Max distance from center

    const handlePointerDown = (e: React.PointerEvent) => {
        setActive(true);
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!active || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        let x = e.clientX - centerX;
        let y = e.clientY - centerY;

        // Calculate distance and clamp to maxRadius
        const distance = Math.sqrt(x * x + y * y);
        if (distance > maxRadius) {
            const angle = Math.atan2(y, x);
            x = Math.cos(angle) * maxRadius;
            y = Math.sin(angle) * maxRadius;
        }

        // Invert Y because screen coordinates (down is +) vs joystick logic (up is usually +)
        // Actually, the previous implementation did:
        // Forward (Up) -> onMove(0, 1)  (Y is positive for forward)
        // Backward (Down) -> onMove(0, -1) (Y is negative for backward)
        // Screen Y: Up is negative, Down is positive.
        // So we need to invert Y for the onMove callback to match existing logic.

        // Normalize to -1 to 1 for callback
        const normX = x / maxRadius;
        const normY = -(y / maxRadius); // Invert Y

        setPosition({ x, y });
        onMove?.(normX, normY);
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        setActive(false);
        setPosition({ x: 0, y: 0 });
        onMove?.(0, 0); // Reset
        e.currentTarget.releasePointerCapture(e.pointerId);
    };

    return (
        <div className={clsx("flex flex-col items-center gap-4 select-none", className)}>
            <div
                ref={containerRef}
                className={clsx(
                    "w-48 h-48 rounded-full border-4 flex items-center justify-center relative touch-none",
                    active ? "border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)] bg-cyan-950/20" : "border-border bg-card"
                )}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
            >
                {/* Stick */}
                <div
                    ref={stickRef}
                    style={{
                        transform: `translate(${position.x}px, ${position.y}px)`,
                    }}
                    className={clsx(
                        "w-20 h-20 rounded-full shadow-xl flex items-center justify-center cursor-pointer pointer-events-none", // pointer-events-none so the container gets the events
                        // But wait, if container gets events, fine. 
                        // Actually, better to have a dedicated hit area or let drag happen on the stick?
                        // If I drag OUT of the stick, I want it to continue. 
                        // Putting listeners on the container is safest.
                        active ? "transition-none" : "transition-transform duration-200 cubic-bezier(0.1, 1.4, 0.4, 1.0)", // Spring back when released
                        type === 'movement'
                            ? "bg-gradient-to-br from-cyan-500 to-blue-700 text-white"
                            : "bg-gradient-to-br from-purple-500 to-indigo-700 text-white"
                    )}
                >
                    {type === 'movement' ? <Crosshair size={24} /> : <div className="w-3 h-3 bg-white rounded-full" />}
                </div>
            </div>

            <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
                {label}
            </span>
        </div>
    );
}
