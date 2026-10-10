import React, { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import { useRive, useStateMachineInput, Layout, Fit, Alignment, EventType } from '@rive-app/react-canvas';

// Teddy comes from the Rive community "Animated Login Screen" file.
// Its state machine has one input of each kind Rive supports:
//   isChecking (boolean) - eyes follow numLook
//   numLook    (number)  - 0 = look down-left ... 100 = look down-right
//   isHandsUp  (boolean) - covers his eyes
//   trigSuccess / trigFail (triggers) - happy / sad reaction
// The success/fail states play for ~4s, and triggers are dropped until he has
// been back in "idle" for about a second, so reactions are retried (below).
const STATE_MACHINE = 'Login Machine';

const TeddyContext = createContext(null);

export function TeddyProvider({ children }) {
  const { rive, RiveComponent } = useRive({
    src: `${process.env.PUBLIC_URL}/rive/teddy.riv`,
    stateMachine: STATE_MACHINE,
    autoplay: true,
    // The artboard is 800x600; crop to the square around his face
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center,
      minX: 230,
      minY: 150,
      maxX: 570,
      maxY: 490,
    }),
  });

  const isChecking = useStateMachineInput(rive, STATE_MACHINE, 'isChecking');
  const numLook = useStateMachineInput(rive, STATE_MACHINE, 'numLook');
  const isHandsUp = useStateMachineInput(rive, STATE_MACHINE, 'isHandsUp');
  const trigSuccess = useStateMachineInput(rive, STATE_MACHINE, 'trigSuccess');
  const trigFail = useStateMachineInput(rive, STATE_MACHINE, 'trigFail');
  const handsUp = useRef(false);
  const pendingReaction = useRef(null);

  // Keep firing the latest reaction until the state machine actually enters
  // that state, so a click made while Teddy is busy isn't silently lost.
  useEffect(() => {
    if (!rive) return;
    const onStateChange = event => {
      const pending = pendingReaction.current;
      if (pending && event.data.includes(pending.state)) pendingReaction.current = null;
    };
    const retry = setInterval(() => {
      const pending = pendingReaction.current;
      if (!pending) return;
      if (Date.now() > pending.giveUpAt) pendingReaction.current = null;
      else pending.trigger.fire();
    }, 150);
    rive.on(EventType.StateChange, onStateChange);
    return () => {
      clearInterval(retry);
      rive.off(EventType.StateChange, onStateChange);
    };
  }, [rive]);

  const teddy = useMemo(() => {
    const relax = () => {
      handsUp.current = false;
      if (isChecking) isChecking.value = false;
      if (isHandsUp) isHandsUp.value = false;
    };

    const react = (trigger, state) => {
      if (!trigger) return;
      relax();
      trigger.fire();
      pendingReaction.current = { trigger, state, giveUpAt: Date.now() + 8000 };
    };

    return {
      Teddy: RiveComponent,
      // fraction: 0 (far left of the screen) ... 1 (far right)
      lookAt(fraction) {
        if (!isChecking || !numLook || handsUp.current) return;
        isChecking.value = true;
        numLook.value = Math.round(Math.min(Math.max(fraction, 0), 1) * 100);
      },
      stopLooking() {
        if (isChecking) isChecking.value = false;
      },
      coverEyes(on) {
        handsUp.current = on;
        if (on && isChecking) isChecking.value = false;
        if (isHandsUp) isHandsUp.value = on;
      },
      relax,
      cheer: () => react(trigSuccess, 'success'),
      pout: () => react(trigFail, 'fail'),
    };
  }, [RiveComponent, isChecking, numLook, isHandsUp, trigSuccess, trigFail]);

  return <TeddyContext.Provider value={teddy}>{children}</TeddyContext.Provider>;
}

export function useTeddy() {
  return useContext(TeddyContext);
}
