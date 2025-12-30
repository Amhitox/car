"use client";

import { useEffect, useRef } from 'react';

type Direction = 'forward' | 'backward' | 'left' | 'right' | 'stop';

interface KeyboardControlsProps {
    onMove: (command: string) => void;
}

export function useKeyboardControls({ onMove }: KeyboardControlsProps) {
    // Use a ref to track the current command to avoid stale closures in event listeners
    // if we were not using stable callbacks (though here onMove should be stable or handled).
    // However, tracking active keys is the most robust way to handle multiple key presses.
    const activeKeys = useRef<Set<string>>(new Set());
    const lastCommand = useRef<string>('stop');

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            // Prevent default scrolling for arrow keys if needed, 
            // but usually for WASD it's fine.

            if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
                activeKeys.current.add(key);
                updateMovement();
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            if (activeKeys.current.has(key)) {
                activeKeys.current.delete(key);
                updateMovement();
            }
        };

        const updateMovement = () => {
            let command = 'stop';
            const keys = activeKeys.current;

            // Priority logic: 
            // Forward/Backward takes precedence over turn if both pressed? 
            // Or usually simpler: check specific keys.
            // Let's implement simple precedence consistent with typical game controls or the previous joystick logic.

            // Check Forward
            if (keys.has('w') || keys.has('arrowup')) {
                command = 'forward';
            }
            // Check Backward (overrides forward if both pressed? or cancels? simple last-wins or specific priority)
            // Let's say if W is pressed, we go forward. If S is pressed, we go backward. 
            // If both, usually stop or one active. logic:
            else if (keys.has('s') || keys.has('arrowdown')) {
                command = 'backward';
            }

            // If no forward/back, check turns
            if (command === 'stop') {
                if (keys.has('a') || keys.has('arrowleft')) {
                    command = 'left';
                } else if (keys.has('d') || keys.has('arrowright')) {
                    command = 'right';
                }
            }

            // Avoid spamming the same command
            if (command !== lastCommand.current) {
                lastCommand.current = command;
                onMove(command);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [onMove]);
}
