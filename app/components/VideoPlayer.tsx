"use client";

import { VideoOff } from 'lucide-react';
import clsx from 'clsx';

interface VideoPlayerProps {
    className?: string;
    streamUrl?: string | null;
}

export default function VideoPlayer({ className, streamUrl }: VideoPlayerProps) {
    return (
        <div className={clsx("relative rounded-xl overflow-hidden bg-black border border-border shadow-2xl", className)}>
            <div className="absolute top-4 left-4 z-10 flex gap-2">
                <div className="px-2 py-1 bg-red-500/80 text-white text-xs font-bold rounded animate-pulse">
                    LIVE
                </div>
                <div className="px-2 py-1 bg-black/60 text-white text-xs font-mono rounded border border-white/10">
                    CAM-01
                </div>
            </div>

            {streamUrl ? (
                <video
                    src={streamUrl}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                />
            ) : (
                <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center text-neutral-500 bg-neutral-900/50">
                    <div className="w-20 h-20 rounded-full bg-neutral-800 flex items-center justify-center mb-4">
                        <VideoOff size={32} className="opacity-50" />
                    </div>
                    <p className="font-mono text-sm tracking-wider">NO SIGNAL</p>
                    <p className="text-xs text-neutral-600 mt-2">Waiting for WebRTC stream...</p>
                </div>
            )}

            {/* Grid Overlay Effect */}
            <div className="absolute inset-0 pointer-events-none opacity-20"
                style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', backgroundSize: '50px 50px' }}>
            </div>
        </div>
    );
}
