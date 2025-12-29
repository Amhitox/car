"use client";

import { Activity, Battery, Signal, Wifi, Settings } from 'lucide-react';
import VideoPlayer from './components/VideoPlayer';
import Joystick from './components/Joystick';
import StatusCard from './components/StatusCard';
import DetectionLogic from './components/DetectionLogic';
import { useIoTConnection } from './context/IoTConnectionContext';
import clsx from 'clsx';

import { ThemeToggle } from './components/ThemeToggle';

export default function Home() {
  const { isConnected, status } = useIoTConnection();

  return (
    <main className="min-h-screen p-6 md:p-8 flex flex-col gap-6 max-w-[1600px] mx-auto transition-colors duration-300">
      {/* Header */}
      <header className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter text-foreground">
            PiBot<span className="text-cyan-500">.Control</span>
          </h1>
          <p className="text-neutral-500 text-sm font-mono mt-1">OPERATOR: ADMIN_01 // SESSION: ACTIVE</p>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border">
            <div className={clsx("w-2 h-2 rounded-full", isConnected ? "bg-emerald-500 animate-pulse" : "bg-red-500")} />
            <span className="text-xs font-mono font-bold uppercase text-neutral-400">
              {status === 'connected' ? 'SYSTEM ONLINE' : 'DISCONNECTED'}
            </span>
          </div>
          <button className="p-2 rounded-full bg-card border border-border hover:text-cyan-400 transition-colors text-foreground">
            <Settings size={20} />
          </button>
        </div>
      </header>

      {/* Top Grid: Video & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[500px]">
        {/* Main Video Logic Stream */}
        <div className="lg:col-span-3 h-full">
          <VideoPlayer className="w-full h-full min-h-[400px]" />
        </div>

        {/* Right Sidebar: Status & Telemetry */}
        <div className="flex flex-col gap-4 h-full">
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
            <StatusCard
              label="Battery"
              value="84%"
              icon={Battery}
              status={84 > 20 ? 'normal' : 'critical'}
            />
            <StatusCard
              label="Signal"
              value="-42 dBm"
              icon={Wifi}
              status="normal"
            />
            <StatusCard
              label="CPU Load"
              value="12%"
              icon={Activity}
              status="normal"
            />
            <StatusCard
              label="Latency"
              value="24ms"
              icon={Signal}
              status="normal"
            />
          </div>

          {/* Mini Log / Console */}
          <div className="flex-1 bg-neutral-900/50 rounded-xl border border-neutral-800 p-4 font-mono text-xs text-neutral-400 overflow-hidden relative">
            <div className="absolute top-2 right-2 text-[10px] uppercase text-neutral-600">Syslog</div>
            <div className="flex flex-col gap-1 mt-4">
              <span className="text-emerald-500/80">[10:42:01] System intialized</span>
              <span className="text-blue-500/80">[10:42:02] Connected to broker</span>
              <span className="text-neutral-500">[10:42:03] Video stream ready</span>
              <span className="text-neutral-500">[10:42:05] Telemetry active</span>
              <span className="text-amber-500/80 flex items-center gap-2">
                <span>[10:45:00] Motion detected</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Controls & Detection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-2">
        {/* Controls - takes 4 columns */}
        <div className="lg:col-span-5 bg-neutral-900/30 border border-neutral-800 rounded-xl p-6 flex items-center justify-around">
          <Joystick
            label="Movement"
            type="movement"
            onMove={(x, y) => console.log('Move', x, y)}
          />
          <div className="h-32 w-px bg-neutral-800 mx-4"></div>
          <Joystick
            label="Camera"
            type="camera"
            onMove={(x, y) => console.log('Cam', x, y)}
          />
        </div>

        {/* Detection Logic - takes 7 columns */}
        <div className="lg:col-span-7">
          <DetectionLogic />
        </div>
      </div>
    </main>
  );
}
