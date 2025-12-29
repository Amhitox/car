"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface IoTConnectionState {
  isConnected: boolean;
  status: 'disconnected' | 'connecting' | 'connected' | 'error';
  lastMessage: string | null;
  connect: () => void;
  disconnect: () => void;
}

const IoTConnectionContext = createContext<IoTConnectionState | undefined>(undefined);

export function IoTConnectionProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<IoTConnectionState['status']>('disconnected');
  const [lastMessage, setLastMessage] = useState<string | null>(null);

  useEffect(() => {
    // Simulate auto-connect on mount
    connect();
  }, []);

  const connect = () => {
    setStatus('connecting');
    // Simulate connection delay
    setTimeout(() => {
      setStatus('connected');
      console.log("Connected to IoT (Mock)");
    }, 1500);
  };

  const disconnect = () => {
    setStatus('disconnected');
  };

  const value = {
    isConnected: status === 'connected',
    status,
    lastMessage,
    connect,
    disconnect
  };

  return (
    <IoTConnectionContext.Provider value={value}>
      {children}
    </IoTConnectionContext.Provider>
  );
}

export function useIoTConnection() {
  const context = useContext(IoTConnectionContext);
  if (context === undefined) {
    throw new Error('useIoTConnection must be used within an IoTConnectionProvider');
  }
  return context;
}
