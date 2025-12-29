"use client";

import { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface StatusCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    status?: 'normal' | 'warning' | 'critical';
    className?: string;
}

export default function StatusCard({ label, value, icon: Icon, status = 'normal', className }: StatusCardProps) {
    const statusColors = {
        normal: "text-emerald-400 border-emerald-500/20 bg-emerald-950/10",
        warning: "text-amber-400 border-amber-500/20 bg-amber-950/10",
        critical: "text-red-400 border-red-500/20 bg-red-950/10",
    };

    return (
        <div className={clsx(
            "p-4 rounded-xl border flex items-center justify-between",
            "bg-card backdrop-blur-sm border-border",
            statusColors[status],
            className
        )}>
            <div className="flex flex-col">
                <span className="text-xs font-mono uppercase text-neutral-500 mb-1">{label}</span>
                <span className="text-2xl font-bold font-mono tracking-tight">{value}</span>
            </div>
            <div className={clsx(
                "p-3 rounded-lg bg-white/5",
                status === 'critical' && "animate-pulse"
            )}>
                <Icon size={24} />
            </div>
        </div>
    );
}
