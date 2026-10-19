import { useEffect, useRef, useState, useCallback } from 'react';

export interface GamepadActions {
  onNavigate: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onSelect: () => void;
  onBack: () => void;
  onActionX?: () => void;
  onActionY?: () => void;
  onBumper?: (side: 'left' | 'right') => void;
  onMenu?: () => void;
}

export function useGamepad(actions: GamepadActions, enabled: boolean = true) {
  const [activeGamepadName, setActiveGamepadName] = useState<string | null>(null);
  const [hasGamepad, setHasGamepad] = useState<boolean>(false);
  const [inputMode, setInputMode] = useState<'gamepad' | 'keyboard' | 'mouse'>('keyboard');

  // Ref to always have the latest callback actions without restarting the loop
  const actionsRef = useRef(actions);
  actionsRef.current = actions;

  // Debouncing refs
  const lastNavTime = useRef<number>(0);
  const prevButtonStates = useRef<boolean[]>([]);
  const axisNeutralRef = useRef<boolean>(true);

  // Handle Gamepad connection events
  useEffect(() => {
    const handleConnect = (e: GamepadEvent) => {
      setActiveGamepadName(e.gamepad.id || 'Controlador Conectado');
      setHasGamepad(true);
      setInputMode('gamepad');
    };

    const handleDisconnect = () => {
      const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
      const stillActive = Array.from(gamepads).find(gp => gp !== null);
      if (stillActive) {
        setActiveGamepadName(stillActive.id);
        setHasGamepad(true);
      } else {
        setActiveGamepadName(null);
        setHasGamepad(false);
      }
    };

    window.addEventListener('gamepadconnected', handleConnect);
    window.addEventListener('gamepaddisconnected', handleDisconnect);

    // Initial check
    if (typeof navigator !== 'undefined' && navigator.getGamepads) {
      const gps = navigator.getGamepads();
      const first = Array.from(gps).find(gp => gp !== null);
      if (first) {
        setActiveGamepadName(first.id);
        setHasGamepad(true);
      }
    }

    return () => {
      window.removeEventListener('gamepadconnected', handleConnect);
      window.removeEventListener('gamepaddisconnected', handleDisconnect);
    };
  }, []);

  // Keyboard navigation & remote control fallback
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        if (e.key === 'Escape') {
          target.blur();
          actionsRef.current.onBack();
        }
        return;
      }

      setInputMode('keyboard');

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          actionsRef.current.onNavigate('up');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          actionsRef.current.onNavigate('down');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          actionsRef.current.onNavigate('left');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          actionsRef.current.onNavigate('right');
          break;
        case 'Enter':
          e.preventDefault();
          actionsRef.current.onSelect();
          break;
        case 'Escape':
        case 'Backspace':
          e.preventDefault();
          actionsRef.current.onBack();
          break;
        case ' ': // Space for details
          e.preventDefault();
          actionsRef.current.onActionX?.();
          break;
        case 'f':
        case 'F':
        case '/':
          e.preventDefault();
          actionsRef.current.onActionY?.();
          break;
        case 'q':
        case 'Q':
        case 'PageUp':
          actionsRef.current.onBumper?.('left');
          break;
        case 'e':
        case 'E':
        case 'PageDown':
          actionsRef.current.onBumper?.('right');
          break;
        case 'c':
        case 'C':
        case 'm':
        case 'M':
          actionsRef.current.onMenu?.();
          break;
      }
    };

    const handleMouseMove = () => {
      if (inputMode !== 'mouse') {
        setInputMode('mouse');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [enabled, inputMode]);

  // Gamepad Polling Loop (Standard RequestAnimationFrame)
  useEffect(() => {
    if (!enabled) return;

    let animFrameId: number;
    const DEADZONE = 0.45;
    const NAV_COOLDOWN = 190; // ms

    const pollGamepad = (timestamp: number) => {
      if (typeof navigator !== 'undefined' && navigator.getGamepads) {
        const gamepads = navigator.getGamepads();
        const gp = Array.from(gamepads).find(g => g !== null && g.connected);

        if (gp) {
          if (!hasGamepad) {
            setHasGamepad(true);
            setActiveGamepadName(gp.id);
          }

          // Check if any button or axis is used
          const buttons = gp.buttons;
          const axes = gp.axes;

          // 1. Navigation handling: D-pad or Left Stick
          // D-Pad: 12: Up, 13: Down, 14: Left, 15: Right
          const dpadUp = buttons[12]?.pressed;
          const dpadDown = buttons[13]?.pressed;
          const dpadLeft = buttons[14]?.pressed;
          const dpadRight = buttons[15]?.pressed;

          // Left Stick: axes 0 (X), axes 1 (Y)
          const axisX = axes[0] || 0;
          const axisY = axes[1] || 0;

          const stickUp = axisY < -DEADZONE;
          const stickDown = axisY > DEADZONE;
          const stickLeft = axisX < -DEADZONE;
          const stickRight = axisX > DEADZONE;

          const isMoving = dpadUp || dpadDown || dpadLeft || dpadRight || stickUp || stickDown || stickLeft || stickRight;

          if (!isMoving) {
            axisNeutralRef.current = true;
          }

          if (isMoving && (axisNeutralRef.current || timestamp - lastNavTime.current > NAV_COOLDOWN)) {
            setInputMode('gamepad');
            axisNeutralRef.current = false;
            lastNavTime.current = timestamp;

            if (dpadUp || stickUp) actionsRef.current.onNavigate('up');
            else if (dpadDown || stickDown) actionsRef.current.onNavigate('down');
            else if (dpadLeft || stickLeft) actionsRef.current.onNavigate('left');
            else if (dpadRight || stickRight) actionsRef.current.onNavigate('right');
          }

          // 2. Buttons triggers on initial press (edge detection)
          const isPressedNow = (idx: number) => Boolean(buttons[idx]?.pressed);
          const wasPressed = (idx: number) => Boolean(prevButtonStates.current[idx]);

          const checkButtonPress = (idx: number, callback?: () => void) => {
            if (isPressedNow(idx) && !wasPressed(idx)) {
              setInputMode('gamepad');
              callback?.();
            }
          };

          // Button 0: A (Xbox) / Cross (PS) / B (Nintendo)
          checkButtonPress(0, () => actionsRef.current.onSelect());

          // Button 1: B (Xbox) / Circle (PS) / A (Nintendo)
          checkButtonPress(1, () => actionsRef.current.onBack());

          // Button 2: X (Xbox) / Square (PS) / Y (Nintendo)
          checkButtonPress(2, () => actionsRef.current.onActionX?.());

          // Button 3: Y (Xbox) / Triangle (PS) / X (Nintendo)
          checkButtonPress(3, () => actionsRef.current.onActionY?.());

          // Bumpers: 4 (LB), 5 (RB)
          checkButtonPress(4, () => actionsRef.current.onBumper?.('left'));
          checkButtonPress(5, () => actionsRef.current.onBumper?.('right'));

          // Menu / Start: Button 9
          checkButtonPress(9, () => actionsRef.current.onMenu?.());

          // Save current state for next frame edge detection
          prevButtonStates.current = buttons.map(b => b.pressed);
        }
      }

      animFrameId = requestAnimationFrame(pollGamepad);
    };

    animFrameId = requestAnimationFrame(pollGamepad);

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [enabled, hasGamepad]);

  return {
    hasGamepad,
    activeGamepadName,
    inputMode,
    setInputMode,
  };
}
